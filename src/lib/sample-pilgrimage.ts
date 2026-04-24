import type { Trip } from "./types";

export const pilgrimageTrip: Trip = {
  slug: "rome-assisi-pilgrimage-demo",
  title: "Rome · Assisi",
  subtitle: "A seven-night parish pilgrimage for twenty-five.",
  purpose: "pilgrimage",
  startDate: "2026-09-20",
  endDate: "2026-09-27",
  party: { adults: 25, children: 0 },
  destinations: [
    {
      city: "Rome",
      country: "Italy",
      nights: 4,
      lat: 41.9028,
      lng: 12.4964,
      timezone: "Europe/Rome",
      heroImage:
        "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1600&q=80",
    },
    {
      city: "Assisi",
      country: "Italy",
      nights: 3,
      lat: 43.0707,
      lng: 12.6149,
      timezone: "Europe/Rome",
      heroImage:
        "https://images.unsplash.com/photo-1609953830385-04c9af4c4f90?auto=format&fit=crop&w=1600&q=80",
    },
  ],
  overview:
    "Seven nights built for twenty-five pilgrims who came for Rome and Assisi — and for the Mass, the confession line, and the walk up La Verna more than the gelato. Rome anchors the first half with the four papal basilicas, a Wednesday papal audience, and an early-morning Mass at the tomb of St. Peter. Assisi closes the pilgrimage with slower days, the Basilica of San Francesco, the Porziuncola, and time in the hills the way St. Francis knew them. Everything is group-paced: one bus, one guide, Masses pre-confirmed, dinners together.",
  days: [
    {
      date: "Sun · Sep 20",
      city: "Rome",
      title: "Arrive · Mass · first supper",
      narrative:
        "Group arrival FCO morning. Private coach to the hotel near the Vatican. Afternoon rest. Opening Mass at a nearby parish, then a first group dinner together.",
      blocks: [
        { time: "09:30", title: "Arrive FCO · group coach transfer", category: "transit" },
        { time: "12:00", title: "Check in · lunch together at hotel", category: "meal" },
        { time: "15:00", title: "Rest", category: "rest" },
        { time: "17:00", title: "Opening Mass · Santa Maria in Traspontina", category: "spiritual" },
        { time: "19:30", title: "Group dinner · Trattoria dei Pellegrini", category: "meal" },
      ],
    },
    {
      date: "Mon · Sep 21",
      city: "Rome",
      title: "Scavi · St. Peter's · Holy Door",
      narrative:
        "Reserved Scavi tour underneath St. Peter's, Mass at the tomb of the apostle, and the rest of the morning at the basilica. Afternoon free for confession or prayer at the Adoration chapel.",
      blocks: [
        { time: "07:45", title: "Scavi Tour · necropolis under St. Peter's", category: "spiritual" },
        { time: "09:30", title: "Mass at the tomb of St. Peter", category: "spiritual" },
        { time: "11:30", title: "St. Peter's Basilica & Holy Door", category: "spiritual" },
        { time: "13:00", title: "Pilgrims' lunch near Borgo", category: "meal" },
        { time: "15:30", title: "Free: confession / Adoration chapel", category: "spiritual" },
        { time: "19:30", title: "Dinner near hotel", category: "meal" },
      ],
    },
    {
      date: "Tue · Sep 22",
      city: "Rome",
      title: "Four papal basilicas",
      narrative:
        "A day with the papal basilicas by coach: St. John Lateran (the cathedral of Rome), Santa Maria Maggiore (the Marian anchor), St. Paul Outside the Walls. Scala Santa on knees for those who wish.",
      blocks: [
        { time: "08:30", title: "St. John Lateran + Scala Santa", category: "spiritual" },
        { time: "11:00", title: "Santa Maria Maggiore · Mass", category: "spiritual" },
        { time: "13:00", title: "Group lunch", category: "meal" },
        { time: "15:00", title: "St. Paul Outside the Walls", category: "spiritual" },
        { time: "17:30", title: "Return to hotel · rest", category: "rest" },
        { time: "19:30", title: "Dinner together", category: "meal" },
      ],
    },
    {
      date: "Wed · Sep 23",
      city: "Rome",
      title: "Papal audience · catacombs",
      narrative:
        "Reserved seats at the Wednesday papal audience in St. Peter's Square. Afternoon visit to the Catacombs of San Callisto and the early Christian crypts. Reflective group debrief before dinner.",
      blocks: [
        { time: "07:30", title: "Seats at Papal Audience (St. Peter's Square)", category: "spiritual" },
        { time: "12:30", title: "Group lunch", category: "meal" },
        { time: "14:30", title: "Catacombs of San Callisto", category: "spiritual" },
        { time: "17:00", title: "Group reflection · rooftop terrace", category: "rest" },
        { time: "19:30", title: "Dinner at Taverna Angelica", category: "meal" },
      ],
    },
    {
      date: "Thu · Sep 24",
      city: "Assisi",
      title: "Rome → Assisi",
      narrative:
        "Morning coach north to Umbria (~2.5h). Arrive Assisi in time for lunch and a first walk up to the Basilica of San Francesco. Quiet evening Vespers with the friars.",
      blocks: [
        { time: "08:30", title: "Depart Rome by coach", category: "transit" },
        { time: "11:30", title: "Arrive Assisi · check in", category: "transit" },
        { time: "13:00", title: "Lunch in the piazza", category: "meal" },
        { time: "15:00", title: "Basilica di San Francesco · upper & lower", category: "spiritual" },
        { time: "18:00", title: "Vespers with the friars", category: "spiritual" },
        { time: "19:30", title: "Dinner at Trattoria Pallotta", category: "meal" },
      ],
    },
    {
      date: "Fri · Sep 25",
      city: "Assisi",
      title: "Porziuncola · Santa Chiara · La Verna",
      narrative:
        "Morning Mass at the Porziuncola in Santa Maria degli Angeli — the little church St. Francis rebuilt. Afternoon pilgrimage to La Verna where St. Francis received the stigmata. A long, quiet day.",
      blocks: [
        { time: "08:00", title: "Mass at the Porziuncola", category: "spiritual" },
        { time: "10:00", title: "Basilica di Santa Chiara · St. Clare", category: "spiritual" },
        { time: "12:30", title: "Box lunch on the coach", category: "meal" },
        { time: "14:00", title: "Pilgrimage to La Verna (1h30m drive)", category: "spiritual" },
        { time: "17:30", title: "Return to Assisi", category: "transit" },
        { time: "19:30", title: "Dinner together", category: "meal" },
      ],
    },
    {
      date: "Sat · Sep 26",
      city: "Assisi",
      title: "Carceri hermitage · free afternoon",
      narrative:
        "Walk up to the Eremo delle Carceri where St. Francis prayed in the woods — the most silent place on the trip. Free afternoon for confession, prayer, or a quiet walk back through the olive groves.",
      blocks: [
        { time: "08:30", title: "Coach to Eremo delle Carceri", category: "transit" },
        { time: "09:15", title: "Mass at the hermitage", category: "spiritual" },
        { time: "11:00", title: "Walking reflection · Subasio path", category: "spiritual" },
        { time: "13:00", title: "Lunch back in town", category: "meal" },
        { time: "15:00", title: "Free: confession / rest / shop", category: "rest" },
        { time: "19:30", title: "Farewell dinner on the terrace", category: "meal" },
      ],
    },
    {
      date: "Sun · Sep 27",
      city: "Assisi",
      title: "Closing Mass · depart",
      narrative:
        "Closing Mass at the Basilica di San Francesco before the coach south to FCO for afternoon departures. Group blessing from the pastor before the drive.",
      blocks: [
        { time: "08:00", title: "Closing Mass · San Francesco", category: "spiritual" },
        { time: "10:00", title: "Coach to FCO (2h30m)", category: "transit" },
        { time: "14:30", title: "Group check-in at FCO", category: "transit" },
      ],
    },
  ],
  lodging: [
    {
      city: "Rome",
      name: "Hotel Columbus",
      neighborhood: "Via della Conciliazione",
      style: "Group-friendly, steps from St. Peter's Square",
      notes:
        "A former monastery with frescoed ceilings and enough rooms for a pilgrimage of twenty-five. Chapel on site. Breakfast included.",
    },
    {
      city: "Assisi",
      name: "Hotel Giotto",
      neighborhood: "Via Fontebella",
      style: "Mid-range, walkable to everything",
      notes:
        "Terrace with a view across the Umbrian plain. Dining room large enough for the full group. The staff is used to parish pilgrimages.",
    },
  ],
  dining: [
    { city: "Rome", name: "Trattoria dei Pellegrini", meal: "dinner", neighborhood: "Borgo", priceBand: "$$", note: "Private room for groups of twenty-plus. Simple, honest Roman food." },
    { city: "Rome", name: "Taverna Angelica", meal: "dinner", neighborhood: "Borgo", priceBand: "$$$", note: "Book the back room. Earlier seating fits a pilgrimage schedule." },
    { city: "Rome", name: "Pizzarium Bonci", meal: "lunch", neighborhood: "Prati", priceBand: "$", note: "Pizza al taglio. Good for an easy group lunch." },
    { city: "Assisi", name: "Trattoria Pallotta", meal: "dinner", neighborhood: "Piazza del Comune", priceBand: "$$", note: "Umbrian classics. Torta al testo, truffle pasta, house wine." },
    { city: "Assisi", name: "La Stalla", meal: "dinner", neighborhood: "Fontemaggio", priceBand: "$$", note: "Rustic, rowdy, wood-fire. Walk-in for groups with advance notice." },
  ],
  experiences: [
    { city: "Rome", name: "Scavi Tour", why: "Reserved tour under St. Peter's to the apostle's tomb. Limited daily capacity.", leadTime: "Book 4–6 months ahead" },
    { city: "Rome", name: "Papal Audience (Wednesday)", why: "Free tickets through the Prefecture of the Papal Household; Vocatio reserves a group section.", leadTime: "Request 6+ weeks ahead" },
    { city: "Rome", name: "Four Papal Basilicas day", why: "All four in one day is a full-bus day. Worth it for the Jubilee Year." },
    { city: "Assisi", name: "La Verna pilgrimage", why: "A day trip most group tours skip. It's where the stigmata happened — don't skip it." },
    { city: "Assisi", name: "Eremo delle Carceri walk", why: "The quietest place on the itinerary. Walk back down through the olive groves." },
  ],
  practical: {
    currency: "Euro (€). Cards accepted almost everywhere; carry €50 cash per person for small donations, candles, and café stops.",
    plug: "Type C / F, 230V. Bring a universal adapter — the group coach has USB ports.",
    visa: "US passports: visa-free stay up to 90 days in the Schengen Area. ETIAS authorization required from 2026 — apply online before travel.",
    dressCodes:
      "Shoulders and knees covered at every basilica and shrine. The group will carry spare scarves on the coach. Men: no shorts in St. Peter's or the Basilica of San Francesco.",
    tipping:
      "Italy tips modestly. Round up at cafés. The pastor traditionally handles the coach driver (€3–5/person) and group dinner tips on the final night.",
  },
  phrases: [
    { language: "Italian", phrase: "Buongiorno", meaning: "Good morning / hello", pronunciation: "bwohn-JOR-noh" },
    { language: "Italian", phrase: "Pace e bene", meaning: "Peace and goodness (Franciscan greeting)", pronunciation: "PAH-cheh eh BEH-neh" },
    { language: "Italian", phrase: "A che ora è la Messa?", meaning: "What time is Mass?", pronunciation: "ah keh OH-rah eh lah MEHS-sah" },
    { language: "Italian", phrase: "Dov'è la confessione?", meaning: "Where is confession?", pronunciation: "doh-VEH lah kohn-feh-see-OH-neh" },
    { language: "Italian", phrase: "Per favore", meaning: "Please", pronunciation: "pair fah-VOH-ray" },
    { language: "Italian", phrase: "Grazie mille", meaning: "Thank you very much", pronunciation: "GRAHT-see-eh MEEL-leh" },
    { language: "Italian", phrase: "Scusi", meaning: "Excuse me", pronunciation: "SKOO-zee" },
    { language: "Italian", phrase: "Il conto, per favore", meaning: "The check, please", pronunciation: "eel KOHN-toh pair fah-VOH-ray" },
  ],
  emergency: [
    { city: "Rome", police: "112 (EU emergency) · 113 (police)", medical: "118", nearestConsulate: "US Embassy: Via Vittorio Veneto 121 · +39 06 46741" },
    { city: "Assisi", police: "112 · 113", medical: "118 · Ospedale di Assisi: +39 075 8139 1", nearestConsulate: "US Consulate Florence: +39 055 266 951" },
  ],
  shrines: [
    {
      city: "Rome",
      name: "St. Peter's Basilica & Tomb of the Apostle",
      why:
        "The founding witness of the Church. A Mass at the Scavi altar, directly above St. Peter's grave, is the anchor of any Roman pilgrimage.",
      massTimes: "Group Mass reserved at 09:00 via the Scavi office.",
      confessionTimes: "Penitentiaries daily in English, 08:00–12:30 and 15:30–18:00.",
    },
    {
      city: "Rome",
      name: "Basilica of St. John Lateran",
      why:
        "The cathedral of Rome and the pope's cathedra. The Scala Santa opposite is traditionally climbed on the knees — optional for those able.",
      massTimes: "11:00 group Mass reserved at a side chapel.",
      confessionTimes: "Scheduled at the basilica 07:00–19:00, multilingual.",
    },
    {
      city: "Rome",
      name: "Santa Maria Maggiore",
      why:
        "The Marian anchor of Rome, home to the Salus Populi Romani icon. Built on the site of the miraculous August snowfall.",
      massTimes: "07:00, 08:00, 09:00, 10:00, 11:00, 12:00, 17:00, 18:00 daily.",
    },
    {
      city: "Rome",
      name: "St. Paul Outside the Walls",
      why:
        "The tomb of the Apostle to the Gentiles. Quieter than the other three, and the most meditative of the papal basilicas.",
      massTimes: "07:00, 08:00, 10:30 (capitular), 12:00, 17:00 daily.",
    },
    {
      city: "Assisi",
      name: "Basilica di San Francesco",
      why:
        "The upper basilica has the Giotto cycle; the lower holds the tomb of St. Francis. The Porziuncola indulgence can be received here.",
      massTimes: "Daily 07:15, 09:00, 11:00, 17:00 (Vespers at 18:00).",
      confessionTimes: "Daily 09:00–12:00 and 15:00–18:00, multiple languages.",
    },
    {
      city: "Assisi",
      name: "Porziuncola · Santa Maria degli Angeli",
      why:
        "The little church St. Francis rebuilt with his own hands. The Portiuncula indulgence is available year-round.",
      massTimes: "Every hour from 07:00 to 12:00, and 17:00, 18:30 daily.",
    },
    {
      city: "Assisi",
      name: "Basilica di Santa Chiara",
      why:
        "The resting place of St. Clare. The incorrupt San Damiano cross that spoke to St. Francis is preserved here.",
      massTimes: "07:15, 08:30, 11:00, 18:00 daily.",
    },
    {
      city: "Assisi",
      name: "Eremo delle Carceri",
      why:
        "The hillside hermitage where St. Francis prayed in silence. A 4km walk up from town through oak and olive.",
      massTimes: "08:30 daily (group Mass by arrangement with the friars).",
    },
  ],
  packing: [
    {
      category: "Clothing",
      items: [
        "Modest layers — shoulders covered, knees covered at every basilica",
        "Light scarf or shawl (for women; doubles as sun cover)",
        "Comfortable walking shoes, broken in — Rome is cobblestones",
        "Long pants for men at St. Peter's and San Francesco",
        "Light sweater — basilicas are cool year-round",
      ],
    },
    {
      category: "Devotional",
      items: [
        "Rosary",
        "Small notebook for reflection",
        "Prayer book or breviary",
        "Medals, small religious articles for Papal Audience blessing",
      ],
    },
    {
      category: "Documents",
      items: [
        "Passport (6+ months validity)",
        "ETIAS authorization printout",
        "Travel insurance card",
        "Group confirmation packet from Vocatio",
      ],
    },
    {
      category: "Tech",
      items: [
        "Universal adapter (Type C/F)",
        "Phone with offline maps downloaded",
        "eSIM activated before flight",
      ],
    },
    {
      category: "Just in case",
      items: [
        "Refillable water bottle (fontanelle are everywhere in Rome)",
        "Small first-aid (bandaids, ibuprofen, blister kit)",
        "Sunscreen (SPF 30+)",
        "Light umbrella",
      ],
    },
  ],
};
