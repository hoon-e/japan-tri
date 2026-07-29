export const extraDestinations = [
  {
    id: "matsuyama-ehime",
    name: "마쓰야마·에히메",
    region: "시코쿠 에히메",
    airport: "마쓰야마 공항",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "일본의 오래된 온천 거리와 전통 건물",
    summary: "도고온천의 골목과 성곽 도시, 우치코·오즈의 옛 거리를 잔잔한 세토내해 풍경과 함께 잇는 서부 시코쿠 여행입니다.",
    directFlightReason: "인천–마쓰야마 직항이 매일 운항되는 시기가 있어 서울에서 에히메의 공항 거점으로 바로 접근하기 좋습니다.",
    driveReason: "공항에서 마쓰야마 도심이 가깝고 우치코·오즈와 시마나미 해안 방면을 각각 하루 구간으로 나누기 쉽습니다.",
    highlights: ["도고온천", "마쓰야마 성", "우치코", "오즈 성하마을"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons: "봄·가을이 온화하고 여름 해안은 햇볕이 강합니다. 겨울 산간 우회 구간은 결빙 여부를 확인하세요.",
    drivingNotes: [
      "도고온천과 마쓰야마 성 주변은 일방통행과 보행자가 많아 외곽 주차장을 이용하세요.",
      "시마나미 해안 교량은 강풍 시 통행 규제와 속도 제한을 확인하세요.",
    ],
    referenceLinks: [
      { category: "관광·명소", label: "마쓰야마 공식 관광 가이드", url: "https://en.matsuyama-sightseeing.com/" },
      { category: "음식·문화", label: "에히메현 공식 관광 가이드", url: "https://www.visitehimejapan.com/en/" },
      { category: "계절·드라이브", label: "도고온천 관광 안내", url: "https://www.dogokanko.or.jp/" },
    ],
    routes: [
      {
        duration: "2n3d", label: "2박 3일", summary: "도고온천과 마쓰야마 도심, 우치코·오즈를 잇는 에히메 핵심 루트",
        days: [
          { day: 1, title: "공항에서 도고온천으로", base: "마쓰야마 숙박", drive: "약 25km · 50분", stops: ["마쓰야마 공항", "마쓰야마 성", "도고온천"], mapStops: [
            { name: "마쓰야마 공항", coordinates: [33.8272, 132.6997] }, { name: "마쓰야마 성", coordinates: [33.8456, 132.7656] }, { name: "도고온천", coordinates: [33.852, 132.7864] },
          ] },
          { day: 2, title: "옛 거리 우치코와 오즈", base: "오즈 숙박", drive: "약 95km · 2시간 10분", stops: ["우치코 옛 거리", "오즈 성", "가류산소"], mapStops: [
            { name: "우치코 옛 거리", coordinates: [33.5494, 132.6495] }, { name: "오즈 성", coordinates: [33.5093, 132.5412] }, { name: "가류산소", coordinates: [33.5066, 132.5448] },
          ] },
          { day: 3, title: "후타미 해안으로 공항 복귀", base: "귀국", drive: "약 75km · 1시간 35분", stops: ["시모나다역", "후타미 해안", "공항 반납"], mapStops: [
            { name: "시모나다역", coordinates: [33.6551, 132.5894] }, { name: "후타미 해안", coordinates: [33.6844, 132.6359] }, { name: "공항 반납", coordinates: [33.8272, 132.6997] },
          ] },
        ],
      },
      {
        duration: "3n4d", label: "3박 4일", summary: "남부 성하마을과 북부 세토내해 전망을 함께 보는 에히메 순환 루트",
        days: [
          { day: 1, title: "마쓰야마 성과 도고온천", base: "마쓰야마 숙박", drive: "약 25km · 50분", stops: ["공항", "마쓰야마 성", "도고온천"], mapStops: [
            { name: "공항", coordinates: [33.8272, 132.6997] }, { name: "마쓰야마 성", coordinates: [33.8456, 132.7656] }, { name: "도고온천", coordinates: [33.852, 132.7864] },
          ] },
          { day: 2, title: "우치코와 오즈의 시간", base: "오즈 숙박", drive: "약 90km · 2시간", stops: ["우치코 옛 거리", "오즈 성", "가류산소"], mapStops: [
            { name: "우치코 옛 거리", coordinates: [33.5494, 132.6495] }, { name: "오즈 성", coordinates: [33.5093, 132.5412] }, { name: "가류산소", coordinates: [33.5066, 132.5448] },
          ] },
          { day: 3, title: "세토내해와 이마바리", base: "이마바리 숙박", drive: "약 145km · 2시간 50분", stops: ["시모나다역", "이마바리 성", "구루시마 해협 전망관"], mapStops: [
            { name: "시모나다역", coordinates: [33.6551, 132.5894] }, { name: "이마바리 성", coordinates: [34.0631, 133.0062] }, { name: "구루시마 해협 전망관", coordinates: [34.0934, 132.9783] },
          ] },
          { day: 4, title: "해안길로 공항 복귀", base: "귀국", drive: "약 70km · 1시간 30분", stops: ["호조 해안", "미쓰하마", "공항 반납"], mapStops: [
            { name: "호조 해안", coordinates: [33.9766, 132.7693] }, { name: "미쓰하마", coordinates: [33.8625, 132.7131] }, { name: "공항 반납", coordinates: [33.8272, 132.6997] },
          ] },
        ],
      },
    ],
  },
  {
    id: "kagoshima-kirishima",
    name: "가고시마·기리시마",
    region: "규슈 가고시마",
    airport: "가고시마 공항",
    image: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "화산과 잔잔한 바다가 보이는 일본 남부 풍경",
    summary: "공항 가까운 기리시마의 화산 지형에서 사쿠라지마와 사쓰마의 정원·성하마을까지 이어가는 남규슈 여행입니다.",
    directFlightReason: "인천–가고시마 직항이 운항되어 서울에서 기리시마의 공항 거점으로 바로 들어갈 수 있습니다.",
    driveReason: "공항이 기리시마에 있어 도착 직후 렌터카를 시작하기 쉽고, 화산·온천·해안 도시를 순환형 일정으로 묶기 좋습니다.",
    highlights: ["기리시마 신궁", "사쿠라지마", "센간엔", "지란 무사저택"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons: "봄·가을이 쾌적하고 여름에는 폭우와 태풍 가능성이 있습니다. 화산재와 분화 경보를 출발 전에 확인하세요.",
    drivingNotes: [
      "사쿠라지마와 기리시마에서는 화산 경보·강회 구간과 도로 통제 정보를 확인하세요.",
      "산간 온천길은 안개와 급커브가 잦아 해 지기 전에 이동을 마치세요.",
    ],
    referenceLinks: [
      { category: "관광·명소", label: "가고시마현 공식 관광 가이드", url: "https://www.kagoshima-kankou.com/for/" },
      { category: "음식·문화", label: "가고시마시 공식 관광 가이드", url: "https://www.kagoshima-yokanavi.jp/en/" },
      { category: "계절·드라이브", label: "기리시마 관광협회", url: "https://kirishimakankou.com/" },
    ],
    routes: [
      {
        duration: "2n3d", label: "2박 3일", summary: "기리시마의 숲과 사쿠라지마·가고시마 시내를 잇는 화산 풍경 루트",
        days: [
          { day: 1, title: "공항에서 기리시마 온천으로", base: "기리시마 숙박", drive: "약 40km · 1시간", stops: ["가고시마 공항", "기리시마 신궁", "마루오 폭포"], mapStops: [
            { name: "가고시마 공항", coordinates: [31.8034, 130.7194] }, { name: "기리시마 신궁", coordinates: [31.8587, 130.8707] }, { name: "마루오 폭포", coordinates: [31.8911, 130.8283] },
          ] },
          { day: 2, title: "사쿠라지마를 돌아 가고시마로", base: "가고시마 숙박", drive: "약 105km · 2시간 30분", stops: ["유노히라 전망소", "아리무라 용암 전망소", "센간엔"], mapStops: [
            { name: "유노히라 전망소", coordinates: [31.5907, 130.6572] }, { name: "아리무라 용암 전망소", coordinates: [31.5554, 130.6783] }, { name: "센간엔", coordinates: [31.6177, 130.5771] },
          ] },
          { day: 3, title: "시내 정원에서 공항으로", base: "귀국", drive: "약 55km · 1시간 20분", stops: ["시로야마 전망대", "덴몬칸", "공항 반납"], mapStops: [
            { name: "시로야마 전망대", coordinates: [31.5968, 130.5502] }, { name: "덴몬칸", coordinates: [31.5908, 130.5572] }, { name: "공항 반납", coordinates: [31.8034, 130.7194] },
          ] },
        ],
      },
      {
        duration: "3n4d", label: "3박 4일", summary: "기리시마와 사쿠라지마에 사쓰마반도의 정원·역사를 더한 남규슈 순환 루트",
        days: [
          { day: 1, title: "기리시마 신궁과 온천", base: "기리시마 숙박", drive: "약 40km · 1시간", stops: ["공항", "기리시마 신궁", "마루오 폭포"], mapStops: [
            { name: "공항", coordinates: [31.8034, 130.7194] }, { name: "기리시마 신궁", coordinates: [31.8587, 130.8707] }, { name: "마루오 폭포", coordinates: [31.8911, 130.8283] },
          ] },
          { day: 2, title: "사쿠라지마 화산 풍경", base: "가고시마 숙박", drive: "약 105km · 2시간 30분", stops: ["유노히라 전망소", "아리무라 용암 전망소", "센간엔"], mapStops: [
            { name: "유노히라 전망소", coordinates: [31.5907, 130.6572] }, { name: "아리무라 용암 전망소", coordinates: [31.5554, 130.6783] }, { name: "센간엔", coordinates: [31.6177, 130.5771] },
          ] },
          { day: 3, title: "사쓰마의 정원과 성하마을", base: "지란 숙박", drive: "약 95km · 2시간 20분", stops: ["이케다호", "지란 무사저택", "지란 평화공원"], mapStops: [
            { name: "이케다호", coordinates: [31.2336, 130.5753] }, { name: "지란 무사저택", coordinates: [31.3789, 130.4421] }, { name: "지란 평화공원", coordinates: [31.364, 130.4326] },
          ] },
          { day: 4, title: "가고시마 도심을 거쳐 공항으로", base: "귀국", drive: "약 115km · 2시간 20분", stops: ["시로야마 전망대", "덴몬칸", "공항 반납"], mapStops: [
            { name: "시로야마 전망대", coordinates: [31.5968, 130.5502] }, { name: "덴몬칸", coordinates: [31.5908, 130.5572] }, { name: "공항 반납", coordinates: [31.8034, 130.7194] },
          ] },
        ],
      },
    ],
  },
  {
    id: "miyazaki-hyuga",
    name: "미야자키·휴가",
    region: "규슈 미야자키",
    airport: "미야자키 부겐빌리아 공항",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "푸른 바다와 야자수가 이어진 해안 도로",
    summary: "아오시마와 니치난 해안의 남국 풍경을 중심으로, 긴 일정에는 다카치호의 신화 마을까지 확장하는 대비가 선명한 여행입니다.",
    directFlightReason: "인천–미야자키 직항이 주 3회 운항되어 운항일을 맞추면 서울에서 남부 규슈로 바로 접근할 수 있습니다.",
    driveReason: "공항 렌터카 거점에서 아오시마가 가깝고 니치난 해안은 한 방향으로 이어지며, 3박 일정에는 다카치호를 별도 하루로 배치할 수 있습니다.",
    highlights: ["아오시마", "우도신궁", "오비 성하마을", "다카치호 협곡"],
    recommendedDuration: "2박 3일 또는 3박 4일",
    seasons: "봄·가을 해안 드라이브가 쾌적합니다. 여름 태풍·폭우와 겨울 다카치호 산간 결빙을 확인하세요.",
    drivingNotes: [
      "니치난 해안은 강풍·파랑과 낙석으로 통제될 수 있어 출발 전 도로 정보를 확인하세요.",
      "다카치호 왕복일은 산길과 터널이 길어 휴식 시간을 넉넉히 잡으세요.",
    ],
    referenceLinks: [
      { category: "관광·명소", label: "미야자키현 공식 관광 사이트", url: "https://www.kanko-miyazaki.jp/" },
      { category: "음식·문화", label: "다카치호 관광협회", url: "https://www.kanko-takachiho.jp/" },
      { category: "계절·드라이브", label: "니치난시 관광협회", url: "https://www.kankou-nichinan.jp/" },
    ],
    routes: [
      {
        duration: "2n3d", label: "2박 3일", summary: "아오시마에서 우도신궁·오비까지 남하하는 니치난 해안 집중 루트",
        days: [
          { day: 1, title: "공항에서 아오시마로", base: "아오시마 숙박", drive: "약 25km · 45분", stops: ["미야자키 공항", "아오시마 신사", "호리키리 고개"], mapStops: [
            { name: "미야자키 공항", coordinates: [31.8772, 131.4486] }, { name: "아오시마 신사", coordinates: [31.805, 131.4753] }, { name: "호리키리 고개", coordinates: [31.7662, 131.4758] },
          ] },
          { day: 2, title: "니치난 해안과 오비", base: "니치난 숙박", drive: "약 85km · 2시간", stops: ["우도신궁", "오비 성하마을", "아부라쓰 항"], mapStops: [
            { name: "우도신궁", coordinates: [31.6505, 131.4667] }, { name: "오비 성하마을", coordinates: [31.6265, 131.349] }, { name: "아부라쓰 항", coordinates: [31.5775, 131.4072] },
          ] },
          { day: 3, title: "해안 전망을 따라 공항 복귀", base: "귀국", drive: "약 70km · 1시간 35분", stops: ["선멧세 니치난", "미치노에키 페닉스", "공항 반납"], mapStops: [
            { name: "선멧세 니치난", coordinates: [31.66, 131.4557] }, { name: "미치노에키 페닉스", coordinates: [31.7375, 131.4726] }, { name: "공항 반납", coordinates: [31.8772, 131.4486] },
          ] },
        ],
      },
      {
        duration: "3n4d", label: "3박 4일", summary: "니치난 해안과 다카치호 산간을 각각 하루씩 배치한 미야자키 종단 루트",
        days: [
          { day: 1, title: "아오시마와 해안 전망", base: "미야자키 숙박", drive: "약 35km · 1시간", stops: ["공항", "아오시마 신사", "호리키리 고개"], mapStops: [
            { name: "공항", coordinates: [31.8772, 131.4486] }, { name: "아오시마 신사", coordinates: [31.805, 131.4753] }, { name: "호리키리 고개", coordinates: [31.7662, 131.4758] },
          ] },
          { day: 2, title: "우도신궁과 오비 성하마을", base: "니치난 숙박", drive: "약 95km · 2시간 15분", stops: ["우도신궁", "오비 성하마을", "아부라쓰 항"], mapStops: [
            { name: "우도신궁", coordinates: [31.6505, 131.4667] }, { name: "오비 성하마을", coordinates: [31.6265, 131.349] }, { name: "아부라쓰 항", coordinates: [31.5775, 131.4072] },
          ] },
          { day: 3, title: "신화 마을 다카치호로", base: "다카치호 숙박", drive: "약 190km · 3시간 40분", stops: ["미야자키 시내", "다카치호 협곡", "다카치호 신사"], mapStops: [
            { name: "미야자키 시내", coordinates: [31.9077, 131.4202] }, { name: "다카치호 협곡", coordinates: [32.7022, 131.3009] }, { name: "다카치호 신사", coordinates: [32.7053, 131.3036] },
          ] },
          { day: 4, title: "휴게소를 나눠 공항 복귀", base: "귀국", drive: "약 155km · 3시간", stops: ["아마테라스 철도", "사이토바루 고분군", "공항 반납"], mapStops: [
            { name: "아마테라스 철도", coordinates: [32.7112, 131.3078] }, { name: "사이토바루 고분군", coordinates: [32.117, 131.3858] }, { name: "공항 반납", coordinates: [31.8772, 131.4486] },
          ] },
        ],
      },
    ],
  },
];
