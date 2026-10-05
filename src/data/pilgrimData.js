/**
 * Pilgrim Guide Data & TTD Directory
 * 
 * Includes:
 * 1. TTD Common Abbreviations & Facilities Directory (Decoded)
 * 2. Smart UPI Laddu KIOSK Machine Workflow Guide
 * 3. Srivari Kalyanamahaprasadam (Wedding Invitation Postal Service) Guide
 * 4. Brahmotsavam & Sanctum Sacred Etiquette (Agamic Code of Conduct)
 * 5. Comprehensive Pilgrim & Temple FAQs (Categorized & Searchable)
 * 
 * All factual content synthesized and rewritten from TTD Sapthagiri publications:
 * - "Know Tirumala Through Abbreviations" (Sapthagiri, October 2026)
 * - "KIOSK machines at Laddu Counters in Tirumala" (Sapthagiri, September 2026)
 * - "Lord Venkateswara Mahaprasadam - The Lord's Blessings at Your Door Step" (Sapthagiri, September 2026)
 * - "Tirumala Brahmotsavam: Divine Celebration and Pilgrim's Etiquette" by Dr. Raghavendra Siddharth (Sapthagiri, September 2025)
 * - "Flowers In Tirumala Temple Festivities" (Sapthagiri, September 2026)
 * - "Sri Varaha Swami Temple" & "Hundi (Koppera) at Tirumala" (Sapthagiri, September 2025 & October 2026)
 */

export const ABBREVIATION_CATEGORIES = [
  { id: 'all', labelEn: 'All Abbreviations', labelTe: 'అన్ని సంక్షిప్త రూపాలు', icon: '🏛️' },
  { id: 'queues_reception', labelEn: 'Queues & Reception', labelTe: 'క్యూ కాంప్లెక్స్‌లు & రిసెప్షన్', icon: '🚶' },
  { id: 'rest_houses', labelEn: 'Rest Houses', labelTe: 'విశ్రాంతి గృహాలు (Rest Houses)', icon: '🏨' },
  { id: 'cottages', labelEn: 'Cottages & Enclaves', labelTe: 'కాటేజీలు & నిలయాలు', icon: '🏡' }
];

