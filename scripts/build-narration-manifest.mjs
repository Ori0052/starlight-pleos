/** Assemble real synthesis timing metadata; never creates or interpolates speech. */
import fs from 'node:fs';
import path from 'node:path';
const inputDir=path.resolve(process.argv[2]||'/workspace/artifacts/starlight-narration');
const inputs=JSON.parse(fs.readFileSync(path.join(inputDir,'inputs.json'),'utf8'));
const recordings={};const reports=[];
for(const item of inputs){
 const result=JSON.parse(fs.readFileSync(path.join(inputDir,`${item.objectId}-result.json`),'utf8'));
 if(result.isError)throw new Error(`Generation did not succeed: ${item.id}`);
 let data=result.structuredContent;
 for(const block of result.content||[]){if(block.type==='text'){try{const value=JSON.parse(block.text);if(value.audio_url)data=value;}catch{}}}
 if(!data?.audio_url||!Number.isFinite(data.duration))throw new Error(`Audio metadata missing: ${item.id}`);
 const characters=data.original_characters;
 if(!Array.isArray(characters)||characters.map(c=>c.text).join('')!==item.text)throw new Error(`Returned text differs: ${item.id}`);
 let offset=0;
 const positions=characters.map(c=>{const startOffset=offset;offset+=c.text.length;return {...c,startOffset,endOffset:offset};});
 let cursor=0;
 const cues=item.paragraphs.map((sentence,index)=>{
  const startOffset=cursor,endOffset=cursor+sentence.length;
  if(item.text.slice(startOffset,endOffset)!==sentence)throw new Error('Sentence offset mismatch');
  const span=positions.filter(c=>c.endOffset>startOffset&&c.startOffset<endOffset);
  if(!span.length)throw new Error(`No timing for sentence ${index}`);
  const start=span[0].start_time,end=span.at(-1).end_time;
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end>data.duration+.01)throw new Error('Invalid source timing');
  cursor=endOffset+2;return {index,start,end};
 });
 recordings[item.id]={[item.lang]:{url:data.audio_url,duration:data.duration,cues,text:item.text,voiceName:'Annie - Lifelike',provider:'HeyGen Voice'}};
 reports.push({storyId:item.id,title:item.title,language:item.lang,voiceId:'330290724a1b470fb63153f34d4c0183',voiceName:'Annie - Lifelike',model:'server default; actual model not returned',durationSeconds:data.duration,sourceCharacters:characters.length,cues:cues.length,audioUrl:data.audio_url,verification:'Returned text and monotonically ordered synthesis cue metadata checked; full recordings not independently downloaded or listened to in this environment.'});
}
const manifest={schemaVersion:1,recordings};
fs.mkdirSync('public/audio',{recursive:true});
fs.writeFileSync('public/audio/narration-manifest.json',JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync('src/narrationCatalog.ts',`import type {NarrationManifest} from './narrationAudio';\n/** Generated from actual synthesis result timestamps. */\nexport const narrationManifest:NarrationManifest=${JSON.stringify(manifest,null,2)};\n`);
fs.writeFileSync('public/audio/narration-provenance.json',JSON.stringify({date:new Date().toISOString(),provider:'HeyGen Voice',reports},null,2)+'\n');
console.log(reports.map(r=>({story:r.storyId,duration:r.durationSeconds,sentences:r.cues})));
