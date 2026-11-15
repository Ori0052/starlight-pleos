# 별자리 이야기 배경음악

별자리 이야기에는 드뷔시의 **달빛 (Clair de lune, Suite bergamasque)** 피아노 녹음을 사용한다. 이 파일은 AI 생성 연주가 아닌 Laurens Goedhart의 2011년 연주·녹음이다. 행성에는 이 곡 대신 별도 지정한 8개 음악을 사용한다. 행성별 음원과 출처·디지털 연주 범위는 [PLANET_MUSIC.md](PLANET_MUSIC.md)를 따른다.

## 원본과 권리

- 작곡: Claude Debussy (1862–1918). 악곡 자체는 퍼블릭 도메인이다.
- 피아노·녹음: **Laurens Goedhart**, 2011년. Commons의 표시 날짜는 2011-08-20이다.
- **녹음 파일의 라이선스: [Creative Commons Attribution 3.0 Unported (CC BY 3.0)](https://creativecommons.org/licenses/by/3.0/)**. 녹음을 퍼블릭 도메인으로 표시하면 안 된다.
- [Wikimedia Commons의 녹음별 출처·라이선스](https://commons.wikimedia.org/wiki/File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg). 확인한 [고정 버전](https://commons.wikimedia.org/w/index.php?title=File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg&oldid=1264119050).
- Commons가 인용하는 [연주자 원문](https://soundcloud.com/laurensgoedhart/claude-debussys-clair-de-lune). 이번 환경에서는 SoundCloud 페이지를 직접 불러오지 못했다. Commons의 녹음별 저작자·라이선스 표기를 확인했다.
- Commons 원본 Ogg 인코딩 크레딧: **Akaniji**. 앱은 Wikimedia가 제공하는 MP3 변환본을 사용한다.

앱 안에 표시할 크레딧:

> 달빛 — Claude Debussy · 피아노·녹음 Laurens Goedhart (2011) · 원본 Commons 변환 Akaniji · CC BY 3.0. Wikimedia MP3 변환본 사용. 반복 재생 및 재생 음량 조절.

이 크레딧에는 Commons 출처와 CC BY 3.0 링크를 연결한다. 출처 표시는 권리자가 앱을 보증하거나 후원한다는 뜻이 아니다.

## 파일 출처와 검증

- 앱 파일: `public/audio/clair-de-lune.mp3` (런타임 `/audio/clair-de-lune.mp3`).
- [Wikimedia 제공 MP3](https://upload.wikimedia.org/wikipedia/commons/transcoded/b/be/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg.mp3).
- 다운로드 경로: [Open Sleep Music의 동일 바이트 미러](https://github.com/jochenwezel/open-sleep-music/releases/download/media-v1/candidate-clair-de-lune-claude-debussy-suite-bergamasque.mp3).
- [미러의 원본 URL·해시·권리 메타데이터](https://github.com/jochenwezel/open-sleep-music/blob/78b9a07c4075ebc1263b00cd1a01f0c2c9ee174e/tools/github-media-delivery.json). 이 제3자 미러는 파일 전달에 사용했으며, 라이선스 판단은 위 Commons 녹음별 출처에 근거한다.
- 크기: **7,563,179 바이트**.
- SHA-256: `c17f9be9d917cb4dc99e55bbeb3b53ae1beb5bce8a649bb387ed5ab21f896778`.
- SHA-1 (미러 매니페스트): `7044558c873aa9011ba200a9d52c39ca3d9e2d87`.
- 2026-11-15 확인: 다운로드한 파일의 SHA-256이 미러 매니페스트와 일치한다. 원본 Wikimedia 호스트는 이 환경의 네트워크 허용 목록에 없어 직접 다운로드할 수 없었다. 허용된 GitHub 미러를 사용했으며 프록시나 TLS 설정은 우회하지 않았다.
- `ffprobe`: MP3, 44,100 Hz, 2채널, **304.117551초** (약 5분 4초), 약 199 kbps. Commons의 원본 Ogg 길이 304.088526초와 인코딩 패딩 때문에 조금 다르다.
- `ffmpeg -v error -i public/audio/clair-de-lune.mp3 -f null -`: 전체 디코딩 종료 코드 0, 오류 없음.
- 앱에 복사한 파일은 다운로드한 MP3와 동일하며 추가 편집·재인코딩·템포·피치 변경을 하지 않았다. 반복 재생과 낮은 음량은 플레이어 동작으로 적용한다.

## 재생 원칙

사용자의 이야기 재생 동작 후 시작하고 낮은 음량으로 반복한다. 내레이션과 함께 일시정지·재개하고, 이야기 종료·감상 종료·감상 종료 타이머·주행 제한 시 음악을 멈춘다. 일반 화면 이동 후에는 현재 재생 미니 플레이어와 함께 이어 듣고, 일시정지·재생 종료로 멈출 수 있다. 사용자가 음악을 끄거나 음량을 조절할 수 있게 한다. 음원 로딩이나 브라우저 재생 정책으로 실패하면 내레이션·자막·대본은 계속 사용할 수 있어야 한다.

파일 무결성과 디코딩은 확인했다. 이 문서는 브라우저 재생, 전체 감상, 내레이션 음량 균형, 반복 경계의 청취 검증까지 완료했다는 뜻은 아니다. 제품에서의 재생 검증은 앱 검수 결과에 별도로 기록한다.