export const TTD_ABBREVIATIONS = [
  // Queues & Reception
  {
    code: 'VQC',
    category: 'queues_reception',
    nameEn: 'Vaikuntam Queue Complex',
    nameTe: 'వైకుంఠం క్యూ కాంప్లెక్స్',
    descEn: 'The massive multi-compartment holding complex designed to safely regulate pilgrim flow for Sarva Darshan and special entry darshan lines into the sanctum.',
    descTe: 'సర్వదర్శనం మరియు ప్రత్యేక ప్రవేశ దర్శన భక్తులు స్వామివారి సన్నిధికి క్రమబద్ధంగా వెళ్లడానికి నిర్మించిన బృహత్తర కంపార్ట్మెంట్ల సముదాయం.'
  },
  {
    code: 'CRO',
    category: 'queues_reception',
    nameEn: 'Central Reception Office',
    nameTe: 'కేంద్ర రిసెప్షన్ కార్యాలయం (సెంట్రల్ రిసెప్షన్ ఆఫీస్)',
    descEn: 'The central administrative hub in Tirumala managing offline accommodation allotments, general enquiries, and pilgrim registration services.',
    descTe: 'తిరుమలలో ఆఫ్‌లైన్ వసతి గదుల కేటాయింపు, సమాచార విచారణలు మరియు యాత్రికుల సేవా నమోదులను పర్యవేక్షించే ప్రధాన కార్యాలయం.'
  },
  {
    code: 'PAC',
    category: 'queues_reception',
    nameEn: 'Pilgrims Amenities Complex',
    nameTe: 'యాత్రికుల వసతి సముదాయం (పిల్గ్రిమ్స్ అమెనిటీస్ కాంప్లెక్స్)',
    descEn: 'Free transit accommodation complexes in Tirumala and Tirupati equipped with lockers, restrooms, continuous hot water, and resting halls.',
    descTe: 'ఉచిత లాకర్లు, విశ్రాంతి మందిరాలు, తాగునీరు మరియు స్నానపు గదుల సదుపాయాలతో యాత్రికుల కోసం ఏర్పాటు చేసిన ఉచిత బస కేంద్రాలు.'
  },

  // Rest Houses
  {
    code: '1ST NC',
    category: 'rest_houses',
    nameEn: 'Sudarshan Rest House',
    nameTe: 'సుదర్శన్ రెస్ట్ హౌస్ (మొదటి నార్త్ కాంప్లెక్స్)',
    descEn: 'Located near the main temple periphery, providing convenient lodging for pilgrims.',
    descTe: 'శ్రీవారి ఆలయ పరిసరాలకు సమీపంలో ఉన్న ప్రముఖ యాత్రికుల విశ్రాంతి నిలయం.'
  },
  {
    code: '2ND NC',
    category: 'rest_houses',
    nameEn: 'Govardhan Rest House',
    nameTe: 'గోవర్ధన్ రెస్ట్ హౌస్ (రెండవ నార్త్ కాంప్లెక్స్)',
    descEn: 'A major accommodation block situated within easy walking distance to the Vaikuntam Queue entrances.',
    descTe: 'వైకుంఠం క్యూ కాంప్లెక్స్ ప్రవేశ మార్గాలకు సమీపంలో ఉన్న ప్రధాన వసతి భవనం.'
  },
  {
    code: '3RD NC',
    category: 'rest_houses',
    nameEn: 'Kalyan Rest House',
    nameTe: 'కల్యాణ్ రెస్ట్ హౌస్ (మూడవ నార్త్ కాంప్లెక్స్)',
    descEn: 'Spacious rest house providing affordable room allotments for visiting devotees.',
    descTe: 'యాత్రికులకు అందుబాటులో ఉండే విస్తారమైన విశ్రాంతి గదుల సముదాయం.'
  },
  {
    code: 'PJNMRH',
    category: 'rest_houses',
    nameEn: 'Panchajanyam Rest House',
    nameTe: 'పాంచజన్యం రెస్ట్ హౌస్',
    descEn: 'Named after Lord Vishnu\'s sacred conch (Panchajanya), located strategically near Tirumala ring road.',
    descTe: 'శ్రీమహావిష్ణువు దివ్య శంఖమైన పాంచజన్యం పేరిట నిర్మించిన అత్యాధునిక వసతి సముదాయం.'
  },
  {
    code: 'KTBRH',
    category: 'rest_houses',
    nameEn: 'Kousthubam Rest House',
    nameTe: 'కౌస్తుభం రెస్ట్ హౌస్',
    descEn: 'Named after the divine wish-fulfilling jewel Kousthubha adorning the Lord\'s chest.',
    descTe: 'స్వామివారి వక్షస్థలాన్ని అలంకరించే కౌస్తుభ దివ్యమణి నామధేయంతో నిర్మించిన వసతి నిలయం.'
  },
  {
    code: 'SGRH',
    category: 'rest_houses',
    nameEn: 'Sapthagiri Rest House',
    nameTe: 'సప్తగిరి రెస్ట్ హౌస్',
    descEn: 'One of the prominent and historically established accommodation blocks in Tirumala.',
    descTe: 'తిరుమలలోని ఏడు పవిత్ర కొండల గౌరవార్థం నామకరణం చేయబడిన సుప్రసిద్ధ విశ్రాంతి భవనం.'
  },
  {
    code: 'ATRH',
    category: 'rest_houses',
    nameEn: 'Alwar Tank Rest House',
    nameTe: 'ఆళ్వార్ ట్యాంక్ రెస్ట్ హౌస్',
    descEn: 'Situated in the scenic proximity of the sacred Alwar Theertham / Tank region in Tirumala.',
    descTe: 'తిరుమలలోని పవిత్ర ఆళ్వార్ పుష్కరిణి/ట్యాంక్ ప్రాంతానికి సమీపంలో గల వసతి నిలయం.'
  },
  {
    code: 'SVRH',
    category: 'rest_houses',
    nameEn: 'Sri Venkateswara Rest House',
    nameTe: 'శ్రీ వేంకటేశ్వర రెస్ట్ హౌస్',
    descEn: 'A central rest house complex hosting devotees participating in regular and special sevas.',
    descTe: 'శ్రీవారి దర్శనార్థం విచ్చేసే భక్తుల కోసం ఏర్పాటు చేయబడిన కేంద్ర వసతి గృహం.'
  },
  {
    code: 'NGRH',
    category: 'rest_houses',
    nameEn: 'Narayanagiri Rest Houses',
    nameTe: 'నారాయణగిరి రెస్ట్ హౌస్లు',
    descEn: 'Located along the foothills of the sacred Narayanagiri peak, known for its serene devotional ambience.',
    descTe: 'స్వామివారి దివ్య పాదాలు వెలసిన నారాయణగిరి శిఖర పరిసరాలలో నిర్మితమైన ప్రశాంత వసతి భవనాలు.'
  },
  {
    code: 'VSRH',
    category: 'rest_houses',
    nameEn: 'Varahaswamy Rest House',
    nameTe: 'వరాహస్వామి రెస్ట్ హౌస్',
    descEn: 'Positioned close to the ancient Sri Adi Bhu Varaha Swami temple near North Mada Street.',
    descTe: 'ఉత్తర మాడ వీధి సమీపంలోని ప్రాచీన శ్రీ ఆది వరాహస్వామి ఆలయానికి దగ్గరగా ఉన్న వసతి నిలయం.'
  },
  {
    code: 'RBRH',
    category: 'rest_houses',
    nameEn: 'Rambagicha Rest Houses',
    nameTe: 'రాంభగీచా రెస్ట్ హౌస్లు',
    descEn: 'Large multi-block guest house enclave located directly opposite the Central Reception Office (CRO).',
    descTe: 'కేంద్ర రిసెప్షన్ కార్యాలయం (CRO) కు ఎదురుగా ఉన్న బహుళ బ్లాకుల ప్రధాన వసతి సముదాయం.'
  },
  {
    code: 'SNRH',
    category: 'rest_houses',
    nameEn: 'Seshadri Nagar Rest House',
    nameTe: 'శేషాద్రినగర్ రెస్ట్ హౌస్',
    descEn: 'Peaceful accommodation zone named in honor of the Seshadri hill representing Adisesha.',
    descTe: 'ఆదిశేషుని స్వరూపమైన శేషాద్రి కొండ పేరిట వెలసిన ప్రశాంత విశ్రాంతి నిలయం.'
  },
  {
    code: 'SMRH',
    category: 'rest_houses',
    nameEn: 'Sanku Mitta Rest House',
    nameTe: 'శంకుమిట్ట రెస్ట్ హౌస్',
    descEn: 'Located near the historic Sanku Mitta elevated quarter in Tirumala.',
    descTe: 'తిరుమలలోని చారిత్రక శంకుమిట్ట ఎత్తైన ప్రాంతంలో నెలకొన్న వసతి భవనం.'
  },

  // Cottages & Enclaves
  {
    code: 'HVC',
    category: 'cottages',
    nameEn: 'Hill View Cottages',
    nameTe: 'హిల్ వ్యూ కాటేజీలు',
    descEn: 'Independent cottage units offering panoramic scenic views of the Seshachalam forest valleys.',
    descTe: 'శేషాచల శ్రేణుల ప్రకృతి సౌందర్యాన్ని వీక్షించేలా నిర్మించిన ప్రశాంత వ్యక్తిగత కాటేజీలు.'
  },
  {
    code: 'GNC',
    category: 'cottages',
    nameEn: 'Garudadri Nagar Cottages',
    nameTe: 'గరుడాద్రినగర్ కాటేజీలు',
    descEn: 'Expansive pilgrim cottage enclave located in the serene northern residential sector of Tirumala.',
    descTe: 'తిరుమల ఉత్తర నివాస ప్రాంతంలో ఉన్న అతిపెద్ద యాత్రికుల కాటేజీల సముదాయం.'
  },
  {
    code: 'ANC',
    category: 'cottages',
    nameEn: 'Anjanadri Nagar Cottages',
    nameTe: 'అంజనాద్రినగర్ కాటేజీలు',
    descEn: 'Named after Anjanadri hill, birthplace of Lord Hanuman, offering family cottage suites.',
    descTe: 'హనుమంతుని జన్మస్థలమైన అంజనాద్రి కొండ పేరిట కుటుంబ యాత్రికుల కోసం నిర్మించిన కాటేజీలు.'
  },
  {
    code: 'SNC',
    category: 'cottages',
    nameEn: 'Seshadri Nagar Cottages',
    nameTe: 'శేషాద్రినగర్ కాటేజీలు',
    descEn: 'Cottages nestled near the inner ring roads providing quiet family boarding.',
    descTe: 'రింగ్ రోడ్డు సమీపంలో కుటుంబ సమేతంగా విడిది చేయడానికి అనువైన కాటేజీలు.'
  },
  {
    code: 'SMC',
    category: 'cottages',
    nameEn: 'Sanku Mitta Cottages',
    nameTe: 'శంకుమిట్ట కాటేజీలు',
    descEn: 'Traditional cottage rows perched on the elevated ridge overlooking the sacred township.',
    descTe: 'తిరుమల పట్టణాన్ని వీక్షించే ఎత్తైన శంకుమిట్ట గట్టుపై నిర్మించిన సాంప్రదాయ కాటేజీలు.'
  },
  {
    code: 'ATC',
    category: 'cottages',
    nameEn: 'Alwar Tank Cottages',
    nameTe: 'ఆళ్వార్ ట్యాంక్ కాటేజీలు',
    descEn: 'Popular cottages situated along the peaceful Alwar Tank approach road.',
    descTe: 'ఆళ్వార్ చెరువు సమీపంలో భక్తులకు అనుకూలంగా ఉండే ప్రముఖ కాటేజీలు.'
  },
  {
    code: 'TBC',
    category: 'cottages',
    nameEn: 'Travellers Bungalow Cottages',
    nameTe: 'ట్రావెలర్స్ బంగ్లా కాటేజీలు (TB కాటేజీలు)',
    descEn: 'Heritage bungalows established during earlier administrative eras, now modernized for pilgrims.',
    descTe: 'పూర్వకాలం నుండి యాత్రికుల సేవలో ఉన్న చారిత్రక సౌకర్యవంతమైన బంగ్లా కాటేజీలు.'
  },
  {
    code: 'MBC',
    category: 'cottages',
    nameEn: 'Mangalam Bavi Cottages',
    nameTe: 'మంగళం బావి కాటేజీలు',
    descEn: 'Cottage enclave built adjacent to the sacred historical water spring known as Mangalam Bavi.',
    descTe: 'చారిత్రక మంగళం బావి తీర్థం చెంత నిర్మించబడిన ప్రశాంత యాత్రికుల కాటేజీల నిలయం.'
  },
  {
    code: 'SPTC',
    category: 'cottages',
    nameEn: 'Soorapuram Thota Cottages',
    nameTe: 'సూరపురం తోట కాటేజీలు',
    descEn: 'Greenery-surrounded cottage accommodations situated near the Paruveta Mandapam / garden belt.',
    descTe: 'పచ్చని ఉద్యానవనాలు మరియు పారువేట మండపం సమీపంలో నిర్మించిన ఆహ్లాదకరమైన కాటేజీలు.'
  }
];

