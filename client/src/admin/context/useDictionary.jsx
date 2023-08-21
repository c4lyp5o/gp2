export function useDictionary() {
  const InfoDecoder = (data) => {
    if (data.includes('Facebook')) {
      data = data.replace('Facebook_', '');
      data = data.replace('live_', 'Facebook LIVE: ');
      data = data.replace('video_', 'Facebook Video: ');
      data = data.replace('poster_', 'Facebook Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Instagram')) {
      data = data.replace('Instagram_', '');
      data = data.replace('live_', 'Instagram LIVE: ');
      data = data.replace('video_', 'Instagram Video: ');
      data = data.replace('poster_', 'Instagram Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Twitter')) {
      data = data.replace('Twitter_', '');
      data = data.replace('live_', 'Twitter LIVE: ');
      data = data.replace('video_', 'Twitter Video: ');
      data = data.replace('poster_', 'Twitter Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Youtube')) {
      data = data.replace('Youtube_', '');
      data = data.replace('live_', 'Youtube LIVE: ');
      data = data.replace('video_', 'Youtube Video: ');
      data = data.replace('poster_', 'Youtube Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('TikTok')) {
      data = data.replace('TikTok_', '');
      data = data.replace('live_', 'TikTok LIVE: ');
      data = data.replace('video_', 'TikTok Video: ');
      data = data.replace('poster_', 'TikTok Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Lain')) {
      data = data.replace('Lain_', '');
      data = data.replace('live_', 'Lain LIVE: ');
      data = data.replace('video_', 'Lain Video: ');
      data = data.replace('poster_', 'Lain Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
  };
  const Dictionary = {
    all: 'all',
    kkiakd: 'KKIA / KD',
    pp: 'Pegawai Pergigian',
    jp: 'Juruterapi Pergigian',
    taska: 'Taska',
    tadika: 'Tadika',
    sr: 'Sekolah Rendah',
    sm: 'Sekolah Menengah',
    ins: 'Institusi',
    statik: 'Klinik Pergigian Statik',
    kpb: 'Klinik Pergigian Bergerak',
    'kp-bergerak': 'Klinik Pergigian Bergerak',
    mp: 'Makmal Pergigian Bergerak',
    mpb: 'Makmal Pergigian Bergerak',
    'makmal-pergigian': 'Makmal Pergigian Bergerak',
    event: 'Event',
    utc: 'UTC',
    kgangkat: 'Kampung Angkat',
    ppb: 'Pasukan Pergigian Bergerak',
    program: 'Program',
    sosmed: 'Media Sosial',
    followers: 'Followers',
    tastad: 'Tadika/Taska',
    'kolej-komuniti': 'Kolej Komuniti',
    'kolej-vokasional': 'Kolej Vokasional',
    ipg: 'Institusi Pendidikan Guru (IPG)',
    ipta: 'Pra Universiti (PRA U) & Universiti Awam (UA)',
    'lain-lain': 'Lain-lain Institusi Pengajian',
    // this is for program-komuniti ------------------------------------------
    programDewasaMuda: 'Program Dewasa Muda',
    kampungAngkatPergigian: 'Progam Kampung Angkat Pergigian',
    ppr: 'Projek Perumahan Rakyat',
    we: 'Institusi Warga Emas',
    oku: 'Institusi OKU / PDK',
    'projek-komuniti': 'Projek Komuniti',
    ppkps: 'PPKPS',
    oap: 'Program Orang Asli dan Penan',
    'penjara-koreksional': 'Program di Penjara / Pusat Koreksional',
    fds: 'Flying Dental Service (Sabah)',
    rtc: 'RTC (Kelantan)',
    // incremental: 'Program Pergigian Sekolah Sesi 2022/2023', //{206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211
    // negeri
    negerijohor: 'Johor',
    negerikedah: 'Kedah',
    negerikelantan: 'Kelantan',
    negerimelaka: 'Melaka',
    negerinegerisembilan: 'Negeri Sembilan',
    negeripahang: 'Pahang',
    negeripulaupinang: 'Pulau Pinang',
    negeriperak: 'Perak',
    negeriperlis: 'Perlis',
    negeriselangor: 'Selangor',
    negeriterengganu: 'Terengganu',
    negerisabah: 'Sabah',
    negerisarawak: 'Sarawak',
    negeriwpkualalumpur: 'WP Kuala Lumpur',
    negeriwpputrajaya: 'WP Putrajaya',
    negeriwplabuan: 'WP Labuan',
    negeriilk: 'ILK',
    // KHUSUS UNTUK RTC
    Pahang: 'Pahang',
    Melaka: 'Melaka',
    Kelantan: 'Kelantan',
    Sarawak: 'Sarawak',
  };
  const DictionaryHurufNegeri = {
    Johor: 'J',
    Kedah: 'K',
    Kelantan: 'D',
    Melaka: 'M',
    'Negeri Sembilan': 'N',
    Pahang: 'C',
    'Pulau Pinang': 'P',
    Perak: 'A',
    Perlis: 'R',
    Selangor: 'B',
    Terengganu: 'T',
    Sabah: 'S',
    Sarawak: 'Q',
    'WP Kuala Lumpur': 'W',
    'WP Labuan': 'L',
    'WP Putrajaya': 'F',
    ILK: 'ILK',
  };
  const DictionarySubProgram = {
    kampungAngkatPergigian: 'Program Kampung Angkat Pergigian',
    oap: 'Program Orang Asli dan Penan',
    ppr: 'Projek Perumahan Rakyat',
    hrc: 'Komuniti Berisiko Tinggi',
  };
  const DictionarySosMedParam = (data) => {
    if (data.includes('bilAktivitiShareKurang10') === true) {
      return 'Bilangan aktiviti share kurang 10';
    }
    if (data.includes('bilAktivitiShareLebih10') === true) {
      return 'Bilangan aktiviti share lebih 10';
    }
    if (data.includes('bilPenonton') === true) {
      return 'Bilangan penonton';
    }
    if (data.includes('bilReach') === true) {
      return 'Bilangan reach';
    }
    if (data.includes('bilShare') === true) {
      return 'Bilangan share';
    }
  };
  const DictionarySosMedAcronym = (data) => {
    if (data.includes('live') === true) {
      return 'GO LIVE!';
    }
    if (data.includes('poster') === true) {
      return 'POSTER';
    }
    if (data.includes('video') === true) {
      return 'VIDEO';
    }
  };

  return {
    InfoDecoder,
    Dictionary,
    DictionaryHurufNegeri,
    DictionarySubProgram,
    DictionarySosMedParam,
    DictionarySosMedAcronym,
  };
}
