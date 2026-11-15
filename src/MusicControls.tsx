import {Music2,Repeat2,Volume2,ExternalLink} from 'lucide-react';
import type {Lang} from './types';
import type {MusicTrack} from './musicTrack';
import './music.css';

type MusicControlsProps={track:MusicTrack;lang:Lang;enabled:boolean;onEnabled:(value:boolean)=>void;volume:number;onVolume:(value:number)=>void;status:string;error:'blocked'|'load'|null;retry:()=>void;canRetry:boolean;compact?:boolean};
export function MusicControls({track,lang,enabled,onEnabled,volume,onVolume,status,error,retry,canRetry,compact=false}:MusicControlsProps){
 const ko=lang==='ko';
 const composer=ko?(track.composerKo||track.composer):track.composer;
 const title=ko?track.titleKo:track.title;
 const digital=track.performanceKind==='digital';
 const percent=Math.round(Math.max(0,Math.min(.35,Number.isFinite(volume)?volume:0))*100);
 return <section className={`music-controls ${compact?'compact':''}`} aria-label={ko?'배경음악':'Background music'} data-testid="background-music" data-track-id={track.id}>
  <div className="music-main"><Music2 size={20}/><div className="music-name"><strong>{composer} · {title}</strong><span><Repeat2 size={12}/>{ko?'반복 재생':'Repeat'} · {status==='playing'?(ko?'재생 중':'Playing'):enabled?(ko?'이야기와 함께 재생':'Plays with narration'):(ko?'꺼짐':'Off')}</span>{digital&&<span className="music-performance">{ko?'디지털 연주':'Digital performance'}</span>}</div><button className="music-toggle" aria-label={ko?'배경음악 켜기/끄기':'Toggle background music'} aria-pressed={enabled} onClick={()=>onEnabled(!enabled)}>{enabled?(ko?'켜짐':'On'):(ko?'꺼짐':'Off')}</button></div>
  <label className="music-volume"><Volume2 size={17}/><span>{ko?'배경음량':'Music volume'}</span><input aria-label={ko?'배경음악 음량':'Background music volume'} type="range" min="0" max="35" step="1" value={percent} onChange={e=>onVolume(+e.target.value/100)}/><small>{percent}%</small></label>
  {error&&enabled&&volume>0&&<div className="music-error" role="status"><span>{error==='blocked'?(ko?'음악 재생을 허용하려면 아래 버튼을 눌러주세요.':'Press below to allow music playback.'):(ko?'배경음악을 불러오지 못했어요. 이야기는 계속 감상할 수 있어요.':'Music could not load. You can continue the story.')}</span><button onClick={retry} disabled={!canRetry}>{ko?'음악 다시 재생':'Retry music'}</button>{!canRetry&&<small>{ko?'이야기를 재생하면 음악도 다시 시도할 수 있어요.':'Play the story to retry the music.'}</small>}</div>}
  <details className="music-credit"><summary>{ko?'음악 출처':'Music credit'}</summary><p>{composer} · {ko?'연주':'Performance'}: {track.performer}. {digital&&<>{ko?'디지털 연주.':'Digital performance.'} </>}<a href={track.sourceUrl} target="_blank" rel="noreferrer">{ko?'음원 출처':'Recording source'}<ExternalLink size={11}/></a> · <a href={track.licenseUrl} target="_blank" rel="noreferrer">{track.license}</a>.</p><p>{track.credit}</p>{track.changes&&<p>{track.changes}</p>}</details>
 </section>;
}