export const LADDU_KIOSK_GUIDE = {
  titleEn: 'Automated UPI KIOSK Machines at Tirumala Laddu Counters',
  titleTe: 'తిరుమల లడ్డూ కౌంటర్ల వద్ద స్వయంచాలక UPI కియోస్క్ యంత్రాల మార్గదర్శిని',
  subtitleEn: 'Swift, cashless, and self-service purchase of additional Srivari Laddus without waiting in queue',
  subtitleTe: 'క్యూలో వేచి ఉండాల్సిన పనిలేకుండా నేరుగా UPI ద్వారా అదనపు లడ్డూలను పొందే డిజిటల్ విధానం',
  overviewEn: 'To minimize pilgrim wait times and eliminate cash handling friction, TTD has deployed modern touch-screen KIOSK terminals directly in front of the Laddu Distribution Complex. Devotees can purchase up to 2 extra laddus per person seamlessly via any UPI app.',
  overviewTe: 'లడ్డూ కౌంటర్ల వద్ద రద్దీని తగ్గించడానికి మరియు భక్తుల సమయాన్ని ఆదా చేయడానికి TTD అత్యాధునిక టచ్‌స్క్రీన్ కియోస్క్ యంత్రాలను ప్రవేశపెట్టింది. భక్తులు ఏ విధమైన నగదు అవసరం లేకుండా నేరుగా UPI ద్వారా ఒక్కొక్కరికి గరిష్టంగా 2 అదనపు లడ్డూలను త్వరితగతిన పొందవచ్చు.',
  quotaRules: [
    {
      titleEn: 'With Valid Darshan Ticket',
      titleTe: 'చెల్లుబాటు అయ్యే దర్శన టికెట్ ఉన్నవారికి',
      descEn: 'Scan your barcode or enter your Darshan Ticket registration number. The system verifies your booking and permits purchase of up to 2 additional laddus per individual listed on that ticket.',
      descTe: 'మీ దర్శన టికెట్ బార్‌కోడ్ స్కాన్ చేయండి లేదా నంబర్ నమోదు చేయండి. టికెట్‌లో నమోదైన వ్యక్తుల సంఖ్య ఆధారంగా ఒక్కొక్కరికి 2 అదనపు లడ్డూల వరకు అనుమతి లభిస్తుంది.'
    },
    {
      titleEn: 'Without Darshan Ticket (Aadhaar Mode)',
      titleTe: 'దర్శన టికెట్ లేని యాత్రికులకు (ఆధార్ విధానం)',
      descEn: 'Even if you do not hold an advance darshan ticket, you can purchase up to 2 additional laddus by authenticating with a valid 12-digit Aadhaar card number.',
      descTe: 'అడ్వాన్స్ దర్శన టికెట్ లేకపోయినా, మీ 12 అంకెల ఆధార్ నంబర్‌ను కియోస్క్‌లో నమోదు చేసి గరిష్టంగా 2 అదనపు లడ్డూలను కొనుగోలు చేయవచ్చు.'
    }
  ],
  steps: [
    {
      step: 1,
      titleEn: 'Approach Terminal',
      titleTe: 'కియోస్క్ యంత్రాన్ని సమీపించండి',
      descEn: 'Locate an available touch-screen KIOSK machine installed near the main Laddu Distribution Complex gates.',
      descTe: 'లడ్డూ పంపిణీ సముదాయం వద్ద అందుబాటులో ఉన్న టచ్‌స్క్రీన్ కియోస్క్ మెషీన్ వద్దకు వెళ్లండి.'
    },
    {
      step: 2,
      titleEn: 'Select Ticket or Aadhaar Mode',
      titleTe: 'దర్శన టికెట్ లేదా ఆధార్ ఎంపిక చేసుకోండి',
      descEn: 'Choose "With Darshan Ticket" if you hold a valid physical or digital darshan pass, or "Without Darshan Ticket" to authenticate via Aadhaar.',
      descTe: 'మీ వద్ద దర్శన టికెట్ ఉంటే మొదటి ఎంపికను, లేకుంటే "దర్శన టికెట్ లేకుండా" ఎంపికపై నొక్కి ఆధార్ వివరాలు నమోదు చేయండి.'
    },
    {
      step: 3,
      titleEn: 'Choose Laddu Quantity',
      titleTe: 'లడ్డూల సంఖ్యను నమోదు చేయండి',
      descEn: 'Select the desired number of additional laddus (strictly subject to the 2 laddus per verified person quota limit).',
      descTe: 'మీ కోటా పరిమితి ప్రకారం (గరిష్టంగా 2 లడ్డూలు) కావలసిన లడ్డూల సంఖ్యను స్క్రీన్‌పై ఎంచుకోండి.'
    },
    {
      step: 4,
      titleEn: 'Scan Dynamic UPI QR Code',
      titleTe: 'UPI QR కోడ్ స్కాన్ చేసి చెల్లించండి',
      descEn: 'The screen generates a dynamic payment QR code. Open any mobile payment app (PhonePe, Google Pay, Paytm, BHIM) and complete the transaction.',
      descTe: 'స్క్రీన్‌పై కనిపించే డైనమిక్ క్యూఆర్ కోడ్‌ను మీ మొబైల్ బ్యాంకింగ్ లేదా UPI యాప్ ద్వారా స్కాన్ చేసి క్షణాల్లో చెల్లింపు పూర్తి చేయండి.'
    },
    {
      step: 5,
      titleEn: 'Collect Printed Voucher & Claim Laddus',
      titleTe: 'రశీదు తీసుకుని లడ్డూలు అందుకోండి',
      descEn: 'Take the automated printed transaction voucher from the dispenser slot and present it at the designated express laddu counter to receive your consecrated laddus.',
      descTe: 'యంత్రం నుండి ముద్రించబడిన రశీదును తీసుకుని, సమీపంలోని లడ్డూ కౌంటర్‌లో సమర్పించి వేడి వేడి శ్రీవారి లడ్డూలను స్వీకరించండి.'
    }
  ]
};

