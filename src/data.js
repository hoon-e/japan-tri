/**
 * Static, curated destination data.
 *
 * Route content is an editorial starting point, not live navigation advice.
 * Flight schedules and road conditions must be checked again before booking.
 */
export const destinations = [
  {
    id: "kumamoto-aso",
    name: "구마모토·아소",
    region: "규슈 중부",
    airport: "아소 구마모토 공항",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "푸른 산과 굽이진 도로가 이어지는 일본의 고원 풍경",
    summary:
      "활화산의 거대한 칼데라와 온천 마을을 짧은 일정에도 밀도 있게 잇는 규슈 대표 고원 드라이브입니다.",
    directFlightReason:
      "인천에서 구마모토로 가는 직항 노선이 있어 도쿄·오사카 환승 없이 고원 여행을 시작하기 좋습니다.",
    driveReason:
      "공항에서 아소와 구로카와 온천이 차로 이어지고, 대중교통보다 렌터카로 전망대와 작은 마을을 조합하기 쉽습니다.",
    highlights: ["다이칸보", "아소 신사", "구로카와 온천", "기쿠치 계곡"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons: "초여름의 초원과 가을 단풍이 특히 좋으며, 겨울에는 결빙과 체인 규정을 확인하세요.",
    drivingNotes: [
      "아소 화산 주변은 분화 경보와 출입 통제를 출발 당일 확인하세요.",
      "산간 도로는 해가 진 뒤 안개와 결빙 위험이 커지므로 밝을 때 이동하세요.",
    ],
    routes: [
      {
        duration: "2n3d",
        label: "2박 3일",
        summary: "공항–아소–구로카와를 한 방향으로 잇는 짧고 선명한 고원 루트",
        days: [
          {
            day: 1,
            title: "공항에서 아소 분지로",
            base: "아소 숙박",
            drive: "약 45km · 1시간 10분",
            stops: ["아소 구마모토 공항", "아소 신사", "몬젠마치 산책"],
          },
          {
            day: 2,
            title: "칼데라 전망과 온천 마을",
            base: "구로카와 온천 숙박",
            drive: "약 75km · 2시간",
            stops: ["다이칸보", "구사센리", "구로카와 온천"],
          },
          {
            day: 3,
            title: "숲길을 지나 공항으로",
            base: "귀국",
            drive: "약 65km · 1시간 30분",
            stops: ["기쿠치 계곡 인근", "미치노에키 오즈", "공항 반납"],
          },
        ],
      },
      {
        duration: "3n4d",
        label: "3박 4일",
        summary: "하루 운전량을 낮추고 다카치호까지 천천히 확장하는 순환 루트",
        days: [
          {
            day: 1,
            title: "구마모토 성과 성하마을",
            base: "구마모토 시내 숙박",
            drive: "약 25km · 45분",
            stops: ["공항", "구마모토 성", "조사이엔"],
          },
          {
            day: 2,
            title: "남아소 풍경길",
            base: "다카치호 숙박",
            drive: "약 95km · 2시간 20분",
            stops: ["시라카와 수원", "다카모리", "다카치호 협곡"],
          },
          {
            day: 3,
            title: "아소 능선과 온천",
            base: "구로카와 온천 숙박",
            drive: "약 90km · 2시간 20분",
            stops: ["구사센리", "다이칸보", "구로카와 온천"],
          },
          {
            day: 4,
            title: "여유 있게 공항 복귀",
            base: "귀국",
            drive: "약 60km · 1시간 20분",
            stops: ["오구니", "미치노에키 오즈", "공항 반납"],
          },
        ],
      },
    ],
  },
  {
    id: "takamatsu-sanuki",
    name: "다카마쓰·사누키",
    region: "시코쿠 가가와",
    airport: "다카마쓰 공항",
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "잔잔한 바다와 섬들이 보이는 일본 해안 풍경",
    summary:
      "세토내해의 잔잔한 풍경, 오래된 항구, 우동 마을을 짧은 운전 구간으로 즐기는 느긋한 시코쿠 여행입니다.",
    directFlightReason:
      "인천–다카마쓰 직항으로 시코쿠에 바로 들어갈 수 있어 혼슈를 거치는 이동 시간을 줄일 수 있습니다.",
    driveReason:
      "공항을 중심으로 고토히라, 마루가메, 미토요가 한 시간 안팎에 모여 있어 초보 운전자도 일정을 나누기 좋습니다.",
    highlights: ["고토히라궁", "치치부가하마", "마루가메 성", "야시마"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons: "봄·가을이 온화합니다. 섬 방문일에는 강풍으로 인한 선박 운항 변동을 확인하세요.",
    drivingNotes: [
      "고토히라와 다카마쓰 중심가는 보행자가 많아 지정 주차장을 이용하세요.",
      "세토대교와 해안 도로는 강풍 시 속도 제한이 생길 수 있습니다.",
    ],
    routes: [
      {
        duration: "2n3d",
        label: "2박 3일",
        summary: "서쪽 해안의 노을과 전통 마을을 묶은 가가와 핵심 루트",
        days: [
          {
            day: 1,
            title: "공항에서 고토히라로",
            base: "고토히라 숙박",
            drive: "약 30km · 45분",
            stops: ["다카마쓰 공항", "고토히라궁", "몬젠마치"],
          },
          {
            day: 2,
            title: "성곽과 세토내해 노을",
            base: "다카마쓰 숙박",
            drive: "약 85km · 2시간",
            stops: ["마루가메 성", "치치부가하마", "다카마쓰 항"],
          },
          {
            day: 3,
            title: "정원과 야시마 전망",
            base: "귀국",
            drive: "약 45km · 1시간 15분",
            stops: ["리쓰린 공원", "야시마", "공항 반납"],
          },
        ],
      },
      {
        duration: "3n4d",
        label: "3박 4일",
        summary: "가가와에 도쿠시마 이야 계곡을 더한 시코쿠 입문 순환 루트",
        days: [
          {
            day: 1,
            title: "다카마쓰 도착과 정원 산책",
            base: "다카마쓰 숙박",
            drive: "약 20km · 40분",
            stops: ["공항", "리쓰린 공원", "기타하마 앨리"],
          },
          {
            day: 2,
            title: "고토히라와 마루가메",
            base: "고토히라 숙박",
            drive: "약 55km · 1시간 20분",
            stops: ["마루가메 성", "우동 마을", "고토히라궁"],
          },
          {
            day: 3,
            title: "산길 너머 이야 계곡",
            base: "미요시 숙박",
            drive: "약 80km · 2시간 10분",
            stops: ["오보케 협곡", "이야 덩굴다리", "산간 온천"],
          },
          {
            day: 4,
            title: "완만한 길로 공항 복귀",
            base: "귀국",
            drive: "약 75km · 1시간 40분",
            stops: ["미요시", "사누키 휴게소", "공항 반납"],
          },
        ],
      },
    ],
  },
  {
    id: "yonago-san-in",
    name: "요나고·산인",
    region: "돗토리·시마네",
    airport: "요나고 기타로 공항",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "호수와 산이 어우러진 고요한 아침 풍경",
    summary:
      "바다와 호수, 신사와 옛 거리가 길 하나로 이어지는 산인 지방의 한적한 로드트립입니다.",
    directFlightReason:
      "인천에서 요나고로 바로 이동할 수 있어 철도 환승이 긴 산인 지방에 짧은 일정으로 접근하기 좋습니다.",
    driveReason:
      "사카이미나토, 마쓰에, 이즈모, 다이센이 공항 양쪽에 펼쳐져 렌터카로 해안과 산악 풍경을 유연하게 묶을 수 있습니다.",
    highlights: ["사카이미나토", "마쓰에 성", "이즈모타이샤", "다이센"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons: "봄·가을은 드라이브가 쾌적하고, 겨울 다이센 방면은 적설과 겨울용 타이어를 반드시 확인하세요.",
    drivingNotes: [
      "겨울 산간 구간은 적설이 많아 렌터카의 스노타이어 장착 여부를 확인하세요.",
      "해 질 무렵 지방 도로에서는 야생동물 출현에 유의하세요.",
    ],
    routes: [
      {
        duration: "2n3d",
        label: "2박 3일",
        summary: "공항 동쪽의 항구와 서쪽의 성곽 도시를 균형 있게 잇는 호수길",
        days: [
          {
            day: 1,
            title: "항구 마을과 해안",
            base: "요나고 숙박",
            drive: "약 35km · 55분",
            stops: ["요나고 공항", "사카이미나토", "유미가하마"],
          },
          {
            day: 2,
            title: "호수를 따라 마쓰에로",
            base: "마쓰에 숙박",
            drive: "약 65km · 1시간 30분",
            stops: ["다이센 전망", "마쓰에 성", "신지호 석양"],
          },
          {
            day: 3,
            title: "정원과 공항 복귀",
            base: "귀국",
            drive: "약 55km · 1시간 10분",
            stops: ["유시엔", "나카우미 호반", "공항 반납"],
          },
        ],
      },
      {
        duration: "3n4d",
        label: "3박 4일",
        summary: "이즈모까지 서쪽으로 확장해 산인의 역사와 풍경을 천천히 보는 루트",
        days: [
          {
            day: 1,
            title: "사카이미나토와 요나고",
            base: "요나고 숙박",
            drive: "약 35km · 55분",
            stops: ["공항", "사카이미나토", "요나고 시내"],
          },
          {
            day: 2,
            title: "다이센 숲과 목장길",
            base: "마쓰에 숙박",
            drive: "약 95km · 2시간 20분",
            stops: ["다이센 마스미즈 고원", "우유 마을", "신지호"],
          },
          {
            day: 3,
            title: "신들의 길 이즈모",
            base: "이즈모 숙박",
            drive: "약 70km · 1시간 35분",
            stops: ["마쓰에 성", "이즈모타이샤", "이나사 해변"],
          },
          {
            day: 4,
            title: "호반 고속도로로 공항 복귀",
            base: "귀국",
            drive: "약 75km · 1시간 30분",
            stops: ["신지호 휴게소", "유시엔", "공항 반납"],
          },
        ],
      },
    ],
  },
];
