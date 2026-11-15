import type {Celestial,Text} from './types';
import {getMythStory,type MythStory} from './mythology';
export type StoryMode='science'|'mythology';
export type ResolvedStory={id:string;kind:StoryMode;title:Text;paragraphs:Text[];mythology?:MythStory};
/** Reviewed scripts are packaged with the app; fetching source revisions never replaces them at runtime. */
export function resolveStory(object:Celestial,mode:StoryMode):ResolvedStory{
 const myth=mode==='mythology'?getMythStory(object.id):undefined;
 return myth?{id:myth.id,kind:'mythology',title:myth.title,paragraphs:myth.paragraphs,mythology:myth}:{id:object.id,kind:'science',title:object.storyTitle,paragraphs:object.story};
}
export function storyModeFromId(storyId?:string):StoryMode{return storyId?.includes(':mythology:')?'mythology':'science'}
