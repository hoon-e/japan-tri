# Travel overview UI review

검토일: **2026-07-29**

이 문서는 현재 일본 소도시 로드트립 앱의 정보 구조를 정리하고, “한눈에
비교” 요구를 만족하는 모바일 우선 계층과 문구 경계를 기록한다. 구현은
`index.html`, `src/app.js`, `src/styles.css`, `src/route-detail.js`, `src/data.js`
에서 이미 연결된 흐름을 유지하는 것을 전제로 한다.

## 1) 현재 정보 계층

현재 메인 화면은 다음 순서로 읽힌다.

1. `index.html`의 hero: 빠른 맥락 설명과 무작위 선택 CTA
2. `#flight-search`: 목적지별 외부 항공권 검색 바로가기
3. `#shortlist`: 공개 후보군 비교 카드
4. `#result`: 선정된 여행지 요약
5. `#route-tabs` + `#route-panel`: 기간별 루트 전환
6. `route.html`: 상세 지도와 일자별 방문 순서

이 순서는 짧은 비교 → 무작위 선택 → 기간 전환 → 상세 지도 확인이라는
핵심 흐름을 지키고 있다.

## 2) 모바일 우선 계층 제안

모바일에서 가장 먼저 읽혀야 하는 정보는 아래 순서가 적절하다.

- 여행지 이름
- 공항/직항 접근성
- 추천 일정
- 계절 적합성
- 대표 방문지
- 운전 주의사항
- 기간별 루트 전환
- 상세 지도 CTA

### 추천 카드 구조

- **shortlist 카드**
  - 상단: 지역 + 도착 거점
  - 본문 1줄: 요약 설명
  - 비교 축: 직항 접근성, 드라이브 적합성
  - 보조 정보: 대표 방문지 chips, 추천 일정

- **selected-trip dashboard**
  - 제목: 선정된 여행지
  - 요약: 목적지 한 줄 설명
  - 핵심 메타: 렌터카 시작점, 추천 일정, 시즌
  - 경고/주의: 운전 전 확인 리스트
  - 행동: 기간별 루트 탭, 상세 지도 링크

이 구조는 상세 설명보다 의사결정에 필요한 짧은 판단 정보를 우선 노출한다.

## 3) 유지해야 하는 흐름

절대 보존해야 하는 계약은 아래와 같다.

- 무작위 선택은 `normalizeDestinations()` 결과만 대상으로 한다.
- `selectRandomDestination()`은 shortlist 밖 항목을 선택하지 않는다.
- 항공권 영역은 가격을 수집하지 않고 목적지별 외부 검색 링크만 제공한다.
- `createRouteDetailUrl()`은 `route.html?destination=<id>&duration=<duration>` 형식을
  유지한다.
- `getRouteSelection()`은 동일한 쿼리 계약으로 상세 페이지를 복원한다.
- 지도는 Leaflet + OSM 표준 타일을 사용하고, 런타임 지오코딩은 하지 않는다.

## 4) 접근성 및 상호작용 위험

현재 구현에서 특히 주의해야 할 영역은 다음과 같다.

- `route-tabs`는 가로 스크롤 탭이므로 작은 화면에서 포커스 이동이 끊기지
  않아야 한다.
- 결과 영역은 `aria-live`로 갱신되지만, 화면 이동 후 포커스가 결과 섹션에
  머무는지 확인해야 한다.
- 카드와 버튼의 터치 면적은 44px 이상을 유지하는 것이 안전하다.
- 색상만으로 “첫 번째 추천”을 구분하지 말고, 텍스트/배지/순번을 함께 써야
  한다.
- 외부 항공권 링크는 새 탭으로 열고 `noopener noreferrer`를 유지한다.
- 지도는 모바일에서 높이를 줄여도 텍스트 일정이 함께 보여야 한다.

## 5) 콘텐츠 경계

이 앱은 예약 도구가 아니라 편집형 비교 도구다.

- 허용: 공항 접근성, 추천 일정, 대표 방문지, 운전 주의사항, 경로 비교
- 비허용: 예약/결제, 계정, 리뷰, 투표, 실시간 AI 일정 생성, 길찾기 내비게이션
- 주의: `directFlightReason`, `driveReason`, `seasons`, `drivingNotes`
  은 모두 편집된 안내이며 실제 출발 전 재확인이 필요하다.

## 6) 문서/검토 체크리스트

- `index.html`의 section 순서가 모바일에서 의미 있게 읽히는가
- shortlist 카드가 selected result와 같은 정보를 중복하지 않는가
- 목적지별 항공권 검색 링크와 상세 지도 흐름이 그대로 남아 있는가
- `route.html`의 지도 실패 시 텍스트 일정으로 대체되는가
- README와 콘텐츠 근거 문서가 이 정보 경계를 설명하는가

## 7) 관련 파일

- `index.html`
- `src/app.js`
- `src/styles.css`
- `src/route-detail.js`
- `src/data.js`
- `README.md`
- `docs/content-sources.md`

## 8) 구현자 참고

- `destination-grid`는 화면이 좁아질수록 3열보다 1열/2열 스택으로 읽히는 편이 안전하다.
- `route-tabs`는 현재처럼 가로 스크롤을 유지하되, 선택 상태와 포커스 스타일이
  터치/키보드 입력 모두에서 분명해야 한다.
- `flight-search-section`은 모바일에서 목적지 카드가 한 열로 쌓이고 검색 링크의
  터치 영역이 44px 이상인지 확인한다.

## 9) 회귀 검증 계약

배포 전 아래 계약을 한 묶음으로 확인한다.

| 영역 | 자동 검증 | 통과 조건 |
| --- | --- | --- |
| 무작위 선택 | `tests/app.test.js`, `tests/data.test.js` | 결정적 RNG가 공개 shortlist의 첫·마지막 후보를 선택하고 빈/잘못된 입력은 안전하게 거부 |
| 상세 흐름 | `tests/app.test.js`, `tests/route-detail.test.js` | 네 개의 `destination × duration` 조합이 고유 상세 URL을 만들고 같은 쿼리로 복원 |
| 모바일 | `tests/static.test.js` | 40rem 이하에서 후보·항공권 카드가 한 열로 전환되고 주요 버튼/링크가 전체 폭, 탭·외부 링크 터치 높이가 44px 이상 |
| 접근성 | `tests/static.test.js` | 건너뛰기 링크, 결과 `aria-live`, 탭의 ARIA/방향키/Home/End 계약, 상세 페이지의 텍스트 일정 대체 경로 유지 |
| 외부 서비스 실패 | `tests/static.test.js` | Leaflet 로딩이 비동기이며 지도 타일/CDN이 실패해도 일자별 텍스트 일정이 먼저 렌더링 |
| 배포 산출물 | `tests/tooling.test.js`, `npm run build` | 루트 정적 호스팅 파일과 `dist/server`, `dist/client`, `dist/.openai/hosting.json` 생성 |

최종 게이트는 `npm run check`다. 이 명령은 무의존성 구문 검사(`typecheck`,
`lint`), 전체 Node 테스트, Cloudflare Worker 호환 정적 산출물 빌드를
순서대로 실행한다. 브라우저 자동화가 없는 환경에서는 정적 계약과 네 개의
상세 URL HTTP 응답을 확인하고, 브라우저 사용이 가능한 배포 전 검수에서는
폭 375px와 데스크톱에서 추첨 → 기간 탭 키보드 이동 → 상세 링크 열기까지
한 차례 확인한다.

직항·관광 콘텐츠의 검토 근거와 시점은
[`docs/content-sources.md`](./content-sources.md)를 단일 기록으로 사용한다.
