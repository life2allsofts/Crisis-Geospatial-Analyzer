export interface SafeHaven {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  capacity: number;
  region: string;
  contact: string;
  evacuationRoutes: string[];
}

export const GHANA_SAFE_HAVENS: SafeHaven[] = [
  // Greater Accra
  {
    id: "ga_stadium",
    name: "Accra Sports Stadium",
    lat: 5.5481,
    lng: -0.2000,
    type: "Stadium / Large Assembly Point",
    capacity: 40000,
    region: "Greater Accra",
    contact: "NADMO National Hotline: 112 / 0302 299350",
    evacuationRoutes: [
      "Route A: Head North on Independence Avenue to Castle Road",
      "Route B: Exit East onto Starlets 91 Road toward Osu"
    ]
  },
  {
    id: "ga_labone_shs",
    name: "Labone Senior High School",
    lat: 5.5658,
    lng: -0.1784,
    type: "School Facility / Assembly Point",
    capacity: 2500,
    region: "Greater Accra",
    contact: "NADMO Accra Metropolitan: 0244 556677",
    evacuationRoutes: [
      "Route A: Use Labone Bypass to Cantonments Road",
      "Route B: Exit North onto Danquah Circle intersection"
    ]
  },
  {
    id: "ga_independence_sq",
    name: "Independence Square Grounds",
    lat: 5.5488,
    lng: -0.1925,
    type: "Open Public Plaza / High Capacity",
    capacity: 50000,
    region: "Greater Accra",
    contact: "NADMO Emergency Service: 0302 299350",
    evacuationRoutes: [
      "Route A: Direct transit West on 28th February Road",
      "Route B: Move North toward High Street and Liberation Road"
    ]
  },

  // Ashanti
  {
    id: "ash_baba_yara",
    name: "Baba Yara Sports Stadium",
    lat: 6.6783,
    lng: -1.6033,
    type: "Stadium Complex / High Capacity",
    capacity: 40500,
    region: "Ashanti",
    contact: "NADMO Ashanti Region: 0299 350040",
    evacuationRoutes: [
      "Route A: Exit toward Hudson Road or Stadium Road",
      "Route B: Move West toward Lake Road bypass"
    ]
  },
  {
    id: "ash_city_hall",
    name: "Kumasi KMA City Hall Plaza",
    lat: 6.6905,
    lng: -1.6180,
    type: "Municipal Office & Assembly Point",
    capacity: 1500,
    region: "Ashanti",
    contact: "NADMO Kumasi Metro: 0322 012345",
    evacuationRoutes: [
      "Route A: Head towards Harper Road",
      "Route B: Move South via Bantama High Street"
    ]
  },

  // Western
  {
    id: "wst_essipong",
    name: "Essipong Sports Stadium",
    lat: 4.9525,
    lng: -1.6784,
    type: "Stadium Complex / High Capacity",
    capacity: 20000,
    region: "Western",
    contact: "NADMO Western Region: 0299 350050",
    evacuationRoutes: [
      "Route A: Exit via Sekondi-Takoradi Highway",
      "Route B: Travel inland via Essipong Bypass"
    ]
  },
  {
    id: "wst_ttu",
    name: "Takoradi Technical University Campus",
    lat: 4.8994,
    lng: -1.7706,
    type: "Educational Campus / Safe Halls",
    capacity: 3500,
    region: "Western",
    contact: "NADMO Sekondi-Takoradi: 0243 123456",
    evacuationRoutes: [
      "Route A: Exit toward Liberation Road",
      "Route B: Head East towards Axim Road"
    ]
  },

  // Northern
  {
    id: "nr_aliu_mahama",
    name: "Aliu Mahama Sports Stadium",
    lat: 9.4088,
    lng: -0.8550,
    type: "Stadium / Assembly Point",
    capacity: 21017,
    region: "Northern",
    contact: "NADMO Northern Region: 0299 350060 / 0372 022345",
    evacuationRoutes: [
      "Route A: Move East toward Bolgatanga-Tamale Road",
      "Route B: Exit South onto Hospital Road"
    ]
  },

  // Eastern
  {
    id: "er_sports_stadium",
    name: "Koforidua Sports Stadium",
    lat: 6.0950,
    lng: -0.2520,
    type: "Stadium / Assembly Point",
    capacity: 5000,
    region: "Eastern",
    contact: "NADMO Eastern Region: 0299 350070",
    evacuationRoutes: [
      "Route A: Move East toward Koforidua-Akwadum Road",
      "Route B: Exit West toward central commercial street bypass"
    ]
  },

  // Central
  {
    id: "cr_stadium",
    name: "Cape Coast Sports Stadium",
    lat: 5.1215,
    lng: -1.2618,
    type: "Stadium Complex / High Capacity",
    capacity: 15000,
    region: "Central",
    contact: "NADMO Central Region: 0299 350080",
    evacuationRoutes: [
      "Route A: Head West on Cape Coast-Takoradi Highway",
      "Route B: Move North toward Jukwa Road bypass"
    ]
  },
  {
    id: "cr_adisadel",
    name: "Adisadel College Assembly Hall",
    lat: 5.1180,
    lng: -1.2720,
    type: "School Facility / Elevated Grounds",
    capacity: 3000,
    region: "Central",
    contact: "NADMO Cape Coast Metro: 0202 987654",
    evacuationRoutes: [
      "Route A: Ascend Adisadel Hill to main administrative block",
      "Route B: Exit North toward bypass connecting to Accra Highway"
    ]
  },

  // Volta / Oti
  {
    id: "vr_stadium",
    name: "Ho Sports Stadium",
    lat: 6.6080,
    lng: 0.4720,
    type: "Stadium / Open Ground",
    capacity: 10000,
    region: "Volta",
    contact: "NADMO Volta Region: 0299 350090",
    evacuationRoutes: [
      "Route A: Exit East toward Mawuli School Road",
      "Route B: Move North toward Ho-Kpalime Highway"
    ]
  },

  // Upper East
  {
    id: "ue_stadium",
    name: "Bolgatanga Municipal Stadium",
    lat: 10.7890,
    lng: -0.8530,
    type: "Stadium / Assembly Point",
    capacity: 8000,
    region: "Upper East",
    contact: "NADMO Upper East: 0299 350100",
    evacuationRoutes: [
      "Route A: Direct escape Route West to Navrongo Highway",
      "Route B: Head South towards Zuarungu Road bypass"
    ]
  },

  // Upper West
  {
    id: "uw_stadium",
    name: "Wa Sports Stadium",
    lat: 10.0630,
    lng: -2.5020,
    type: "Stadium / Assembly Point",
    capacity: 5000,
    region: "Upper West",
    contact: "NADMO Upper West: 0299 350110",
    evacuationRoutes: [
      "Route A: Route North toward Wa-Hamile Road",
      "Route B: Route East toward central administrative corridor"
    ]
  }
];
