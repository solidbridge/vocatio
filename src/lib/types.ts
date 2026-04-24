export type TripPurpose =
  | "pilgrimage"
  | "business"
  | "pleasure"
  | "mixed"
  | "education"
  | "retreat"
  | "other";

export type TravelStyle = "luxury" | "premium" | "comfort" | "value";
export type TravelPace = "packed" | "balanced" | "slow";

export interface Destination {
  city: string;
  country: string;
  nights: number;
  lat?: number;
  lng?: number;
  timezone?: string;
  heroImage?: string;
}

export interface IntakePayload {
  purpose: TripPurpose;
  purposeOther?: string;
  adults: number;
  children: number;
  childAges?: string;
  startDate?: string;
  endDate?: string;
  flexibleNights?: number;
  destinations: Destination[];
  style: TravelStyle;
  pace: TravelPace;
  mustHaves: string[];
  dietaryAccessibility?: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface DayBlock {
  time: string;
  title: string;
  detail?: string;
  category?: "spiritual" | "meal" | "activity" | "transit" | "rest";
}

export interface ItineraryDay {
  date: string;
  city: string;
  title: string;
  narrative: string;
  blocks: DayBlock[];
}

export interface Lodging {
  city: string;
  name: string;
  neighborhood: string;
  style: string;
  notes: string;
}

export interface DiningPick {
  city: string;
  name: string;
  meal: "breakfast" | "lunch" | "dinner" | "cafe" | "aperitivo";
  neighborhood: string;
  note: string;
  priceBand: "$" | "$$" | "$$$" | "$$$$";
}

export interface ExperienceItem {
  city: string;
  name: string;
  why: string;
  leadTime?: string;
  kidsFriendly?: boolean;
}

export interface Phrase {
  language: string;
  phrase: string;
  meaning: string;
  pronunciation: string;
}

export interface EmergencyContact {
  city: string;
  police: string;
  medical: string;
  nearestConsulate?: string;
}

export interface ShrineStop {
  city: string;
  name: string;
  why: string;
  massTimes?: string;
  confessionTimes?: string;
}

export interface Trip {
  slug: string;
  title: string;
  subtitle: string;
  purpose: TripPurpose;
  startDate: string;
  endDate: string;
  party: { adults: number; children: number; childAges?: string };
  destinations: Destination[];
  overview: string;
  days: ItineraryDay[];
  lodging: Lodging[];
  dining: DiningPick[];
  experiences: ExperienceItem[];
  practical: {
    currency: string;
    plug: string;
    visa: string;
    dressCodes: string;
    tipping: string;
  };
  phrases: Phrase[];
  emergency: EmergencyContact[];
  shrines?: ShrineStop[];
  kids?: {
    snackPicks: string[];
    downtimeIdeas: string[];
    dayKillers: string[];
  };
  packing: { category: string; items: string[] }[];
}
