import {vehicleAdapter} from './services';
import type {VehicleStatus} from './types';
import type {ClimateValues,ControlAvailability,ControlFailure,VehicleCommand,VehicleCommandResult,VehicleControlAdapter,VehicleControlSnapshot,WindowId,SeatId,ClimateZone} from './vehicleControlTypes';

/** App-owned browser simulation. This adapter never reads or commands a physical car. */
const windows:WindowId[]=['front-left','front-right','rear-left','rear-right'];
const seats:SeatId[]=[...windows];
const zones:ClimateZone[]=['front','rear'];
const now=()=>new Date().toISOString();
function freeze<T>(value:T):T{
 if(value&&typeof value==='object'){
  for(const item of Object.values(value))freeze(item);
  Object.freeze(value);
 }
 return value;
}
function copy(value:VehicleControlSnapshot):VehicleControlSnapshot{
 return {...value,telemetry:{...value.telemetry},windows:Object.fromEntries(windows.map(id=>[id,{...value.windows[id]}])) as VehicleControlSnapshot['windows'],climate:{front:{...value.climate.front},rear:{...value.climate.rear}},lighting:{...value.lighting},seats:Object.fromEntries(seats.map(id=>[id,{...value.seats[id]}])) as VehicleControlSnapshot['seats'],lastCommand:{...value.lastCommand}};
}
const initialTime=now();
let snapshot:VehicleControlSnapshot=freeze({
 source:'demo',active:false,availability:'ready',updatedAt:initialTime,
 telemetry:{batteryPercent:85,rangeKm:420,cabinTempC:21.5,doorsLocked:false,doorLockSupported:true},
 windows:Object.fromEntries(windows.map(id=>[id,{supported:true,position:0,target:null,motion:'stopped'}])) as VehicleControlSnapshot['windows'],
 climate:{front:{supported:true,temperature:22,fan:2,freshAir:true,power:true},rear:{supported:true,temperature:22,fan:2,freshAir:true,power:true}},
 lighting:{supported:true,brightness:35,on:true},
 seats:Object.fromEntries(seats.map(id=>[id,{supported:true,recline:20,slide:50}])) as VehicleControlSnapshot['seats'],
 lastCommand:{status:'idle',id:0,updatedAt:initialTime},
});
const listeners=new Set<(value:VehicleControlSnapshot)=>void>();
const movement=new Map<WindowId,ReturnType<typeof setInterval>>();
let sequence=0;
let refreshGeneration=0;
let nextFault:'none'|'reject-next'|'timeout-next'='none';
type Pending={id:number;command:VehicleCommand;timer:ReturnType<typeof setTimeout>;resolve:(value:VehicleCommandResult)=>void};
let pending:Pending|null=null;
function publish(change:(value:VehicleControlSnapshot)=>void){
 const next=copy(snapshot);change(next);snapshot=freeze(next);
 listeners.forEach(listener=>listener(snapshot));
}
function commandState(value:VehicleControlSnapshot,id:number,type:VehicleCommand['type'],status:'pending'|'applied'|'failed',reason?:ControlFailure){
 value.lastCommand={id,type,status,updatedAt:now(),...(reason?{reason}:{})};
}
function gate():ControlFailure|null{
 if(!snapshot.active)return 'not-started';
 if(snapshot.availability!=='ready')return snapshot.availability;
 const state=vehicleAdapter.getStatus();
 if(state==='demo-parked')return null;
 return state==='restricted'?'driving-restricted':state;
}
function stopMovement(id:WindowId){
 const timer=movement.get(id);if(timer!==undefined)clearInterval(timer);movement.delete(id);
}
function stopAllMovement(){windows.forEach(stopMovement);}
function markStopped(value:VehicleControlSnapshot,ids:WindowId[]=windows){
 ids.forEach(id=>{value.windows[id].motion='stopped';value.windows[id].target=null;});
}
function cancelPending(reason:ControlFailure){
 const job=pending;if(!job)return;
 pending=null;clearTimeout(job.timer);
 publish(value=>commandState(value,job.id,job.command.type,'failed',reason));
 job.resolve({ok:false,reason,id:job.id});
}
function stopForRestriction(reason:ControlFailure){
 stopAllMovement();cancelPending(reason);
 publish(value=>markStopped(value));
}
function supported(command:VehicleCommand):boolean{
 switch(command.type){
  case 'door-lock':return snapshot.telemetry.doorLockSupported;
  case 'window':return snapshot.windows[command.window]?.supported===true;
  case 'climate':return snapshot.climate[command.zone]?.supported===true;
  case 'light':return snapshot.lighting.supported;
  case 'seat':return snapshot.seats[command.seat]?.supported===true;
 }
}
const integerBetween=(value:unknown,min:number,max:number)=>typeof value==='number'&&Number.isFinite(value)&&Number.isInteger(value)&&value>=min&&value<=max;
function valid(command:VehicleCommand):boolean{
 if(!command||typeof command!=='object')return false;
 switch(command.type){
  case 'door-lock':return typeof command.locked==='boolean';
  case 'window':return windows.includes(command.window)&&['vent','close','stop'].includes(command.action);
  case 'climate':{
   if(!zones.includes(command.zone)||!command.values||typeof command.values!=='object'||Array.isArray(command.values))return false;
   const values=command.values;
   const allowed:(keyof ClimateValues)[]=['temperature','fan','freshAir','power'];
   if(Object.keys(values).length===0||Object.keys(values).some(key=>!allowed.includes(key as keyof ClimateValues))||Object.values(values).some(value=>value===undefined))return false;
   return (values.temperature===undefined||(typeof values.temperature==='number'&&Number.isFinite(values.temperature)&&values.temperature>=16&&values.temperature<=28&&Number.isInteger(values.temperature*2)))&&
    (values.fan===undefined||integerBetween(values.fan,0,5))&&
    (values.freshAir===undefined||typeof values.freshAir==='boolean')&&
    (values.power===undefined||typeof values.power==='boolean');
  }
  case 'light':return integerBetween(command.brightness,0,100)&&typeof command.on==='boolean';
  case 'seat':return seats.includes(command.seat)&&integerBetween(command.recline,10,45)&&integerBetween(command.slide,0,100);
  default:return false;
 }
}
function startMovement(id:WindowId,target:number){
 stopMovement(id);
 const position=snapshot.windows[id].position;
 if(position===target){publish(value=>markStopped(value,[id]));return;}
 publish(value=>{value.windows[id].target=target;value.windows[id].motion=target>position?'opening':'closing';});
 const timer=setInterval(()=>{
  if(movement.get(id)!==timer)return;
  const blocked=gate();
  if(blocked||!snapshot.windows[id].supported){stopMovement(id);publish(value=>markStopped(value,[id]));return;}
  const current=snapshot.windows[id].position;
  const next=current<target?Math.min(target,current+5):Math.max(target,current-5);
  if(next===target)stopMovement(id);
  publish(value=>{
   value.windows[id].position=next;value.updatedAt=now();
   if(next===target)markStopped(value,[id]);
  });
 },100);
 movement.set(id,timer);
}
function reject(id:number,command:VehicleCommand,reason:ControlFailure):VehicleCommandResult{
 // An unaccepted busy request must not hide the command that is still pending.
 if(!pending)publish(value=>commandState(value,id,command?.type,'failed',reason));
 return {ok:false,reason,id};
}
function apply(command:VehicleCommand,id:number){
 publish(value=>{
  switch(command.type){
   case 'door-lock':value.telemetry.doorsLocked=command.locked;break;
   case 'climate':Object.assign(value.climate[command.zone],command.values);break;
   case 'light':Object.assign(value.lighting,{brightness:command.brightness,on:command.on});break;
   case 'seat':Object.assign(value.seats[command.seat],{recline:command.recline,slide:command.slide});break;
  }
  value.updatedAt=now();commandState(value,id,command.type,'applied');
 });
 if(command.type==='window')startMovement(command.window,command.action==='close'?0:Math.max(snapshot.windows[command.window].position,25));
}

