import {useCallback,useEffect,useRef,useState} from 'react';
import type {Celestial,Lang,Playback} from './types';
import {narrationCueAt,recordingMatchesStory,type NarrationRecording} from './narrationAudio';

const initial:Playback={status:'idle',index:0,charIndex:0,error:null};
type Medium='none'|'browser'|'description'|'audio';
type Intent='stop'|'pause'|'play';
const speechSupported=()=>typeof window!=='undefined'&&'speechSynthesis'in window&&'SpeechSynthesisUtterance'in window;

/** Browser fallback and recorded narration share controls, but progress always follows real callbacks. */
export function useNarration(object:Celestial,lang:Lang,description:boolean,storyKey=object.id,recording?:NarrationRecording){
  const [playback,setPlayback]=useState<Playback>(initial);
  const [volume,setVolumeState]=useState(0.8);
  const [currentTime,setCurrentTime]=useState(0);
  const [duration,setDuration]=useState(recording?.duration??0);
  const [descriptionWarning,setDescriptionWarning]=useState<string|null>(null);
  const playbackRef=useRef(playback);
  const volumeRef=useRef(volume);
  const objectRef=useRef(object);
  const langRef=useRef(lang);
  const descriptionRef=useRef(description);
  const recordingRef=useRef(recording);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const utteranceRef=useRef<SpeechSynthesisUtterance|null>(null);
  const speechGeneration=useRef(0);
  const audioRequestGeneration=useRef(0);
  const mediumRef=useRef<Medium>('none');
  const intentRef=useRef<Intent>('stop');
  const descriptionDoneRef=useRef(false);
  const pendingSeekRef=useRef<number|null>(null);
  const speechTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const audioTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const speakRef=useRef<(index:number,charIndex?:number)=>void>(()=>{});
  const startRecordingRef=useRef<()=>void>(()=>{});

  const message=useCallback((ko:string,en:string)=>langRef.current==='ko'?ko:en,[]);
  const update=useCallback((patch:Partial<Playback>)=>{
    playbackRef.current={...playbackRef.current,...patch};
    setPlayback(playbackRef.current);
  },[]);
  const clearSpeechTimer=useCallback(()=>{if(speechTimerRef.current)clearTimeout(speechTimerRef.current);speechTimerRef.current=null;},[]);
  const clearAudioTimer=useCallback(()=>{if(audioTimerRef.current)clearTimeout(audioTimerRef.current);audioTimerRef.current=null;},[]);
  const cancelSpeech=useCallback(()=>{
    speechGeneration.current++;
    clearSpeechTimer();
    if(speechSupported())window.speechSynthesis.cancel();
    utteranceRef.current=null;
  },[clearSpeechTimer]);

  const recordingFailure=useCallback((error:string)=>{
    clearAudioTimer();cancelSpeech();mediumRef.current='none';
    intentRef.current='pause';
    audioRequestGeneration.current++;
    audioRef.current?.pause();
    update({status:'unavailable',error});
  },[cancelSpeech,clearAudioTimer,update]);

  const armAudioTimer=useCallback(()=>{
    clearAudioTimer();
    const audio=audioRef.current;
    audioTimerRef.current=setTimeout(()=>{
      if(audioRef.current!==audio||intentRef.current!=='play'||playbackRef.current.status!=='loading')return;
      recordingFailure(message('녹음 음성의 재생을 확인하지 못했어요. 다시 재생하거나 전체 대본으로 이어서 감상해 주세요.','Recorded audio did not start. Try play again or continue with the full transcript.'));
    },15000);
  },[clearAudioTimer,message,recordingFailure]);

  const startRecording=useCallback(()=>{
    const audio=audioRef.current;
    if(!audio||!recordingRef.current){
      recordingFailure(message('녹음 음성을 준비하지 못했어요. 전체 대본을 읽어주세요.','The recording is unavailable. Read the full transcript to continue.'));
      return;
    }
    cancelSpeech();
    mediumRef.current='audio';
    intentRef.current='play';
    const request=++audioRequestGeneration.current;
    audio.volume=volumeRef.current;
    if(audio.error){audio.load();}
    if(pendingSeekRef.current!==null){
      try{audio.currentTime=pendingSeekRef.current;pendingSeekRef.current=null;}catch{/* Metadata callback applies the pending seek. */}
    }
    update({status:'loading',error:null,index:Math.max(0,playbackRef.current.index)});
    armAudioTimer();
    try{
      const promise=audio.play();
      promise?.then(()=>{
        if(audioRef.current!==audio||request!==audioRequestGeneration.current)return;
        if(intentRef.current!=='play')audio.pause();
        // Only the native playing event establishes playback; promise resolution is insufficient.
      }).catch((error:unknown)=>{
        if(audioRef.current!==audio||request!==audioRequestGeneration.current)return;
        clearAudioTimer();intentRef.current='pause';
        if(error instanceof DOMException&&error.name==='AbortError'){update({status:'paused'});return;}
        if(error instanceof DOMException&&error.name==='NotAllowedError'){
          update({status:'paused',error:message('이 기기에서는 재생 버튼을 한 번 더 눌러 음성을 시작해 주세요.','Press play once more to start audio on this device.')});
        }else recordingFailure(message('녹음 음성을 재생할 수 없어요. 연결을 확인하거나 전체 대본으로 이어서 감상해 주세요.','The recording could not play. Check the connection or continue with the full transcript.'));
      });
    }catch{
      recordingFailure(message('이 환경에서 녹음 음성을 재생할 수 없어요. 전체 대본을 이용해 주세요.','Recorded audio cannot play in this environment. Use the full transcript.'));
    }
  },[armAudioTimer,cancelSpeech,clearAudioTimer,message,recordingFailure,update]);
  startRecordingRef.current=startRecording;

  const skipDescription=useCallback(()=>{
    cancelSpeech();descriptionDoneRef.current=true;
    setDescriptionWarning(message('이 기기에서 시각 설명 음성을 사용할 수 없어 설명 대본을 제공합니다. 이야기 녹음은 계속 재생할 수 있어요.','Visual-description speech is unavailable on this device; its transcript remains available. The story recording can still play.'));
    update({index:0,charIndex:0,error:null});
    if(intentRef.current==='play')startRecordingRef.current();
    else update({status:'paused'});
  },[cancelSpeech,message,update]);

  const speak=useCallback((index:number,charIndex=0)=>{
    const isDescription=Boolean(recordingRef.current)&&index===-1;
    if(!speechSupported()){
      if(isDescription){skipDescription();return;}
      update({status:'unavailable',error:message('이 환경에서는 음성을 사용할 수 없어요. 전체 대본으로 이야기를 읽어주세요.','Speech is unavailable here. Read the full transcript to continue.')});
      return;
    }
    // A missing description voice must never prevent an otherwise usable recording.
    if(isDescription&&window.speechSynthesis.getVoices().length===0){skipDescription();return;}
    cancelSpeech();
    const currentObject=objectRef.current;
    const currentLang=langRef.current;
    const text=index===-1?currentObject.description[currentLang]:currentObject.story[index]?.[currentLang];
    if(!text){
      if(isDescription){descriptionDoneRef.current=true;startRecordingRef.current();}
      else update({status:'ended',index:Math.max(0,currentObject.story.length-1),charIndex:0});
      return;
    }
    const offset=Math.min(Math.max(0,charIndex),Math.max(0,text.length-1));
    const utterance=new SpeechSynthesisUtterance(text.slice(offset));
    utterance.lang=currentLang==='ko'?'ko-KR':'en-US';
    utterance.rate=currentLang==='ko'?.9:.95;
    utterance.volume=volumeRef.current;
    const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(currentLang));
    if(voice)utterance.voice=voice;
    const token=speechGeneration.current;
    utteranceRef.current=utterance;
    mediumRef.current=isDescription?'description':'browser';
    intentRef.current='play';
    update({status:'loading',index,charIndex:offset,error:null});
    utterance.onstart=()=>{if(token!==speechGeneration.current)return;clearSpeechTimer();update({status:'playing'});};
    utterance.onboundary=event=>{if(token!==speechGeneration.current)return;update({status:'playing',charIndex:offset+event.charIndex});};
    utterance.onpause=()=>{if(token===speechGeneration.current)update({status:'paused'});};
    utterance.onresume=()=>{if(token===speechGeneration.current){clearSpeechTimer();update({status:'playing'});}};
    utterance.onend=()=>{
      if(token!==speechGeneration.current)return;
      clearSpeechTimer();utteranceRef.current=null;
      if(isDescription){
        descriptionDoneRef.current=true;update({index:0,charIndex:0});
        if(intentRef.current==='play')startRecordingRef.current();
        return;
      }
      const next=index+1;
      if(next>=currentObject.story.length){mediumRef.current='none';intentRef.current='stop';update({status:'ended',index:currentObject.story.length-1,charIndex:text.length,error:null});}
      else speakRef.current(next);
    };
    utterance.onerror=event=>{
      if(token!==speechGeneration.current)return;
      clearSpeechTimer();
      if(event.error==='interrupted'||event.error==='canceled')return;
      if(isDescription){skipDescription();return;}
      intentRef.current='pause';
      update({status:'unavailable',error:message('음성을 재생할 수 없어요. 대본으로 계속 감상할 수 있어요.','Audio could not play. You can continue with the transcript.')});
    };
    speechTimerRef.current=setTimeout(()=>{
      if(token!==speechGeneration.current||playbackRef.current.status!=='loading')return;
      if(isDescription){skipDescription();return;}
      cancelSpeech();intentRef.current='pause';
      update({status:'unavailable',error:message('음성 시작을 확인하지 못했어요. 대본으로 계속해주세요.','Speech did not start. Continue with the transcript.')});
    },10000);
    try{window.speechSynthesis.speak(utterance);}catch{
      if(isDescription)skipDescription();
      else{cancelSpeech();intentRef.current='pause';update({status:'unavailable',error:message('음성을 시작할 수 없어요. 전체 대본을 이용해 주세요.','Speech could not start. Use the full transcript.')});}
    }
  },[cancelSpeech,clearSpeechTimer,message,skipDescription,update]);
  speakRef.current=speak;

  const play=useCallback(()=>{
    const state=playbackRef.current;
    if(state.status==='playing'||state.status==='loading')return;
    intentRef.current='play';
    if(recordingRef.current){
      if(state.status==='ended'){
        if(audioRef.current){try{audioRef.current.currentTime=0;}catch{pendingSeekRef.current=0;}}
        setCurrentTime(0);descriptionDoneRef.current=false;update({index:0,charIndex:0});
      }
      if(state.index===-1&&mediumRef.current==='description'){
        if(speechSupported()&&utteranceRef.current&&window.speechSynthesis.paused){window.speechSynthesis.resume();return;}
        speak(-1,state.charIndex);return;
      }
      if(!descriptionDoneRef.current&&descriptionRef.current){speak(-1);return;}
      descriptionDoneRef.current=true;startRecording();return;
    }
    if(speechSupported()&&state.status==='paused'&&utteranceRef.current&&window.speechSynthesis.paused){window.speechSynthesis.resume();return;}
    if(state.status==='idle'||state.status==='ended')speak(descriptionRef.current?-1:0);
    else speak(state.index,state.charIndex);
  },[speak,startRecording,update]);

  const pause=useCallback(()=>{
    intentRef.current='pause';audioRequestGeneration.current++;
    clearAudioTimer();
    if(mediumRef.current==='audio'){audioRef.current?.pause();update({status:'paused'});return;}
    if(playbackRef.current.status==='loading'){cancelSpeech();update({status:'paused'});return;}
    if(playbackRef.current.status==='playing'&&speechSupported()){window.speechSynthesis.pause();update({status:'paused'});}
  },[cancelSpeech,clearAudioTimer,update]);

  const stop=useCallback(()=>{
    intentRef.current='stop';audioRequestGeneration.current++;
    cancelSpeech();clearAudioTimer();mediumRef.current='none';descriptionDoneRef.current=false;pendingSeekRef.current=null;
    const audio=audioRef.current;
    if(audio){audio.pause();try{audio.currentTime=0;}catch{/* Metadata may not be loaded. */}}
    setCurrentTime(0);update(initial);
  },[cancelSpeech,clearAudioTimer,update]);

  const restart=useCallback(()=>{stop();play();},[play,stop]);

  const seek=useCallback((index:number)=>{
    const target=Math.max(0,Math.min(index,objectRef.current.story.length-1));
    const wasPlaying=['playing','loading'].includes(playbackRef.current.status);
    if(recordingRef.current){
      const cue=recordingRef.current.cues.find(c=>c.index===target);
      if(!cue){update({status:'unavailable',error:message('이 문장의 녹음 위치를 찾지 못했어요. 전체 대본을 이용해 주세요.','The recording position for this sentence is unavailable. Use the full transcript.')});return;}
      cancelSpeech();clearAudioTimer();audioRequestGeneration.current++;
      descriptionDoneRef.current=true;mediumRef.current='audio';intentRef.current=wasPlaying?'play':'pause';
      const audio=audioRef.current;
      if(audio){
        try{audio.currentTime=cue.start;pendingSeekRef.current=null;setCurrentTime(audio.currentTime);}catch{pendingSeekRef.current=cue.start;}
        if(!wasPlaying)audio.pause();
      }else pendingSeekRef.current=cue.start;
      update({index:target,charIndex:0,status:wasPlaying?'loading':'paused',error:null});
      if(wasPlaying)startRecording();
      return;
    }
    cancelSpeech();intentRef.current=wasPlaying?'play':'pause';update({index:target,charIndex:0,status:'paused',error:null});
    if(wasPlaying)speak(target);
  },[cancelSpeech,clearAudioTimer,message,speak,startRecording,update]);

  /** Exact recorded-media scrub. Browser narration continues to use sentence seek(). */
  const seekTime=useCallback((seconds:number)=>{
    const recording=recordingRef.current;
    const audio=audioRef.current;
    if(!recording||!audio||!Number.isFinite(seconds))return;
    const wasPlaying=intentRef.current==='play';
    const hasMediaDuration=Number.isFinite(audio.duration)&&audio.duration>0;
    const limit=hasMediaDuration?audio.duration:recording.duration;
    const target=Math.max(0,Math.min(seconds,limit));
    cancelSpeech();clearAudioTimer();audioRequestGeneration.current++;
    descriptionDoneRef.current=true;mediumRef.current='audio';intentRef.current=wasPlaying?'play':'pause';
    let actual=Number.isFinite(audio.currentTime)?audio.currentTime:0;
    try{audio.currentTime=target;pendingSeekRef.current=null;actual=audio.currentTime;setCurrentTime(actual);}
    catch{pendingSeekRef.current=target;}
    const cue=narrationCueAt(recording.cues,actual);
    const line=cue?objectRef.current.story[cue.index]?.[langRef.current]??'':'';
    const position=cue?{index:cue.index,charIndex:actual>=cue.end?line.length:0}:{};
    if(hasMediaDuration&&actual>=audio.duration){
      // Explicitly choosing the endpoint must not restart the file via play().
      intentRef.current='stop';mediumRef.current='none';audio.pause();
      update({...position,status:'ended',error:null});return;
    }
    if(!wasPlaying)audio.pause();
    update({...position,status:wasPlaying?'loading':'paused',error:null});
    if(wasPlaying)startRecording();
  },[cancelSpeech,clearAudioTimer,startRecording,update]);

  const setVolume=useCallback((next:number)=>{
    const value=Math.max(0,Math.min(1,next));volumeRef.current=value;setVolumeState(value);
    if(audioRef.current)audioRef.current.volume=value;
    const state=playbackRef.current;
    if(mediumRef.current==='audio')return;
    if(state.status==='playing'||state.status==='loading')speak(state.index,state.charIndex);
    else if(state.status==='paused'){cancelSpeech();update({status:'paused'});}
  },[cancelSpeech,speak,update]);

  useEffect(()=>{
    objectRef.current=object;langRef.current=lang;recordingRef.current=recording;
    intentRef.current='stop';audioRequestGeneration.current++;
    cancelSpeech();clearAudioTimer();mediumRef.current='none';descriptionDoneRef.current=false;pendingSeekRef.current=null;
    setCurrentTime(0);setDuration(recording?.duration??0);setDescriptionWarning(null);update(initial);
    if(!recording)return;
    if(!recordingMatchesStory(recording,object.story.map(line=>line[lang]))){
      update({status:'unavailable',error:message('대본과 녹음의 문장 정보가 일치하지 않아요. 전체 대본으로 감상해 주세요.','The saved transcript and recording do not match. Use the full transcript.')});return;
    }
    if(typeof Audio==='undefined'){
      update({status:'unavailable',error:message('이 환경은 녹음 음성 재생을 지원하지 않아요. 전체 대본을 이용해 주세요.','This environment does not support recorded audio. Use the full transcript.')});return;
    }
    let audio:HTMLAudioElement;
    try{audio=new Audio();}catch{
      update({status:'unavailable',error:message('녹음 재생기를 준비할 수 없어요. 전체 대본을 이용해 주세요.','The recording player could not initialize. Use the full transcript.')});return;
    }
    audioRef.current=audio;
    audio.preload='metadata';audio.volume=volumeRef.current;
    const currentObject=object;
    const currentRecording=recording;
    const currentLang=lang;
    const active=()=>audioRef.current===audio;
    const validateMediaDuration=()=>{
      if(!Number.isFinite(audio.duration)||audio.duration<=0)return true;
      setDuration(audio.duration);
      const lastEnd=currentRecording.cues.at(-1)?.end??0;
      if(audio.duration+0.15<lastEnd){
        recordingFailure(currentLang==='ko'?'녹음 파일이 대본의 끝까지 포함하지 않아요. 전체 대본으로 감상해 주세요.':'The recording ends before the transcript is complete. Use the full transcript.');return false;
      }
      return true;
    };
    const syncPosition=()=>{
      if(!active())return;
      const time=Number.isFinite(audio.currentTime)?audio.currentTime:0;
      setCurrentTime(time);
      if(mediumRef.current!=='audio')return;
      const cue=narrationCueAt(currentRecording.cues,time);
      if(cue){const line=currentObject.story[cue.index]?.[currentLang]??'';update({index:cue.index,charIndex:time>=cue.end?line.length:0});}
    };
    audio.onloadedmetadata=()=>{
      if(!active())return;
      if(!validateMediaDuration())return;
      if(pendingSeekRef.current!==null){try{audio.currentTime=pendingSeekRef.current;pendingSeekRef.current=null;}catch{/* A subsequent metadata event may succeed. */}}
      syncPosition();
    };
    audio.ondurationchange=()=>{if(active())validateMediaDuration();};
    audio.ontimeupdate=syncPosition;
    audio.onseeked=()=>{
      syncPosition();
      // Buffered seeks need not emit another 'playing' event. Native seek completion
      // plus an unpaused, ready player verifies continued playback without a timer.
      if(active()&&mediumRef.current==='audio'&&intentRef.current==='play'&&!audio.paused&&!audio.ended&&audio.readyState>=3){clearAudioTimer();update({status:'playing',error:null});}
    };
    audio.onplaying=()=>{
      if(!active())return;
      if(intentRef.current!=='play'||mediumRef.current!=='audio'){audio.pause();return;}
      clearAudioTimer();syncPosition();update({status:'playing',error:null});
    };
    audio.onpause=()=>{if(active()&&mediumRef.current==='audio'&&['playing','loading'].includes(playbackRef.current.status)&&intentRef.current!=='stop')update({status:'paused'});};
    audio.onwaiting=()=>{if(active()&&mediumRef.current==='audio'&&intentRef.current==='play'){update({status:'loading'});armAudioTimer();}};
    audio.onstalled=audio.onwaiting;
    audio.onended=()=>{
      if(!active()||mediumRef.current!=='audio')return;
      const lastCue=currentRecording.cues.at(-1);
      if(lastCue&&audio.currentTime+0.15<lastCue.end){
        recordingFailure(currentLang==='ko'?'이야기 녹음이 끝까지 재생되지 않았어요. 대본으로 이어서 감상해 주세요.':'The story recording did not finish. Continue with the transcript.');return;
      }
      clearAudioTimer();intentRef.current='stop';mediumRef.current='none';
      const last=Math.max(0,currentObject.story.length-1);
      setCurrentTime(Number.isFinite(audio.duration)?audio.duration:currentRecording.duration);
      update({status:'ended',index:last,charIndex:currentObject.story[last]?.[currentLang].length??0,error:null});
    };
    audio.onerror=()=>{
      if(!active())return;
      recordingFailure(currentLang==='ko'?'녹음 음성을 불러오지 못했어요. 연결을 확인하거나 전체 대본으로 이어서 감상해 주세요.':'The recording could not load. Check the connection or continue with the full transcript.');
    };
    audio.src=recording.url;
    audio.load();
    return()=>{
      if(audioRef.current===audio)audioRef.current=null;
      audio.onloadedmetadata=null;audio.ondurationchange=null;audio.ontimeupdate=null;audio.onseeked=null;audio.onplaying=null;audio.onpause=null;audio.onwaiting=null;audio.onstalled=null;audio.onended=null;audio.onerror=null;
      audio.pause();audio.removeAttribute('src');audio.load();
    };
  },[object.id,lang,storyKey,recording?.url,armAudioTimer,cancelSpeech,clearAudioTimer,recordingFailure,message,update]);

  useEffect(()=>{
    descriptionRef.current=description;
    if(!description&&playbackRef.current.index===-1){
      const wasPlaying=['playing','loading'].includes(playbackRef.current.status);
      cancelSpeech();descriptionDoneRef.current=true;intentRef.current=wasPlaying?'play':'pause';update({status:'paused',index:0,charIndex:0});
      if(wasPlaying){if(recordingRef.current)startRecording();else speak(0);}
    }
  },[description,cancelSpeech,speak,startRecording,update]);

  useEffect(()=>()=>{intentRef.current='stop';audioRequestGeneration.current++;cancelSpeech();clearAudioTimer();audioRef.current?.pause();},[cancelSpeech,clearAudioTimer]);
  return {playback,play,pause,restart,seek,seekTime,stop,volume,setVolume,currentTime,duration,source:recording?'recorded' as const:'browser' as const,isDescription:playback.index===-1,descriptionWarning};
}