export const KALYANAMAHAPRASADAM_GUIDE = {
  titleEn: "Lord Venkateswara's Divine Blessings at Your Doorstep (Kalyanamahaprasadam)",
  titleTe: 'నవదంపతులకు ఇంటి వద్దకే శ్రీవారి దివ్య ఆశీస్సులు (కల్యాణ మహాప్రసాదం)',
  subtitleEn: 'Postal Marriage Gift & Sanctified Blessings Kit for Newly Married Couples',
  subtitleTe: 'వివాహం నిశ్చయమైన వధూవరులకు తిరుమల తిరుపతి దేవస్థానం పంపే పవిత్ర ప్రసాద కానుక',
  overviewEn: 'TTD extends the divine grace of Lord Venkateswara and Goddess Padmavathi Devi to newlywed couples. By sending your wedding invitation card to the Executive Officer at least 30 days prior to the wedding, TTD dispatches a sanctified marriage blessings package directly to your postal residence free of cost.',
  overviewTe: 'సనాతన ధర్మంలో వివాహ బంధాన్ని పవిత్రంగా ఆశీర్వదించడానికి TTD ఈ విశిష్ట సేవను అందిస్తోంది. మీ వివాహ ఆహ్వాన పత్రికను (Wedding Card) వివాహ తేదీకి కనీసం ఒక నెల ముందుగా TTD ఈవో గారికి పంపితే, శ్రీవారి పవిత్ర కల్యాణ ప్రసాదాల కానుక మీ ఇంటి చిరునామాకు తపాలా ద్వారా చేరుతుంది.',
  dispatchWindowEn: 'Send card at least 1 month (30 days) in advance of the wedding date with your complete return postal address and pin code.',
  dispatchWindowTe: 'పూర్తి పోస్టల్ చిరునామా మరియు పిన్ కోడ్‌తో వివాహానికి కనీసం 30 రోజుల ముందుగా ఆహ్వాన పత్రికను పంపాలి.',
  officialAddress: {
    designation: 'The Executive Officer',
    organization: 'Tirumala Tirupati Devasthanams (TTD)',
    building: 'TTD Administrative Building',
    street: 'K.T. Road',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    pinCode: '517 501',
    country: 'India'
  },
  kitContents: [
    {
      itemEn: 'Akshintalu (Talambralu)',
      itemTe: 'దివ్య అక్షింతలు (తలంబ్రాలు)',
      descEn: 'Sacred consecrated rice pearls blessed in the sanctum during Srivari Nitya Kalyana Utsavam.',
      descTe: 'శ్రీవారి నిత్య కల్యాణోత్సవంలో పూజించబడిన పవిత్ర మంత్రాలయ అక్షింతలు.'
    },
    {
      itemEn: 'Consecrated Kumkuma',
      itemTe: 'పవిత్ర కుంకుమ',
      descEn: 'Sanctified saffron vermilion energized through divine archana to Goddess Padmavathi and Lakshmi.',
      descTe: 'అమ్మవార్ల పూజలో సమర్పించబడిన సర్వమంగళ ప్రదాత దివ్య కుంకుమ.'
    },
    {
      itemEn: 'Kankanam (Wedding Wristbands)',
      itemTe: 'రక్షా కంకణాలు',
      descEn: 'Consecrated sacred wedding wristbands for both the bride and the bridegroom symbolizing divine protection and harmony.',
      descTe: 'వధూవరుల ఇరువురికీ సకల శుభాలను, దాంపత్య రక్షణను ప్రసాదించే పవిత్ర రక్షా బంధనాలు.'
    },
    {
      itemEn: 'Sanctified Prasadam',
      itemTe: 'శ్రీవారి పవిత్ర ప్రసాదం',
      descEn: 'Direct sacred prasadam offered at the holy feet of Lord Srinivasa.',
      descTe: 'శ్రీవారి మూలవిరాట్ సన్నిధిలో నివేదించబడిన పవిత్ర మహాప్రసాదం.'
    },
    {
      itemEn: 'Special Kalyana Grantha (Book)',
      itemTe: 'విశిష్ట కల్యాణ గ్రంథం',
      descEn: 'An inspiring devotional booklet illustrating the sacred spiritual vows, dharma, and significance of Vedic marriage.',
      descTe: 'గృహస్థాశ్రమ విశిష్టతను, సనాతన వివాహ ధర్మాలను వివరించే మార్గదర్శక ఆధ్యాత్మిక పుస్తకం.'
    }
  ]
};

