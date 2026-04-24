import type { Trip } from "./types";

export const sampleTrip: Trip = {
  slug: "rome-florence-capri-demo",
  title: "Rome · Florence · Capri",
  subtitle: "A ten-night Italian journey for a family of four.",
  purpose: "pleasure",
  startDate: "2026-06-14",
  endDate: "2026-06-24",
  party: { adults: 2, children: 2, childAges: "8, 11" },
  destinations: [
    {
      city: "Rome",
      country: "Italy",
      nights: 4,
      lat: 41.9028,
      lng: 12.4964,
      timezone: "Europe/Rome",
      heroImage:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
    },
    {
      city: "Florence",
      country: "Italy",
      nights: 3,
      lat: 43.7696,
      lng: 11.2558,
      timezone: "Europe/Rome",
      heroImage:
        "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1600&q=80",
    },
    {
      city: "Capri",
      country: "Italy",
      nights: 3,
      lat: 40.5532,
      lng: 14.2222,
      timezone: "Europe/Rome",
      heroImage:
        "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=1600&q=80",
    },
  ],
  overview:
    "Ten nights built for two parents and two children (8 and 11) who want the best of Italy without running the kids into the ground. Rome is anchored by the Vatican and the Forum with mornings out and afternoons napping back at the hotel. Florence leans into art and gelato at a slower pace, with one day carved out for a Tuscan hill town. Capri closes the trip with water, lemon groves, and enough downtime that the flight home doesn't feel like a punishment.",
  days: [
    {
      date: "Sun · Jun 14",
      city: "Rome",
      title: "Arrive · gentle reset",
      narrative:
        "Land mid-morning at FCO, private transfer to the hotel near Piazza Navona. Light lunch, a short orientation walk past the Pantheon, then a real afternoon rest. Dinner early and close.",
      blocks: [
        { time: "11:00", title: "Arrive FCO · private transfer", category: "transit" },
        { time: "13:00", title: "Check in, light lunch", category: "meal" },
        { time: "15:30", title: "Orientation walk · Pantheon & Navona", category: "activity" },
        { time: "17:00", title: "Hotel rest", category: "rest" },
        { time: "19:30", title: "Dinner at Armando al Pantheon", category: "meal" },
      ],
    },
    {
      date: "Mon · Jun 15",
      city: "Rome",
      title: "Vatican morning",
      narrative:
        "Early entry to the Vatican Museums before the crowds arrive. St. Peter's after. Afternoon gelato crawl through Centro Storico. Early dinner in Trastevere.",
      blocks: [
        { time: "07:45", title: "Early-access Vatican Museums tour", category: "spiritual" },
        { time: "11:00", title: "Sistine Chapel · St. Peter's Basilica", category: "spiritual" },
        { time: "13:30", title: "Lunch near Borgo Pio", category: "meal" },
        { time: "15:30", title: "Nap back at hotel", category: "rest" },
        { time: "18:00", title: "Passeggiata · Ponte Sant'Angelo", category: "activity" },
        { time: "19:30", title: "Dinner in Trastevere", category: "meal" },
      ],
    },
    {
      date: "Tue · Jun 16",
      city: "Rome",
      title: "Ancient Rome · with a kid's pace",
      narrative:
        "Colosseum and Forum with a family-friendly guide who keeps the history vivid. Afternoon swim at the hotel pool, then Villa Borghese at golden hour.",
      blocks: [
        { time: "09:00", title: "Colosseum + Forum guided (kid-friendly)", category: "activity" },
        { time: "13:00", title: "Lunch at Roscioli Salumeria", category: "meal" },
        { time: "15:00", title: "Pool + downtime", category: "rest" },
        { time: "18:00", title: "Villa Borghese rowboats", category: "activity" },
        { time: "20:00", title: "Pizza al taglio dinner", category: "meal" },
      ],
    },
    {
      date: "Wed · Jun 17",
      city: "Rome",
      title: "Off-script day",
      narrative:
        "Campo de' Fiori morning market, a hands-on pasta class together, then free time. Optional evening at Piazza del Popolo for sunset.",
      blocks: [
        { time: "09:30", title: "Campo de' Fiori market", category: "activity" },
        { time: "11:00", title: "Family pasta-making class", category: "activity" },
        { time: "15:00", title: "Free afternoon", category: "rest" },
        { time: "19:30", title: "Sunset at Pincio Terrace", category: "activity" },
      ],
    },
    {
      date: "Thu · Jun 18",
      city: "Florence",
      title: "Rome → Florence",
      narrative:
        "Frecciarossa high-speed train mid-morning. Check in near Santa Croce. Duomo exterior walk, evening aperitivo overlooking the Arno.",
      blocks: [
        { time: "10:15", title: "Frecciarossa to Florence (1h25m)", category: "transit" },
        { time: "12:30", title: "Check in · light lunch", category: "meal" },
        { time: "15:00", title: "Duomo complex exterior walk", category: "activity" },
        { time: "18:30", title: "Aperitivo on the Arno", category: "meal" },
        { time: "20:30", title: "Trattoria dinner", category: "meal" },
      ],
    },
    {
      date: "Fri · Jun 19",
      city: "Florence",
      title: "Uffizi · Duomo climb · gelato",
      narrative:
        "Reserved Uffizi slot. After lunch, the Duomo climb for the older child, quieter gardens nearby for the younger. Gelato at Gelateria della Passera.",
      blocks: [
        { time: "09:00", title: "Uffizi Gallery (reserved)", category: "activity" },
        { time: "12:30", title: "Lunch at Trattoria Mario", category: "meal" },
        { time: "15:00", title: "Duomo climb OR Boboli Gardens", category: "activity" },
        { time: "17:00", title: "Gelato della Passera", category: "meal" },
        { time: "19:30", title: "Dinner at Il Latini", category: "meal" },
      ],
    },
    {
      date: "Sat · Jun 20",
      city: "Florence",
      title: "Tuscan hill town day",
      narrative:
        "Private driver to San Gimignano, light lunch, then a family vineyard with juice for the kids and a gentle tasting for the adults. Back for a quiet Florence night.",
      blocks: [
        { time: "09:00", title: "Depart for San Gimignano", category: "transit" },
        { time: "11:00", title: "Walk the towers", category: "activity" },
        { time: "13:00", title: "Lunch in the piazza", category: "meal" },
        { time: "15:00", title: "Family vineyard visit", category: "activity" },
        { time: "19:00", title: "Return to Florence", category: "transit" },
      ],
    },
    {
      date: "Sun · Jun 21",
      city: "Capri",
      title: "Florence → Naples → Capri",
      narrative:
        "Frecciarossa to Naples, private transfer to Sorrento, hydrofoil to Capri. Afternoon swim, early family dinner at the hotel.",
      blocks: [
        { time: "08:30", title: "Train to Naples (3h)", category: "transit" },
        { time: "12:30", title: "Transfer + hydrofoil to Capri", category: "transit" },
        { time: "15:00", title: "Pool + first swim", category: "rest" },
        { time: "19:00", title: "Dinner at the hotel", category: "meal" },
      ],
    },
    {
      date: "Mon · Jun 22",
      city: "Capri",
      title: "Around the island",
      narrative:
        "Private gozzo boat around Capri with snorkel stops and the Blue Grotto (weather permitting). Quiet evening in Anacapri.",
      blocks: [
        { time: "09:30", title: "Private gozzo boat · half day", category: "activity" },
        { time: "13:00", title: "Lunch at Da Gelsomina", category: "meal" },
        { time: "16:00", title: "Nap + pool", category: "rest" },
        { time: "19:30", title: "Stroll + dinner in Anacapri", category: "meal" },
      ],
    },
    {
      date: "Tue · Jun 23",
      city: "Capri",
      title: "Slow day, long dinner",
      narrative:
        "A completely open day. Beach club, a lemon grove visit for the kids, and a last long dinner on the terrace.",
      blocks: [
        { time: "10:00", title: "Beach club morning", category: "rest" },
        { time: "15:00", title: "Lemon grove & limoncello demo", category: "activity" },
        { time: "19:30", title: "Farewell dinner · terrace table", category: "meal" },
      ],
    },
    {
      date: "Wed · Jun 24",
      city: "Capri",
      title: "Depart",
      narrative:
        "Hydrofoil to Naples, private transfer to NAP. Kids nap on the plane. Home.",
      blocks: [
        { time: "09:00", title: "Hydrofoil + transfer", category: "transit" },
        { time: "13:00", title: "NAP departure", category: "transit" },
      ],
    },
  ],
  lodging: [
    {
      city: "Rome",
      name: "Hotel Vilòn",
      neighborhood: "Centro Storico",
      style: "Quiet luxury, family suites available",
      notes:
        "Tucked behind Palazzo Borghese. Adjoining rooms can be arranged with enough lead time. Walk to everything.",
    },
    {
      city: "Florence",
      name: "Portrait Firenze",
      neighborhood: "Ponte Vecchio",
      style: "Family-friendly luxury, river views",
      notes:
        "Ferragamo-owned, generous suite layouts. The concierge team is exceptional with kid logistics.",
    },
    {
      city: "Capri",
      name: "Capri Palace Jumeirah",
      neighborhood: "Anacapri",
      style: "Full-service resort, quieter side of island",
      notes:
        "Better for families than Capri town. Pool, Michelin-star restaurant, easy shuttle into town.",
    },
  ],
  dining: [
    { city: "Rome", name: "Armando al Pantheon", meal: "dinner", neighborhood: "Pantheon", priceBand: "$$$", note: "Reserve two months out. Cacio e pepe benchmark." },
    { city: "Rome", name: "Roscioli Salumeria", meal: "lunch", neighborhood: "Campo de' Fiori", priceBand: "$$$", note: "Book the downstairs table. Carbonara and the best burrata." },
    { city: "Rome", name: "Pizzarium Bonci", meal: "lunch", neighborhood: "Prati", priceBand: "$", note: "Kid-proof. Pizza al taglio by the gram." },
    { city: "Florence", name: "Trattoria Mario", meal: "lunch", neighborhood: "San Lorenzo", priceBand: "$$", note: "No reservations. Arrive 12:15. Cash only." },
    { city: "Florence", name: "Il Latini", meal: "dinner", neighborhood: "Santa Maria Novella", priceBand: "$$$", note: "Theatrical and loud; the kids will love it." },
    { city: "Florence", name: "Gelateria della Passera", meal: "cafe", neighborhood: "Oltrarno", priceBand: "$", note: "Tiny shop. Pistachio is non-negotiable." },
    { city: "Capri", name: "Da Gelsomina", meal: "lunch", neighborhood: "Anacapri", priceBand: "$$$", note: "Views, lemon pasta, and a pool the kids can use." },
    { city: "Capri", name: "L'Olivo (Capri Palace)", meal: "dinner", neighborhood: "Anacapri", priceBand: "$$$$", note: "Two Michelin stars. Save for the last night." },
  ],
  experiences: [
    { city: "Rome", name: "Early-access Vatican Museums", why: "Empty Sistine at 8 a.m. is a different universe.", leadTime: "Book 8+ weeks ahead", kidsFriendly: true },
    { city: "Rome", name: "Family pasta-making class", why: "Gives the kids a non-tourist win mid-trip.", kidsFriendly: true },
    { city: "Rome", name: "Colosseum + Forum guided", why: "Ask for a guide who works with children.", kidsFriendly: true },
    { city: "Florence", name: "Uffizi (reserved)", why: "Two hours is plenty with kids. Focus on Botticelli + Caravaggio.", leadTime: "Book 4+ weeks ahead", kidsFriendly: true },
    { city: "Florence", name: "San Gimignano day", why: "The hilltown pays off — towers, space to run, real Tuscan lunch.", kidsFriendly: true },
    { city: "Capri", name: "Private gozzo boat", why: "Skippers know which grottos actually work the morning you're there.", kidsFriendly: true },
    { city: "Capri", name: "Lemon grove visit", why: "Limoncello for parents, tasting for kids, shade for everyone.", kidsFriendly: true },
  ],
  practical: {
    currency: "Euro (€). Cards widely accepted; carry €100 cash for taxis, tips, market stalls.",
    plug: "Type C / F, 230V. Bring a universal adapter plus one USB-C multi-charger per adult.",
    visa: "US passports: visa-free stay up to 90 days in the Schengen Area. ETIAS authorization required from 2026 — apply online before travel.",
    dressCodes:
      "Vatican, St. Peter's, Duomo: shoulders and knees covered for everyone. Bring a light scarf for children.",
    tipping:
      "Italians don't tip like Americans. Round up at cafés; €5–10 per meal at nicer restaurants; €1–2 per bag for porters.",
  },
  phrases: [
    { language: "Italian", phrase: "Buongiorno", meaning: "Good morning / hello", pronunciation: "bwohn-JOR-noh" },
    { language: "Italian", phrase: "Per favore", meaning: "Please", pronunciation: "pair fah-VOH-ray" },
    { language: "Italian", phrase: "Grazie mille", meaning: "Thank you very much", pronunciation: "GRAHT-see-eh MEEL-leh" },
    { language: "Italian", phrase: "Il conto, per favore", meaning: "The check, please", pronunciation: "eel KOHN-toh" },
    { language: "Italian", phrase: "Dov'è il bagno?", meaning: "Where is the restroom?", pronunciation: "doh-VEH eel BAHN-yoh" },
    { language: "Italian", phrase: "Un tavolo per quattro", meaning: "A table for four", pronunciation: "oon TAH-voh-loh pair KWAHT-troh" },
    { language: "Italian", phrase: "Senza glutine", meaning: "Gluten-free", pronunciation: "SEN-tsah GLOO-tee-neh" },
    { language: "Italian", phrase: "Scusi", meaning: "Excuse me", pronunciation: "SKOO-zee" },
  ],
  emergency: [
    { city: "Rome", police: "112 (EU emergency) · 113 (police)", medical: "118", nearestConsulate: "US Embassy: Via Vittorio Veneto 121 · +39 06 46741" },
    { city: "Florence", police: "112 · 113", medical: "118", nearestConsulate: "US Consulate: Lungarno Vespucci 38 · +39 055 266 951" },
    { city: "Capri", police: "112 · 113", medical: "118 · Capri Hospital: +39 081 838 1111", nearestConsulate: "US Consulate Naples: +39 081 583 8111" },
  ],
  kids: {
    snackPicks: [
      "Schiacciata from any Florence forno (focaccia bread, kid-approved)",
      "Gelato at least once a day, but always after 4 p.m. for post-nap fuel",
      "Pizza bianca from Roscioli on a walking morning",
    ],
    downtimeIdeas: [
      "Hotel pool afternoons — every hotel on this trip has one",
      "Villa Borghese rowboats in Rome · 20 minutes is plenty",
      "Beach club morning in Capri before the crowds",
    ],
    dayKillers: [
      "Avoid 3+ hour museum blocks. The Vatican and Uffizi are the only museums on this trip for a reason.",
      "No restaurant reservations before 7:30 p.m. — siestas exist for a reason",
      "Travel days are travel days. Don't plan evening activities after a train.",
    ],
  },
  packing: [
    {
      category: "Clothing",
      items: [
        "Light layers — cool evenings even in June",
        "One modest outfit per person for church visits (covered shoulders & knees)",
        "Comfortable walking shoes broken in before you leave",
        "Swimsuits (two per person — one always drying)",
        "A lightweight scarf per adult (sun, AC, Vatican dress code)",
      ],
    },
    {
      category: "Documents",
      items: [
        "Passports (6+ months validity)",
        "ETIAS authorization printout",
        "Travel insurance card",
        "Hotel confirmations (printed backup)",
        "Vatican and Uffizi tickets — save PDFs offline",
      ],
    },
    {
      category: "Tech",
      items: [
        "Universal adapter (Type C/F)",
        "USB-C multi-charger per adult",
        "eSIM or international data plan activated before flight",
        "Portable battery pack",
      ],
    },
    {
      category: "Kid kit",
      items: [
        "Refillable water bottles (fontanelle are everywhere)",
        "Small snack bag restocked daily",
        "One small travel notebook per child",
        "Motion-sickness remedy for boat and hydrofoil days",
      ],
    },
    {
      category: "Just in case",
      items: [
        "Basic first-aid (bandaids, ibuprofen, antacids)",
        "Sunscreen (SPF 50+)",
        "Small umbrella",
      ],
    },
  ],
};
