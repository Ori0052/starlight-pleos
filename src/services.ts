import type {SessionState, VehicleStatus, ViewingRecord} from './types';
/** All adapter names below belong to this web prototype; none are Pleos SDK APIs. */
export function readStored<T>(key:string,fallback:T):T {
  try { const raw=localStorage.getItem(key); return raw===null?fallback:JSON.parse(raw) as T; }
  catch { return fallback; }
}
export function writeStored<T>(key:string,value:T):boolean {
  try { localStorage.setItem(key,JSON.stringify(value)); return true; }
  catch { return false; }
}
const RECORD_KEY='starlight.records.v1';
function validRecords():ViewingRecord[] {
  const records=readStored<unknown>(RECORD_KEY,[]);
  return Array.isArray(records)?records.filter((r):r is ViewingRecord=>r&&typeof r.id==='string'&&typeof r.objectId==='string'&&typeof r.date==='string'&&typeof r.note==='string'):[];
}
export const recordRepository={
  list:validRecords,
  save(input:Omit<ViewingRecord,'id'> & {id?:string}):ViewingRecord {
    const records=validRecords();
    // One entry for the same content, mode and local calendar day; repeated Save is idempotent.
    const day=new Date(input.date).toLocaleDateString('en-CA');
    const existing=records.find(r=>r.objectId===input.objectId&&r.storyId===input.storyId&&r.mode===input.mode&&new Date(r.date).toLocaleDateString('en-CA')===day);
    const record:ViewingRecord={...input,id:existing?.id??input.id??crypto.randomUUID()};
    if(existing) { record.note=input.note||existing.note; record.completed=input.completed||existing.completed; records[records.indexOf(existing)]=record; }
    else records.unshift(record);
    if(!writeStored(RECORD_KEY,records)) throw new Error('Storage unavailable');
    return record;
  },
  update(id:string,patch:Partial<Pick<ViewingRecord,'note'|'completed'>>):ViewingRecord|null {
    const records=validRecords(); const index=records.findIndex(r=>r.id===id); if(index<0)return null;
    records[index]={...records[index],...patch};
    if(!writeStored(RECORD_KEY,records))throw new Error('Storage unavailable');
    return records[index];
  },
  remove(id:string):boolean { return writeStored(RECORD_KEY,validRecords().filter(r=>r.id!==id)); }
};
export type ServiceResult<T>={status:'available';value:T;source:'browser'|'demo';timestamp:string}|{status:'unavailable';reason:'unsupported'|'permission-denied'|'disconnected'|'stale'|'not-connected';timestamp:string};
export interface VehicleAdapter {getStatus():VehicleStatus;subscribe(listener:(status:VehicleStatus)=>void):()=>void}
export interface LocationAdapter {getPosition():Promise<ServiceResult<{latitude:number;longitude:number;accuracy:number}>>}
export interface SkyPositionAdapter {calculate(location:{latitude:number;longitude:number},at:Date):Promise<ServiceResult<{id:string;altitude:number;azimuth:number}[]>>}
export interface WeatherAdapter {getConditions(latitude:number,longitude:number):Promise<ServiceResult<{cloudCover:number;description:string}>>}
export interface NavigationAdapter {destinationUrl(latitude:number,longitude:number):string;sendToVehicle(latitude:number,longitude:number):Promise<ServiceResult<{routeId:string}>>}
export interface SharedSessionAdapter {getState():SessionState;subscribe(listener:(state:SessionState)=>void):()=>void;connect():void;disconnect():void;dispatch(controller:'vehicle'|'mobile',patch:Partial<Pick<SessionState,'selectedId'|'storyId'|'playing'|'position'>>):void}
const stamp=()=>new Date().toISOString();
const unavailable=(reason:'unsupported'|'permission-denied'|'disconnected'|'stale'|'not-connected'='not-connected')=>({status:'unavailable' as const,reason,timestamp:stamp()});
const vehicleListeners=new Set<(status:VehicleStatus)=>void>();
let vehicleStatus:VehicleStatus='demo-parked';
export const vehicleAdapter:VehicleAdapter={getStatus:()=>vehicleStatus,subscribe:listener=>{vehicleListeners.add(listener);return()=>{vehicleListeners.delete(listener)}}};
/** Development panel only. A zero speed is never interpreted as parked. */
export function setDemoVehicleStatus(status:VehicleStatus){vehicleStatus=status;vehicleListeners.forEach(listener=>listener(status));}
export const locationAdapter:LocationAdapter={getPosition:()=>new Promise(resolve=>{
  if(!navigator.geolocation){resolve(unavailable('unsupported'));return;}
  navigator.geolocation.getCurrentPosition(position=>resolve({status:'available',value:{latitude:position.coords.latitude,longitude:position.coords.longitude,accuracy:position.coords.accuracy},source:'browser',timestamp:new Date(position.timestamp).toISOString()}),error=>resolve(unavailable(error.code===1?'permission-denied':'disconnected')),{enableHighAccuracy:false,timeout:10000,maximumAge:60000});
})};
// No ephemeris or live weather has been connected. Demo patterns never claim to show the current sky.
export const skyAdapter:SkyPositionAdapter={calculate:async()=>unavailable()};
export const weatherAdapter:WeatherAdapter={getConditions:async()=>unavailable()};
export const navigationAdapter:NavigationAdapter={destinationUrl:(latitude,longitude)=>`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`,sendToVehicle:async()=>unavailable()};
/** Same-window vehicle/mobile simulation. No network server, remote pairing, or family data upload. */
export function createDemoSessionAdapter(initialObjectId='orion'):SharedSessionAdapter {
  let state:SessionState={status:'idle',controller:'vehicle',sequence:0,selectedId:initialObjectId,storyId:initialObjectId,playing:false,position:0};
  let pending:ReturnType<typeof setTimeout>|null=null;
  const listeners=new Set<(state:SessionState)=>void>();
  const emit=()=>listeners.forEach(listener=>listener({...state}));
  return {
    getState:()=>({...state}),subscribe:listener=>{listeners.add(listener);return()=>{listeners.delete(listener)}},
    connect(){if(pending)clearTimeout(pending);state={...state,status:'waiting'};emit();pending=setTimeout(()=>{pending=null;state={...state,status:'connected'};emit()},700)},
    disconnect(){if(pending)clearTimeout(pending);pending=null;state={...state,status:'disconnected'};emit()},
    dispatch(controller,patch){if(state.status!=='connected')return;state={...state,...patch,controller,sequence:state.sequence+1};emit()}
  };
}