export const PILGRIM_ETIQUETTE_RULES = [
  {
    titleEn: 'The Strict Sacred Rule: Never Wear Flowers in Tirumala',
    titleTe: 'పరమ పవిత్ర నియమం: తిరుమలలో భక్తులు పూలు ధరించకూడదు',
    descEn: 'Tirumala is revered as the Pushpa Mandapam (the Pavilion of Flowers). Every single flower and blossom on the sacred hill belongs exclusively to Lord Venkateswara. Devotees—regardless of tradition—must refrain from wearing flowers in their hair or clothes while atop Tirumala.',
    descTe: 'తిరుమల క్షేత్రం "పుష్ప మండపం"గా ప్రసిద్ధి చెందింది. ఈ పవిత్ర గిరిపై విరిసే ప్రతి పువ్వు మరియు పరిమళం కేవలం శ్రీవేంకటేశ్వర స్వామివారి దివ్య కైంకర్యానికి మాత్రమే చెందుతుంది. కావున తిరుమలలో ఉన్నంత కాలం స్త్రీలు గానీ భక్తులు గానీ తమ తలలో పువ్వులు ధరించరాదు.'
  },
  {
    titleEn: 'Agamic Modesty & Traditional Attire',
    titleTe: 'సాంప్రదాయ వస్త్రధారణ',
    descEn: 'In accordance with the Bhrigu Samhita and temple regulations, pilgrims must wear neat, modest traditional garments covering shoulders and knees (Dhoti/Kurta or Pyjama with Uttariyam for men; Saree, Half-saree, or Chudidar with Dupatta for women).',
    descTe: 'భృగు సంహిత మరియు ఆలయ నిబంధనల ప్రకారం భక్తులు హుందాతనంతో కూడిన సంప్రదాయ వస్త్రాలను ధరించాలి (పురుషులు: ధోవతి, కుర్తా లేదా పైజామా; స్త్రీలు: చీర, లంగా ఓణీ లేదా దుపట్టాతో కూడిన చుడీదార్).'
  },
  {
    titleEn: 'Quietude & Mindful Silence',
    titleTe: 'ప్రశాంతత & మౌన ధ్యానం',
    descEn: 'The sanctum precincts carry profound cosmic vibrations. Avoid loud talking, mobile phone ringing, argument, or boisterous laughter. Maintain internal remembrance of the divine Govinda Namam.',
    descTe: 'ఆలయ ప్రాకారాలలో దైవిక స్పందనలు నిండి ఉంటాయి. కేకలు, సెల్‌ఫోన్ శబ్దాలు, అనవసర సంభాషణలు మాని మనస్సులో "గోవింద" నామస్మరణను నిరంతరం కొనసాగించాలి.'
  },
  {
    titleEn: 'Circumambulation (Clockwise Pradakshinam)',
    titleTe: 'ప్రదక్షిణ నియమాలు',
    descEn: 'Circumambulate shrines, mandapams, and the outer Mada streets strictly in a mindful, clockwise direction, embodying complete self-surrender without jostling fellow devotees.',
    descTe: 'ఆలయ మండపాలు మరియు మాడ వీధులలో ఎల్లప్పుడూ సవ్యదిశలోనే (Clockwise) ప్రశాంతంగా, ఇతరులను నెట్టివేయకుండా భక్తితో ప్రదక్షిణ చేయాలి.'
  },
  {
    titleEn: 'Strict Photography & Recording Restrictions',
    titleTe: 'ఫోటోగ్రఫీ మరియు వీడియో నిషేధం',
    descEn: 'Photography, videography, and unauthorized filming inside the temple complex, sanctum entrances, and during ritual processions are strictly prohibited to safeguard ancient sanctity.',
    descTe: 'ఆలయ పవిత్రతను కాపాడటానికి గర్భాలయ ద్వారాల వద్ద, క్యూ కాంప్లెక్స్‌లలో మరియు పూజా క్రతువుల సమయంలో కెమెరాలు, సెల్‌ఫోన్ రికార్డింగ్‌లు పూర్తిగా నిషేధించబడ్డాయి.'
  },
  {
    titleEn: 'Cleanliness: Holy Surroundings Reflect Clean Mind',
    titleTe: 'పరిసరాల పరిశుభ్రత',
    descEn: 'Dispose of garbage only in designated trash bins. Avoid single-use plastics and maintain the natural ecological sanctity of the sacred Seshachalam biosphere.',
    descTe: 'చెత్తను కేవలం నిర్దేశిత డస్ట్‌బిన్లలో మాత్రమే వేయాలి. ప్లాస్టిక్ వాడకాన్ని పూర్తిగా వర్జించి పవిత్ర శేషాచల అటవీ వాతావరణాన్ని పరిశుభ్రంగా ఉంచాలి.'
  }
];