export const vehicleControls:VehicleControlAdapter={
 getSnapshot:()=>snapshot,
 subscribe(listener){listeners.add(listener);return()=>{listeners.delete(listener);};},
 startDemo(){if(!snapshot.active)publish(value=>{value.active=true;value.updatedAt=now();value.lastCommand={status:'idle',id:sequence,updatedAt:now()};});},
 stopDemo(){
  refreshGeneration++;stopAllMovement();
  publish(value=>{value.active=false;markStopped(value);});
  cancelPending('cancelled');
  publish(value=>{value.active=false;markStopped(value);value.lastCommand={status:'idle',id:sequence,updatedAt:now()};});
 },
 async refresh(){
  const generation=++refreshGeneration;
  await new Promise<void>(resolve=>setTimeout(resolve,300));
  if(generation!==refreshGeneration||!snapshot.active||snapshot.availability!=='ready')return;
  publish(value=>{value.updatedAt=now();});
 },
 execute(command){
  const id=++sequence;
  if(!valid(command))return Promise.resolve(reject(id,command,'invalid-value'));
  command=freeze(command.type==='climate'?{...command,values:{...command.values}}:{...command});
  if(command.type==='window'&&command.action==='stop'){
   if(pending?.command.type==='window'&&pending.command.window===command.window)cancelPending('cancelled');
   stopMovement(command.window);
   publish(value=>{
    markStopped(value,[command.window]);value.updatedAt=now();
    // Preserve an unrelated in-flight request's pending indicator.
    if(!pending)commandState(value,id,'window','applied');
   });
   return Promise.resolve({ok:true,source:'demo',id});
  }
  const blocked=gate();if(blocked)return Promise.resolve(reject(id,command,blocked));
  if(!supported(command))return Promise.resolve(reject(id,command,'unsupported'));
  if(pending)return Promise.resolve(reject(id,command,'busy'));
  const fault=nextFault;nextFault='none';
  return new Promise<VehicleCommandResult>(resolve=>{
   const job:Pending={id,command,resolve,timer:setTimeout(()=>{
    if(pending!==job)return;
    pending=null;
    const failure=gate()??(!supported(command)?'unsupported':fault==='reject-next'?'rejected':fault==='timeout-next'?'timeout':null);
    if(failure){publish(value=>commandState(value,id,command.type,'failed',failure));resolve({ok:false,reason:failure,id});return;}
    apply(command,id);resolve({ok:true,source:'demo',id});
   },fault==='reject-next'?800:fault==='timeout-next'?1200:400)};
   pending=job;
   publish(value=>commandState(value,id,command.type,'pending'));
  });
 },
};

