/**
 * Static, curated destination data.
 *
 * Route content is an editorial starting point, not live navigation advice.
 * Flight schedules and road conditions must be checked again before booking.
 * Each day's mapStops mirrors stops by index and stores [latitude, longitude]
 * for an editorial map visualization, not turn-by-turn routing.
 */
export const destinations = [
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
    referenceLinks: [
      {
        category: "관광·명소",
        label: "가가와현 공식 관광 가이드",
        url: "https://www.my-kagawa.jp/",
      },
      {
        category: "음식·문화",
        label: "고토히라 관광협회",
        url: "https://www.kotohira-kankou.jp/",
      },
      {
        category: "계절·드라이브",
        label: "미토요시 관광 안내",
        url: "https://www.city.mitoyo.lg.jp/kakuka/seisaku/kanko/",
      },
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
            mapStops: [
              { name: "다카마쓰 공항", coordinates: [34.215174, 134.019401] },
              { name: "고토히라궁", coordinates: [34.1839, 133.8093] },
              { name: "몬젠마치", coordinates: [34.187, 133.816] },
            ],
          },
          {
            day: 2,
            title: "성곽과 세토내해 노을",
            base: "다카마쓰 숙박",
            drive: "약 85km · 2시간",
            stops: ["마루가메 성", "치치부가하마", "다카마쓰 항"],
            mapStops: [
              { name: "마루가메 성", coordinates: [34.286022, 133.800101] },
              { name: "치치부가하마", coordinates: [34.18831, 133.646831] },
              { name: "다카마쓰 항", coordinates: [34.352456, 134.046599] },
            ],
          },
          {
            day: 3,
            title: "정원과 야시마 전망",
            base: "귀국",
            drive: "약 45km · 1시간 15분",
            stops: ["리쓰린 공원", "야시마", "공항 반납"],
            mapStops: [
              { name: "리쓰린 공원", coordinates: [34.329497, 134.043926] },
              { name: "야시마", coordinates: [34.357, 134.106] },
              { name: "공항 반납", coordinates: [34.215174, 134.019401] },
            ],
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
            mapStops: [
              { name: "공항", coordinates: [34.215174, 134.019401] },
              { name: "리쓰린 공원", coordinates: [34.329497, 134.043926] },
              { name: "기타하마 앨리", coordinates: [34.351007, 134.056817] },
            ],
          },
          {
            day: 2,
            title: "고토히라와 마루가메",
            base: "고토히라 숙박",
            drive: "약 55km · 1시간 20분",
            stops: ["마루가메 성", "우동 마을", "고토히라궁"],
            mapStops: [
              { name: "마루가메 성", coordinates: [34.286022, 133.800101] },
              { name: "우동 마을", coordinates: [34.186, 133.817] },
              { name: "고토히라궁", coordinates: [34.1839, 133.8093] },
            ],
          },
          {
            day: 3,
            title: "산길 너머 이야 계곡",
            base: "미요시 숙박",
            drive: "약 80km · 2시간 10분",
            stops: ["오보케 협곡", "이야 덩굴다리", "산간 온천"],
            mapStops: [
              { name: "오보케 협곡", coordinates: [33.884574, 133.755903] },
              { name: "이야 덩굴다리", coordinates: [33.8752, 133.8346] },
              { name: "산간 온천", coordinates: [33.921371, 133.817348] },
            ],
          },
          {
            day: 4,
            title: "완만한 길로 공항 복귀",
            base: "귀국",
            drive: "약 75km · 1시간 40분",
            stops: ["미요시", "사누키 휴게소", "공항 반납"],
            mapStops: [
              { name: "미요시", coordinates: [34.026924, 133.804587] },
              { name: "사누키 휴게소", coordinates: [34.248, 133.923] },
              { name: "공항 반납", coordinates: [34.215174, 134.019401] },
            ],
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
    referenceLinks: [
      {
        category: "관광·명소",
        label: "돗토리현 공식 관광 사이트",
        url: "https://www.tottori-tour.jp/",
      },
      {
        category: "음식·문화",
        label: "시마네현 공식 관광 가이드",
        url: "https://www.kankou-shimane.com/",
      },
      {
        category: "계절·드라이브",
        label: "다이센 관광 안내",
        url: "https://tourismdaisen.com/",
      },
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
            mapStops: [
              { name: "요나고 공항", coordinates: [35.5023, 133.2361] },
              { name: "사카이미나토", coordinates: [35.54515, 133.222681] },
              { name: "유미가하마", coordinates: [35.455, 133.301] },
            ],
          },
          {
            day: 2,
            title: "호수를 따라 마쓰에로",
            base: "마쓰에 숙박",
            drive: "약 65km · 1시간 30분",
            stops: ["다이센 전망", "마쓰에 성", "신지호 석양"],
            mapStops: [
              { name: "다이센 전망", coordinates: [35.3718, 133.533] },
              { name: "마쓰에 성", coordinates: [35.475141, 133.050763] },
              { name: "신지호 석양", coordinates: [35.459733, 133.052342] },
            ],
          },
          {
            day: 3,
            title: "정원과 공항 복귀",
            base: "귀국",
            drive: "약 55km · 1시간 10분",
            stops: ["유시엔", "나카우미 호반", "공항 반납"],
            mapStops: [
              { name: "유시엔", coordinates: [35.49071, 133.175208] },
              { name: "나카우미 호반", coordinates: [35.516481, 133.193226] },
              { name: "공항 반납", coordinates: [35.5023, 133.2361] },
            ],
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
            mapStops: [
              { name: "공항", coordinates: [35.5023, 133.2361] },
              { name: "사카이미나토", coordinates: [35.54515, 133.222681] },
              { name: "요나고 시내", coordinates: [35.422759, 133.335403] },
            ],
          },
          {
            day: 2,
            title: "다이센 숲과 목장길",
            base: "마쓰에 숙박",
            drive: "약 95km · 2시간 20분",
            stops: ["다이센 마스미즈 고원", "우유 마을", "신지호"],
            mapStops: [
              { name: "다이센 마스미즈 고원", coordinates: [35.3718, 133.533] },
              { name: "우유 마을", coordinates: [35.38, 133.536] },
              { name: "신지호", coordinates: [35.463, 133.046] },
            ],
          },
          {
            day: 3,
            title: "신들의 길 이즈모",
            base: "이즈모 숙박",
            drive: "약 70km · 1시간 35분",
            stops: ["마쓰에 성", "이즈모타이샤", "이나사 해변"],
            mapStops: [
              { name: "마쓰에 성", coordinates: [35.475141, 133.050763] },
              { name: "이즈모타이샤", coordinates: [35.399803, 132.685151] },
              { name: "이나사 해변", coordinates: [35.395781, 132.673612] },
            ],
          },
          {
            day: 4,
            title: "호반 고속도로로 공항 복귀",
            base: "귀국",
            drive: "약 75km · 1시간 30분",
            stops: ["신지호 휴게소", "유시엔", "공항 반납"],
            mapStops: [
              { name: "신지호 휴게소", coordinates: [35.433, 132.895] },
              { name: "유시엔", coordinates: [35.49071, 133.175208] },
              { name: "공항 반납", coordinates: [35.5023, 133.2361] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "matsuyama-ehime",
    name: "마쓰야마·에히메",
    region: "시코쿠 에히메",
    airport: "마쓰야마 공항",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "산과 바다 사이에 자리한 일본 지방 도시 풍경",
    summary:
      "도고온천과 성곽 도시를 시작으로 시마나미 해안과 우치코 옛 거리를 잇는 서부 시코쿠 로드트립입니다.",
    directFlightReason:
      "인천–마쓰야마 직항을 이용하면 에히메의 온천·해안 권역에 환승 없이 도착해 공항에서 바로 일정을 시작할 수 있습니다.",
    driveReason:
      "마쓰야마 시내, 우치코, 이마바리가 공항에서 반나절 운전권에 있어 온천과 옛 마을, 섬 풍경을 일정별로 나누기 좋습니다.",
    highlights: ["도고온천", "마쓰야마 성", "우치코", "시마나미 해도"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons:
      "봄·가을은 해안 드라이브가 온화합니다. 겨울 산간 도로와 강풍이 부는 교량 구간은 출발 전 통제를 확인하세요.",
    drivingNotes: [
      "마쓰야마 중심가의 노면전차 교차로에서는 신호와 차선 진행 방향을 주의하세요.",
      "시마나미 해도 교량은 강풍 시 속도 제한이나 이륜차 통제가 생길 수 있습니다.",
    ],
    travelLinks: [
      {
        category: "관광·명소",
        label: "에히메 공식 관광 가이드",
        url: "https://www.visitehimejapan.com/en/",
      },
      {
        category: "음식·문화",
        label: "마쓰야마 공식 관광 가이드",
        url: "https://en.matsuyama-sightseeing.com/",
      },
      {
        category: "계절·드라이브",
        label: "마쓰야마 공항 교통 안내",
        url: "https://www.matsuyama-airport.co.jp/access/",
      },
    ],
    routes: [
      {
        duration: "2n3d",
        label: "2박 3일",
        summary: "성곽·온천과 우치코 옛 거리를 묶은 에히메 남부 핵심 루트",
        days: [
          {
            day: 1,
            title: "마쓰야마 성과 도고온천",
            base: "마쓰야마 숙박",
            drive: "약 25km · 50분",
            stops: ["마쓰야마 공항", "마쓰야마 성", "도고온천"],
            mapStops: [
              { name: "마쓰야마 공항", coordinates: [33.8272, 132.6997] },
              { name: "마쓰야마 성", coordinates: [33.8456, 132.7658] },
              { name: "도고온천", coordinates: [33.852, 132.7864] },
            ],
          },
          {
            day: 2,
            title: "우치코와 오즈 옛 거리",
            base: "오즈 숙박",
            drive: "약 105km · 2시간 20분",
            stops: ["우치코 옛 거리", "오즈 성", "가류산장"],
            mapStops: [
              { name: "우치코 옛 거리", coordinates: [33.5515, 132.6503] },
              { name: "오즈 성", coordinates: [33.5062, 132.5447] },
              { name: "가류산장", coordinates: [33.5084, 132.5384] },
            ],
          },
          {
            day: 3,
            title: "후타미 해안으로 공항 복귀",
            base: "귀국",
            drive: "약 75km · 1시간 35분",
            stops: ["시모나다역", "후타미 해안", "공항 반납"],
            mapStops: [
              { name: "시모나다역", coordinates: [33.6552, 132.5891] },
              { name: "후타미 해안", coordinates: [33.6834, 132.6328] },
              { name: "공항 반납", coordinates: [33.8272, 132.6997] },
            ],
          },
        ],
      },
      {
        duration: "3n4d",
        label: "3박 4일",
        summary: "마쓰야마에서 이마바리와 시마나미 해안까지 확장하는 순환 루트",
        days: [
          {
            day: 1,
            title: "공항 도착과 도고 산책",
            base: "마쓰야마 숙박",
            drive: "약 25km · 50분",
            stops: ["마쓰야마 공항", "마쓰야마 성", "도고온천"],
            mapStops: [
              { name: "마쓰야마 공항", coordinates: [33.8272, 132.6997] },
              { name: "마쓰야마 성", coordinates: [33.8456, 132.7658] },
              { name: "도고온천", coordinates: [33.852, 132.7864] },
            ],
          },
          {
            day: 2,
            title: "이마바리와 구루시마 해협",
            base: "이마바리 숙박",
            drive: "약 95km · 2시간 10분",
            stops: ["이마바리 성", "구루시마 해협 전망대", "오시마"],
            mapStops: [
              { name: "이마바리 성", coordinates: [34.0631, 133.0062] },
              { name: "구루시마 해협 전망대", coordinates: [34.1146, 132.9789] },
              { name: "오시마", coordinates: [34.1575, 133.0371] },
            ],
          },
          {
            day: 3,
            title: "산길 너머 우치코",
            base: "우치코 숙박",
            drive: "약 125km · 2시간 40분",
            stops: ["사이조 우치누키", "우치코 옛 거리", "우치코자"],
            mapStops: [
              { name: "사이조 우치누키", coordinates: [33.9196, 133.1812] },
              { name: "우치코 옛 거리", coordinates: [33.5515, 132.6503] },
              { name: "우치코자", coordinates: [33.5489, 132.6491] },
            ],
          },
          {
            day: 4,
            title: "해안길로 공항 복귀",
            base: "귀국",
            drive: "약 70km · 1시간 30분",
            stops: ["시모나다역", "후타미 해안", "공항 반납"],
            mapStops: [
              { name: "시모나다역", coordinates: [33.6552, 132.5891] },
              { name: "후타미 해안", coordinates: [33.6834, 132.6328] },
              { name: "공항 반납", coordinates: [33.8272, 132.6997] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "saga-ureshino-arita",
    name: "사가·우레시노·아리타",
    region: "규슈 사가",
    airport: "규슈 사가 국제공항",
    image:
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "안개 낀 산과 전통 마을이 어우러진 일본 시골 풍경",
    summary:
      "도자기 마을과 녹차 산지, 온천을 낮은 구릉 도로로 잇는 서부 규슈의 차분한 문화 로드트립입니다.",
    directFlightReason:
      "인천–사가 직항으로 서부 규슈에 바로 들어가 공항 렌터카 거점에서 아리타와 우레시노 방면으로 이동할 수 있습니다.",
    driveReason:
      "사가 평야를 중심으로 아리타, 우레시노, 가라쓰가 약 한두 시간권에 있어 도자기·온천·해안 주제를 짧은 일정으로 묶기 좋습니다.",
    highlights: ["아리타 도자기 마을", "우레시노 온천", "가라쓰 성", "요시노가리 유적"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons:
      "봄의 녹음과 가을 도자기 행사가 좋습니다. 장마철 저지대 침수와 겨울 산간 결빙 가능성을 확인하세요.",
    drivingNotes: [
      "아리타 도자기 축제 기간에는 중심가 교통 통제와 임시 주차장 안내를 확인하세요.",
      "우레시노·다케오 사이 산길은 안개와 야간 시야 저하에 유의하세요.",
    ],
    travelLinks: [
      {
        category: "관광·명소",
        label: "사가 공식 관광 가이드",
        url: "https://www.saga-tripgenius.com/",
      },
      {
        category: "음식·문화",
        label: "아리타 관광 협회",
        url: "https://www.arita.jp.e.ew.hp.transer.com/",
      },
      {
        category: "계절·드라이브",
        label: "사가 공항 교통 안내",
        url: "https://saga-ab.jp/access/",
      },
    ],
    routes: [
      {
        duration: "2n3d",
        label: "2박 3일",
        summary: "우레시노 온천과 아리타 도자기 마을을 잇는 서부 사가 루트",
        days: [
          {
            day: 1,
            title: "사가 평야와 역사 유적",
            base: "사가 숙박",
            drive: "약 45km · 1시간 10분",
            stops: ["사가 공항", "사가 성터", "요시노가리 유적"],
            mapStops: [
              { name: "사가 공항", coordinates: [33.1497, 130.3022] },
              { name: "사가 성터", coordinates: [33.2452, 130.3015] },
              { name: "요시노가리 유적", coordinates: [33.3246, 130.3843] },
            ],
          },
          {
            day: 2,
            title: "도자기 마을과 온천",
            base: "우레시노 숙박",
            drive: "약 95km · 2시간 10분",
            stops: ["아리타 도자기 마을", "이마리 오카와치야마", "우레시노 온천"],
            mapStops: [
              { name: "아리타 도자기 마을", coordinates: [33.183, 129.8817] },
              { name: "이마리 오카와치야마", coordinates: [33.225, 129.8629] },
              { name: "우레시노 온천", coordinates: [33.0961, 129.9847] },
            ],
          },
          {
            day: 3,
            title: "차밭과 공항 복귀",
            base: "귀국",
            drive: "약 55km · 1시간 15분",
            stops: ["우레시노 차밭", "히젠하마슈쿠", "공항 반납"],
            mapStops: [
              { name: "우레시노 차밭", coordinates: [33.1076, 130.004] },
              { name: "히젠하마슈쿠", coordinates: [33.0911, 130.0991] },
              { name: "공항 반납", coordinates: [33.1497, 130.3022] },
            ],
          },
        ],
      },
      {
        duration: "3n4d",
        label: "3박 4일",
        summary: "도자기·온천에 가라쓰 해안과 성곽 풍경을 더한 사가 순환 루트",
        days: [
          {
            day: 1,
            title: "사가 도착과 유적 산책",
            base: "사가 숙박",
            drive: "약 45km · 1시간 10분",
            stops: ["사가 공항", "사가 성터", "요시노가리 유적"],
            mapStops: [
              { name: "사가 공항", coordinates: [33.1497, 130.3022] },
              { name: "사가 성터", coordinates: [33.2452, 130.3015] },
              { name: "요시노가리 유적", coordinates: [33.3246, 130.3843] },
            ],
          },
          {
            day: 2,
            title: "가라쓰 해안과 소나무 숲",
            base: "가라쓰 숙박",
            drive: "약 105km · 2시간 25분",
            stops: ["가라쓰 성", "니지노마쓰바라", "요부코"],
            mapStops: [
              { name: "가라쓰 성", coordinates: [33.4554, 129.9782] },
              { name: "니지노마쓰바라", coordinates: [33.4418, 130.0074] },
              { name: "요부코", coordinates: [33.5407, 129.8958] },
            ],
          },
          {
            day: 3,
            title: "이마리와 아리타 도자기 길",
            base: "우레시노 숙박",
            drive: "약 95km · 2시간 20분",
            stops: ["이마리 오카와치야마", "아리타 도자기 마을", "우레시노 온천"],
            mapStops: [
              { name: "이마리 오카와치야마", coordinates: [33.225, 129.8629] },
              { name: "아리타 도자기 마을", coordinates: [33.183, 129.8817] },
              { name: "우레시노 온천", coordinates: [33.0961, 129.9847] },
            ],
          },
          {
            day: 4,
            title: "녹차 마을에서 공항으로",
            base: "귀국",
            drive: "약 60km · 1시간 20분",
            stops: ["우레시노 차밭", "히젠하마슈쿠", "공항 반납"],
            mapStops: [
              { name: "우레시노 차밭", coordinates: [33.1076, 130.004] },
              { name: "히젠하마슈쿠", coordinates: [33.0911, 130.0991] },
              { name: "공항 반납", coordinates: [33.1497, 130.3022] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "miyazaki-takachiho-nichinan",
    name: "미야자키·다카치호·니치난",
    region: "규슈 미야자키",
    airport: "미야자키 부겐빌리아 공항",
    image:
      "https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "푸른 바다와 숲이 맞닿은 일본 남부 해안 풍경",
    summary:
      "태평양 해안과 신화의 협곡, 삼나무 숲을 남북으로 잇는 남규슈의 풍경 중심 로드트립입니다.",
    directFlightReason:
      "인천–미야자키 직항을 이용하면 남동 규슈에 바로 도착해 공항 렌터카로 니치난 해안이나 북부 산간으로 출발할 수 있습니다.",
    driveReason:
      "공항 남쪽 니치난은 해안도로, 북쪽 다카치호는 협곡과 신사라는 뚜렷한 테마가 있어 기간별 방향을 명확히 구성할 수 있습니다.",
    highlights: ["다카치호 협곡", "아오시마", "우도신궁", "오비 성하마을"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons:
      "봄·가을은 해안과 협곡 산책이 좋습니다. 여름 태풍과 폭우, 겨울 다카치호 산간 결빙을 확인하세요.",
    drivingNotes: [
      "다카치호 방면은 굽은 산길과 터널이 이어지므로 일몰 전 도착을 목표로 하세요.",
      "태풍·폭우 뒤 니치난 해안도로의 낙석과 통제 정보를 확인하세요.",
    ],
    travelLinks: [
      {
        category: "관광·명소",
        label: "미야자키 공식 관광 가이드",
        url: "https://www.kanko-miyazaki.jp/",
      },
      {
        category: "음식·문화",
        label: "니치난 공식 관광 정보",
        url: "https://www.kankou-nichinan.jp/",
      },
      {
        category: "계절·드라이브",
        label: "미야자키 공항 교통 안내",
        url: "https://www.miyazaki-airport.co.jp/access",
      },
    ],
    routes: [
      {
        duration: "2n3d",
        label: "2박 3일",
        summary: "아오시마에서 오비까지 태평양을 따라가는 니치난 해안 루트",
        days: [
          {
            day: 1,
            title: "공항에서 아오시마로",
            base: "아오시마 숙박",
            drive: "약 25km · 45분",
            stops: ["미야자키 공항", "아오시마 신사", "호리키리 고개"],
            mapStops: [
              { name: "미야자키 공항", coordinates: [31.8772, 131.4486] },
              { name: "아오시마 신사", coordinates: [31.8036, 131.4752] },
              { name: "호리키리 고개", coordinates: [31.7589, 131.4722] },
            ],
          },
          {
            day: 2,
            title: "니치난 해안과 오비",
            base: "니치난 숙박",
            drive: "약 85km · 2시간 10분",
            stops: ["우도신궁", "오비 성하마을", "사카타니 계단식 논"],
            mapStops: [
              { name: "우도신궁", coordinates: [31.6508, 131.466] },
              { name: "오비 성하마을", coordinates: [31.6264, 131.351] },
              { name: "사카타니 계단식 논", coordinates: [31.6782, 131.3108] },
            ],
          },
          {
            day: 3,
            title: "해안 전망길로 공항 복귀",
            base: "귀국",
            drive: "약 70km · 1시간 35분",
            stops: ["선멧세 니치난", "아오시마 해안", "공항 반납"],
            mapStops: [
              { name: "선멧세 니치난", coordinates: [31.6847, 131.4608] },
              { name: "아오시마 해안", coordinates: [31.8064, 131.4702] },
              { name: "공항 반납", coordinates: [31.8772, 131.4486] },
            ],
          },
        ],
      },
      {
        duration: "3n4d",
        label: "3박 4일",
        summary: "니치난 해안에 다카치호 협곡과 신화 마을을 더한 남북 종단 루트",
        days: [
          {
            day: 1,
            title: "아오시마와 미야자키 해안",
            base: "미야자키 숙박",
            drive: "약 35km · 1시간",
            stops: ["미야자키 공항", "아오시마 신사", "미야자키 시내"],
            mapStops: [
              { name: "미야자키 공항", coordinates: [31.8772, 131.4486] },
              { name: "아오시마 신사", coordinates: [31.8036, 131.4752] },
              { name: "미야자키 시내", coordinates: [31.9111, 131.4239] },
            ],
          },
          {
            day: 2,
            title: "산길 따라 다카치호",
            base: "다카치호 숙박",
            drive: "약 145km · 3시간",
            stops: ["미야자키 신궁", "다카치호 협곡", "다카치호 신사"],
            mapStops: [
              { name: "미야자키 신궁", coordinates: [31.9381, 131.4295] },
              { name: "다카치호 협곡", coordinates: [32.7117, 131.3015] },
              { name: "다카치호 신사", coordinates: [32.7098, 131.3051] },
            ],
          },
          {
            day: 3,
            title: "신화 마을에서 니치난으로",
            base: "아오시마 숙박",
            drive: "약 185km · 3시간 40분",
            stops: ["아마노이와토 신사", "휴가 해안", "아오시마"],
            mapStops: [
              { name: "아마노이와토 신사", coordinates: [32.734, 131.3492] },
              { name: "휴가 해안", coordinates: [32.4257, 131.6744] },
              { name: "아오시마", coordinates: [31.8036, 131.4752] },
            ],
          },
          {
            day: 4,
            title: "우도신궁과 공항 복귀",
            base: "귀국",
            drive: "약 90km · 2시간 10분",
            stops: ["우도신궁", "호리키리 고개", "공항 반납"],
            mapStops: [
              { name: "우도신궁", coordinates: [31.6508, 131.466] },
              { name: "호리키리 고개", coordinates: [31.7589, 131.4722] },
              { name: "공항 반납", coordinates: [31.8772, 131.4486] },
            ],
          },
        ],
      },
    ],
  },
];