export const PILGRIM_FAQS = [
  {
    id: 'faq-flowers-rule',
    category: 'rules',
    questionEn: 'Why are pilgrims not allowed to wear flowers in their hair at Tirumala?',
    questionTe: 'తిరుమలలో భక్తులు తలలో పూలు ఎందుకు ధరించకూడదు?',
    answerEn: 'According to centuries-old Sri Vaishnava tradition and the Venkatachala Mahatmyam, Tirumala is glorified as the "Pushpa Mandapam" (Pavilion of Flowers). Every flower blooming across the sacred hills is deemed the sovereign property of Lord Venkateswara. All blossoms are consecrated inside the temple\'s "Pula Ara" (flower vault) for decorating the Mula Virat\'s divine jewels, weapons, and chest consorts. To wear flowers meant for the Divine on one\'s own body is considered an infringement of reverence; hence, devotees abstain from wearing flowers anywhere atop Tirumala.',
    answerTe: 'శ్రీవైష్ణవ సంప్రదాయం ప్రకారం తిరుమల క్షేత్రాన్ని "పుష్ప మండపం"గా కీర్తిస్తారు. ఈ పవిత్ర కొండపై పూసే ప్రతి పువ్వు శ్రీవేంకటేశ్వర స్వామివారి దివ్య కైంకర్యానికి మాత్రమే సొంతం. ఆ పువ్వులను ఆలయంలోని "పూల అర"లో భద్రపరచి స్వామివారి ఆభరణాలు, ఆయుధాలు మరియు వక్షస్థల లక్ష్మీదేవికి సమర్పిస్తారు. పరమాత్ముని పూజకు ఉద్దేశించిన పుష్పాలను మానవులు తమ అలంకరణ కోసం ధరించకూడదనే పరమ భక్తి నియమంతో భక్తులు తిరుమలలో పూలు పెట్టుకోరు.',
    source: 'Sapthagiri Magazine (September 2026), "Flowers in Tirumala Temple Festivities"'
  },
  {
    id: 'faq-varaha-swami-first',
    category: 'rituals',
    questionEn: 'Why should pilgrims visit Sri Bhu Varaha Swami Temple before taking darshan of Lord Venkateswara?',
    questionTe: 'శ్రీవేంకటేశ్వర స్వామి దర్శనానికి ముందే శ్రీ ఆది వరాహస్వామిని ఎందుకు దర్శించుకోవాలి?',
    answerEn: 'Scriptures record that when Lord Vishnu descended to Earth as Srinivasa, the entire Seshachalam hill was the sovereign hermitage of Sri Adi Varaha Swamy (who had earlier rescued Bhudevi from the demon Hiranyaksha). Lord Srinivasa graciously requested Lord Varaha for land to reside upon. Sri Varaha Swamy granted the sacred site with the covenant that pilgrims must first pay homage, offer worship, and receive the grace of Varaha Swamy before approaching the Ananda Nilayam sanctum. This foundational protocol ensures that the devotee\'s pilgrimage is spiritually complete and fruitful.',
    answerTe: 'పురాణ కథనం ప్రకారం శ్రీనివాసుడు భూలోకానికి విచ్చేసినప్పుడు శేషాచల పర్వతం శ్రీ ఆది వరాహస్వామివారి నివాసస్థానంగా ఉండేది. స్వామివారు ఇక్కడ కొలువుదీరడానికి వరాహస్వామి అనుమతిని, భూమిని పొందారు. ఆ దివ్య ఒడంబడిక ప్రకారం తిరుమలకు వచ్చే భక్తులు తొలుత స్వామి పుష్కరిణి ఒడ్డున ఉన్న శ్రీ భూవరాహస్వామిని దర్శించి, ఆ తరువాతే శ్రీవేంకటేశ్వర స్వామిని దర్శించుకోవాలని ఆగమ విధి నిర్దేశిస్తుంది.',
    source: 'Sapthagiri Magazine (September 2025), "Sri Varaha Swami Temple" & Venkatachala Mahatmyam'
  },
  {
    id: 'faq-hundi-koppera',
    category: 'traditions',
    questionEn: 'Why is the temple hundi referred to as "Koppera", and why do devotees offer wealth into it?',
    questionTe: 'తిరుమల హుండీని "కొప్పెర" అని ఎందుకు అంటారు? అందులో కానుకలు ఎందుకు సమర్పిస్తారు?',
    answerEn: 'The sacred hundi at Tirumala is situated in the Tirumamani Mandapam opposite the historic Sankeertana Bhandagaram (Annamayya Ara). It comprises a large 3-foot by 2-foot brass cauldron (known locally as a "Koppera") veiled beneath a 9-foot tapering white fabric canopy tied to the ceiling with four drop-openings. According to revered tradition, Lord Venkateswara borrowed a cosmic wealth loan from Kubera to conduct His celestial wedding with Goddess Padmavathi. Devotees drop coins, gold, and offerings into the Koppera as an act of heartfelt love, symbolically participating in helping the Lord repay this sacred debt through the Kali Yuga.',
    answerTe: 'శ్రీవారి ఆలయంలోని తిరుమామణి మండపంలో అన్నమయ్య అర ఎదురుగా ఉన్న హుండీ 3 అడుగుల పొడవు, 2 అడుగుల వెడల్పు గల భారీ ఇత్తడి పాత్ర (కొప్పెర). దీనిని పైకప్పు వరకు 9 అడుగుల తెల్లటి వస్త్రంతో కప్పి నాలుగు వైపులా కానుకలు వేయడానికి ద్వారాలు ఏర్పాటు చేస్తారు. పద్మావతీ శ్రీనివాసుల దివ్య కల్యాణం కోసం కుబేరుని వద్ద తీసుకున్న రుణాన్ని తీర్చడంలో భక్తులు భాగస్వామ్యులవుతూ తమ భక్తి ప్రపత్తులతో కానుకలను ఈ కొప్పెరలో సమర్పిస్తారు.',
    source: 'Sapthagiri Magazine (October 2026), "Hundi (Koppera) at Tirumala"'
  },
  {
    id: 'faq-sannidhi-golla',
    category: 'traditions',
    questionEn: 'Who is the Sannidhi Golla, and why do they enter the sanctum before Suprabhatam begins?',
    questionTe: 'సన్నిధి గొల్ల ఎవరు? సుప్రభాతానికి ముందే గర్భాలయంలోకి వారు ఎందుకు ప్రవేశిస్తారు?',
    answerEn: 'When Lord Srinivasa first manifested on the southern banks of Swami Pushkarini, a humble Yadava cowherd was the very first mortal soul to behold and offer hospitality to the Lord. Deeply touched by his pure devotion, the Lord granted his lineage the eternal privilege of the first daily darshan until the end of Kali Yuga. Every morning at 2:30 AM (Brahma Muhurta), the Sannidhi Golla awakens the Archakas, leads them with a flaming torch proclaiming "The path to the servants of Sri Swamy!", inspects the seals on the Bangaru Vakili locks, and enters the sanctum first before Suprabhatam to illuminate the sacred path.',
    answerTe: 'స్వామివారు తొలుత పుష్కరిణి ఒడ్డున వెలసినప్పుడు ఒక యాదవ భక్తుడు స్వామిని మొదటగా దర్శించి ఆతిథ్యమిచ్చాడు. ఆ నిష్కల్మష భక్తికి మెచ్చిన స్వామి తన వంశీయులకే ప్రతిరోజూ ప్రథమ దర్శన భాగ్యం లభిస్తుందని వరమిచ్చారు. ఆ సాంప్రదాయం ప్రకారం ప్రతిరోజూ బ్రహ్మముహూర్తంలో (తెల్లవారుజామున 2:30 గంటలకు) దివిటీ పట్టుకుని అర్చకులను ఆలయానికి తోడ్కొని వచ్చి, బంగారు వాకిలి తాళాలను పరిశీలించి, సుప్రభాతానికి ముందే గర్భాలయంలోకి ప్రవేశించే అపురూప గౌరవం సన్నిధి గొల్లదే.',
    source: 'Sapthagiri Magazine (September 2025), "The Sacred First Glimpse in Tirumala" by Smt. Akhila Madhu'
  },
  {
    id: 'faq-laddu-kiosk',
    category: 'amenities',
    questionEn: 'How do the UPI KIOSK machines work for purchasing additional Tirumala Laddus?',
    questionTe: 'అదనపు లడ్డూలను కొనుగోలు చేయడానికి UPI కియోస్క్ యంత్రాలను ఎలా ఉపయోగించాలి?',
    answerEn: 'TTD has installed digital touch-screen KIOSK machines outside the Laddu Distribution Complex. Pilgrims choose between two modes: "With Valid Darshan Ticket" (permits up to 2 extra laddus per pilgrim listed on the pass) or "Without Darshan Ticket" (permits up to 2 extra laddus per validated Aadhaar card). After choosing the quantity, scan the generated UPI QR code using any banking app, print your receipt voucher, and instantly claim your laddus at the counter.',
    answerTe: 'లడ్డూ కాంప్లెక్స్ వద్ద గల టచ్‌స్క్రీన్ కియోస్క్ మెషీన్లలో "దర్శన టికెట్ ఉన్నవారు" లేదా "ఆధార్ నంబర్ ఉన్నవారు" అనే ఆప్షన్ ఎంచుకోవాలి. దర్శన టికెట్ ద్వారా లేదా ఆధార్ ద్వారా ఒక్కొక్కరికి గరిష్టంగా 2 అదనపు లడ్డూల వరకు ఎంపిక చేసుకోవచ్చు. స్క్రీన్‌పై వచ్చే UPI QR కోడ్‌ను ఫోన్‌పే, గూగుల్‌పే ద్వారా స్కాన్ చేసి నగదు చెల్లించిన వెంటనే రశీదు వస్తుంది. దానిని కౌంటర్‌లో ఇచ్చి లడ్డూలు తీసుకోవచ్చు.',
    source: 'Sapthagiri Magazine (September 2026), "KIOSK machines at Laddu Counters in Tirumala"'
  },
  {
    id: 'faq-wedding-card-blessing',
    category: 'amenities',
    questionEn: 'How can newly married couples receive Lord Venkateswara\'s wedding blessings by post?',
    questionTe: 'కొత్తగా పెళ్లయిన దంపతులు శ్రీవారి కల్యాణ ప్రసాదాన్ని తపాలా ద్వారా ఎలా పొందవచ్చు?',
    answerEn: 'Families can send their formal printed wedding invitation card at least 30 days before the wedding date addressed to: The Executive Officer, TTD Administrative Building, K.T. Road, Tirupati - 517501, Andhra Pradesh. Include the full return postal address and mobile number. TTD dispatches a sanctified marriage blessings kit containing Akshintalu (Talambralu), Kumkuma, Kankanam (wedding wristbands), Srivari Prasadam, and a spiritual Kalyana book directly to your home.',
    answerTe: 'వివాహ తేదీకి కనీసం ఒక నెల ముందుగా మీ పెళ్లి పత్రికను "కార్యనిర్వహణాధికారి (Executive Officer), TTD పరిపాలనా భవనం, K.T. రోడ్డు, తిరుపతి - 517 501, ఆంధ్రప్రదేశ్" అను చిరునామాకు పూర్తి తిరుగు చిరునామాతో పంపాలి. TTD వారు స్వామివారి దివ్య అక్షింతలు, కుంకుమ, రక్షా కంకణాలు, పవిత్ర ప్రసాదం మరియు కల్యాణ గ్రంథాన్ని ఉచితంగా మీ ఇంటికి తపాలా ద్వారా పంపుతారు.',
    source: 'Sapthagiri Magazine (September 2026), "Lord Venkateswara Mahaprasadam - The Lord\'s Blessings at Your Door Step"'
  },
  {
    id: 'faq-seven-thresholds',
    category: 'rituals',
    questionEn: 'What are the seven sacred doorways and thresholds leading into the sanctum sanctorum?',
    questionTe: 'గర్భాలయానికి దారితీసే ఏడు పవిత్ర ప్రవేశ ద్వారాలు మరియు గడపలు ఏవి?',
    answerEn: 'Devotees step through seven profound thresholds on their journey to the Mula Virat: 1. Maha Dwaram (Padikavali / Simhadwaram - the grand outer gopuram), 2. Vendi Vakili (Nadimi Padi Kavali - the silver-plated entrance), 3. Bangaru Vakili (the golden portal opening into Tirumamani Mandapam), 4. Snapana Mantapa Door (entrance to the sacred abhishekam hall), 5. Ramulavarimeda Door (chamber dedicated to Sri Rama), 6. Sayana Mantapa Door (the chamber of Ekanta Seva rest), and 7. Kulasekhara Padi (the innermost granite threshold right before the Mula Virat which mortal beings do not cross).',
    answerTe: 'స్వామివారి మూలవిరాట్ సన్నిధికి చేరుకోవడానికి ఏడు దివ్య ద్వారాలు ఉన్నాయి: 1. మహా ద్వారం (పడికావలి - బాహ్య రాజగోపురం), 2. వెండి వాకిలి (నడిమి పడి కావలి), 3. బంగారు వాకిలి (తిరుమామణి మండప ద్వారం), 4. స్నపన మండప ద్వారం, 5. రాములవారిమేడ ద్వారం, 6. శయన మండప ద్వారం, మరియు 7. కులశేఖర పడి (గర్భాలయం ముందున్న పవిత్ర గడప; దీనిని ఎవరూ దాటకూడదు).',
    source: 'Sapthagiri Magazine (September 2026), "Architectural Thresholds of the Sanctum"'
  },
  {
    id: 'faq-eight-garlands',
    category: 'traditions',
    questionEn: 'What are the specific flower garlands crafted daily for Lord Venkateswara?',
    questionTe: 'శ్రీవారికి ప్రతిరోజూ అలంకరించే ఎనిమిది విశిష్ట పూలమాలలు ఏవి?',
    answerEn: 'Tirumala follows a rigorous Agamic metric for the Mula Virat\'s floral vestments: 1. Shikhamani (an 8-foot majestic garland draped from crown to shoulders), 2. Saligrama Malas (two 4-foot garlands framing the Saligrama Haram), 3. Kanthasari (two 3.5-foot neck collars), 4. Vakshasthala Lakshmi Malas (two 1.5-foot garlands adorning the chest consorts), 5. Shanku & Chakra Malas (1-foot garlands for the divine Conch and Discus), 6. Khatari Saram (a 2-foot garland decorating sword Nandakam), 7. Tavalams (three cascading garlands sweeping from elbows and waist down to the holy feet), and 8. Tiruvadi Malas (exclusive garlands for the sacred lotus feet).',
    answerTe: 'శ్రీవారి మూలవిరాట్‌కు సమర్పించే పుష్పమాలలు నిర్దిష్ట కొలతలతో తయారవుతాయి: 1. శిఖామణి (కిరీటం నుండి భుజాల మీదుగా జారే 8 అడుగుల భారీ మాల), 2. సాలిగ్రామ మాలలు (4 అడుగులవి రెండు), 3. కంఠసరి (మెడను అలంకరించే 3.5 అడుగులవి రెండు), 4. వక్షస్థల లక్ష్మి మాలలు (1.5 అడుగులవి రెండు), 5. శంఖ-చక్ర మాలలు (ఒక్కొక్క అడుగు), 6. ఖటారి సరం (నందకం ఖడ్గానికి 2 అడుగుల మాల), 7. తవళాలు (మోచేతులు, నడుము నుండి పాదాల వరకు జారే 3 మాలలు), మరియు 8. తిరువడి మాలలు (స్వామివారి పవిత్ర శ్రీచరణాలకు సమర్పించే ప్రత్యేక మాలలు).',
    source: 'Sapthagiri Magazine (September 2026), "Flowers in Tirumala Temple Festivities"'
  },
  {
    id: 'faq-kainkaryaparas-three',
    category: 'rituals',
    questionEn: 'Who are the Three Important Functionaries (Kainkaryaparas) of Tirumala Temple?',
    questionTe: 'తిరుమల ఆలయ ప్రధాన ముగ్గురు కైంకర్యపరులు ఎవరు?',
    answerEn: 'As systematically codified in the historic British record "Sawal Jawab Patti Fasli 1227 (1817 AD)", the three paramount functionaries who conduct worship are: 1. The Vaikhanasa Archakas (hereditary priests from Bharadwaja and Kausika gotras descending from Gopinatha Deekshitulu who alone touch and bathe the deity), 2. The Jeeyangars (Pedda Jeeyar, Chinna Jeeyar, and Ekangis who oversee rituals, hold keys in wooden boxes, light Akhandam lamps, and present all offerings to the priests), and 3. The 7 Acharya Purushas (hereditary spiritual leaders including Thollappacharya who bring Akasaganga water and lead Veda Parayanam).',
    answerTe: '1817 నాటి ఈస్టిండియా కంపెనీ చారిత్రక "సవాల్ జవాబ్ పట్టీ" ప్రకారం ఆలయంలో మూడు వర్గాల కైంకర్యపరులు ప్రధానమైనవారు: 1. వైఖానస అర్చకులు (గోపినాథ దీక్షితుల వంశీయులైన భరద్వాజ, కౌశిక గోత్రాల అర్చకులు; వీరు మాత్రమే మూలవిరాట్‌ను స్పృశించి పూజలు చేస్తారు), 2. జీయంగార్లు (పెద్ద జీయర్, చిన్న జీయర్, ఏకాంగులు; ఆలయ నియమాలను పర్యవేక్షిస్తూ, అఖండ దీపాలు వెలిగిస్తూ, పూజా ద్రవ్యాలను అర్చకులకు అందిస్తారు), మరియు 3. ఏడుగురు ఆచార్య పురుషులు (తోళప్పాచార్య, పూరిసై వంటి వంశీయులు; ఆకాశగంగ తీర్థం తేవడం, వేదపారాయణాన్ని నడిపించడం వీరి బాధ్యత).',
    source: 'Sapthagiri Magazine (September 2025), "The Three Important Functionaries of Tirumala Temple" by Sri Archakam Ramakrishna Deekshitulu'
  },
  {
    id: 'faq-copper-plates-1922',
    category: 'traditions',
    questionEn: 'How were Annamacharya\'s copper plate sankirtanas discovered inside the Tirumala temple?',
    questionTe: 'తిరుమల ఆలయంలో అన్నమాచార్యుల రాగిరేకులు ఎలా బయటపడ్డాయి?',
    answerEn: 'For over 300 years, the monumental musical legacy of Tallapaka Annamacharya lay hidden inside a small, concealed stone vault known as the Sankeertana Bhandagaram (Annamayya Ara), situated directly opposite the temple hundi. In 1922, during administrative inspections under the Mahants, scholars opened this vault and uncovered approximately 2,500 double-sided copper plates incised with over 14,000 devotional sankirtanas. Revered scholar Veturi Prabhakara Sastry spearheaded the transcription and publication of these invaluable songs under TTD.',
    answerTe: 'దాదాపు 300 సంవత్సరాలకు పైగా తాళ్లపాక అన్నమాచార్యుల సంకీర్తనలు ఆలయ హుండీ ఎదురుగా ఉన్న "సంకీర్తన భాండాగారం" (అన్నమయ్య అర) అనే రాతి గదిలో మరుగున పడి ఉన్నాయి. 1922లో మహంతుల పాలన కాలంలో ఈ గదిని తెరవగా, సుమారు 2,500 రాగిరేకులపై చెక్కబడిన 14,000కు పైగా దివ్య సంకీర్తనలు వెలుగుచూశాయి. ప్రముఖ పండితుడు వేటూరి ప్రభాకరశాస్త్రి గారి అవిరళ కృషితో TTD వీటిని సేకరించి పరిష్కరించి ప్రచురించింది.',
    source: 'Sapthagiri Magazine (October 2026), "The Secret of the Tirumala Temple" by Smt. Prema Nandakumar'
  }
];
