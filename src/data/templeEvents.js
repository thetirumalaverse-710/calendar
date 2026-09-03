// Comprehensive Panchangam temple events (2026-2027 Complete Official TTD Festivals List)
/**
 * EVENT DATA SCHEMA & CLASSIFICATION DOCUMENTATION:
 * - `crowdLevel`: Internal estimated pilgrim-density/guidance classification used for website UI display.
 * - `crowdBadge`: Internal UI label for pilgrim guidance.
 *   Note: Neither `crowdLevel` nor `crowdBadge` represents an official TTD-published crowd prediction or official TTD classification.
 * - `isMajor`: Internal website display-priority flag used for UI highlight grouping; NOT an official TTD designation.
 */

export const TEMPLES = [
  {
    id: 'tirumala-main',
    name: 'Tirumala Sri Venkateswara Swamy Temple',
    teluguName: 'తిరుమల శ్రీ వేంకటేశ్వర స్వామి వారి ఆలయం',
    location: 'Tirumala Hills (7 Hills / Seshachalam)',
    distanceFromStation: '22 km from Tirupati Railway Station',
    deity: 'Lord Venkateswara (Srinivasa / Balaji)',
    badge: 'Supreme Shrine',
    color: '#D4AF37',
    description: 'The world-famous ancient hill shrine of Lord Venkateswara located atop the sacred Seshachalam Seven Hills.',
    timing: '03:00 AM - 01:30 AM (Next Day)',
    dressCode: 'Strict Traditional South Indian (Dhoti/Kurta for Men, Saree/Half-Saree/Churidar with Dupatta for Women)'
  },
  {
    id: 'tiruchanur',
    name: 'Sri Padmavathi Ammavari Temple',
    teluguName: 'శ్రీ పద్మావతి అమ్మావారి ఆలయం, తిరుచానూరు',
    location: 'Tiruchanur, Tirupati',
    distanceFromStation: '5 km from Tirupati Bus Stand',
    deity: 'Goddess Padmavathi Devi (Alamelu Manga)',
    badge: 'Divine Consort Shrine',
    color: '#FF4D6D',
    description: 'Sacred abode of Divine Mother Padmavathi Devi, consort of Lord Venkateswara. A pilgrimage to Tirumala is complete only after visiting Tiruchanur.',
    timing: '05:00 AM - 09:00 PM',
    dressCode: 'Traditional Indian Attire'
  },
  {
    id: 'govindaraja',
    name: 'Sri Govindaraja Swamy Temple',
    teluguName: 'శ్రీ గోవిందరాజ స్వామి వారి ఆలయం',
    location: 'Heart of Tirupati City (Near Railway Station)',
    distanceFromStation: '0.5 km from Tirupati Railway Station',
    deity: 'Lord Govindaraja Swamy (In Anantasayana posture)',
    badge: 'Historic Landmark Shrine',
    color: '#3A86EF',
    description: 'Consecrated by Saint Ramanujacharya in 1130 AD. Lord Govindaraja Swamy is the elder brother of Lord Venkateswara.',
    timing: '05:00 AM - 09:30 PM',
    dressCode: 'Traditional / Decent Formal Attire'
  },
  {
    id: 'kapileswara',
    name: 'Sri Kapileswara Swamy Temple (Kapila Theertham)',
    teluguName: 'శ్రీ కపిలేశ్వర స్వామి వారి ఆలయం (కపిల తీర్థం)',
    location: 'Foot of Tirumala Hills, Tirupati',
    distanceFromStation: '4 km from Tirupati Bus Stand',
    deity: 'Lord Shiva (Kapileswara) & Goddess Kamakshi Devi',
    badge: 'Only Ancient Shaivite Shrine',
    color: '#FFB703',
    description: 'Situated at the foot of Tirumala hills next to a breathtaking natural waterfall (Kapila Theertham) created by Sage Kapila Maharshi.',
    timing: '05:30 AM - 08:30 PM',
    dressCode: 'Traditional Indian Attire'
  },
  {
    id: 'srinivasa-mangapuram',
    name: 'Sri Kalyana Venkateswara Swamy Temple',
    teluguName: 'శ్రీ కళ్యాణ వేంకటేశ్వర స్వామి వారి ఆలయం, శ్రీనివాస మంగాపురం',
    location: 'Srinivasa Mangapuram (12 km West of Tirupati)',
    distanceFromStation: '12 km from Tirupati Railway Station',
    deity: 'Lord Kalyana Venkateswara Swamy',
    badge: 'Sacred Wedding Refuge Shrine',
    color: '#800020',
    description: 'Where Lord Venkateswara stayed for 6 months with Goddess Padmavathi after their divine wedding before ascending Tirumala hills.',
    timing: '05:30 AM - 08:30 PM',
    dressCode: 'Traditional Indian Attire'
  },
  {
    id: 'narayanavanam',
    name: 'Sri Kalyana Venkateswara Swamy Temple',
    teluguName: 'శ్రీ కళ్యాణ వేంకటేశ్వర స్వామి వారి ఆలయం, నారాయణవనం',
    location: 'Narayanavanam (40 km East of Tirupati)',
    distanceFromStation: '40 km from Tirupati Railway Station',
    deity: 'Lord Kalyana Venkateswara Swamy',
    badge: 'Divine Wedding Shrine',
    color: '#9C27B0',
    description: 'Sacred site associated with the celestial wedding of Sri Padmavati and Srinivasa.',
    timing: '05:30 AM - 08:30 PM',
    dressCode: 'Traditional Indian Attire'
  },
  {
    id: 'kodandarama',
    name: 'Sri Kodandarama Swamy Temple',
    teluguName: 'శ్రీ కోదండరామ స్వామి వారి ఆలయం',
    location: 'Heart of Tirupati City',
    distanceFromStation: '2 km from Tirupati Railway Station',
    deity: 'Lord Sri Rama, Sita Devi & Lakshmana Swamy',
    badge: 'Treta Yuga Historic Temple',
    color: '#FB8500',
    description: 'Commemorating Lord Rama, Sita Devi, and Lakshmana who rested at this spot during their return from Lanka.',
    timing: '05:00 AM - 08:30 PM',
    dressCode: 'Traditional Indian Attire'
  },
  {
    id: 'appalayagunta',
    name: 'Appalayagunta Sri Prasanna Venkateswara Swamy Temple',
    teluguName: 'అప్పులాయగుంట శ్రీ ప్రసన్న వేంకటేశ్వర స్వామి ఆలయం',
    location: 'Appalayagunta (18 km from Tirupati)',
    distanceFromStation: '18 km from Tirupati',
    deity: 'Lord Prasanna Venkateswara Swamy',
    badge: 'Blessing Refuge Shrine',
    color: '#2A9D8F',
    description: 'Where Lord Venkateswara blessed Saint Siddeshwara Maharshi with Abhaya Hastha posture.',
    timing: '06:00 AM - 08:00 PM',
    dressCode: 'Traditional Indian Attire'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Events', labelTe: 'అన్ని ఉత్సవాలు' },
  { id: 'brahmotsavam', label: 'Brahmotsavam & Annual Utsavam', labelTe: 'బ్రహ్మోత్సవాలు' },
  { id: 'vahana-seva', label: 'Vahana Seva & Processions', labelTe: 'వాహన సేవలు' },
  { id: 'monthly-ritual', label: 'Monthly / Lunar Rituals (Pournami/Ekadasi)', labelTe: 'మాసికోత్సవాలు (పౌర్ణమి/ఏకాదశి)' },
  { id: 'float-festival', label: 'Teppotsavam (Float Festival)', labelTe: 'తెప్పోత్సవం' },
  { id: 'special-puja', label: 'Special Utsavam & Abhishekam', labelTe: 'విశేష పూజలు & అభిషేకం' }
];


export const DAILY_NITYA_SEVAS = [
  {
    templeId: 'tirumala-main',
    templeName: 'Tirumala Sri Venkateswara Swamy Temple',
    sevas: [
      { name: 'Suprabhatam', time: '03:00 AM - 03:30 AM', desc: 'Awakening ritual with sacred hymns.' },
      { name: 'Thomala Seva', time: '03:30 AM - 04:00 AM', desc: 'Adorning the deity with fresh flower garlands.' },
      { name: 'Archana (Sahasranamarchana)', time: '04:15 AM - 05:00 AM', desc: 'Recitation of 1000 holy names of Lord Venkateswara.' },
      { name: 'Nitya Kalyanotsavam', time: '12:00 PM - 01:00 PM', desc: 'Celestial wedding ceremony of Sri Malayappa Swamy.' },
      { name: 'Sahasra Deepalankara Seva', time: '05:30 PM - 06:30 PM', desc: 'Unjal (Swing) Seva illuminated by 1000 ghee lamps.' },
      { name: 'Ekanta Seva', time: '01:30 AM (After 1 AM Early Morning)', desc: 'Final night lullaby before the Lord retires.' }
    ],
    annaprasadam: {
      location: 'Nitya Annaprasadam Complex (Tirumala)',
      timings: '09:00 AM to 11:00 PM Continuous Daily',
      details: 'Free unlimited hygienic hot meal with rice, Sambar, Rasam, Chutney, Payasam, and Butter Milk served to over 100,000 pilgrims daily.'
    }
  },
  {
    templeId: 'tiruchanur',
    templeName: 'Sri Padmavathi Ammavari Temple, Tiruchanur',
    sevas: [
      { name: 'Suprabhatam', time: '05:00 AM - 05:30 AM', desc: 'Waking up Goddess Padmavathi Devi.' },
      { name: 'Sahasranamarchana', time: '07:30 AM - 08:30 AM', desc: 'Chanting 1000 sacred names of Divine Mother Padmavathi.' },
      { name: 'Unjal Seva', time: '05:00 PM - 06:00 PM', desc: 'Swing ritual accompanied by classical music.' },
      { name: 'Ekantha Seva', time: '08:30 PM', desc: 'Night repose ritual.' }
    ],
    annaprasadam: {
      location: 'Nitya Annaprasadam Hall, Tiruchanur',
      timings: '11:30 AM to 03:30 PM & 07:00 PM to 09:00 PM',
      details: 'Free delicious meal served with devotion to all visiting pilgrims.'
    }
  }
];

export const PILGRIM_TIPS = [
  {
    title: 'Dress Code Guidelines',
    titleTe: 'దుస్తుల నియమావళి',
    icon: 'Shirt',
    content: 'Men: Dhoti with Towel / Kurta Pyjama. Women: Saree / Half-saree / Salwar Kameez with Dupatta. Western clothes are strictly restricted in sanctum lines.'
  },
  {
    title: 'Free Annaprasadam',
    titleTe: 'ఉచిత అన్నప్రసాదం',
    icon: 'Utensils',
    content: 'Nitya Annaprasadam Complex in Tirumala operates continuously from 9:00 AM to 11:00 PM. Clean, delicious, unlimited hot meals served with devotion.'
  }
];

// ============================================================
// SEPTEMBER 2026 — TTD TEMPLE EVENTS
// ============================================================
/**
 * DATA CLASSIFICATION NOTE FOR SEPTEMBER 2026 EVENTS:
 * - `crowdLevel` is an internal estimated pilgrim-density/guidance classification.
 * - `crowdBadge` is an internal UI label.
 * - Neither field represents an official TTD-published crowd prediction or official TTD classification.
 * - `isMajor` is an internal website display-priority flag and is NOT an official TTD designation.
 */

export const SEPTEMBER_2026_EVENTS = [
  // ============================================================
  // TIRUMALA — SRI VENKATESWARA SWAMY TEMPLE
  // ============================================================
  {
    id: "ttd-2026-09-04-gokulashtami-asthanam",
    templeId: "tirumala-main",
    title: "Gokulashtami Asthanam",
    titleTe: "గోకులాష్టమి ఆస్థానం",
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Bangaru Vakili Mukha Mandapam, Srivari Temple, Tirumala",
    time: "08:00 PM - 10:00 PM",
    startTime: '20:00:00',
    crowdLevel: "High",
    crowdBadge: "Gokulashtami",
    vahanam: "Sarvabhupala Vahanam",
    description:
      "Gokulashtami Asthanam will be observed at the Srivari Temple on the occasion of Sri Krishna Janmashtami. Sri Krishna Swamy will be seated on the Sarvabhupala Vahanam and special offerings will be rendered. Ekanta Tirumanjanam will be performed for Sri Ugra Srinivasa Murthy, Sri Devi, Bhudevi and Sri Krishna Swamy, followed by Dwadasaradhana.",
    descriptionTe:
      "శ్రీకృష్ణ జన్మాష్టమి సందర్భంగా తిరుమల శ్రీవారి ఆలయంలో గోకులాష్టమి ఆస్థానం నిర్వహిస్తారు. బంగారు సర్వభూపాల వాహనంపై శ్రీకృష్ణస్వామివారిని వేంచేపుచేసి ప్రత్యేక నివేదనలు సమర్పిస్తారు. శ్రీ ఉగ్రశ్రీనివాసమూర్తికి, శ్రీదేవి, భూదేవి అమ్మవార్లకు, శ్రీకృష్ణస్వామివారికి ఏకాంత తిరుమంజనం నిర్వహించి అనంతరం ద్వాదశారాధనం చేపడతారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-04-kaliya-mardhana-abhishekam",
    templeId: "tirumala-main",
    title: "Panchabhishekam to Sri Kaliya Mardhana Krishna",
    titleTe: "శ్రీ కాళీయమర్ధన కృష్ణునికి పంచాభిషేకాలు",
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    category: "special-puja",
    highlight: true,
    isMajor: false,
    location: "Garden near Gogarbham Dam, Tirumala",
    time: "10:00 AM - 12:00 PM",
    startTime: '10:00:00',
    crowdLevel: "High",
    crowdBadge: "Janmashtami",
    vahanam: "",
    description:
      "Panchabhishekam will be performed to Sri Kaliya Mardhana Krishna near Gogarbham Dam on the occasion of Sri Krishna Janmashtami. The TTD Garden Wing will subsequently conduct Utlotsavam at the same venue.",
    descriptionTe:
      "శ్రీకృష్ణ జన్మాష్టమి సందర్భంగా గోగర్భం డ్యామ్ సమీపంలోని ఉద్యానవనంలో శ్రీ కాళీయమర్ధన కృష్ణునికి ఉదయం 10 నుండి మధ్యాహ్నం 12 గంటల వరకు పంచాభిషేకాలు నిర్వహిస్తారు. అనంతరం అదే ప్రదేశంలో టిటిడి ఉద్యానవన శాఖ ఆధ్వర్యంలో ఉట్లోత్సవం నిర్వహిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-05-utlotsavam",
    templeId: "tirumala-main",
    title: "Utlotsavam",
    titleTe: "ఉట్లోత్సవం",
    startDate: "2026-09-05",
    endDate: "2026-09-05",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Four Mada Streets, Tirumala",
    time: "04:00 PM",
    startTime: '16:00:00',
    crowdLevel: "Peak",
    crowdBadge: "Utlotsavam",
    vahanam: "Bangaru Tiruchi",
    description:
      "Utlotsavam will be celebrated with celestial grandeur at Tirumala. At 4:00 PM, Sri Malayappa Swamy on Bangaru Tiruchi, accompanied by Sri Krishna Swamy on another Tiruchi, will be paraded through the Mada streets. Youth participate enthusiastically by breaking mud pots (utlu), spreading joy among pilgrims.",
    descriptionTe:
      "సెప్టెంబర్ 5న తిరుమలలో ఉట్లోత్సవాన్ని వైభవంగా నిర్వహిస్తారు. సాయంత్రం 4 గంటలకు శ్రీ మలయప్పస్వామివారు బంగారు తిరుచ్చిపై, శ్రీకృష్ణస్వామివారు మరో తిరుచ్చిపై తిరుమాడ వీధుల్లో విహరిస్తారు. యువకులు ఎంతో ఉత్సాహంగా పాల్గొని ఉట్లను కొడుతూ భక్తులకు ఆనందాన్ని పంచుతారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-08-koil-alwar-tirumanjanam",
    templeId: "tirumala-main",
    title: "Koil Alwar Tirumanjanam",
    titleTe: "కోయిల్ ఆళ్వార్ తిరుమంజనం",
    startDate: "2026-09-08",
    endDate: "2026-09-08",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Srivari Temple, Tirumala",
    time: "06:00 AM - 11:00 AM",
    startTime: '06:00:00',
    crowdLevel: "High",
    crowdBadge: "Temple Purification",
    vahanam: "",
    description:
      "Koil Alwar Tirumanjanam will be performed before the Srivari Brahmotsavams. The Anand Nilayam, Bangaru Vakili, sub-shrines, temple premises and worship materials will be purified.",
    descriptionTe:
      "శ్రీవారి బ్రహ్మోత్సవాలకు ముందు ఆనవాయితీ ప్రకారం కోయిల్ ఆళ్వార్ తిరుమంజనం నిర్వహిస్తారు. ఆనందనిలయం మొదలుకొని బంగారువాకిలి వరకు, ఉప ఆలయాలు, ఆలయ ప్రాంగణం, పూజాసామగ్రిని శుద్ధి చేస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-13-balarama-varaha-jayanti",
    templeId: "tirumala-main",
    title: "Balarama Jayanti and Varaha Jayanti",
    titleTe: "బలరామ జయంతి, వరాహ జయంతి",
    startDate: "2026-09-13",
    endDate: "2026-09-13",
    category: "festival",
    highlight: true,
    isMajor: true,
    location: "Tirumala",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Jayanti",
    vahanam: "",
    description:
      "Balarama Jayanti and Varaha Jayanti will be observed at Tirumala.",
    descriptionTe:
      "తిరుమలలో బలరామ జయంతి, వరాహ జయంతిని నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-14-brahmotsavam-ankurarpanam",
    templeId: "tirumala-main",
    title: "Srivari Brahmotsavams Ankurarpanam",
    titleTe: "శ్రీవారి బ్రహ్మోత్సవాలకు అంకురార్పణం",
    startDate: "2026-09-14",
    endDate: "2026-09-14",
    category: "brahmotsavam",
    highlight: true,
    isMajor: true,
    location: "Vasantha Mandapam, Tirumala",
    time: "07:00 PM - 08:00 PM",
    startTime: '19:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam",
    vahanam: "",
    description:
      "Ankurarpanam will be performed before the Srivari Brahmotsavams. Sri Vishwaksena will proceed to the Vasantha Mandapam, where special worship will be offered to Bhudevi and nine varieties of grains will be sown.",
    descriptionTe:
      "శ్రీవారి బ్రహ్మోత్సవాలకు ముందు అంకురార్పణం నిర్వహిస్తారు. శ్రీ విష్వక్సేనులు వసంతమండపానికి ఊరేగింపుగా వెళ్లి భూమాతకు ప్రత్యేక పూజలు నిర్వహించిన అనంతరం తొమ్మిది రకాల ధాన్యాలను నాటుతారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-15-dhwajarohanam",
    templeId: "tirumala-main",
    title: "Srivari Brahmotsavams Commencement & Dhwajarohanam",
    titleTe: "శ్రీవారి బ్రహ్మోత్సవాలు ప్రారంభం, ధ్వజారోహణం",
    startDate: "2026-09-15",
    endDate: "2026-09-15",
    category: "brahmotsavam",
    highlight: true,
    isMajor: true,
    location: "Srivari Temple, Tirumala",
    time: "06:21 PM - 06:35 PM",
    startTime: '18:21:00',
    crowdLevel: "Peak",
    crowdBadge: "Brahmotsavam Opening",
    vahanam: "",
    description:
      "The annual Srivari Brahmotsavams will commence with Dhwajarohanam. The Garuda flag will be hoisted on the golden Dhwajastambham amid Vedic chanting and auspicious music.",
    descriptionTe:
      "తిరుమల శ్రీవారి బ్రహ్మోత్సవాలు ధ్వజారోహణంతో ప్రారంభమవుతాయి. వేదగానాలు, మంగళవాద్యాల మధ్య బంగారు ధ్వజస్తంభంపై గరుడధ్వజాన్ని ఎగురవేసి సకల దేవతలను, అష్టదిక్పాలకులను బ్రహ్మోత్సవాలకు ఆహ్వానిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-15-pedda-sesha-vahanam",
    templeId: "tirumala-main",
    title: "Pedda Sesha Vahanam",
    titleTe: "పెద్దశేషవాహనం",
    startDate: "2026-09-15",
    endDate: "2026-09-15",
    category: "vahana-seva",
    highlight: true,
    isMajor: true,
    location: "Four Mada Streets, Tirumala",
    time: "09:00 PM",
    startTime: '21:00:00',
    crowdLevel: "Peak",
    crowdBadge: "Brahmotsavam Day 1",
    vahanam: "Pedda Sesha Vahanam",
    description:
      "Sri Malayappa Swamy with Sridevi and Bhudevi will bless devotees on the seven-headed golden Pedda Sesha Vahanam through the Mada streets.",
    descriptionTe:
      "బ్రహ్మోత్సవాల మొదటిరోజు రాత్రి శ్రీదేవి, భూదేవి సమేత శ్రీ మలయప్పస్వామివారు ఏడుతలల స్వర్ణ పెద్దశేషవాహనంపై తిరుమాడ వీధుల్లో విహరించి భక్తులకు దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-16-chinna-sesha-vahanam",
    templeId: "tirumala-main",
    title: "Chinna Sesha Vahanam",
    titleTe: "చిన్నశేషవాహనం",
    startDate: "2026-09-16",
    endDate: "2026-09-16",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "08:00 AM",
    startTime: '08:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 2",
    vahanam: "Chinna Sesha Vahanam",
    description:
      "Sri Malayappa Swamy will appear on the five-headed Chinna Sesha Vahanam on the second morning of Brahmotsavams.",
    descriptionTe:
      "బ్రహ్మోత్సవాల రెండవ రోజు ఉదయం శ్రీ మలయప్పస్వామివారు ఐదు తలల చిన్నశేషవాహనంపై ఊరేగుతూ భక్తులకు దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-16-hamsa-vahanam",
    templeId: "tirumala-main",
    title: "Hamsa Vahanam",
    titleTe: "హంస వాహనం",
    startDate: "2026-09-16",
    endDate: "2026-09-16",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "07:00 PM",
    startTime: '19:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 2",
    vahanam: "Hamsa Vahanam",
    description:
      "Sri Malayappa Swamy will appear as Saraswati, holding the veena, on the Hamsa Vahanam.",
    descriptionTe:
      "బ్రహ్మోత్సవాల రెండవ రోజు రాత్రి శ్రీ మలయప్పస్వామివారు వీణాపాణియై సరస్వతీ రూపంలో హంసవాహనంపై దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-17-simha-vahanam",
    templeId: "tirumala-main",
    title: "Simha Vahanam",
    titleTe: "సింహ వాహనం",
    startDate: "2026-09-17",
    endDate: "2026-09-17",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "08:00 AM",
    startTime: '08:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 3",
    vahanam: "Simha Vahanam",
    description:
      "Sri Malayappa Swamy will bless devotees on the Simha Vahanam on the third morning of Brahmotsavams.",
    descriptionTe:
      "బ్రహ్మోత్సవాల మూడవ రోజు ఉదయం శ్రీ మలయప్పస్వామివారు సింహవాహనంపై భక్తులకు దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-17-muthyapu-pandiri-vahanam",
    templeId: "tirumala-main",
    title: "Muthyapu Pandiri Vahanam",
    titleTe: "ముత్యపుపందిరి వాహనం",
    startDate: "2026-09-17",
    endDate: "2026-09-17",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "07:00 PM",
    startTime: '19:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 3",
    vahanam: "Muthyapu Pandiri Vahanam",
    description:
      "Sri Malayappa Swamy will proceed beneath the pearl canopy of the Muthyapu Pandiri Vahanam.",
    descriptionTe:
      "బ్రహ్మోత్సవాల మూడవ రోజు రాత్రి శ్రీ మలయప్పస్వామివారు ముత్యపుపందిరి వాహనంపై ఊరేగుతూ భక్తులకు దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-18-kalpavriksha-vahanam",
    templeId: "tirumala-main",
    title: "Kalpavriksha Vahanam",
    titleTe: "కల్పవృక్ష వాహనం",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "08:00 AM",
    startTime: '08:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 4",
    vahanam: "Kalpavriksha Vahanam",
    description:
      "Sri Malayappa Swamy with the consorts will proceed on the Kalpavriksha Vahanam and bless devotees.",
    descriptionTe:
      "బ్రహ్మోత్సవాల నాలుగవ రోజు ఉదయం ఉభయదేవేరులతో కలిసి శ్రీ మలయప్పస్వామివారు కల్పవృక్ష వాహనంపై నాలుగు మాడ వీధుల్లో విహరించి భక్తులకు దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-18-sarvabhoopala-vahanam",
    templeId: "tirumala-main",
    title: "Sarvabhoopala Vahanam",
    titleTe: "సర్వభూపాల వాహనం",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "07:00 PM",
    startTime: '19:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 4",
    vahanam: "Sarvabhoopala Vahanam",
    description:
      "Sri Malayappa Swamy with Sridevi and Bhudevi will bless devotees on the Sarvabhoopala Vahanam.",
    descriptionTe:
      "బ్రహ్మోత్సవాల నాలుగవ రోజు రాత్రి శ్రీదేవి, భూదేవి సమేత శ్రీ మలయప్పస్వామివారు సర్వభూపాల వాహనంపై భక్తులకు అభయమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-19-mohini-avataram",
    templeId: "tirumala-main",
    title: "Mohini Avataram",
    titleTe: "మోహినీ అవతారం",
    startDate: "2026-09-19",
    endDate: "2026-09-19",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "08:00 AM",
    startTime: '08:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 5",
    vahanam: "Mohini Vahanam",
    description:
      "Sri Malayappa Swamy will appear in the enchanting Mohini form. Sri Krishna will also be presented as Butter Krishna on a palanquin.",
    descriptionTe:
      "బ్రహ్మోత్సవాల ఐదవ రోజు ఉదయం శ్రీవారు మోహినీ రూపంలో దర్శనమిస్తారు. పక్కనే దంతపుపల్లకిపై వెన్నముద్ద కృష్ణుడిగా మరో రూపంలో దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-19-garuda-vahanam",
    templeId: "tirumala-main",
    title: "Srivari Garuda Seva",
    titleTe: "శ్రీవారి గరుడ సేవ",
    startDate: "2026-09-19",
    endDate: "2026-09-19",
    category: "vahana-seva",
    highlight: true,
    isMajor: true,
    location: "Four Mada Streets, Tirumala",
    time: "06:30 PM - 12:00 AM",
    startTime: '18:30:00',
    crowdLevel: "Peak",
    crowdBadge: "Garuda Seva",
    vahanam: "Garuda Vahanam",
    description:
      "Sri Malayappa Swamy will proceed on the Garuda Vahanam through the Mada streets and bless devotees with His divine form.",
    descriptionTe:
      "శ్రీవారి బ్రహ్మోత్సవాల్లో ఐదవ రోజు రాత్రి శ్రీ మలయప్పస్వామివారు గరుడవాహనంపై తిరుమాడ వీధుల్లో విహరించి భక్తులకు దివ్యమంగళ రూపదర్శనం ఇస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-20-hanumantha-vahanam",
    templeId: "tirumala-main",
    title: "Hanumantha Vahanam",
    titleTe: "హనుమంత వాహనం",
    startDate: "2026-09-20",
    endDate: "2026-09-20",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "08:00 AM",
    startTime: '08:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 6",
    vahanam: "Hanumantha Vahanam",
    description:
      "Sri Malayappa Swamy will appear in the form of Lord Rama riding the Hanumantha Vahanam.",
    descriptionTe:
      "బ్రహ్మోత్సవాల ఆరవ రోజు ఉదయం శేషాచలాధీశుడు శ్రీరాముని అవతారంలో తన భక్తుడైన హనుమంతునిపై ఊరేగి భక్తులకు దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-20-swarna-ratham",
    templeId: "tirumala-main",
    title: "Srivari Swarna Rathotsavam",
    titleTe: "శ్రీవారి స్వర్ణరథం",
    startDate: "2026-09-20",
    endDate: "2026-09-20",
    category: "vahana-seva",
    highlight: true,
    isMajor: true,
    location: "Four Mada Streets, Tirumala",
    time: "04:00 PM",
    startTime: '16:00:00',
    crowdLevel: "Peak",
    crowdBadge: "Golden Chariot",
    vahanam: "Swarna Ratham",
    description:
      "Sri Srinivasa will bless devotees while riding the golden chariot during the sixth-day evening celebration.",
    descriptionTe:
      "శ్రీవారి బ్రహ్మోత్సవాల్లో ఆరవ రోజు సాయంత్రం శ్రీనివాసుడు స్వర్ణరథాన్ని అధిరోహించి భక్తులను అనుగ్రహిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-20-gaja-vahanam",
    templeId: "tirumala-main",
    title: "Gaja Vahanam",
    titleTe: "గజవాహనం",
    startDate: "2026-09-20",
    endDate: "2026-09-20",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "07:00 PM",
    startTime: '19:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 6",
    vahanam: "Gaja Vahanam",
    description:
      "Sri Venkateswara Swamy will proceed on the Gaja Vahanam through the streets and bless devotees.",
    descriptionTe:
      "బ్రహ్మోత్సవాల ఆరవ రోజు రాత్రి వేంకటాద్రీశుడు గజవాహనంపై తిరువీధుల్లో ఊరేగుతూ భక్తులకు అభయమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-21-surya-prabha-vahanam",
    templeId: "tirumala-main",
    title: "Surya Prabha Vahanam",
    titleTe: "సూర్యప్రభ వాహనం",
    startDate: "2026-09-21",
    endDate: "2026-09-21",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "08:00 AM",
    startTime: '08:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 7",
    vahanam: "Surya Prabha Vahanam",
    description:
      "Sri Narayana will proceed on the Surya Prabha Vahanam and bless devotees.",
    descriptionTe:
      "బ్రహ్మోత్సవాల ఏడవ రోజు ఉదయం శ్రీమన్నారాయణుడు సూర్యప్రభ వాహనంపై తిరుమాడ వీధుల్లో విహరిస్తూ భక్తులను కటాక్షిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-21-chandra-prabha-vahanam",
    templeId: "tirumala-main",
    title: "Chandra Prabha Vahanam",
    titleTe: "చంద్రప్రభ వాహనం",
    startDate: "2026-09-21",
    endDate: "2026-09-21",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "07:00 PM",
    startTime: '19:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 7",
    vahanam: "Chandra Prabha Vahanam",
    description:
      "Sri Malayappa Swamy will proceed on the Chandra Prabha Vahanam and bless devotees.",
    descriptionTe:
      "బ్రహ్మోత్సవాల ఏడవ రోజు రాత్రి శ్రీ మలయప్పస్వామివారు చంద్రప్రభ వాహనంపై విహరిస్తూ భక్తులకు దర్శనమిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-22-rathotsavam",
    templeId: "tirumala-main",
    title: "Srivari Rathotsavam",
    titleTe: "శ్రీవారి రథోత్సవం",
    startDate: "2026-09-22",
    endDate: "2026-09-22",
    category: "vahana-seva",
    highlight: true,
    isMajor: true,
    location: "Four Mada Streets, Tirumala",
    time: "07:30 AM",
    startTime: '07:30:00',
    crowdLevel: "Peak",
    crowdBadge: "Rathotsavam",
    vahanam: "Ratham",
    description:
      "Sri Malayappa Swamy with Sridevi and Bhudevi will participate in the grand Rathotsavam on the eighth morning of Brahmotsavams.",
    descriptionTe:
      "బ్రహ్మోత్సవాల ఎనిమిదవ రోజు ఉదయం ఉభయదేవేరులతో కూడిన శ్రీ మలయప్పస్వామివారి రథోత్సవం అంగరంగ వైభవంగా జరుగుతుంది.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-22-aswa-vahanam",
    templeId: "tirumala-main",
    title: "Aswa Vahanam",
    titleTe: "అశ్వవాహనం",
    startDate: "2026-09-22",
    endDate: "2026-09-22",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Four Mada Streets, Tirumala",
    time: "07:00 PM",
    startTime: '19:00:00',
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Day 8",
    vahanam: "Aswa Vahanam",
    description:
      "Sri Malayappa Swamy will appear on the Aswa Vahanam in the form associated with the Kalki incarnation.",
    descriptionTe:
      "బ్రహ్మోత్సవాల ఎనిమిదవ రోజు రాత్రి శ్రీ మలయప్పస్వామివారు అశ్వవాహనంపై విహరిస్తూ కల్కి అవతార స్వరూపంలో భక్తులను అనుగ్రహిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-23-chakra-snanam",
    templeId: "tirumala-main",
    title: "Srivari Chakra Snanam",
    titleTe: "శ్రీవారి చక్రస్నానం",
    startDate: "2026-09-23",
    endDate: "2026-09-23",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Swami Pushkarini, Tirumala",
    time: "Morning",
    crowdLevel: "Peak",
    crowdBadge: "Brahmotsavam Finale",
    vahanam: "Chakrattalwar",
    description:
      "Chakra Snanam will be performed on the final day of Brahmotsavams after sacred Abhishekam to Chakrattalwar.",
    descriptionTe:
      "శ్రీవారి బ్రహ్మోత్సవాల చివరి రోజు ఉదయం చక్రస్నానం నిర్వహిస్తారు. చక్రత్తాళ్వార్లకు పాలు, పెరుగు, నెయ్యి, తేనె, చందనంతో అభిషేకం నిర్వహించిన అనంతరం స్వామి పుష్కరిణిలో చక్రస్నానం జరుగుతుంది.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-23-dhwajavarohanam",
    templeId: "tirumala-main",
    title: "Dhwajavarohanam",
    titleTe: "ధ్వజావరోహణం",
    startDate: "2026-09-23",
    endDate: "2026-09-23",
    category: "brahmotsavam",
    highlight: true,
    isMajor: true,
    location: "Srivari Temple, Tirumala",
    time: "Night",
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Finale",
    vahanam: "Bangaru Tiruchi",
    description:
      "Dhwajavarohanam will be performed after the Bangaru Tiruchi Utsavam, formally concluding the nine-day Srivari Brahmotsavams.",
    descriptionTe:
      "బంగారు తిరుచ్చి ఉత్సవం అనంతరం రాత్రి ధ్వజావరోహణం శాస్త్రోక్తంగా నిర్వహిస్తారు. ధ్వజావరోహణంతో తొమ్మిది రోజుల పాటు జరిగిన శ్రీవారి బ్రహ్మోత్సవాలు ముగుస్తాయి.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-24-bagh-savari",
    templeId: "tirumala-main",
    title: "Srivari Bagh Savari",
    titleTe: "శ్రీవారి బాగ్ సవారి",
    startDate: "2026-09-24",
    endDate: "2026-09-24",
    category: "special-puja",
    highlight: true,
    isMajor: false,
    location: "Tirumala",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Brahmotsavam Observance",
    vahanam: "",
    description:
      "Srivari Bagh Savari will be observed at Tirumala following the annual Srivari Brahmotsavams.",
    descriptionTe:
      "శ్రీవారి వార్షిక బ్రహ్మోత్సవాల అనంతరం సెప్టెంబర్ 24న తిరుమలలో శ్రీవారి బాగ్ సవారి నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-25-anantha-padmanabha-vratham",
    templeId: "tirumala-main",
    title: "Anantha Padmanabha Vratham & Chakra Snanam",
    titleTe: "అనంత పద్మనాభ వ్రతం, చక్రస్నానం",
    startDate: "2026-09-25",
    endDate: "2026-09-25",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Tirumala",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Anantha Padmanabha Vratham",
    vahanam: "",
    description:
      "Anantha Padmanabha Vratham and Chakra Snanam will be observed at Tirumala.",
    descriptionTe:
      "సెప్టెంబర్ 25న తిరుమలలో అనంత పద్మనాభ వ్రతం, చక్రస్నానం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },

  // ============================================================
  // GOVINDARAJA SWAMY TEMPLE — TIRUPATI
  // ============================================================
  {
    id: "ttd-2026-09-04-govindaraja-krishna-abhishekam",
    templeId: "govindaraja",
    title: "Sri Krishna Swamy Abhishekam & Gokulashtami Asthanam",
    titleTe: "శ్రీ కృష్ణస్వామివారి అభిషేకం, గోకులాష్టమి ఆస్థానం",
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Sri Govindaraja Swamy Temple, Tirupati",
    time: "04:00 PM - 06:30 PM",
    crowdLevel: "High",
    crowdBadge: "Gokulashtami",
    vahanam: "",
    description:
      "Abhishekam to Sri Krishna Swamy will be performed from 4:00 PM to 6:30 PM, followed by a Puranic discourse, Gokulashtami Asthanam and Nivedana at the Bangaru Vakili.",
    descriptionTe:
      "సెప్టెంబరు 4న సాయంత్రం 4 నుంచి 6.30 గంటల వరకు శ్రీ కృష్ణస్వామివారికి అభిషేకం నిర్వహిస్తారు. అనంతరం బంగారు వాకిలి వద్ద పురాణ ప్రవచనం, గోకులాష్టమి ఆస్థానం, నివేదన కార్యక్రమాలు నిర్వహిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-08-govindaraja-pedda-veedhi-utlotsavam",
    templeId: "govindaraja",
    title: "Pedda Veedhi Utlotsavam",
    titleTe: "పెద్ద వీధి ఉట్లోత్సవం",
    startDate: "2026-09-08",
    endDate: "2026-09-08",
    category: "special-puja",
    highlight: true,
    isMajor: false,
    location: "Sri Govindaraja Swamy Temple, Tirupati",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Utlotsavam",
    vahanam: "",
    description:
      "Pedda Veedhi Utlotsavam will be conducted at Sri Govindaraja Swamy Temple.",
    descriptionTe:
      "సెప్టెంబరు 8న శ్రీ గోవిందరాజస్వామివారి ఆలయంలో పెద్ద వీధి ఉట్లోత్సవం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-12-govindaraja-uttara-nakshatram",
    templeId: "govindaraja",
    title: "Sri Govindaraja Swamy Procession on Uttara Nakshatram",
    titleTe: "ఉత్తర నక్షత్రం సందర్భంగా శ్రీ గోవిందరాజస్వామివారి ఊరేగింపు",
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    category: "vahana-seva",
    highlight: true,
    isMajor: false,
    location: "Sri Govindaraja Swamy Temple, Tirupati",
    time: "06:00 PM",
    crowdLevel: "High",
    crowdBadge: "Uttara Nakshatram",
    vahanam: "",
    description:
      "On Uttara Nakshatram, Sri Govindaraja Swamy will bless devotees in procession along with the consorts.",
    descriptionTe:
      "ఉత్తర నక్షత్రం సందర్భంగా సెప్టెంబరు 12న సాయంత్రం 6 గంటలకు ఉభయనాంచారులతో కలిసి శ్రీ గోవిందరాజస్వామివారు భక్తులకు దర్శనమివ్వనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-21-govindaraja-patrotsavam-ankurarpanam",
    templeId: "govindaraja",
    title: "Patrotsavams Ankurarpanam",
    titleTe: "పత్రోత్సవాలకు అంకురార్పణ",
    startDate: "2026-09-21",
    endDate: "2026-09-21",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Sri Govindaraja Swamy Temple, Tirupati",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Patrotsavams",
    vahanam: "",
    description:
      "Ankurarpanam will be performed at Sri Govindaraja Swamy Temple before the Patrotsavams.",
    descriptionTe:
      "సెప్టెంబరు 21న శ్రీ గోవిందరాజస్వామివారి ఆలయంలో పత్రోత్సవాలకు అంకురార్పణ నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-22-24-govindaraja-patrotsavams",
    templeId: "govindaraja",
    title: "Sri Govindaraja Swamy Patrotsavams",
    titleTe: "శ్రీ గోవిందరాజస్వామివారి పత్రోత్సవాలు",
    startDate: "2026-09-22",
    endDate: "2026-09-24",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Sri Govindaraja Swamy Temple, Tirupati",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Patrotsavams",
    vahanam: "",
    description:
      "The annual Patrotsavams of Sri Govindaraja Swamy will be conducted from September 22 to September 24.",
    descriptionTe:
      "సెప్టెంబరు 22 నుండి 24వ తేదీ వరకు శ్రీ గోవిందరాజస్వామివారి పత్రోత్సవాలు నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-26-govindaraja-garuda-seva",
    templeId: "govindaraja",
    title: "Sri Govindaraja Swamy Garuda Seva",
    titleTe: "శ్రీ గోవిందరాజస్వామివారి గరుడ సేవ",
    startDate: "2026-09-26",
    endDate: "2026-09-26",
    category: "vahana-seva",
    highlight: true,
    isMajor: true,
    location: "Sri Govindaraja Swamy Temple, Tirupati",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Pournami Garuda Seva",
    vahanam: "Garuda Vahanam",
    description:
      "Sri Govindaraja Swamy will bless devotees on Garuda Vahanam on the occasion of Pournami.",
    descriptionTe:
      "పౌర్ణమి సందర్భంగా సెప్టెంబరు 26న శ్రీ గోవిందరాజస్వామివారి గరుడ సేవ నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },

  // ============================================================
  // KALYANA VENKATESWARA SWAMY TEMPLE — NARAYANAVANAM
  // ============================================================
  {
    id: "ttd-2026-09-04-narayanavanam-krishna-abhishekam",
    templeId: "narayanavanam",
    title: "Sri Krishna Swamy Abhishekam & Gokulashtami Asthanam",
    titleTe: "శ్రీ కృష్ణస్వామివారి అభిషేకం, గోకులాష్టమి ఆస్థానం",
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Sri Kalyana Venkateswara Swamy Temple, Narayanavanam",
    time: "05:00 PM - 06:40 PM",
    crowdLevel: "High",
    crowdBadge: "Gokulashtami",
    vahanam: "",
    description:
      "Abhishekam to Sri Krishna Swamy will be performed from 5:00 PM to 6:40 PM, followed by Gokulashtami Asthanam and Nivedana.",
    descriptionTe:
      "సెప్టెంబరు 4న సాయంత్రం 5 నుంచి 6.40 గంటల వరకు శ్రీ కృష్ణస్వామివారికి అభిషేకం నిర్వహించి అనంతరం గోకులాష్టమి ఆస్థానం, నివేదన కార్యక్రమాలు నిర్వహిస్తారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-05-narayanavanam-krishna-utlotsavam",
    templeId: "narayanavanam",
    title: "Sri Krishna Swamy Utsavams & Utlotsavam",
    titleTe: "శ్రీ కృష్ణస్వామివారి ఉత్సవం, ఉట్లోత్సవం",
    startDate: "2026-09-05",
    endDate: "2026-09-05",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Sri Kalyana Venkateswara Swamy Temple, Narayanavanam",
    time: "09:00 AM & 05:00 PM",
    crowdLevel: "High",
    crowdBadge: "Utlotsavam",
    vahanam: "Sri Krishna Swamy Street Procession",
    description:
      "Suprabhatam, Thomala Seva and Panchanga Sravanam will be performed in the morning. Sri Krishna Swamy will take a street procession at 9:00 AM, followed by Utlotsavam at 5:00 PM.",
    descriptionTe:
      "సెప్టెంబరు 5న ఉదయం సుప్రభాతంతో స్వామివారిని మేల్కొలిపి తోమాలసేవ, పంచాంగ శ్రవణం నిర్వహిస్తారు. ఉదయం 9 గంటలకు శ్రీ కృష్ణస్వామివారి వీధి ఉత్సవం, సాయంత్రం 5 గంటలకు ఉట్లోత్సవం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },

  // ============================================================
  // SRI PADMAVATHI AMMAVARI TEMPLE — TIRUCHANUR
  // ============================================================
  {
    id: "ttd-2026-09-04-tiruchanur-padma-tiruchi",
    templeId: "tiruchanur",
    title: "Sri Padmavathi Ammavaru Tiruchi Procession",
    titleTe: "శ్రీ పద్మావతి అమ్మవారి తిరుచ్చి ఉత్సవం",
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    category: "vahana-seva",
    highlight: false,
    isMajor: false,
    location: "Four Mada Streets, Tiruchanur",
    time: "06:00 PM",
    startTime: '18:00:00',
    crowdLevel: "High",
    crowdBadge: "Friday Procession",
    vahanam: "Tiruchi",
    description:
      "Sri Padmavathi Ammavaru will bless devotees on a Tiruchi through the four Mada streets.",
    descriptionTe:
      "సెప్టెంబరు 4న శుక్రవారం సందర్భంగా శ్రీ పద్మావతి అమ్మవారు తిరుచ్చిపై ఆలయ నాలుగు మాడ వీధుల్లో విహరించి భక్తులకు దర్శనమివ్వనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-11-tiruchanur-padma-tiruchi",
    templeId: "tiruchanur",
    title: "Sri Padmavathi Ammavaru Tiruchi Procession",
    titleTe: "శ్రీ పద్మావతి అమ్మవారి తిరుచ్చి ఉత్సవం",
    startDate: "2026-09-11",
    endDate: "2026-09-11",
    category: "vahana-seva",
    highlight: false,
    isMajor: false,
    location: "Four Mada Streets, Tiruchanur",
    time: "06:00 PM",
    startTime: '18:00:00',
    crowdLevel: "High",
    crowdBadge: "Friday Procession",
    vahanam: "Tiruchi",
    description:
      "Sri Padmavathi Ammavaru will bless devotees on a Tiruchi through the four Mada streets.",
    descriptionTe:
      "సెప్టెంబరు 11న శుక్రవారం సందర్భంగా శ్రీ పద్మావతి అమ్మవారు తిరుచ్చిపై ఆలయ నాలుగు మాడ వీధుల్లో విహరించి భక్తులకు దర్శనమివ్వనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-18-tiruchanur-padma-tiruchi",
    templeId: "tiruchanur",
    title: "Sri Padmavathi Ammavaru Tiruchi Procession",
    titleTe: "శ్రీ పద్మావతి అమ్మవారి తిరుచ్చి ఉత్సవం",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    category: "vahana-seva",
    highlight: false,
    isMajor: false,
    location: "Four Mada Streets, Tiruchanur",
    time: "06:00 PM",
    startTime: '18:00:00',
    crowdLevel: "High",
    crowdBadge: "Friday Procession",
    vahanam: "Tiruchi",
    description:
      "Sri Padmavathi Ammavaru will bless devotees on a Tiruchi through the four Mada streets.",
    descriptionTe:
      "సెప్టెంబరు 18న శుక్రవారం సందర్భంగా శ్రీ పద్మావతి అమ్మవారు తిరుచ్చిపై ఆలయ నాలుగు మాడ వీధుల్లో విహరించి భక్తులకు దర్శనమివ్వనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-22-tiruchanur-gaja-vahanam",
    templeId: "tiruchanur",
    title: "Sri Padmavathi Ammavaru Gaja Vahanam",
    titleTe: "శ్రీ పద్మావతి అమ్మవారి గజవాహన సేవ",
    startDate: "2026-09-22",
    endDate: "2026-09-22",
    category: "vahana-seva",
    highlight: true,
    isMajor: true,
    location: "Four Mada Streets, Tiruchanur",
    time: "06:45 PM",
    startTime: '18:45:00',
    crowdLevel: "High",
    crowdBadge: "Uttarashada Nakshatram",
    vahanam: "Gaja Vahanam",
    description:
      "On Uttarashada Nakshatram, Sri Padmavathi Ammavaru will proceed on the Gaja Vahanam at 6:45 PM and bless devotees.",
    descriptionTe:
      "ఉత్తరాషాఢ నక్షత్రం సందర్భంగా సెప్టెంబరు 22న సాయంత్రం 6.45 గంటలకు శ్రీ పద్మావతి అమ్మవారు గజవాహనంపై విహరించి భక్తులను కటాక్షించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-25-tiruchanur-padma-tiruchi",
    templeId: "tiruchanur",
    title: "Sri Padmavathi Ammavaru Tiruchi Procession",
    titleTe: "శ్రీ పద్మావతి అమ్మవారి తిరుచ్చి ఉత్సవం",
    startDate: "2026-09-25",
    endDate: "2026-09-25",
    category: "vahana-seva",
    highlight: false,
    isMajor: false,
    location: "Four Mada Streets, Tiruchanur",
    time: "06:00 PM",
    startTime: '18:00:00',
    crowdLevel: "High",
    crowdBadge: "Friday Procession",
    vahanam: "Tiruchi",
    description:
      "Sri Padmavathi Ammavaru will bless devotees on a Tiruchi through the four Mada streets.",
    descriptionTe:
      "సెప్టెంబరు 25న శుక్రవారం సందర్భంగా శ్రీ పద్మావతి అమ్మవారు తిరుచ్చిపై ఆలయ నాలుగు మాడ వీధుల్లో విహరించి భక్తులకు దర్శనమివ్వనున్నారు.",
    imageUrl: "",
    images: []
  },

  // ============================================================
  // SRI PRASANNA VENKATESWARA SWAMY TEMPLE — APPALAYAGUNTA
  // ============================================================
  {
    id: "ttd-2026-09-01-appalayagunta-ashtadala",
    templeId: "appalayagunta",
    title: "Ashtadala Padapadmaradhana Seva",
    titleTe: "అష్టదళ పాదపద్మారాధన సేవ",
    startDate: "2026-09-01",
    endDate: "2026-09-01",
    category: "special-puja",
    highlight: true,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "08:00 AM",
    crowdLevel: "Normal",
    crowdBadge: "Special Seva",
    vahanam: "",
    description:
      "Ashtadala Padapadmaradhana Seva will be performed at 8:00 AM.",
    descriptionTe:
      "సెప్టెంబరు 1న ఉదయం 8 గంటలకు అప్పలాయగుంట శ్రీ ప్రసన్న వేంకటేశ్వరస్వామివారి ఆలయంలో అష్టదళ పాదపద్మారాధన సేవ నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-04-appalayagunta-friday-seva",
    templeId: "appalayagunta",
    title: "Friday Vastralankarana Seva & Abhishekam",
    titleTe: "శుక్రవారం వస్త్రాలంకరణ సేవ, అభిషేకం",
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "07:00 AM",
    crowdLevel: "Normal",
    crowdBadge: "Friday Abhishekam",
    vahanam: "",
    description:
      "Friday Vastralankarana Seva and Abhishekam will be performed at 7:00 AM.",
    descriptionTe:
      "సెప్టెంబరు 4న శుక్రవారం సందర్భంగా ఉదయం 7 గంటలకు వస్త్రాలంకరణ సేవ, అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-06-appalayagunta-anjaneya-abhishekam",
    templeId: "appalayagunta",
    title: "Sri Prasanna Anjaneya Swamy Abhishekam",
    titleTe: "శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం",
    startDate: "2026-09-06",
    endDate: "2026-09-06",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "08:15 AM",
    crowdLevel: "Normal",
    crowdBadge: "Sunday Abhishekam",
    vahanam: "",
    description:
      "Abhishekam to Sri Prasanna Anjaneya Swamy will be performed at 8:15 AM.",
    descriptionTe:
      "సెప్టెంబరు 6న ఉదయం 8.15 గంటలకు శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-09-appalayagunta-ashtottara",
    templeId: "appalayagunta",
    title: "Ashtottara Shata Kalasabhishekam",
    titleTe: "అష్టోత్తర శత కలశాభిషేకం",
    startDate: "2026-09-09",
    endDate: "2026-09-09",
    category: "special-puja",
    highlight: true,
    isMajor: true,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "08:00 AM",
    crowdLevel: "High",
    crowdBadge: "Kalasabhishekam",
    vahanam: "",
    description:
      "Ashtottara Shata Kalasabhishekam will be performed at 8:00 AM.",
    descriptionTe:
      "సెప్టెంబరు 9న ఉదయం 8 గంటలకు అప్పలాయగుంట శ్రీ ప్రసన్న వేంకటేశ్వరస్వామివారి ఆలయంలో అష్టోత్తర శత కలశాభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-11-appalayagunta-friday-seva",
    templeId: "appalayagunta",
    title: "Friday Vastralankarana Seva & Abhishekam",
    titleTe: "శుక్రవారం వస్త్రాలంకరణ సేవ, అభిషేకం",
    startDate: "2026-09-11",
    endDate: "2026-09-11",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "07:00 AM",
    crowdLevel: "Normal",
    crowdBadge: "Friday Abhishekam",
    vahanam: "",
    description:
      "Friday Vastralankarana Seva and Abhishekam will be performed at 7:00 AM.",
    descriptionTe:
      "సెప్టెంబరు 11న శుక్రవారం సందర్భంగా ఉదయం 7 గంటలకు వస్త్రాలంకరణ సేవ, అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-13-appalayagunta-anjaneya-abhishekam",
    templeId: "appalayagunta",
    title: "Sri Prasanna Anjaneya Swamy Abhishekam",
    titleTe: "శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం",
    startDate: "2026-09-13",
    endDate: "2026-09-13",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "08:15 AM",
    crowdLevel: "Normal",
    crowdBadge: "Sunday Abhishekam",
    vahanam: "",
    description:
      "Abhishekam to Sri Prasanna Anjaneya Swamy will be performed at 8:15 AM.",
    descriptionTe:
      "సెప్టెంబరు 13న ఉదయం 8.15 గంటలకు శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-18-appalayagunta-friday-seva",
    templeId: "appalayagunta",
    title: "Friday Vastralankarana Seva & Abhishekam",
    titleTe: "శుక్రవారం వస్త్రాలంకరణ సేవ, అభిషేకం",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "07:00 AM",
    crowdLevel: "Normal",
    crowdBadge: "Friday Abhishekam",
    vahanam: "",
    description:
      "Friday Vastralankarana Seva and Abhishekam will be performed at 7:00 AM.",
    descriptionTe:
      "సెప్టెంబరు 18న శుక్రవారం సందర్భంగా ఉదయం 7 గంటలకు వస్త్రాలంకరణ సేవ, అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-20-appalayagunta-anjaneya-abhishekam",
    templeId: "appalayagunta",
    title: "Sri Prasanna Anjaneya Swamy Abhishekam",
    titleTe: "శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం",
    startDate: "2026-09-20",
    endDate: "2026-09-20",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "08:15 AM",
    crowdLevel: "Normal",
    crowdBadge: "Sunday Abhishekam",
    vahanam: "",
    description:
      "Abhishekam to Sri Prasanna Anjaneya Swamy will be performed at 8:15 AM.",
    descriptionTe:
      "సెప్టెంబరు 20న ఉదయం 8.15 గంటలకు శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-23-appalayagunta-kalyanotsavam",
    templeId: "appalayagunta",
    title: "Sri Prasanna Venkateswara Swamy Kalyanotsavam",
    titleTe: "శ్రీ ప్రసన్న వేంకటేశ్వరస్వామివారి కల్యాణోత్సవం",
    startDate: "2026-09-23",
    endDate: "2026-09-23",
    category: "kalyanotsavam",
    highlight: true,
    isMajor: true,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "",
    crowdLevel: "High",
    crowdBadge: "Kalyanotsavam",
    vahanam: "",
    description:
      "The grand Kalyanotsavam of Sri Prasanna Venkateswara Swamy with Sridevi and Bhudevi will be conducted.",
    descriptionTe:
      "సెప్టెంబరు 23న శ్రీదేవి, భూదేవి సమేత శ్రీ ప్రసన్న వేంకటేశ్వరస్వామివారి కల్యాణోత్సవం వైభవంగా నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-25-appalayagunta-friday-seva",
    templeId: "appalayagunta",
    title: "Friday Vastralankarana Seva & Abhishekam",
    titleTe: "శుక్రవారం వస్త్రాలంకరణ సేవ, అభిషేకం",
    startDate: "2026-09-25",
    endDate: "2026-09-25",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "07:00 AM",
    crowdLevel: "Normal",
    crowdBadge: "Friday Abhishekam",
    vahanam: "",
    description:
      "Friday Vastralankarana Seva and Abhishekam will be performed at 7:00 AM.",
    descriptionTe:
      "సెప్టెంబరు 25న శుక్రవారం సందర్భంగా ఉదయం 7 గంటలకు వస్త్రాలంకరణ సేవ, అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  },
  {
    id: "ttd-2026-09-27-appalayagunta-anjaneya-abhishekam",
    templeId: "appalayagunta",
    title: "Sri Prasanna Anjaneya Swamy Abhishekam",
    titleTe: "శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం",
    startDate: "2026-09-27",
    endDate: "2026-09-27",
    category: "special-puja",
    highlight: false,
    isMajor: false,
    location: "Sri Prasanna Venkateswara Swamy Temple, Appalayagunta",
    time: "08:15 AM",
    crowdLevel: "Normal",
    crowdBadge: "Sunday Abhishekam",
    vahanam: "",
    description:
      "Abhishekam to Sri Prasanna Anjaneya Swamy will be performed at 8:15 AM.",
    descriptionTe:
      "సెప్టెంబరు 27న ఉదయం 8.15 గంటలకు శ్రీ ప్రసన్న ఆంజనేయస్వామివారికి అభిషేకం నిర్వహించనున్నారు.",
    imageUrl: "",
    images: []
  }
];

export const TEMPLE_EVENTS = SEPTEMBER_2026_EVENTS;

