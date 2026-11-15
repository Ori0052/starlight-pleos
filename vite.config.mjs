import {defineConfig} from 'vite';

// Keep the first paint styled even when a cached document or an embedded browser
// cannot complete a separate stylesheet request. Assets and UI remain unchanged.
export default defineConfig({
 plugins:[{
  name:'inline-built-app-styles',
  apply:'build',
  transformIndexHtml:{
   order:'post',
   handler(html,context){
    const styles=Object.values(context.bundle??{}).filter(asset=>asset.type==='asset'&&asset.fileName.endsWith('.css'));
    if(styles.length===0)throw new Error('The production app must include its styles.');
    let result=html;
    for(const asset of styles){
     const css=typeof asset.source==='string'?asset.source:new TextDecoder().decode(asset.source);
     if(/<\/style/i.test(css))throw new Error('Unexpected style terminator in bundled CSS.');
     const escaped=asset.fileName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
     const link=new RegExp(`<link\\b[^>]*href=["']/?${escaped}["'][^>]*>`,'g');
     if(!link.test(result))throw new Error(`Missing stylesheet link: ${asset.fileName}`);
     link.lastIndex=0;
     result=result.replace(link,()=>`<style data-starlight-styles="bundled">${css}</style>`);
    }
    return result;
   },
  },
 }],
});
