import {useId, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import {ArrowRight, BookOpen, ExternalLink, Globe2, Stars} from 'lucide-react';
import {getObject} from './content';
import {getMythStory} from './mythology';
import type {Lang, Text} from './types';
import {Button, StatusBadge} from './ui';
import './storyLibraryGuide.css';

type Section = 'constellations' | 'myths' | 'cultures';
type Props = {lang: Lang; onOpenStory: (id: string) => void};

const text = (ko: string, en: string): Text => ({ko, en});
const sources = {
  iau: 'https://www.iau.org/IAU/Astronomy-FAQs/Constellations.aspx',
  nasa: 'https://science.nasa.gov/learn/heat/resource/cultural-star-knowledge-booklet/',
};

// Only the three existing, approved scripts belong to the playable collection.
const availableStories = ['orion', 'ursa-major', 'cassiopeia'].flatMap(id => {
  const story = getMythStory(id);
  return story ? [{object: getObject(id), story}] : [];
});

const copy = {
  introduction: text('별자리의 수와 이야기의 수는 달라요. 같은 하늘도 사람과 문화에 따라 다르게 읽어 왔어요.', 'Constellations and stories have different counts. People around the world have read the same sky in many ways.'),
  navigation: text('별자리와 이야기 살펴보기', 'Explore constellations and stories'),
  tabs: {
    constellations: text('총 별자리', 'Constellation count'),
    myths: text('별자리 신화', 'Constellation myths'),
    cultures: text('문화별 이야기', 'Cultural sky stories'),
  },
  official: text('현대 천문학의 공식 기준', 'The modern astronomy standard'),
  skyRegions: text('온 하늘을 나눈 88개의 영역', '88 regions covering the whole sky'),
  definition: text('국제천문연맹(IAU)은 별자리를 경계가 정해진 하늘의 영역으로 정했어요. 이 88개로 온 하늘의 위치를 나타낼 수 있어요.', 'The International Astronomical Union (IAU) defines a constellation as a region of the sky with a boundary. These 88 regions cover the entire sky.'),
  notStoryCount: text('88은 모든 문화의 별자리나 신화를 합한 수가 아니에요.', '88 is not the total of every culture’s star patterns or myths.'),
  manyWays: text('같은 별, 여러 가지 이야기', 'The same stars, many stories'),
  manyWaysBody: text('한 문화에서 하나로 묶은 별들을 다른 문화에서는 나누어 보기도 해요. 별 하나, 별무리, 은하수에 전해지는 이야기도 있어서 공식 별자리와 꼭 하나씩 짝을 이루지는 않아요.', 'One culture may group stars together while another separates them. Stories can also belong to a single star, a star cluster, or the Milky Way, so they do not match the 88 regions one for one.'),
  worldwideCount: text('그럼 신화는 모두 몇 편일까요?', 'How many myths are there altogether?'),
  worldwideCountBody: text('같은 이야기에도 지역과 시대에 따른 여러 판본이 있어요. 모든 문화의 별 이야기를 합한 공식 총수는 확인되지 않았어요.', 'The same story can have different versions across places and times. There is no confirmed official worldwide total of sky stories.'),
  iauLink: text('IAU의 별자리 정의와 88개 목록', 'IAU definition and list of 88 constellations'),
  nasaLink: text('NASA의 세계 별 문화 학습 자료', 'NASA learning resource: cultural star knowledge'),
  available: text('지금 이 앱에서 감상할 수 있어요', 'Available to enjoy in this app'),
  mythsIntro: text('오리온·큰곰·카시오페이아의 그리스 신화예요. 이야기마다 같은 내용의 음성·자막·대본으로 함께 감상해요.', 'Explore the Greek myths of Orion, Ursa Major, and Cassiopeia. Each story has matching narration, captions, and a reading script.'),
  availableCount: text(`그리스 신화 · ${availableStories.length}편`, `Greek myths · ${availableStories.length} stories`),
  openStory: text('이야기 열기', 'Open story'),
  estimates: text('예상 읽기', 'Estimated reading'),
  minutes: text('분', 'min'),
  sourcesOnStory: text('각 이야기 아래에서 출처·원문 링크·각색 여부를 확인할 수 있어요.', 'Each story includes its source, original link, and adaptation details.'),
  cultureTitle: text('세상은 별을 어떻게 이야기했을까요?', 'How have people told stories about the stars?'),
  cultureIntro: text('그리스·로마 신화뿐 아니라 여러 지역에 별과 하늘의 전승이 있어요. 아래는 문화를 알아보는 예시이며, 모든 문화나 모든 이야기를 모은 목록은 아니에요.', 'Sky traditions reach far beyond Greek and Roman mythology. These examples introduce several traditions; they are not a collection of every culture or every story.'),
  cultureScope: text('문화권 소개 · 기관 자료로 연결', 'Cultural introductions · external reference material'),
  cultureHelp: text('외부 자료는 해당 기관의 언어로 열려요. 그리스 신화 3편 외의 이야기는 아직 앱 감상 콘텐츠로 제공하지 않아요.', 'External resources open in their publisher’s language. Only the three Greek myths are currently available as stories in the app.'),
  greekAvailable: text('앱에서 그리스 신화 감상하기', 'Explore the Greek myths in this app'),
  source: text('자료 출처', 'Reference'),
  newTab: text('새 탭에서 열림', 'opens in a new tab'),
};

type Culture = {id: string; name: Text; example: Text; description: Text; publisher: Text; url: string};
const cultures: Culture[] = [
  {
    id: 'greek-roman', name: text('그리스·로마', 'Greek and Roman'),
    example: text('사냥꾼과 곰, 하늘에 앉은 왕비', 'A hunter, a bear, and a queen in the sky'),
    description: text('오리온과 큰곰, 카시오페이아처럼 신화 속 인물과 동물을 별에 겹쳐 보았어요. 이 앱의 기존 세 편은 그리스 신화를 바탕으로 해요.', 'Mythical people and animals appear in the stars as Orion, Ursa Major, and Cassiopeia. The app’s three existing stories are based on Greek myths.'),
    publisher: text('국제천문연맹 · 별자리의 역사', 'IAU · constellation history'), url: sources.iau,
  },
  {
    id: 'korea-east-asia', name: text('한국·동아시아', 'Korea and East Asia'),
    example: text('견우와 직녀, 은하수 너머의 만남', 'The Cowherd and the Weaver across the Milky Way'),
    description: text('견우·직녀 이야기는 한국의 칠석 풍습과 이어져 있어요. 중국 등 동아시아에도 관련 전승이 있으며 지역마다 모습이 달라요.', 'The Cowherd and Weaver story is linked to Korea’s Chilseok traditions. Related stories also appear elsewhere in East Asia, with regional differences.'),
    publisher: text('한국학중앙연구원 · 견우직녀 설화', 'Academy of Korean Studies · Cowherd and Weaver'), url: 'https://encykorea.aks.ac.kr/Article/E0002170',
  },
  {
    id: 'india', name: text('인도', 'India'),
    example: text('삽타리시, 일곱 현자의 별', 'Saptarishi, the seven sages'),
    description: text('북두칠성을 이루는 일곱 별은 인도의 전통에서 일곱 현자와 연결돼요. 같은 별무리를 다르게 읽어 온 한 가지 예예요.', 'In an Indian tradition, the seven stars of the Big Dipper are associated with seven sages. This is one example of a different reading of the same stars.'),
    publisher: text('인도 안드라프라데시 교육청 · 과학 교과서(PDF)', 'Andhra Pradesh School Education · science textbook (PDF)'), url: 'https://cse.ap.gov.in/downloadBooks/Physics%20Books/8_Physics_SEM-2_Textbook.pdf/8',
  },
  {
    id: 'egypt', name: text('고대 이집트', 'Ancient Egypt'),
    example: text('시리우스와 여신 소프데트', 'Sirius and the goddess Sopdet'),
    description: text('밝은 별 시리우스는 여신 소프데트로 표현되었어요. 별자리 전체가 아니라 별 하나에도 신과 관련된 이야기가 깃들어 있어요.', 'The bright star Sirius was represented by the goddess Sopdet. A sky tradition can belong to one star as well as a whole star pattern.'),
    publisher: text('스미스소니언 국립아프리카미술관 · African Cosmos', 'Smithsonian National Museum of African Art · African Cosmos'), url: 'https://africa.si.edu/exhibitions/african-cosmos-stellar-arts',
  },
  {
    id: 'mesopotamia', name: text('메소포타미아', 'Mesopotamia'),
    example: text('점토판에 남은 하늘의 황소와 목자', 'A heavenly bull and shepherd on clay tablets'),
    description: text('바빌로니아에서는 별무리를 신과 동물, 사람의 이름으로 불렀어요. 점토판에는 오늘날 황소자리·오리온자리와 겹치는 별무리의 이름도 남아 있어요.', 'Babylonian star groups were named for gods, animals, and people. Clay tablets preserve names for patterns corresponding to today’s Taurus and Orion.'),
    publisher: text('미시간대학교 · 메소포타미아의 별자리', 'University of Michigan · Mesopotamian constellations'), url: 'https://www.early-astronomy-um.org/ancient_ziqpu.php',
  },
  {
    id: 'norse', name: text('북유럽', 'Norse traditions'),
    example: text('하늘을 붙드는 북극성', 'The Pole Star holding the sky'),
    description: text('북극성을 신들이 세운 우주의 축 끝에 달린 보석으로 보는 전승이 소개돼요. 별을 통해 세상의 모습을 상상한 이야기예요.', 'One tradition describes the Pole Star as a jewel on the tip of a spike placed through the universe by the gods—an image of how the sky is held together.'),
    publisher: text('영국 왕립천문대 · 북극성의 전설', 'Royal Observatory Greenwich · legends of the Pole Star'), url: 'https://www.rmg.co.uk/stories/space-astronomy/ursa-minor-little-bear-polaris',
  },
  {
    id: 'australia', name: text('호주 원주민 공동체', 'Aboriginal Australian communities'),
    example: text('서로 다른 공동체가 전하는 일곱 자매', 'Seven Sisters traditions in different communities'),
    description: text('호주 국립박물관은 Martu, Ngaanyatjarra, Anangu Pitjantjatjara Yankunytjatjara 사람들의 전승을 각각 소개해요. 호주 원주민 문화를 하나의 신화로 묶을 수는 없어요.', 'The National Museum of Australia presents traditions of Martu, Ngaanyatjarra, and Anangu Pitjantjatjara Yankunytjatjara peoples. These are distinct communities, not one shared mythology for all Aboriginal Australians.'),
    publisher: text('호주 국립박물관 · Songlines: Tracking the Seven Sisters', 'National Museum of Australia · Songlines: Tracking the Seven Sisters'), url: 'https://www.nma.gov.au/exhibitions/songlines',
  },
];

function ReferenceLink({href, children, lang}: {href: string; children: ReactNode; lang: Lang}) {
  return <a className="story-guide-reference" href={href} target="_blank" rel="noreferrer">
    <span>{children}</span><ExternalLink size={16} aria-hidden="true"/>
    <span className="story-guide-sr-only"> ({copy.newTab[lang]})</span>
  </a>;
}

export function StoryLibraryGuide({lang, onOpenStory}: Props) {
  const [active, setActive] = useState<Section>('constellations');
  const id = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabs: {section: Section; icon: typeof Stars}[] = [
    {section: 'constellations', icon: Stars}, {section: 'myths', icon: BookOpen}, {section: 'cultures', icon: Globe2},
  ];
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(tabs[next].section);
    tabRefs.current[next]?.focus();
  }
  return <div className="story-library-guide">
    <p className="story-guide-intro">{copy.introduction[lang]}</p>
    <div className="story-guide-tabs" role="tablist" aria-label={copy.navigation[lang]}>
      {tabs.map(({section, icon: Icon}, index) => <button
        key={section} type="button" role="tab" id={`${id}-${section}-tab`}
        aria-selected={active === section} aria-controls={`${id}-${section}-panel`}
        tabIndex={active === section ? 0 : -1}
        ref={element => {tabRefs.current[index] = element;}}
        onClick={() => setActive(section)} onKeyDown={event => moveTab(event, index)}>
        <Icon size={20} aria-hidden="true"/><span>{copy.tabs[section][lang]}</span>
      </button>)}
    </div>

    {active === 'constellations' && <section className="story-guide-panel" role="tabpanel" tabIndex={0} id={`${id}-constellations-panel`} aria-labelledby={`${id}-constellations-tab`}>
      <div className="story-guide-count">
        <div className="story-guide-number" aria-hidden="true">88<span>IAU</span></div>
        <div>
          <StatusBadge tone="warm">{copy.official[lang]}</StatusBadge>
          <h3>{copy.skyRegions[lang]}</h3>
          <p>{copy.definition[lang]}</p>
          <p className="story-guide-emphasis">{copy.notStoryCount[lang]}</p>
        </div>
      </div>
      <div className="story-guide-explanations">
        <article><h4>{copy.manyWays[lang]}</h4><p>{copy.manyWaysBody[lang]}</p></article>
        <article><h4>{copy.worldwideCount[lang]}</h4><p>{copy.worldwideCountBody[lang]}</p></article>
      </div>
      <div className="story-guide-sources">
        <ReferenceLink href={sources.iau} lang={lang}>{copy.iauLink[lang]}</ReferenceLink>
        <ReferenceLink href={sources.nasa} lang={lang}>{copy.nasaLink[lang]}</ReferenceLink>
      </div>
    </section>}

    {active === 'myths' && <section className="story-guide-panel" role="tabpanel" tabIndex={0} id={`${id}-myths-panel`} aria-labelledby={`${id}-myths-tab`}>
      <StatusBadge>{copy.availableCount[lang]}</StatusBadge>
      <h3>{copy.available[lang]}</h3>
      <p>{copy.mythsIntro[lang]}</p>
      <ul className="story-guide-stories">
        {availableStories.map(({object, story}, index) => <li key={object.id}>
          <Button variant="ghost" className="story-guide-story" onClick={() => onOpenStory(object.id)}>
            <span className="story-guide-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="story-guide-story-text">
              <span className="story-guide-object">{object.name[lang]} <span lang="en">{lang === 'ko' ? object.name.en : ''}</span></span>
              <strong>{story.title[lang]}</strong>
              <span className="story-guide-duration">{copy.estimates[lang]} · {story.estimatedMinutes[lang]}{lang === 'ko' ? '' : ' '}{copy.minutes[lang]}</span>
            </span>
            <ArrowRight size={22} aria-hidden="true"/>
          </Button>
          <span className="story-guide-sr-only">{copy.openStory[lang]}</span>
        </li>)}
      </ul>
      <p className="story-guide-note">{copy.sourcesOnStory[lang]}</p>
    </section>}

    {active === 'cultures' && <section className="story-guide-panel" role="tabpanel" tabIndex={0} id={`${id}-cultures-panel`} aria-labelledby={`${id}-cultures-tab`}>
      <StatusBadge tone="muted">{copy.cultureScope[lang]}</StatusBadge>
      <h3>{copy.cultureTitle[lang]}</h3>
      <p>{copy.cultureIntro[lang]}</p>
      <p className="story-guide-note">{copy.cultureHelp[lang]}</p>
      <ul className="story-guide-cultures">
        {cultures.map(culture => <li key={culture.id}>
          <article>
            <p className="story-guide-culture-name">{culture.name[lang]}</p>
            <h4>{culture.example[lang]}</h4>
            <p>{culture.description[lang]}</p>
            {culture.id === 'greek-roman' && <Button variant="ghost" className="story-guide-greek-link" onClick={() => {setActive('myths'); tabRefs.current[1]?.focus();}}>{copy.greekAvailable[lang]}<ArrowRight size={18} aria-hidden="true"/></Button>}
            <ReferenceLink href={culture.url} lang={lang}>{culture.publisher[lang]}</ReferenceLink>
          </article>
        </li>)}
      </ul>
      <ReferenceLink href={sources.nasa} lang={lang}>{copy.nasaLink[lang]}</ReferenceLink>
    </section>}
  </div>;
}