/** Developer-panel controls: these affect only the browser's sample vehicle. */
export function setDemoControlAvailability(availability:ControlAvailability){
 if(!['ready','permission-denied','unsupported','disconnected','stale'].includes(availability))return;
 if(availability!=='ready')stopAllMovement();
 publish(value=>{value.availability=availability;if(availability!=='ready')markStopped(value);});
 if(availability!=='ready')cancelPending(availability);
}
export function setDemoControlFault(fault:'none'|'reject-next'|'timeout-next'){
 if(['none','reject-next','timeout-next'].includes(fault))nextFault=fault;
}
export function setDemoControlCapability(kind:'window'|'climate'|'light'|'seat'|'door-lock',id:string,supportedValue:boolean){
 if(typeof supportedValue!=='boolean')return;
 const matches=(command:VehicleCommand)=>command.type===kind&&(command.type==='window'?command.window===id:command.type==='climate'?command.zone===id:command.type==='seat'?command.seat===id:true);
 if(kind==='window'&&windows.includes(id as WindowId)){
  if(!supportedValue)stopMovement(id as WindowId);
  publish(value=>{value.windows[id as WindowId].supported=supportedValue;if(!supportedValue)markStopped(value,[id as WindowId]);});
 }else if(kind==='climate'&&zones.includes(id as ClimateZone))publish(value=>{value.climate[id as ClimateZone].supported=supportedValue;});
 else if(kind==='seat'&&seats.includes(id as SeatId))publish(value=>{value.seats[id as SeatId].supported=supportedValue;});
 else if(kind==='light')publish(value=>{value.lighting.supported=supportedValue;});
 else if(kind==='door-lock')publish(value=>{value.telemetry.doorLockSupported=supportedValue;});
 if(!supportedValue&&pending&&matches(pending.command))cancelPending('unsupported');
}
vehicleAdapter.subscribe((status:VehicleStatus)=>{
 if(status==='demo-parked')return;
 stopForRestriction(status==='restricted'?'driving-restricted':status);
});
