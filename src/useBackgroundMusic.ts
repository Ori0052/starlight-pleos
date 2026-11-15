import {useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {MusicTrack} from './musicTrack';

type MusicStatus='idle'|'playing'|'paused'|'blocked'|'error';
type MusicError='blocked'|'load'|null;
type BackgroundMusicOptions={track?:MusicTrack;eligible?:boolean;playing:boolean;enabled:boolean;volume:number};

/** A selected track follows actual narration playback and owns exactly one media element. */
export function useBackgroundMusic({track,eligible=true,playing,enabled,volume}:BackgroundMusicOptions){
 const audioRef=useRef<HTMLAudioElement|null>(null);
 const trackRef=useRef<MusicTrack|undefined>(track);
 const requested=useRef(false);
 const alive=useRef(true);
 const generation=useRef(0);
 const playRequest=useRef(0);
 const stopped=useRef(false);
 const volumeRef=useRef(volume);
 const [status,setStatus]=useState<MusicStatus>('idle');
 const [error,setError]=useState<MusicError>(null);
 const shouldPlay=Boolean(track)&&eligible&&playing&&enabled&&Number.isFinite(volume)&&volume>0;
 requested.current=shouldPlay;
 volumeRef.current=volume;

 const mediaVolume=useCallback(()=>Math.max(0,Math.min(.35,Number.isFinite(volumeRef.current)?volumeRef.current:0))*.65,[]);
 const release=useCallback(()=>{
  generation.current++;playRequest.current++;
  const audio=audioRef.current;audioRef.current=null;
  if(!audio)return;
  audio.onplaying=null;audio.onpause=null;audio.onerror=null;
  audio.pause();try{audio.currentTime=0}catch{/* An unprepared track has no seekable timeline. */}
  audio.removeAttribute('src');audio.load();
 },[]);
 const ensure=useCallback(()=>{
  const selected=trackRef.current;
  if(!selected)return null;
  if(audioRef.current)return audioRef.current;
  if(typeof Audio==='undefined')return null;
  let audio:HTMLAudioElement;
  try{audio=new Audio();}catch{return null;}
  const token=++generation.current;
  const active=()=>alive.current&&audioRef.current===audio&&generation.current===token;
  audio.preload='none';audio.loop=true;audio.volume=mediaVolume();
  audio.onplaying=()=>{
   if(!active())return;
   if(!requested.current||stopped.current){audio.pause();return;}
   setStatus('playing');setError(null);
  };
  audio.onpause=()=>{
   if(!active()||stopped.current||!audio.paused)return;
   setStatus(previous=>previous==='error'||previous==='blocked'?previous:'paused');
  };
  audio.onerror=()=>{
   if(!active()||stopped.current)return;
   setStatus('error');setError('load');
  };
  audioRef.current=audio;
  try{audio.src=selected.src;}catch{release();return null;}
  return audio;
 },[mediaVolume,release]);
 const retry=useCallback(()=>{
  if(!requested.current||!trackRef.current)return;
  stopped.current=false;
  const audio=ensure();
  if(!audio){if(alive.current){setStatus('error');setError('load');}return;}
  const token=generation.current;
  const request=++playRequest.current;
  const active=()=>alive.current&&audioRef.current===audio&&generation.current===token&&playRequest.current===request;
  audio.volume=mediaVolume();
  if(audio.error)audio.load();
  try{
   const promise=audio.play();
   promise?.then(()=>{if(active()&&!requested.current)audio.pause();}).catch((cause:unknown)=>{
    if(!active())return;
    if(!requested.current){audio.pause();return;}
    if(cause instanceof DOMException&&cause.name==='AbortError')return;
    const blocked=cause instanceof DOMException&&cause.name==='NotAllowedError';
    setStatus(blocked?'blocked':'error');setError(blocked?'blocked':'load');
   });
  }catch{
   if(active()&&requested.current){setStatus('error');setError('load');}
  }
 },[ensure,mediaVolume]);
 const stop=useCallback(()=>{
  requested.current=false;stopped.current=true;playRequest.current++;
  const audio=audioRef.current;
  if(audio){audio.pause();try{audio.currentTime=0}catch{/* No timeline before metadata. */}}
  if(alive.current){setStatus('idle');setError(null);}
 },[]);

 // Cleanup happens during commit so stale media cannot survive a visible track change.
 useLayoutEffect(()=>{
  alive.current=true;trackRef.current=track;stopped.current=false;
  setStatus('idle');setError(null);
  return()=>{alive.current=false;requested.current=false;stopped.current=true;trackRef.current=undefined;release();};
 },[track?.id,track?.src,release]);
 useEffect(()=>{
  requested.current=shouldPlay;
  const audio=audioRef.current;
  if(audio)audio.volume=mediaVolume();
  if(shouldPlay){if(!audio||audio.paused||audio.error)retry();return;}
  playRequest.current++;
  if(audio){
   audio.pause();
   if(!track||!eligible){stopped.current=true;try{audio.currentTime=0}catch{}setStatus('idle');setError(null);}
  }
 },[shouldPlay,track?.id,track?.src,eligible,volume,retry,mediaVolume]);
 return {status,error,retry,stop};
}
