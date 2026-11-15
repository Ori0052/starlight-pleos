# STARLIGHT PLEOS 제출·검수 자료

- [실제 웹 시연 영상 — 2분 52.4초](video/STARLIGHT_PLEOS_demo.mp4?raw=true)
- [설명 자막](video/STARLIGHT_PLEOS_demo.srt)
- [재편집 프로젝트와 원본 녹화](video/STARLIGHT_PLEOS_video_project.zip?raw=true)
- [실제 웹 캡처 22장](screenshots/)
- [현재 구현 + 원본 보존 기획서 PDF — 38쪽](documents/STARLIGHT_PLEOS_planning_with_actual_web.pdf)
- [실제 구현 보강안 PDF — 21쪽](documents/STARLIGHT_PLEOS_actual_implementation.pdf)
- [편집용 구현 보강안 DOCX](documents/STARLIGHT_PLEOS_actual_implementation.docx)
- [검수 결과](verification/)
- [제출 APK](../apk/starlight-pleos-release.apk?raw=true)

영상은 실제 웹을 직접 조작한 녹화입니다. 자막은 기능 설명이며 음성 대본 전사가 아닙니다. 원본 녹화는 무음이고, 편집 영상에는 별도 허가된 드뷔시 「달빛」 녹음을 배경음악으로 사용했습니다. 앱 내레이션이나 실제 차량/Pleos 에뮬레이터 화면을 녹음·녹화했다는 뜻이 아닙니다.

웹의 시연 하늘·학습 모형·차량 시연·같은 브라우저 공동 감상 범위를 유지했습니다. 실제 기록 저장·수정·재열기, 창문 중간 정지와 공조의 적용 전/후 상태, 감상 종료 타이머를 조작했습니다. 실제 차량 제어와 천문 AR 계산은 연결하지 않았습니다.

Android APK는 release 빌드·서명·무결성·실제 설치를 확인했습니다. 일반 AOSP 16의 WebView에서 화면 시작 검증이 막혔고 기본 WebView 대조 앱에서도 같은 native SIGTRAP이 발생했습니다. 원인은 확정하지 않았습니다. APK UI 실행, 실제 Pleos 런타임·SDK와 실차 동작은 미검증입니다.

## 빌드 기준

- 소스·APK 검수 기준 커밋: `f94659023f7232e4f61487b243c5d53b6bb3b6d2`
- 성공한 웹/Android CI 기준 커밋: `5d6cea7a36f3596616a89304f33ff7482944a23e`
- [실제 성공한 CI 실행](https://github.com/Ori0052/starlight-pleos/actions/runs/43694119845)
- 제출 APK SHA-256: `4631d1032cef8a08c9b4e7e1d52cd793f9780733da825c221cb970f1a8b11611`
- 영상 SHA-256: `cc5c48dbeddbe092caa03b478d03956cac1cd833d0fd72f24a91a91d7e4f31e4`

자료 추가 커밋은 위 코드·APK 기준과 구분됩니다. 접수 시에는 최종 저장소 HEAD도 별도로 기록합니다. 개인 인적 사항·동의·서명용 접수양식과 앱 서명키는 공개 저장소에 포함하지 않습니다.
