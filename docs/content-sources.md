# 콘텐츠 근거와 검토 상태

확인일: **2026-07-29**

이 문서는 정적 후보 데이터의 선정 근거와 갱신 경계를 기록한다. 항공편,
도로 통제, 렌터카 영업 조건은 바뀔 수 있으므로 실제 예약 전 운영 주체의 최신
안내를 다시 확인해야 한다.

## 항공권 가격 데이터

- [SerpApi Google Flights API](https://serpapi.com/google-flights-api)
- [SerpApi 요금제와 검색 한도](https://serpapi.com/pricing)
- [GitHub Actions 예약 실행](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [GitHub Actions secrets](https://docs.github.com/en/actions/concepts/security/secrets)

브라우저에는 SerpApi 키를 전달하지 않는다. 예약 실행되는 GitHub Actions가
가격을 조회하고 정규화된 최저가 Top 5 스냅샷만 공개한다.

## 상세 지도 데이터와 제공 조건

- [Leaflet 공식 Quick Start](https://leafletjs.com/examples/quick-start/)
- [OpenStreetMap 표준 타일 사용 정책](https://operations.osmfoundation.org/policies/tiles/)
- [OpenStreetMap Nominatim 사용 정책](https://operations.osmfoundation.org/policies/nominatim/)

상세 페이지는 Leaflet으로 편집된 방문 순서를 시각화하고, 표준 OSM 타일
`https://tile.openstreetmap.org/{z}/{x}/{y}.png`을 사용한다. 지도 안에는
`© OpenStreetMap contributors` 링크를 항상 보이게 유지한다. 표준 타일
서비스는 최선 노력 방식이며 SLA가 없으므로, 트래픽 규모나 정책이 바뀌면
다른 제공자로 전환할 수 있어야 한다.

브라우저의 정상적인 Referer와 캐시 동작을 막지 않으며 `no-cache` 요청,
대량 다운로드, 사전 가져오기, 오프라인 타일 저장을 구현하지 않는다. 좌표는
콘텐츠 작성 과정에서 공개 Nominatim 정책(식별 가능한 User-Agent, 초당 1회
이하, 결과 캐시)을 지켜 일회성으로 확인했으며, 앱은 런타임 지오코딩 요청을
보내지 않는다.

## 직항 접근성

| 후보 권역 | 확인한 공식 근거 | 검토 결과 |
| --- | --- | --- |
| 다카마쓰·사누키 | [다카마쓰 공항 국제선 시간표](https://www.takamatsu-airport.com/timetable/int.php) | 서울 노선의 2026년 7월 운항 정보를 공항 공식 시간표에서 확인 |
| 요나고·산인 | [요나고 기타로 공항 서울선 시간표](https://www.yonago-air.com/flight/seoul) | 2026년 3월 29일~10월 24일 서울 노선을 공항 공식 시간표에서 확인 |

후보 설명은 “인천·김포 중 한 곳에서 직항으로 접근 가능”하다는 제품 기준을
따른다. 세 후보의 현재 근거는 모두 인천 노선이며, 김포 노선을 운항한다고
표현하지 않는다.

## 렌터카·드라이브 콘텐츠 경계

- 공항을 렌터카 인수·반납 거점으로 삼고 하루 운전량을 대체로 2시간대 안으로
  나눈 편집 루트다.
- `src/data.js`의 거리와 시간은 탐색용 대략치이며 실시간 길찾기나 통제 정보를
  제공하지 않는다.
- 산인 겨울 적설, 세토내해 강풍처럼 일정에 직접 영향을 주는
  위험은 목적지별 운전 유의사항에 명시한다.
- 대표 방문 순서와 숙박 거점은 제품 명세에 따라 **사용자 검토 전 초안**으로
  취급한다. 확정 일정이나 내비게이션 안내로 사용하지 않는다.

## 갱신 체크리스트

1. 공식 공항 또는 항공사에서 인천·김포 직항의 운항 기간과 요일을 확인한다.
2. 계절 운휴 또는 감편이 있으면 `directFlightReason`을 수정하거나 후보를
   비활성화한다.
3. 공항 렌터카 영업시간, 겨울용 타이어, 화산·산악 도로 통제를 확인한다.
4. 각 목적지에 고유한 `id`와 최소 2개 기간 루트가 있는지 `npm run check`로
   검증한다.
5. 방문 순서나 숙박 거점을 바꾸면 사용자 검토 상태도 함께 갱신한다.
