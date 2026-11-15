import type {Lang} from './types';

export type NarrationCue={index:number;start:number;end:number};
export type NarrationRecording={
  url:string;
  duration:number;
  cues:NarrationCue[];
  /** Exact story text submitted to synthesis, excluding a separate visual description. */
  text:string;
  voiceName:string;
  provider:string;
};
export type NarrationManifest={
  schemaVersion?:number;
  recordings:Record<string,Partial<Record<Lang,NarrationRecording>>>;
};

/** Reject malformed source data instead of presenting invented playback positions. */
export function isNarrationRecording(value:unknown):value is NarrationRecording{
  if(!value||typeof value!=='object')return false;
  const r=value as Partial<NarrationRecording>;
  if(typeof r.url!=='string'||!(/^(?:\/[^/]|https?:\/\/)/.test(r.url))||!Number.isFinite(r.duration)||!(Number(r.duration)>0)||typeof r.text!=='string'||typeof r.voiceName!=='string'||typeof r.provider!=='string'||!Array.isArray(r.cues)||r.cues.length===0)return false;
  const seen=new Set<number>();
  return r.cues.every((cue,i)=>{
    if(!cue||!Number.isInteger(cue.index)||cue.index<0||seen.has(cue.index)||!Number.isFinite(cue.start)||!Number.isFinite(cue.end)||cue.start<0||cue.end<=cue.start||cue.end>Number(r.duration)+0.25||(i>0&&cue.start<r.cues![i-1].start))return false;
    if(i>0&&cue.index<=r.cues![i-1].index)return false;
    seen.add(cue.index);return true;
  });
}

/** Absence means the existing browser voice; a selected recording never silently switches engines. */
export function getNarrationRecording(manifest:unknown,storyId:string,lang:Lang):NarrationRecording|undefined{
  if(!manifest||typeof manifest!=='object')return undefined;
  const entries=(manifest as Partial<NarrationManifest>).recordings;
  const value=entries?.[storyId]?.[lang];
  return isNarrationRecording(value)?value:undefined;
}

/** Keep the previous caption during a real pause between sentences. No interpolated word timing. */
export function narrationCueAt(cues:NarrationCue[],time:number):NarrationCue|undefined{
  if(cues.length===0)return undefined;
  let current=cues[0];
  for(const cue of cues){if(cue.start>time)break;current=cue;}
  return current;
}

/** The recording must narrate this exact saved script, with one real cue per sentence. */
export function recordingMatchesStory(recording:NarrationRecording,sentences:string[]):boolean{
  const normalize=(text:string)=>text.replace(/\s+/g,' ').trim();
  return normalize(recording.text)===normalize(sentences.join('\n\n'))&&recording.cues.length===sentences.length&&recording.cues.every((cue,index)=>cue.index===index);
}
