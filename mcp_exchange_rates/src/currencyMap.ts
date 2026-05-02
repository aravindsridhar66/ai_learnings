const aliases: Record<string, string> = {
  // ── USD ──────────────────────────────────────────────────────────────────
  dollar: "USD", dollars: "USD", "us dollar": "USD", "us dollars": "USD",
  "u.s. dollar": "USD", "u.s. dollars": "USD", "united states dollar": "USD",
  "american dollar": "USD", "american dollars": "USD", buck: "USD", bucks: "USD",
  greenback: "USD", greenbacks: "USD", usd: "USD",

  // ── EUR ──────────────────────────────────────────────────────────────────
  euro: "EUR", euros: "EUR", eur: "EUR",

  // ── GBP ──────────────────────────────────────────────────────────────────
  pound: "GBP", pounds: "GBP", "british pound": "GBP", "british pounds": "GBP",
  sterling: "GBP", "pound sterling": "GBP", quid: "GBP", gbp: "GBP",

  // ── JPY ──────────────────────────────────────────────────────────────────
  yen: "JPY", "japanese yen": "JPY", jpy: "JPY",

  // ── CNY ──────────────────────────────────────────────────────────────────
  yuan: "CNY", renminbi: "CNY", "chinese yuan": "CNY", rmb: "CNY",
  "chinese renminbi": "CNY", "people's yuan": "CNY", cny: "CNY",

  // ── INR ──────────────────────────────────────────────────────────────────
  rupee: "INR", rupees: "INR", "indian rupee": "INR", "indian rupees": "INR", inr: "INR",

  // ── CAD ──────────────────────────────────────────────────────────────────
  "canadian dollar": "CAD", "canadian dollars": "CAD", loonie: "CAD", cad: "CAD",

  // ── AUD ──────────────────────────────────────────────────────────────────
  "australian dollar": "AUD", "australian dollars": "AUD",
  "aussie dollar": "AUD", "aussie dollars": "AUD", aud: "AUD",

  // ── CHF ──────────────────────────────────────────────────────────────────
  franc: "CHF", francs: "CHF", "swiss franc": "CHF", "swiss francs": "CHF", chf: "CHF",

  // ── HKD ──────────────────────────────────────────────────────────────────
  "hong kong dollar": "HKD", "hong kong dollars": "HKD", hkd: "HKD",

  // ── SGD ──────────────────────────────────────────────────────────────────
  "singapore dollar": "SGD", "singapore dollars": "SGD", sgd: "SGD",

  // ── NZD ──────────────────────────────────────────────────────────────────
  "new zealand dollar": "NZD", "new zealand dollars": "NZD",
  "kiwi dollar": "NZD", "kiwi dollars": "NZD", nzd: "NZD",

  // ── SEK ──────────────────────────────────────────────────────────────────
  krona: "SEK", kronor: "SEK", "swedish krona": "SEK", "swedish kronor": "SEK", sek: "SEK",

  // ── NOK ──────────────────────────────────────────────────────────────────
  "norwegian krone": "NOK", "norwegian kroner": "NOK", nok: "NOK",

  // ── DKK ──────────────────────────────────────────────────────────────────
  "danish krone": "DKK", "danish kroner": "DKK", dkk: "DKK",

  // ── MXN ──────────────────────────────────────────────────────────────────
  "mexican peso": "MXN", "mexican pesos": "MXN", mxn: "MXN",

  // ── BRL ──────────────────────────────────────────────────────────────────
  real: "BRL", reais: "BRL", reals: "BRL", "brazilian real": "BRL",
  "brazilian reais": "BRL", brl: "BRL",

  // ── ZAR ──────────────────────────────────────────────────────────────────
  rand: "ZAR", "south african rand": "ZAR", zar: "ZAR",

  // ── KRW ──────────────────────────────────────────────────────────────────
  won: "KRW", "korean won": "KRW", "south korean won": "KRW", krw: "KRW",

  // ── THB ──────────────────────────────────────────────────────────────────
  baht: "THB", "thai baht": "THB", thb: "THB",

  // ── IDR ──────────────────────────────────────────────────────────────────
  rupiah: "IDR", "indonesian rupiah": "IDR", idr: "IDR",

  // ── MYR ──────────────────────────────────────────────────────────────────
  ringgit: "MYR", "malaysian ringgit": "MYR", myr: "MYR",

  // ── PHP ──────────────────────────────────────────────────────────────────
  "philippine peso": "PHP", "philippine pesos": "PHP",
  "filipino peso": "PHP", "filipino pesos": "PHP", php: "PHP",

  // ── ARS ──────────────────────────────────────────────────────────────────
  "argentine peso": "ARS", "argentinian peso": "ARS",
  "argentina peso": "ARS", ars: "ARS",

  // ── CLP ──────────────────────────────────────────────────────────────────
  "chilean peso": "CLP", "chilean pesos": "CLP", clp: "CLP",

  // ── COP ──────────────────────────────────────────────────────────────────
  "colombian peso": "COP", "colombian pesos": "COP", cop: "COP",

  // ── PEN ──────────────────────────────────────────────────────────────────
  sol: "PEN", soles: "PEN", "peruvian sol": "PEN", "peruvian soles": "PEN", pen: "PEN",

  // ── AED ──────────────────────────────────────────────────────────────────
  dirham: "AED", dirhams: "AED", "emirati dirham": "AED",
  "uae dirham": "AED", "dubai dirham": "AED", aed: "AED",

  // ── SAR ──────────────────────────────────────────────────────────────────
  riyal: "SAR", riyals: "SAR", "saudi riyal": "SAR",
  "saudi riyals": "SAR", "saudi arabian riyal": "SAR", sar: "SAR",

  // ── QAR ──────────────────────────────────────────────────────────────────
  "qatari riyal": "QAR", "qatari riyals": "QAR", qar: "QAR",

  // ── KWD ──────────────────────────────────────────────────────────────────
  dinar: "KWD", dinars: "KWD", "kuwaiti dinar": "KWD", "kuwaiti dinars": "KWD", kwd: "KWD",

  // ── BHD ──────────────────────────────────────────────────────────────────
  "bahraini dinar": "BHD", "bahraini dinars": "BHD", bhd: "BHD",

  // ── OMR ──────────────────────────────────────────────────────────────────
  "omani rial": "OMR", "omani rials": "OMR", rial: "OMR", rials: "OMR", omr: "OMR",

  // ── JOD ──────────────────────────────────────────────────────────────────
  "jordanian dinar": "JOD", "jordanian dinars": "JOD", jod: "JOD",

  // ── IQD ──────────────────────────────────────────────────────────────────
  "iraqi dinar": "IQD", "iraqi dinars": "IQD", iqd: "IQD",

  // ── TRY ──────────────────────────────────────────────────────────────────
  lira: "TRY", "turkish lira": "TRY", "new turkish lira": "TRY", "try": "TRY",

  // ── RUB ──────────────────────────────────────────────────────────────────
  ruble: "RUB", rubles: "RUB", rouble: "RUB", roubles: "RUB",
  "russian ruble": "RUB", "russian rouble": "RUB", rub: "RUB",

  // ── UAH ──────────────────────────────────────────────────────────────────
  hryvnia: "UAH", hryvnias: "UAH", "ukrainian hryvnia": "UAH", uah: "UAH",

  // ── PLN ──────────────────────────────────────────────────────────────────
  zloty: "PLN", zlotys: "PLN", "polish zloty": "PLN", pln: "PLN",

  // ── CZK ──────────────────────────────────────────────────────────────────
  koruna: "CZK", korunas: "CZK", "czech koruna": "CZK", czk: "CZK",

  // ── HUF ──────────────────────────────────────────────────────────────────
  forint: "HUF", forints: "HUF", "hungarian forint": "HUF", huf: "HUF",

  // ── RON ──────────────────────────────────────────────────────────────────
  leu: "RON", lei: "RON", "romanian leu": "RON", ron: "RON",

  // ── BGN ──────────────────────────────────────────────────────────────────
  lev: "BGN", leva: "BGN", "bulgarian lev": "BGN", bgn: "BGN",

  // ── HRK ──────────────────────────────────────────────────────────────────
  kuna: "HRK", kunas: "HRK", "croatian kuna": "HRK", hrk: "HRK",

  // ── ILS ──────────────────────────────────────────────────────────────────
  shekel: "ILS", shekels: "ILS", "israeli shekel": "ILS",
  "new israeli shekel": "ILS", ils: "ILS",

  // ── EGP ──────────────────────────────────────────────────────────────────
  "egyptian pound": "EGP", "egyptian pounds": "EGP", egp: "EGP",

  // ── NGN ──────────────────────────────────────────────────────────────────
  naira: "NGN", nairas: "NGN", "nigerian naira": "NGN", ngn: "NGN",

  // ── GHS ──────────────────────────────────────────────────────────────────
  cedi: "GHS", cedis: "GHS", "ghanaian cedi": "GHS", ghs: "GHS",

  // ── KES ──────────────────────────────────────────────────────────────────
  shilling: "KES", shillings: "KES", "kenyan shilling": "KES", kes: "KES",

  // ── TZS ──────────────────────────────────────────────────────────────────
  "tanzanian shilling": "TZS", tzs: "TZS",

  // ── UGX ──────────────────────────────────────────────────────────────────
  "ugandan shilling": "UGX", ugx: "UGX",

  // ── ETB ──────────────────────────────────────────────────────────────────
  birr: "ETB", "ethiopian birr": "ETB", etb: "ETB",

  // ── MAD ──────────────────────────────────────────────────────────────────
  "moroccan dirham": "MAD", mad: "MAD",

  // ── PKR ──────────────────────────────────────────────────────────────────
  "pakistani rupee": "PKR", "pakistani rupees": "PKR", pkr: "PKR",

  // ── BDT ──────────────────────────────────────────────────────────────────
  taka: "BDT", "bangladeshi taka": "BDT", bdt: "BDT",

  // ── LKR ──────────────────────────────────────────────────────────────────
  "sri lankan rupee": "LKR", "sri lankan rupees": "LKR", lkr: "LKR",

  // ── NPR ──────────────────────────────────────────────────────────────────
  "nepalese rupee": "NPR", "nepalese rupees": "NPR",
  "nepali rupee": "NPR", "nepali rupees": "NPR", npr: "NPR",

  // ── MMK ──────────────────────────────────────────────────────────────────
  kyat: "MMK", "myanmar kyat": "MMK", "burmese kyat": "MMK", mmk: "MMK",

  // ── VND ──────────────────────────────────────────────────────────────────
  dong: "VND", "vietnamese dong": "VND", vnd: "VND",

  // ── KHR ──────────────────────────────────────────────────────────────────
  riel: "KHR", "cambodian riel": "KHR", khr: "KHR",

  // ── TWD ──────────────────────────────────────────────────────────────────
  "taiwanese dollar": "TWD", "taiwan dollar": "TWD",
  "new taiwan dollar": "TWD", twd: "TWD",

  // ── MOP ──────────────────────────────────────────────────────────────────
  pataca: "MOP", "macanese pataca": "MOP", mop: "MOP",

  // ── BND ──────────────────────────────────────────────────────────────────
  "brunei dollar": "BND", bnd: "BND",

  // ── KZT ──────────────────────────────────────────────────────────────────
  tenge: "KZT", "kazakhstani tenge": "KZT", kzt: "KZT",

  // ── UZS ──────────────────────────────────────────────────────────────────
  "uzbekistani som": "UZS", uzs: "UZS",

  // ── AZN ──────────────────────────────────────────────────────────────────
  manat: "AZN", "azerbaijani manat": "AZN", azn: "AZN",

  // ── GEL ──────────────────────────────────────────────────────────────────
  lari: "GEL", "georgian lari": "GEL", gel: "GEL",

  // ── AMD ──────────────────────────────────────────────────────────────────
  dram: "AMD", "armenian dram": "AMD", amd: "AMD",

  // ── BYN ──────────────────────────────────────────────────────────────────
  "belarusian ruble": "BYN", byn: "BYN",

  // ── MDL ──────────────────────────────────────────────────────────────────
  "moldovan leu": "MDL", mdl: "MDL",

  // ── ISK ──────────────────────────────────────────────────────────────────
  krónur: "ISK", "icelandic krona": "ISK", isk: "ISK",

  // ── ALL ──────────────────────────────────────────────────────────────────
  lek: "ALL", "albanian lek": "ALL", all: "ALL",

  // ── MKD ──────────────────────────────────────────────────────────────────
  denar: "MKD", "macedonian denar": "MKD", mkd: "MKD",

  // ── RSD ──────────────────────────────────────────────────────────────────
  "serbian dinar": "RSD", rsd: "RSD",

  // ── BAM ──────────────────────────────────────────────────────────────────
  "convertible mark": "BAM", "bosnian mark": "BAM", bam: "BAM",

  // ── DZD ──────────────────────────────────────────────────────────────────
  "algerian dinar": "DZD", dzd: "DZD",

  // ── TND ──────────────────────────────────────────────────────────────────
  "tunisian dinar": "TND", tnd: "TND",

  // ── LYD ──────────────────────────────────────────────────────────────────
  "libyan dinar": "LYD", lyd: "LYD",

  // ── SDG ──────────────────────────────────────────────────────────────────
  "sudanese pound": "SDG", sdg: "SDG",

  // ── AOA ──────────────────────────────────────────────────────────────────
  kwanza: "AOA", "angolan kwanza": "AOA", aoa: "AOA",

  // ── ZMW ──────────────────────────────────────────────────────────────────
  kwacha: "ZMW", "zambian kwacha": "ZMW", zmw: "ZMW",

  // ── MWK ──────────────────────────────────────────────────────────────────
  "malawian kwacha": "MWK", mwk: "MWK",

  // ── MZN ──────────────────────────────────────────────────────────────────
  metical: "MZN", "mozambican metical": "MZN", mzn: "MZN",

  // ── BWP ──────────────────────────────────────────────────────────────────
  pula: "BWP", "botswana pula": "BWP", bwp: "BWP",

  // ── NAD ──────────────────────────────────────────────────────────────────
  "namibian dollar": "NAD", nad: "NAD",

  // ── SZL ──────────────────────────────────────────────────────────────────
  lilangeni: "SZL", szl: "SZL",

  // ── LSL ──────────────────────────────────────────────────────────────────
  loti: "LSL", "lesotho loti": "LSL", lsl: "LSL",

  // ── MUR ──────────────────────────────────────────────────────────────────
  "mauritian rupee": "MUR", "mauritian rupees": "MUR", mur: "MUR",

  // ── SCR ──────────────────────────────────────────────────────────────────
  "seychellois rupee": "SCR", scr: "SCR",

  // ── XOF ──────────────────────────────────────────────────────────────────
  "west african franc": "XOF", "cfa franc": "XOF", xof: "XOF",

  // ── XAF ──────────────────────────────────────────────────────────────────
  "central african franc": "XAF", xaf: "XAF",

  // ── TTD ──────────────────────────────────────────────────────────────────
  "trinidad dollar": "TTD", "trinidadian dollar": "TTD", ttd: "TTD",

  // ── JMD ──────────────────────────────────────────────────────────────────
  "jamaican dollar": "JMD", jmd: "JMD",

  // ── BBD ──────────────────────────────────────────────────────────────────
  "barbadian dollar": "BBD", "bajan dollar": "BBD", bbd: "BBD",

  // ── XCD ──────────────────────────────────────────────────────────────────
  "east caribbean dollar": "XCD", xcd: "XCD",

  // ── HTG ──────────────────────────────────────────────────────────────────
  gourde: "HTG", "haitian gourde": "HTG", htg: "HTG",

  // ── DOP ──────────────────────────────────────────────────────────────────
  "dominican peso": "DOP", "dominican pesos": "DOP", dop: "DOP",

  // ── CRC ──────────────────────────────────────────────────────────────────
  colon: "CRC", colón: "CRC", "costa rican colon": "CRC", crc: "CRC",

  // ── GTQ ──────────────────────────────────────────────────────────────────
  quetzal: "GTQ", "guatemalan quetzal": "GTQ", gtq: "GTQ",

  // ── HNL ──────────────────────────────────────────────────────────────────
  lempira: "HNL", "honduran lempira": "HNL", hnl: "HNL",

  // ── NIO ──────────────────────────────────────────────────────────────────
  cordoba: "NIO", córdoba: "NIO", "nicaraguan cordoba": "NIO", nio: "NIO",

  // ── PAB ──────────────────────────────────────────────────────────────────
  balboa: "PAB", "panamanian balboa": "PAB", pab: "PAB",

  // ── BOB ──────────────────────────────────────────────────────────────────
  boliviano: "BOB", "bolivian boliviano": "BOB", bob: "BOB",

  // ── PYG ──────────────────────────────────────────────────────────────────
  guarani: "PYG", guaraní: "PYG", "paraguayan guarani": "PYG", pyg: "PYG",

  // ── UYU ──────────────────────────────────────────────────────────────────
  "uruguayan peso": "UYU", "uruguayan pesos": "UYU", uyu: "UYU",

  // ── VES ──────────────────────────────────────────────────────────────────
  bolivar: "VES", bolívar: "VES", "venezuelan bolivar": "VES", ves: "VES",

  // ── GYD ──────────────────────────────────────────────────────────────────
  "guyanese dollar": "GYD", gyd: "GYD",

  // ── SRD ──────────────────────────────────────────────────────────────────
  "surinamese dollar": "SRD", srd: "SRD",

  // ── FJD ──────────────────────────────────────────────────────────────────
  "fijian dollar": "FJD", "fiji dollar": "FJD", fjd: "FJD",

  // ── PGK ──────────────────────────────────────────────────────────────────
  kina: "PGK", "papua new guinea kina": "PGK", pgk: "PGK",

  // ── WST ──────────────────────────────────────────────────────────────────
  tala: "WST", "samoan tala": "WST", wst: "WST",

  // ── TOP ──────────────────────────────────────────────────────────────────
  "pa'anga": "TOP", paanga: "TOP", "tongan paanga": "TOP", top: "TOP",

  // ── VUV ──────────────────────────────────────────────────────────────────
  vatu: "VUV", "vanuatu vatu": "VUV", vuv: "VUV",

  // ── SBD ──────────────────────────────────────────────────────────────────
  "solomon islands dollar": "SBD", sbd: "SBD",

  // ── MNT ──────────────────────────────────────────────────────────────────
  tugrik: "MNT", tögrög: "MNT", "mongolian tugrik": "MNT", mnt: "MNT",

  // ── AFN ──────────────────────────────────────────────────────────────────
  afghani: "AFN", "afghan afghani": "AFN", afn: "AFN",

  // ── IRR ──────────────────────────────────────────────────────────────────
  "iranian rial": "IRR", irr: "IRR",

  // ── SYP ──────────────────────────────────────────────────────────────────
  "syrian pound": "SYP", syp: "SYP",

  // ── LBP ──────────────────────────────────────────────────────────────────
  "lebanese pound": "LBP", lbp: "LBP",

  // ── YER ──────────────────────────────────────────────────────────────────
  "yemeni rial": "YER", yer: "YER",

  // ── ILS ──────────────────────────────────────────────────────────────────
  "new shekel": "ILS", "new shekels": "ILS",

  // ── XPF ──────────────────────────────────────────────────────────────────
  "cfp franc": "XPF", "pacific franc": "XPF", xpf: "XPF",

  // ── MXV ──────────────────────────────────────────────────────────────────
  // (investment unit, skipped)

  // ── HKD already covered above ──────────────────────────────────────────

  // ── MGA ──────────────────────────────────────────────────────────────────
  ariary: "MGA", "malagasy ariary": "MGA", mga: "MGA",

  // ── TJS ──────────────────────────────────────────────────────────────────
  somoni: "TJS", "tajikistani somoni": "TJS", tjs: "TJS",

  // ── TMT ──────────────────────────────────────────────────────────────────
  "turkmenistani manat": "TMT", tmt: "TMT",

  // ── KGS ──────────────────────────────────────────────────────────────────
  som: "KGS", "kyrgyzstani som": "KGS", kgs: "KGS",

  // ── XDR ──────────────────────────────────────────────────────────────────
  "special drawing rights": "XDR", sdr: "XDR", xdr: "XDR",

  // ── BTN ──────────────────────────────────────────────────────────────────
  ngultrum: "BTN", "bhutanese ngultrum": "BTN", btn: "BTN",

  // ── MVR ──────────────────────────────────────────────────────────────────
  rufiyaa: "MVR", "maldivian rufiyaa": "MVR", mvr: "MVR",

  // ── LAK ──────────────────────────────────────────────────────────────────
  kip: "LAK", "lao kip": "LAK", "laotian kip": "LAK", lak: "LAK",

  // ── KPW ──────────────────────────────────────────────────────────────────
  "north korean won": "KPW", kpw: "KPW",

  // ── CUP ──────────────────────────────────────────────────────────────────
  "cuban peso": "CUP", "cuban pesos": "CUP", cup: "CUP",

  // ── AWG ──────────────────────────────────────────────────────────────────
  florin: "AWG", "aruban florin": "AWG", awg: "AWG",

  // ── ANG ──────────────────────────────────────────────────────────────────
  "netherlands antillean guilder": "ANG", guilder: "ANG", ang: "ANG",

  // ── BSD ──────────────────────────────────────────────────────────────────
  "bahamian dollar": "BSD", bsd: "BSD",

  // ── BMD ──────────────────────────────────────────────────────────────────
  "bermudian dollar": "BMD", bmd: "BMD",

  // ── BZD ──────────────────────────────────────────────────────────────────
  "belize dollar": "BZD", bzd: "BZD",

  // ── KYD ──────────────────────────────────────────────────────────────────
  "cayman islands dollar": "KYD", kyd: "KYD",

  // ── FKP ──────────────────────────────────────────────────────────────────
  "falkland islands pound": "FKP", fkp: "FKP",

  // ── GIP ──────────────────────────────────────────────────────────────────
  "gibraltar pound": "GIP", gip: "GIP",

  // ── SHP ──────────────────────────────────────────────────────────────────
  "saint helena pound": "SHP", shp: "SHP",

  // ── STN ──────────────────────────────────────────────────────────────────
  dobra: "STN", "sao tome dobra": "STN", stn: "STN",

  // ── CVE ──────────────────────────────────────────────────────────────────
  "cape verdean escudo": "CVE", escudo: "CVE", cve: "CVE",

  // ── GMD ──────────────────────────────────────────────────────────────────
  dalasi: "GMD", "gambian dalasi": "GMD", gmd: "GMD",

  // ── GNF ──────────────────────────────────────────────────────────────────
  "guinean franc": "GNF", gnf: "GNF",

  // ── SLL ──────────────────────────────────────────────────────────────────
  leone: "SLL", "sierra leonean leone": "SLL", sll: "SLL",

  // ── LRD ──────────────────────────────────────────────────────────────────
  "liberian dollar": "LRD", lrd: "LRD",

  // ── DJF ──────────────────────────────────────────────────────────────────
  "djiboutian franc": "DJF", djf: "DJF",

  // ── KMF ──────────────────────────────────────────────────────────────────
  "comorian franc": "KMF", kmf: "KMF",

  // ── ERN ──────────────────────────────────────────────────────────────────
  nakfa: "ERN", "eritrean nakfa": "ERN", ern: "ERN",

  // ── SSP ──────────────────────────────────────────────────────────────────
  "south sudanese pound": "SSP", ssp: "SSP",

  // ── CDF ──────────────────────────────────────────────────────────────────
  "congolese franc": "CDF", cdf: "CDF",

  // ── BIF ──────────────────────────────────────────────────────────────────
  "burundian franc": "BIF", bif: "BIF",

  // ── RWF ──────────────────────────────────────────────────────────────────
  "rwandan franc": "RWF", rwf: "RWF",

  // ── SOS ──────────────────────────────────────────────────────────────────
  "somali shilling": "SOS", sos: "SOS",

  // ── MRU ──────────────────────────────────────────────────────────────────
  ouguiya: "MRU", "mauritanian ouguiya": "MRU", mru: "MRU",

  // ── ZWL ──────────────────────────────────────────────────────────────────
  "zimbabwean dollar": "ZWL", zwl: "ZWL",
};

export function inferCurrencyCode(input: string): string | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  // Check named aliases first so words like "yen" and "won" resolve correctly
  // before falling back to treating any 3-letter string as a direct ISO code
  const fromAlias = aliases[normalized];
  if (fromAlias) return fromAlias;

  if (/^[a-zA-Z]{3}$/.test(normalized)) return normalized.toUpperCase();

  return null;
}

export { aliases };
