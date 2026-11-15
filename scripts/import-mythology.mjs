#!/usr/bin/env node
/** Import source evidence only. Never rewrites or approves src/mythology.ts. */
import {mkdir,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const endpoint='https://ko.wikipedia.org/w/api.php';
const userAgent='STARLIGHT-PLEOS/1.1 (https://starlight-pleos-drive.rhfenrdltkfk.chatgpt.site; curated educational mythology)';
const pages=[['orion','오리온자리'],['ursa-major','큰곰자리'],['cassiopeia','카시오페이아자리']];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let requests=0;

function apiUrl(parameters){
  const url=new URL(endpoint);
  url.search=new URLSearchParams({action:'parse',format:'json',formatversion:'2',origin:'*',maxlag:'5',...parameters});
  return url.href;
}
async function request(parameters){
  const url=apiUrl(parameters);
  for(let attempt=0;attempt<3;attempt++){
    if(++requests>18)throw new Error('Import request budget exceeded; no snapshot written.');
    try{
      const response=await fetch(url,{headers:{'User-Agent':userAgent,'Api-User-Agent':userAgent,Accept:'application/json'},signal:AbortSignal.timeout(20000)});
      if(!response.ok){
        if([429,502,503,504].includes(response.status)&&attempt<2){
          const retry=Number(response.headers.get('retry-after'));
          await wait(Math.min(10000,Number.isFinite(retry)&&retry>0?retry*1000:1000*2**attempt));
          continue;
        }
        throw new Error(`Wikipedia HTTP ${response.status}`);
      }
      const data=await response.json();
      if(data.error){
        if(data.error.code==='maxlag'&&attempt<2){await wait(1000*2**attempt);continue;}
        throw new Error(`Wikipedia API: ${data.error.code}`);
      }
      if(!data.parse)throw new Error('Unexpected Wikipedia response; no snapshot written.');
      await wait(350);
      return {data:data.parse,url};
    }catch(error){
      if(attempt===2)throw error;
      await wait(1000*2**attempt);
    }
  }
  throw new Error('Wikipedia unavailable; existing source snapshot is unchanged.');
}
// Plain evidence text only: no HTML from upstream is ever inserted into the app.
function plainText(wikitext){
  return wikitext.replace(/<!--[^]*?-->/g,'').replace(/<ref\b[^>]*>[^]*?<\/ref>/gi,'')
    .replace(/<ref\b[^>]*\/\s*>/gi,'').replace(/\[\[(?:파일|File|Image):[^]*?\]\]/gi,'')
    .replace(/\{\{[^{}]*\}\}/g,'').replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'$2')
    .replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/'{2,5}/g,'').replace(/<[^>]+>/g,'')
    .replace(/^={2,}\s*(.*?)\s*={2,}$/gm,'$1').replace(/^\*\s*/gm,'• ')
    .replace(/\n{3,}/g,'\n\n').trim();
}

const sources=[];
for(const [objectId,title] of pages){
  // tocdata replaces deprecated prop=sections; do not request an introductory summary.
  const toc=await request({page:title,prop:'tocdata|revid'});
  const section=toc.data.tocdata?.sections?.find(item=>/^신화(?:와 역사)?$/.test(item.line));
  if(!section||!Number.isSafeInteger(toc.data.revid))throw new Error(`No verified mythology section for ${title}; existing snapshot unchanged.`);
  const source=await request({oldid:String(toc.data.revid),section:String(section.index),prop:'wikitext'});
  if(source.data.revid!==toc.data.revid||typeof source.data.wikitext!=='string')throw new Error(`Revision mismatch for ${title}.`);
  sources.push({objectId,pageId:source.data.pageid,title:source.data.title,revisionId:source.data.revid,section:section.line,sectionIndex:String(section.index),
    url:`https://ko.wikipedia.org/wiki/${encodeURIComponent(title)}#${encodeURIComponent(section.anchor)}`,
    revisionUrl:`https://ko.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&oldid=${source.data.revid}#${encodeURIComponent(section.anchor)}`,
    historyUrl:`https://ko.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&action=history`,
    apiUrl:source.url,fetchedAt:new Date().toISOString(),license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',
    attribution:`한국어 위키백과 「${title}」 기여자들`,sourceWikitext:source.data.wikitext,sourceText:plainText(source.data.wikitext)});
  console.log(`Fetched ${title} / ${section.line} / revision ${source.data.revid}`);
}
// Refresh is a review candidate, never the published evidence linked by approved scripts.
const target=path.join(root,'docs/content-review/mythology-candidates.json');
await mkdir(path.dirname(target),{recursive:true});
await writeFile(`${target}.tmp`,JSON.stringify({schemaVersion:1,provider:'Korean Wikipedia / MediaWiki Action API',retrievalMethod:'direct-node-fetch',sources},null,2)+'\n');
await rename(`${target}.tmp`,target);
console.log('Candidate snapshot updated. Published sources and reviewed narration were NOT changed; review candidates before copying evidence and updating src/mythology.ts.');
