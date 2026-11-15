import {useId} from 'react';
import './brandMark.css';

/** Render the approved artwork without its black icon background. */
export function BrandMark(){
 const maskId=`starlight-brand-${useId()}`;
 return <svg className="brand-mark" viewBox="64 96 384 320" aria-hidden="true" focusable="false">
  <defs>
   <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512" style={{maskType:'luminance'}}>
    <image href="/icons/icon-512.png" width="512" height="512"/>
   </mask>
  </defs>
  <rect width="512" height="512" fill="currentColor" mask={`url(#${maskId})`}/>
 </svg>;
}
