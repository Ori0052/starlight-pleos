import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import ts from 'typescript';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const code=await fs.readFile(path.join(root,'src/musicTrack.ts'),'utf8');
const {outputText}=ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
const {planetMusicTracks}=await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const ids=['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
if(Object.keys(planetMusicTracks).length!==8||new Set(Object.values(planetMusicTracks).map(track=>track.id)).size!==8)throw new Error('Exactly eight distinct planet tracks are required.');
const tracks=[];
for(const objectId of ids){
 const track=planetMusicTracks[objectId];
 if(!track?.src||!track.sourceUrl||!track.licenseUrl||!track.credit)throw new Error(`Incomplete music attribution: ${objectId}`);
 const entry={objectId,...track};
 if(track.src.startsWith('/')){
  const bytes=await fs.readFile(path.join(root,'public',track.src));
  const sha256=createHash('sha256').update(bytes).digest('hex');
  if(track.sha256&&track.sha256!==sha256)throw new Error(`Audio integrity mismatch: ${objectId}`);
  entry.bytes=bytes.length;entry.sha256=sha256;entry.delivery='bundled';
 }else entry.delivery='external';
 tracks.push(entry);
}
await fs.writeFile(path.join(root,'public/audio/planets/catalog.json'),JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),tracks},null,2)+'\n');
process.stdout.write(JSON.stringify(tracks.map(({objectId,id,delivery,bytes})=>({objectId,id,delivery,bytes})),null,2)+'\n');
