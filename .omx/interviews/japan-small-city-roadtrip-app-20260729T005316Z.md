# Deep Interview Transcript Summary

## Metadata

- **Interview ID:** `aabac39e-94e3-4f46-9468-b712b8d41484`
- **Profile:** Standard
- **Context:** Greenfield
- **Rounds:** 7
- **Threshold:** 20%
- **Final ambiguity:** 15%
- **Context snapshot:** `.omx/context/japan-small-city-roadtrip-app-20260729T004611Z.md`

## Initial idea

한국 출발 항공편이 많고 렌터카로 주변 소도시 여행하기 좋은 일본 후보지를 추린 뒤, 후보 중 하나를 무작위로 선정하고 도시 정보와 여행 루트를 추천하는 웹 애플리케이션.

## Round summary

### Round 1 — Intent

- **Question:** 이 앱이 사용자에게 가장 먼저 해결해줘야 하는 핵심 문제는 무엇인가?
- **Answer:** 선택 피로 해소.
- **Finding:** 새로운 여행지 발견과 일정 실용성은 중요하지만, 제품의 최우선 Job-to-be-Done은 목적지 결정에 드는 고민을 줄이는 것이다.
- **Ambiguity:** 63.5%

### Round 2 — Intent pressure / Contrarian

- **Question:** 아무 조건 없이 즉시 한 곳을 뽑는 것만으로 선택 피로 해소에 충분한가?
- **Answer:** 후보를 먼저 비교한 뒤 랜덤 선택.
- **Finding:** 완전한 무작위성보다 추천 근거에 대한 신뢰와 최소한의 사용자 통제가 우선한다. 핵심 흐름은 `적격 후보 제시 → 후보군 확인 → 랜덤 선택`이다.
- **Ambiguity:** 49.5%

### Round 3 — Non-goals

- **Answer:** 다음 기능을 MVP에서 모두 제외한다.
  - 실시간 항공권 가격 조회 및 예약
  - 숙소 및 렌터카 예약
  - 회원가입 및 여행 저장
  - 자유 대화형 AI 맞춤 일정
  - 커뮤니티 및 후기
- **Finding:** MVP는 검수된 여행지 후보와 대표 드라이브 루트를 발견하는 경험에 집중한다.
- **Ambiguity:** 37.0%

### Round 4 — Decision boundaries

- **OMX가 자율 결정 가능:**
  - 후보 도시 선정 기준과 최종 후보 목록
  - 화면 흐름과 시각 디자인
  - 기술 스택과 데이터 구조
- **사용자 결정/검토 영역:**
  - 대표 여행 루트의 내용
- **항상 확인 필요:**
  - 유료 API 또는 지속 비용
  - 자격증명 사용
  - 프로덕션 배포
  - 합의된 MVP 범위 확대
- **Ambiguity:** 32.8%

### Round 5 — Route outcome

- **Answer:** 여행 기간별 검수 루트 선택.
- **Finding:** 목적지마다 하나의 고정 일정이 아니라, 2박 3일·3박 4일처럼 기간에 맞는 여러 대표 루트를 제공한다. 자유 생성형 AI 일정은 사용하지 않는다.
- **Ambiguity:** 27.3%

### Round 6 — Departure scope

- **Answer:** 인천·김포 중심.
- **Finding:** MVP의 “한국 출발 항공 접근성”은 인천·김포 출발 직항을 기준으로 한다. 전국 공항 지원과 사용자 출발 공항 선택은 제외한다.
- **Ambiguity:** 21.3%

### Round 7 — Acceptance criteria

- **Required:**
  - 후보 확인부터 기간별 루트 열람까지 핵심 흐름 완주
  - 후보별 추천 근거 공개
  - 일자별 방문 순서, 대략적 운전 구간·시간, 숙박 거점이 있는 실행 가능한 루트
  - 모바일 반응형 사용성
- **Not required as a UI acceptance criterion:** 데이터 출처 및 기준일 표시
- **Final ambiguity:** 15.0%

## Pressure-pass finding

첫 답변에서는 “선택 피로 해소”가 핵심 가치로 제시되었다. 이를 “아무 입력 없이 즉시 랜덤 추천해도 충분한가?”라는 반례로 재검토한 결과, 사용자는 순수 랜덤보다 후보를 먼저 확인하는 방식을 선택했다. 따라서 제품은 결정을 대신하되, 추천 근거와 후보군을 숨기지 않아야 한다.

## Closure

- Non-goals: resolved
- Decision boundaries: resolved
- Pressure pass: complete
- Practical closure audit: passed
- Residual risk: exact 목적지 목록과 개별 루트 내용은 최신 외부 자료 조사 및 사용자 검토가 필요한 downstream 작업이다.

