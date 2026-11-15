import {useEffect,useState} from 'react';
import type {Lang} from './types';
import {Button} from './ui';
import {vehicleControls,setDemoControlAvailability,setDemoControlCapability,setDemoControlFault} from './vehicleControls';
import type {ControlAvailability} from './vehicleControlTypes';

export function VehicleDeveloperControls({lang,onOpen}:{lang:Lang;onOpen:()=>void}){
 const [state,setState]=useState(()=>vehicleControls.getSnapshot());
 const [target,setTarget]=useState('window:rear-right');
 useEffect(()=>vehicleControls.subscribe(setState),[]);
 const ko=lang==='ko';
 const [kind,id]=target.split(':');
 const supported=kind==='window'?state.windows[id as keyof typeof state.windows].supported:kind==='climate'?state.climate[id as keyof typeof state.climate].supported:kind==='seat'?state.seats[id as keyof typeof state.seats].supported:kind==='light'?state.lighting.supported:state.telemetry.doorLockSupported;
 return <section className="vehicle-dev-panel"><h2>{ko?'차량 제어 시연 테스트':'Vehicle control demo tests'}</h2><p>{ko?'웹 시연의 상태와 실패만 변경합니다. 실제 차량 명령을 보내지 않습니다.':'Changes only the web simulator state and failures. No real vehicle commands are sent.'}</p>
  <label>{ko?'제어 데이터 상태':'Control data state'}<select data-testid="vehicle-dev-availability" value={state.availability} onChange={event=>setDemoControlAvailability(event.target.value as ControlAvailability)}>{['ready','permission-denied','unsupported','disconnected','stale'].map(value=><option key={value}>{value}</option>)}</select></label>
  <label>{ko?'다음 요청 결과 · 1회 적용':'Next request result · applies once'}<select data-testid="vehicle-dev-fault" defaultValue="none" onChange={event=>setDemoControlFault(event.target.value as 'none'|'reject-next'|'timeout-next')}><option value="none">none</option><option value="reject-next">reject-next</option><option value="timeout-next">timeout-next</option></select></label>
  <label>{ko?'시연 기능 지원':'Demo capability'}<select data-testid="vehicle-dev-capability" value={target} onChange={event=>setTarget(event.target.value)}>{['window:rear-right','window:front-left','climate:rear','seat:rear-right','light:ambient','door-lock:all'].map(value=><option key={value}>{value}</option>)}</select></label>
  <label><input data-testid="vehicle-dev-supported" type="checkbox" checked={supported} onChange={event=>setDemoControlCapability(kind as 'window'|'climate'|'seat'|'light'|'door-lock',id,event.target.checked)}/>{ko?'해당 기능 지원':'Capability supported'}</label>
  <Button onClick={onOpen}>{ko?'차량 환경 열기':'Open vehicle environment'}</Button>
 </section>;
}
