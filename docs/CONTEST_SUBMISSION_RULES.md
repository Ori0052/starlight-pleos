# 공모전 제출 규정과 구현 범위

확인일: **2026년 11월 15일 · 한국 시간(KST)**. 아래는 현대자동차그룹 차량용 앱 개발 공모전(Code your App into Pleos App Market)의 공식 안내를 요약한 제출 기준이다. 접수양식·산출물의 최종 내용과 실제 확인한 실행 환경은 제출본에 별도로 기록한다.

## 마감과 제출 방식

- 접수 마감은 **2026년 11월 15일 23:59 KST**다. 1차 결과는 11월 23일, 2차 PT는 12월 3–4일, 최종 선정 발표는 12월 18일로 안내되어 있다. 일정 변경은 공식 공지를 따른다. [일정](https://appdevchallenge.auto-hmg.io/guide/schedule) · [마감 시각 안내](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000007)
- 접수 주소는 `appdevchallenge@hyundai-partners.com`, 제목 형식은 `[차량용 앱 개발 공모전] 팀명(개인은 성명)_대표자명`이다. 참가자 전원의 동의·서명·날짜를 작성하고 팀 참가 시 전원을 CC한다. 수정 제출은 처음 제출한 메일 주소를 사용하며, 전체 자료와 서명 동의서를 다시 첨부한다. 마감 전 마지막 제출본이 최종본이다. [제출 방법](https://appdevchallenge.auto-hmg.io/guide/submission)

## 개발 산출물 가산점

1차는 접수양식(기획서)만으로 지원할 수 있다. 프로토타입 시연 영상·화면 녹화와 소스 코드/APK를 포함한 GitHub 링크는 선택 개발 산출물이며, 제출 수준에 따른 단계별 가산점 대상이다. **단순 저장소 생성이나 웹 빌드 성공만으로 특정 점수를 보장하는 규정은 확인되지 않았고, 세부 배점도 공개되지 않았다.** 숏폼 링크는 본상 가산점이 없는 별도 항목이다. [심사·시상](https://appdevchallenge.auto-hmg.io/guide/judging-awards) · [FAQ](https://appdevchallenge.auto-hmg.io/faq)

## GitHub와 APK

- 저장소에 프로젝트 소스와 **실행 가능한 release APK**를 함께 제공한다. APK는 `apk/` 경로에 두고, 파일명은 `팀명_앱이름_release.apk` 형식을 따른다. 용량 초과 시 GitHub Releases 주소를 사용할 수 있다.
- 접수 메일에는 **저장소 주소와 최종 커밋 해시**를 적는다. README에는 앱명/소개, 실행 방법, 테스트 환경/설정, 실제 사용한 Pleos Connect 에뮬레이터 버전과 화면 규격, APK 위치 또는 Release 링크를 적는다. 사용하지 않은 환경이나 미실행 SDK 버전을 검증 완료로 쓰지 않는다. [GitHub 제출 안내](https://appdevchallenge.auto-hmg.io/guide/submission)
- 마감까지 Private 저장소로 제출할 수 있고 심사용 계정 초대는 필요하지 않다. 이 경우 **11월 16일까지 Public으로 전환하고 11월 23일까지 공개 상태를 유지**해야 GitHub 개발 산출물 가산점이 반영된다. 공개가 어려우면 마감 전 소스+APK ZIP의 다운로드 주소로 대체할 수 있다. 서명·개인 연락처·비밀키를 공개 저장소에 포함하지 않는다. [비공개 저장소 안내](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000007)

## 기획서와 실제 실행 캡처

공식 추가 안내는 DOCX/PDF 접수양식을 모두 인정하며, **필수 항목과 순서를 유지하면 이미지·도표를 넣을 수 있다.** PPT/PDF/HTML 추가 자료와 시연 영상도 참고 자료로 제출할 수 있고, 분량 제한은 별도로 두지 않는다. 이는 메일 서버의 기술적 첨부 용량 상한까지 없다는 뜻은 아니다. [접수양식·추가 자료 안내](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000007)

STARLIGHT PLEOS에는 실제 실행한 웹 화면을 캡처하고 각 화면의 조작 흐름·검수 환경·기준 커밋을 함께 적는다. 차량 제어 시연, 학습용 하늘, 같은 브라우저 내 공동 감상 등의 범위 표시를 유지한다. 원본 콘셉트 시안과 실행 캡처를 구분하고, 웹 화면을 Pleos 에뮬레이터 화면이나 실차 제어의 증거로 표기하지 않는다.

## 공개 SDK와 공모전 개발 범위

공식 **개발 범위 공지 08**은 공개 문서의 Vehicle/NaviHelper/TextToSpeech/SpeechToText/FusedLocation SDK를 공모전 출품작에 사용할 수 있으며, 워크스페이스의 준비 중 표시와 별개로 문서에 따라 에뮬레이터 개발·시험이 가능하다고 안내한다. 따라서 준비 중 표시는 개발 불가의 근거가 아니다. Gleo Interface(App Schema)는 참가팀의 별도 검토·승인 없이 사용할 수 있다. 공개되지 않은 SDK와 Pleos LLM SDK는 공모 기간에 제공되지 않으며, 차량 마이크 음성 인식은 공식 SpeechToText SDK 경로를 따른다. [개발 범위 공지 08](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000008)

현재 웹의 차량 어댑터는 시연 상태이며 실제 Pleos SDK에 연결되지 않았다. 다음 결과는 서로 다른 증거로 다룬다.

| 확인 항목 | 입증하는 범위 |
| --- | --- |
| React/TypeScript 웹 빌드·브라우저 검수 | 웹 화면과 웹 사용자 흐름의 동작 |
| 별도 Android 패키지 빌드·일반 Android 실행 | 확인한 Android 패키징/실행 환경에서의 동작 |
| Pleos SDK 초기화·호출·콜백과 상태 검증 | 실제로 확인한 SDK 기능과 테스트 환경의 범위 |
| Pleos Connect 에뮬레이터 실행 | 명시한 Pleos 에뮬레이터 버전·규격에서의 구동 |
| 실차 조회·제어·하드웨어 시험 | 확인한 차량/권한/기능에서의 실제 반영 |

**이 문서의 검토 시점에 Pleos Connect 에뮬레이터 SDK 동작과 실차 제어는 검증하지 않았다.** 별도 Android APK가 생성되어도 이 사실을 자동으로 바꾸지 않는다. 실제 빌드·구동 결과와 APK 위치는 해당 산출물의 README 및 검수 기록을 따른다. [차량 SDK 검토](VEHICLE_SDK_REVIEW.md)

## 2차 PT와 이후 단계

2차 대상 팀은 PT 전에 실제 동작 가능한 앱을 완료해야 한다. 공지 08은 Pleos Connect 에뮬레이터에서 구동되는 앱 시연을 안내하며 실차를 요구하지 않는다. 1차 산출물은 PT 전까지 보완할 수 있고, 최종 선정팀은 전시용 APK와 현장 시연을 준비한다. 공모전 심사는 Pleos App Market 입점 심사와 별개다. [개발 범위 공지](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000008) · [심사·결과물 안내](https://appdevchallenge.auto-hmg.io/guide/judging-awards)

빌드와 자료 준비 완료는 이메일 접수 완료와 구분한다. 실제 발송 여부, 제출 파일·링크, 최종 커밋과 접수 기준 시각을 최종 제출 기록에 남긴다.
