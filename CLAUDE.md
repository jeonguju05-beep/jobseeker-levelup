# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

- `npm run dev` — 개발 서버 실행 (Turbopack, http://localhost:3000)
- `npm run build` — 프로덕션 빌드
- `npm run start` — 프로덕션 빌드 실행
- `npm run lint` — ESLint (`eslint-config-next/core-web-vitals`)

테스트 러너가 설치돼 있지 않고 테스트 파일도 없어서, 구성된 테스트 스위트는 없다.

## 배포 규칙

- Vercel 배포는 사용자가 명시적으로 "배포해줘"라고 요청했을 때만 실행한다. 코드를 수정했다고 해서 자동으로 배포하지 않는다.

## 아키텍처

이 프로젝트는 백엔드/데이터베이스/API 라우트가 없는 단일 페이지 Next.js(App Router) 클라이언트 앱이다. 모든 상태는 `app/page.js`(하나의 거대한 클라이언트 컴포넌트) 안에 있고 `localStorage`에 저장된다.

- `app/layout.js` — `next/font/google`로 구글 폰트 3종을 로드한다(한글 본문용 Noto Sans KR, 미래지향적 HUD용 Orbitron — 라틴 문자·숫자만 지원하며, 같은 `font-family` 스택에 Noto Sans KR과 함께 있으면 한글은 자동으로 그쪽으로 폴백된다). 페이지 메타데이터도 여기서 설정한다. `Geist`/`Geist_Mono`는 여전히 로드되지만 UI에서 쓰이진 않는다.
- `app/globals.css` — Tailwind v4의 CSS-first 설정(`@theme inline`에서 폰트 변수를 `font-sans`/`font-display`로 매핑)과, `page.js` 전반에서 쓰는 커스텀 키프레임 애니메이션(`pop-in`, `shake`, `pulse-glow`)이 있다.
- `app/page.js` — 그 외 전부: 온보딩용 `SignaturePad` 컴포넌트, `CalendarView` 컴포넌트, 그리고 모든 게임 로직이 들어있는 메인 `Home` 컴포넌트.

### 저장 구조 (전부 `localStorage`, 백엔드 없음)

- **`profile`** — 하나의 JSON 객체: EXP, 손으로 그린 목표 직업 서명(캔버스 `dataURL`), 카테고리별 보상 문구(`levelUpReward`, `quest3Reward`, `dungeonReward`, `battleReward`, `trainingReward`), 날짜 롤오버 처리용 필드(`lastActiveDate`, `quest3RewardedDate`).
- **`missions_<dateKey>`** — 하루에 하나씩 생기는 배열(키 포맷은 `dateKey()`/`todayKey()`에서 나오며 0으로 패딩되지 않음, 예: `missions_2026-7-21`). 미션은 설계상 매일 초기화되며 날짜 간 이전(migration)은 없다. 로드 시 `Home`의 초기화 effect가 `profile.lastActiveDate`부터 오늘 사이의 건너뛴 날짜를 전부 훑어서, 그날 완료 못한 미션이 있으면 EXP를 깎는다(초기화 `useEffect`의 페널티 계산 블록 참고).
- **`deadlines`** — 날짜별로 나뉘지 않는 별도의 단일 배열. `<input type="date">`와 맞추기 위해 0-패딩된 자체 ISO 날짜 헬퍼(`isoDate()`/`todayIso()`)를 쓴다 — 미션 날짜 키와는 의도적으로 다른 포맷이니 두 날짜 헬퍼 계열을 섞어 쓰지 않도록 주의.

### 게임 루프 동작 방식

- 레벨링: `levelFromExp(exp)`, `EXP_PER_LEVEL = 100`. UI에 보이는 EXP는 레벨당 나머지가 아니라 누적 총합이다.
- 미션 유형별 EXP/스타일 처리는 `MISSION_TYPE_META`(general/dungeon/surprise/battle)에 모여있다 — 새 유형을 추가할 땐 조건문을 여기저기 흩뿌리지 말고 이곳에 추가할 것. `hunt`(수련) 유형은 체크박스가 아니라 타이머 기반이라 따로 처리된다.
- `hunt` 유형은 1초 주기의 단일 `setInterval` effect가 처리하며, 이 effect는 한 번만 실행되므로 stale closure를 피하기 위해 `missionsRef`/`profileRef`(상태를 미러링하는 ref)를 통해 읽고 쓴다. **주의할 점:** 이 인터벌은 변경 여부와 상관없이 매 틱마다 `setMissions`/`setProfile`을 호출해서 매초 `localStorage`에 다시 저장한다. 페이지가 열려있는 동안 `localStorage.setItem`으로 미션/프로필 상태를 한 번만 고쳐두는 방식은 통하지 않는다 — 실행 중인 인터벌이 1초 안에 덮어써버린다. 앱 자체의 핸들러를 통해 상태를 바꾸거나(혹은 storage를 고친 뒤 새로고침) 해야 한다.
- 보상 지급은 의도적으로 2단계다: 미션을 체크해도 `isDone`만 바뀌고, EXP는 사용자가 팝업의 "받기"를 눌러야(`claimReward`) 지급된다. 같은 이유로 EXP 지급 코드는 다른 `setState` 호출에 넘기는 함수 *안에서* `setProfile`/`setGiftQueue` 등을 호출하지 않는다 — React Strict Mode가 개발 모드에서 그런 함수를 두 번 실행해서 EXP가 두 배로 지급될 수 있기 때문이다. 새 보상 트리거를 추가할 때도 기존 패턴(결과를 먼저 순수한 값으로 계산한 뒤 각 setter를 한 번씩만 호출)을 따를 것.
- 레벨업/일일퀘스트 3개 달성/던전·격투·수련 클리어 같은 단발성 축하 이벤트는 모두 `queueGift(label, reward)`를 거쳐 `giftQueue`에 쌓인다. 화면엔 `giftQueue[0]`만 렌더링되므로, 여러 트리거가 동시에 발생해도 서로 덮어쓰지 않고 순서대로 쌓인다. 각 트리거는 전환 감지용 ref(`prevLevelRef`, `prevAllDoneRef`)나 날짜를 기록하는 profile 필드(`quest3RewardedDate`)로 가드돼 있어서, 조건이 참인 렌더마다 발동하는 게 아니라 딱 한 번만 발동한다.
- 전체 화면을 덮는 "위로 메시지" 오버레이(`comfortMsg`)는 서로 무관한 두 트리거가 공유한다: 미션 보상을 받을 때마다 나오는 랜덤 응원, 그리고 오늘의 미션을 전부 완료한 순간 딱 한 번 뜨는 고정 문구 "수고했어, 오늘도!". 캐릭터가 크게 흔들리며 나오고, 자동으로 사라지지 않고 사용자가 탭해야 닫힌다.

### 비주얼 언어

어두운 "글래스" UI: 얇은 `border-white/10` + `bg-white/[0.04]` + `backdrop-blur-2xl` 패널, 주요 버튼에만 쓰는 채도 높은 시안→바이올렛 그라데이션, 미션 유형별 색상 `border-l` 악센트. 새 패널을 만들 때도 이 톤을 유지하고, 이전에 쓰던 불투명한 `bg-slate-900/60` 스타일로 되돌아가지 않도록 한다.
