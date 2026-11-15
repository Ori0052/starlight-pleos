# 별자리와 이야기 가이드

## 반영 범위

사용자가 동의한 분류인 **총 별자리 / 별자리 신화 / 문화별 이야기**를 기존 앱의 안내 화면에 적용하기 위한 컴포넌트다. 새 신화 추가는 보류한 상태를 유지한다.

- `src/StoryLibraryGuide.tsx`: `StoryLibraryGuide({lang, onOpenStory})`를 내보낸다. `onOpenStory`에는 천체 ID(`orion`, `ursa-major`, `cassiopeia`)를 전달한다.
- `src/storyLibraryGuide.css`: 안내 화면 안에서만 쓰는 스타일. 기존 `Button`, `StatusBadge`를 재사용한다.
- 부모 화면이 기존 모달에 컴포넌트를 넣고 이야기 화면으로 연결한다. 이 컴포넌트 자체는 새 모달이나 경로를 만들지 않는다.

## 숫자와 콘텐츠의 구분

1. **88개**: IAU가 정한 현대 천문학의 별자리 영역 수다. 별을 선으로 연결한 그림이나 전 세계 문화의 별 이야기 총수로 표시하지 않는다.
2. **앱에서 감상 가능한 그리스 신화 3편**: 기존 `mythology.ts`의 오리온·큰곰·카시오페이아만 표시한다. 제목과 예상 읽기 시간은 기존 데이터에서 가져온다. 새로운 대본·음성·별자리를 추가하지 않는다.
3. **문화별 소개**: 그리스·로마, 한국·동아시아, 인도, 고대 이집트, 메소포타미아, 북유럽, 호주 원주민 공동체의 예시와 기관 자료 링크다. 새로 감상 가능한 앱 이야기로 취급하지 않는다. 모든 문화나 전승을 수집했다는 뜻도 아니다.

별 하나, 별무리, 은하수, 하늘의 어두운 부분에도 전승이 있을 수 있다. 문화별 묶음과 공식 88개 영역은 일대일 대응이 아니며, 한 이야기에도 지역·시대별 판본이 있다. **모든 문화의 별 이야기에 관한 공식 세계 총수는 확인되지 않았다.**

## 자료와 확인 범위

조사일: 2026-11-15. 안내 문구는 아래 자료를 참고해 새로 요약했다. 원문·이미지·대본을 수입하지 않았다. 공개 웹페이지에 접근할 수 있다는 사실만으로 대본이나 녹음의 자유로운 재사용 권리가 생기지는 않는다.

| 주제 | 자료 | 확인한 내용과 한계 |
| --- | --- | --- |
| 공식 별자리 | [IAU — The Constellations](https://www.iau.org/IAU/Astronomy-FAQs/Constellations.aspx) | 88개 목록과, 경계로 둘러싸인 하늘의 영역이라는 현대 정의. 문화별 별그림과 구별한다. |
| 세계 별 문화 학습 | [NASA — Cultural Star Knowledge Booklet](https://science.nasa.gov/learn/heat/resource/cultural-star-knowledge-booklet/) | 문화별 별 지식을 살펴보는 학습 자료의 입구로 제공한다. 세계 전승 총목록으로 설명하지 않는다. |
| 한국·동아시아 | [한국학중앙연구원 — 견우직녀 설화](https://encykorea.aks.ac.kr/Article/E0002170) | 한국의 칠석과 관련 전승, 중국의 오래된 기록, 지역·시대별 전승의 맥락. 별들이 해마다 실제로 가까워져 만난다고 설명하지 않는다. |
| 인도 | [안드라프라데시 교육청 — 과학 교과서 PDF](https://cse.ap.gov.in/downloadBooks/Physics%20Books/8_Physics_SEM-2_Textbook.pdf/8) | 검색에 색인된 교과서 설명에서 삽타리시와 일곱 현자의 연결을 확인. PDF 본문 직접 열기는 시간 초과되어 전체 판본·세부 인명은 재검수하지 않았으며 앱에도 싣지 않는다. |
| 고대 이집트 | [Smithsonian National Museum of African Art — African Cosmos: Stellar Arts](https://africa.si.edu/exhibitions/african-cosmos-stellar-arts) | 기관 검색 색인에서 시리우스를 신격화한 소프데트 설명 확인. 본문 직접 열기는 서버 오류. 개별 전승의 상세 대본은 제공하지 않는다. 교차 자료: [Emory University, Relief of the Goddess Sopdet](https://collections.carlos.emory.edu/objects/25599/relief-of-the-goddess-sopdet) 검색 설명도 같은 연결을 확인했지만, 직접 접근에는 자바스크립트 확인 화면이 나타났다. |
| 메소포타미아 | [University of Michigan — Mesopotamian Constellations and Their Legacy](https://www.early-astronomy-um.org/ancient_ziqpu.php) | 신·동물·사물 이름의 바빌로니아 별무리 및 오늘날 황소자리·오리온자리에 대응하는 이름. 별자리 문화와 천문·점성 전통의 맥락을 소개한다. |
| 북유럽 | [Royal Observatory Greenwich — Ursa Minor and Polaris](https://www.rmg.co.uk/stories/space-astronomy/ursa-minor-little-bear-polaris) | ‘Legends about the Pole Star’의 북극성을 우주의 축 끝 보석으로 보는 노르드 전승. 모든 북유럽 전승을 대표한다고 설명하지 않는다. |
| 호주 원주민 공동체 | [National Museum of Australia — Songlines: Tracking the Seven Sisters](https://www.nma.gov.au/exhibitions/songlines) | Martu, Ngaanyatjarra, Anangu Pitjantjatjara Yankunytjatjara 사람들의 전승이 소개되는 전시. 서로 다른 공동체를 하나의 보편적인 ‘원주민 신화’로 묶지 않는다. 공개 전시 범위를 넘어 비공개 전승을 재구성하지 않는다. |

## 동작과 접근성

- 한국어·영어 안내 문구를 리소스 객체로 분리했다.
- 세 탭은 키보드 좌우 화살표·Home·End·Tab으로 이동할 수 있다. 선택 상태와 패널 연결을 ARIA로 제공한다.
- 이야기 제목을 선택하면 기존 천체 ID를 부모에 전달한다. 새 이야기를 생성하거나 API를 호출하지 않는다.
- 외부 자료는 기관명을 링크에 표시하고 새 탭에서 연다. 스크린리더용 ‘새 탭에서 열림’ 안내를 제공한다.
- 좁은 화면에서는 설명·문화 소개를 한 열로 배치한다. 기존 `.large-text` 설정을 따라 글자와 탭 조작 영역을 키운다.
- 구현 수준의 키보드·대비·레이아웃 지원이며, 실제 보조기술 사용자 검증을 완료했다는 의미는 아니다.

## 검수

- 이 작업에서는 TypeScript 검사를 실행한다. 실제 앱에 마운트한 뒤 모달 열기, 세 탭, 세 이야기 연결, 모바일·영어·큰 글씨의 화면 검수는 부모 구현과 함께 확인해야 한다.
- 외부 기관의 PDF 지연·서버 오류·언어는 앱에서 제어하지 않는다. 앱 대본과 외부 참고자료의 제공 범위를 명확히 나누었다.
