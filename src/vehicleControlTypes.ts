export type WindowId='front-left'|'front-right'|'rear-left'|'rear-right';
export type SeatId=WindowId;
export type ClimateZone='front'|'rear';
export type ControlAvailability='ready'|'permission-denied'|'unsupported'|'disconnected'|'stale';
export type ControlFailure=Exclude<ControlAvailability,'ready'>|'not-started'|'driving-restricted'|'busy'|'invalid-value'|'rejected'|'timeout'|'cancelled';
export type ClimateValues={temperature:number;fan:number;freshAir:boolean;power:boolean};
export type VehicleCommand=
 |{type:'door-lock';locked:boolean}
 |{type:'window';window:WindowId;action:'vent'|'close'|'stop'}
 |{type:'climate';zone:ClimateZone;values:Partial<ClimateValues>}
 |{type:'light';brightness:number;on:boolean}
 |{type:'seat';seat:SeatId;recline:number;slide:number};
export type VehicleCommandResult={ok:true;source:'demo';id:number}|{ok:false;reason:ControlFailure;id:number};
export type VehicleControlSnapshot={
 source:'demo';active:boolean;availability:ControlAvailability;updatedAt:string;
 telemetry:{batteryPercent:number;rangeKm:number;cabinTempC:number;doorsLocked:boolean;doorLockSupported:boolean};
 windows:Record<WindowId,{supported:boolean;position:number;target:number|null;motion:'opening'|'closing'|'stopped'}>;
 climate:Record<ClimateZone,ClimateValues&{supported:boolean}>;
 lighting:{supported:boolean;brightness:number;on:boolean};
 seats:Record<SeatId,{supported:boolean;recline:number;slide:number}>;
 lastCommand:{status:'idle'|'pending'|'applied'|'failed';id:number;type?:VehicleCommand['type'];reason?:ControlFailure;updatedAt:string};
};
export interface VehicleControlAdapter{
 getSnapshot():VehicleControlSnapshot;
 subscribe(listener:(snapshot:VehicleControlSnapshot)=>void):()=>void;
 startDemo():void;
 stopDemo():void;
 refresh():Promise<void>;
 execute(command:VehicleCommand):Promise<VehicleCommandResult>;
}
