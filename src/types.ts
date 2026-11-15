export type Lang = 'ko' | 'en';
export type Text = {ko:string; en:string};
export type Settings = {captions:boolean; description:boolean; largeText:boolean; reducedMotion:boolean};
export type Celestial = {id:string; kind:'constellation'|'planet'|'star'|'moon'; name:Text; english:string; eyebrow:Text; summary:Text; facts:{label:Text;value:Text}[]; storyTitle:Text; story:Text[]; description:Text; image?:string; color:string};
export type ViewingRecord = {id:string; objectId:string; storyId:string; date:string; note:string; mode:'learning'|'demo'; completed:boolean};
export type VehicleStatus = 'demo-parked'|'restricted'|'permission-denied'|'unsupported'|'disconnected'|'stale';
export type Playback = {status:'idle'|'playing'|'paused'|'ended'|'unavailable'|'loading'; index:number; charIndex:number; error:string|null};
export type SessionState = {status:'idle'|'waiting'|'connected'|'disconnected'; controller:'vehicle'|'mobile'; sequence:number; selectedId:string; storyId:string; playing:boolean; position:number};
