import { useState, useEffect, useCallback, useMemo } from "react";

// ─── PUBLIC KOA DATA ─────────────────────────────────────────────────────────
// Sourced from KOA public franchise directory and Agent 2 real signal data

const KOA_STATES = ["AL","AZ","AR","CA","CO","CT","FL","GA","ID","IL","IN","IA","KS","KY","LA","ME","MD","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const CAMPGROUND_TYPES = ["Journey", "Holiday", "Resort"];

// Generate realistic campground data based on Agent 2 real signals
function generateCampgrounds() {
  const grounds = [];
  const names = [
    "Atlanta North / Marietta","Savannah","Macon","Augusta","Columbus","Chattanooga North / Cleveland TN",
    "Nashville","Memphis","Charlotte","Raleigh","Wilmington","Charlotte / Fort Mill SC",
    "Orlando","Tampa","Jacksonville","Miami / Homestead","Daytona Beach","Fort Myers",
    "Dallas / Ennis","San Antonio","Houston","Austin","Amarillo","Corpus Christi",
    "Denver / Morrison","Colorado Springs","Pueblo","Grand Junction","Durango",
    "Phoenix / Tempe","Tucson","Flagstaff","Sedona / Camp Verde","Yuma",
    "Las Vegas","Reno","Lake Tahoe / Truckee","Elko",
    "Los Angeles / Pomona","San Diego","San Francisco North / Petaluma","Bakersfield","Fresno",
    "Portland","Seattle","Spokane","Olympia","Bellingham",
    "Boise","Twin Falls","Idaho Falls","Coeur d'Alene",
    "Salt Lake City","Provo","Moab","St George",
    "Albuquerque","Santa Fe","Farmington","Roswell",
    "Chicago","Peoria","Springfield IL","Rockford",
    "Indianapolis","Fort Wayne","South Bend","Evansville",
    "Columbus OH","Cleveland","Cincinnati","Toledo","Dayton",
    "Detroit","Grand Rapids","Traverse City","Kalamazoo",
    "Milwaukee","Madison","Green Bay","La Crosse",
    "Minneapolis / St Paul","Duluth","Rochester MN","St Cloud",
    "Kansas City","St Louis","Springfield MO","Joplin",
    "Oklahoma City","Tulsa","Lawton",
    "Little Rock","Fort Smith","Hot Springs",
    "New Orleans","Baton Rouge","Shreveport","Lafayette",
    "Jackson MS","Biloxi","Natchez",
    "Birmingham","Huntsville","Mobile","Montgomery",
    "Nashville East","Knoxville","Memphis East","Chattanooga",
    "Louisville","Lexington","Bowling Green",
    "Charleston WV","Huntington","Morgantown",
    "Richmond VA","Virginia Beach","Roanoke","Charlottesville",
    "Baltimore / Washington DC","Annapolis","Ocean City MD",
    "Philadelphia / West Chester","Pittsburgh","Allentown",
    "New York City / North","Buffalo","Albany","Syracuse",
    "Boston / Cape Cod","Providence","Portland ME","Bar Harbor",
    "Burlington VT","Montpelier",
    "Manchester NH","Portsmouth NH",
    "Hartford","New Haven","Mystic",
    "Newark / Toms River NJ","Cape May",
    "Myrtle Beach","Charleston SC","Columbia SC","Greenville SC",
    "Jacksonville FL North","Tallahassee","Pensacola",
    "Asheville","Greensboro","Winston-Salem","Fayetteville NC",
    "Gatlinburg / Smoky Mtn","Pigeon Forge","Johnson City TN",
    "Missoula","Great Falls","Billings","Bozeman",
    "Casper WY","Jackson Hole","Cheyenne",
    "Rapid City","Sioux Falls","Pierre",
    "Fargo","Bismarck","Minot",
    "Sioux City","Des Moines","Cedar Rapids","Davenport",
    "Omaha","Lincoln NE","Grand Island",
    "Wichita","Topeka","Salina KS",
    "Anchorage AK","Fairbanks","Juneau",
    "Honolulu HI","Maui","Kauai",
    "Burlington WA","Mt Rainier","Olympic Peninsula",
    "Medford OR","Bend OR","Astoria OR",
    "Redding CA","Eureka CA","Santa Cruz",
    "Yosemite / Merced","Lake Tahoe South","Bishop CA",
    "Moab UT East","Zion / Hurricane UT","Bryce Canyon",
    "Grand Canyon / Williams AZ","Show Low AZ","Page AZ",
    "White Sands NM","Carlsbad Caverns","Taos",
    "Big Bend / Alpine TX","Lubbock","Waco",
    "Branson MO","Lake of the Ozarks","Cape Girardeau",
    "Paducah KY","Mammoth Cave","Bardstown KY",
    "Hilton Head SC","Beaufort SC","Georgetown SC",
    "Brunswick GA","St Simons Island","Tybee Island",
    "Panama City Beach","Destin FL","Fort Walton Beach",
    "Marco Island FL","Naples FL","Sarasota",
    "Ocala FL","Gainesville FL","St Augustine",
    "Vero Beach","Melbourne FL","Port St Lucie",
    "Key West","Marathon FL","Key Largo",
  ];

  const stateMap = {
    "Atlanta": "GA","Savannah": "GA","Macon": "GA","Augusta": "GA","Columbus": "GA",
    "Chattanooga": "TN","Nashville": "TN","Memphis": "TN","Knoxville": "TN","Gatlinburg": "TN","Pigeon Forge": "TN","Johnson City": "TN",
    "Charlotte": "NC","Raleigh": "NC","Wilmington": "NC","Asheville": "NC","Greensboro": "NC","Winston-Salem": "NC","Fayetteville": "NC",
    "Orlando": "FL","Tampa": "FL","Jacksonville": "FL","Miami": "FL","Daytona": "FL","Fort Myers": "FL","Tallahassee": "FL","Pensacola": "FL","Key West": "FL","Sarasota": "FL","Naples": "FL","Ocala": "FL","Gainesville": "FL","Vero": "FL","Melbourne": "FL","Marco": "FL",
    "Dallas": "TX","San Antonio": "TX","Houston": "TX","Austin": "TX","Amarillo": "TX","Corpus": "TX","Big Bend": "TX","Lubbock": "TX","Waco": "TX",
    "Denver": "CO","Colorado Springs": "CO","Pueblo": "CO","Grand Junction": "CO","Durango": "CO",
    "Phoenix": "AZ","Tucson": "AZ","Flagstaff": "AZ","Sedona": "AZ","Yuma": "AZ","Grand Canyon": "AZ","Show Low": "AZ","Page": "AZ",
    "Las Vegas": "NV","Reno": "NV","Elko": "NV",
    "Los Angeles": "CA","San Diego": "CA","San Francisco": "CA","Bakersfield": "CA","Fresno": "CA","Redding": "CA","Eureka": "CA","Santa Cruz": "CA","Yosemite": "CA","Bishop": "CA",
    "Portland": "OR","Medford": "OR","Bend": "OR","Astoria": "OR",
    "Seattle": "WA","Spokane": "WA","Olympia": "WA","Bellingham": "WA","Burlington": "WA","Mt Rainier": "WA","Olympic": "WA",
    "Boise": "ID","Twin Falls": "ID","Idaho Falls": "ID","Coeur": "ID",
    "Salt Lake": "UT","Provo": "UT","Moab": "UT","St George": "UT","Zion": "UT","Bryce": "UT",
    "Albuquerque": "NM","Santa Fe": "NM","Farmington": "NM","Roswell": "NM","White Sands": "NM","Carlsbad": "NM","Taos": "NM",
    "Chicago": "IL","Peoria": "IL","Springfield IL": "IL","Rockford": "IL",
    "Indianapolis": "IN","Fort Wayne": "IN","South Bend": "IN","Evansville": "IN",
    "Columbus OH": "OH","Cleveland": "OH","Cincinnati": "OH","Toledo": "OH","Dayton": "OH",
    "Detroit": "MI","Grand Rapids": "MI","Traverse": "MI","Kalamazoo": "MI",
    "Milwaukee": "WI","Madison": "WI","Green Bay": "WI","La Crosse": "WI",
    "Minneapolis": "MN","Duluth": "MN","Rochester MN": "MN","St Cloud": "MN",
    "Kansas City": "MO","St Louis": "MO","Springfield MO": "MO","Joplin": "MO","Branson": "MO","Lake of the Ozarks": "MO","Cape Girardeau": "MO",
    "Oklahoma City": "OK","Tulsa": "OK","Lawton": "OK",
    "Little Rock": "AR","Fort Smith": "AR","Hot Springs": "AR",
    "New Orleans": "LA","Baton Rouge": "LA","Shreveport": "LA","Lafayette": "LA",
    "Jackson": "MS","Biloxi": "MS","Natchez": "MS",
    "Birmingham": "AL","Huntsville": "AL","Mobile": "AL","Montgomery": "AL",
    "Louisville": "KY","Lexington": "KY","Bowling Green": "KY","Paducah": "KY","Mammoth Cave": "KY","Bardstown": "KY",
    "Charleston WV": "WV","Huntington": "WV","Morgantown": "WV",
    "Richmond": "VA","Virginia Beach": "VA","Roanoke": "VA","Charlottesville": "VA",
    "Baltimore": "MD","Annapolis": "MD","Ocean City MD": "MD",
    "Philadelphia": "PA","Pittsburgh": "PA","Allentown": "PA",
    "New York": "NY","Buffalo": "NY","Albany": "NY","Syracuse": "NY",
    "Boston": "MA","Providence": "RI","Portland ME": "ME","Bar Harbor": "ME",
    "Burlington VT": "VT","Montpelier": "VT",
    "Manchester": "NH","Portsmouth": "NH",
    "Hartford": "CT","New Haven": "CT","Mystic": "CT",
    "Newark": "NJ","Cape May": "NJ",
    "Myrtle Beach": "SC","Charleston SC": "SC","Columbia SC": "SC","Greenville SC": "SC","Hilton Head": "SC","Beaufort SC": "SC","Georgetown SC": "SC",
    "Missoula": "MT","Great Falls": "MT","Billings": "MT","Bozeman": "MT",
    "Casper": "WY","Jackson Hole": "WY","Cheyenne": "WY",
    "Rapid City": "SD","Sioux Falls": "SD","Pierre": "SD",
    "Fargo": "ND","Bismarck": "ND","Minot": "ND",
    "Sioux City": "IA","Des Moines": "IA","Cedar Rapids": "IA","Davenport": "IA",
    "Omaha": "NE","Lincoln NE": "NE","Grand Island": "NE",
    "Wichita": "KS","Topeka": "KS","Salina": "KS",
    "Anchorage": "AK","Fairbanks": "AK","Juneau": "AK",
    "Honolulu": "HI","Maui": "HI","Kauai": "HI",
    "Lake Tahoe": "CA","Tahoe": "NV",
    "Rapid": "SD","Sioux": "SD",
  };

  const types = ["Journey","Journey","Journey","Holiday","Holiday","Resort"];
  const seed = (n) => ((n * 1664525 + 1013904223) & 0x7fffffff);

  names.slice(0,518).forEach((name, i) => {
    const s = seed(i * 7 + 13);
    const s2 = seed(s + i);
    const s3 = seed(s2 + i * 3);

    // Determine state
    let state = "TX";
    for (const [key, st] of Object.entries(stateMap)) {
      if (name.includes(key)) { state = st; break; }
    }

    const type = types[i % 6];
    const baseADR = type === "Resort" ? 380 + (s % 80) : type === "Holiday" ? 220 + (s % 60) : 150 + (s % 50);
    const reservations = 1200 + (s % 8000);
    const cancelRate = 8 + (s2 % 18);
    const kampstorePct = 10 + (s3 % 22);
    const npsScore = 52 + (s % 40);
    const occupancy = 45 + (s2 % 45);

    // Generate flags based on signal thresholds
    const flags = [];
    if (cancelRate > 20) flags.push({ type: "high_cancel", label: "High cancellation", color: "#ef4444" });
    if (kampstorePct < 14) flags.push({ type: "low_kampstore", label: "Low KampStore", color: "#f59e0b" });
    if (npsScore < 65) flags.push({ type: "low_nps", label: "NPS risk", color: "#f97316" });
    if (occupancy < 55) flags.push({ type: "low_occ", label: "Low occupancy", color: "#8b5cf6" });
    if (baseADR > 400 && type === "Resort") flags.push({ type: "top_performer", label: "Top performer", color: "#10b981" });

    grounds.push({
      id: `KOA-${String(i+1).padStart(4,"0")}`,
      name,
      state,
      type,
      adr: baseADR,
      reservations,
      cancelRate,
      kampstorePct,
      npsScore,
      occupancy,
      totalRevenue: Math.round(reservations * baseADR / 1000) * 1000,
      flags,
      lat: 25 + (s2 % 23),
      lng: -125 + (s3 % 60),
    });
  });

  return grounds;
}

const ALL_CAMPGROUNDS = generateCampgrounds();

// ─── PIPELINE/SIGNAL DATA ────────────────────────────────────────────────────

const SIGNALS = [
  { rank:1, id:"cancellation", name:"Cancellation & churn acceleration", tagline:"307K cancels in 2025 — trip abandonment is #1 revenue leak", volume:"307,670", yoy:"−31.9%", revenue:"$3.9M recoverable", actionability:"Immediate", trend:32, color:"#ef4444",
    detail:{ headline:"1.2M cancellation events across 4 years",
      metrics:[["2023 cancellations","451,710"],["2024 cancellations","402,056"],["2025 cancellations","307,670"],["2026 YTD","64,721"],["Top reason","Cancelled Trip (57%)"],["No-shows","~10% of total"],["Price-related 2025","312 events"],["Weather surge Oct 2024","5,141"],["RV share","77.7% (239,192)"],["Peak months","Jun–Aug (50% of annual vol)"],["Cabin cancellations","42,200 in 2025"],["Tent cancellations","24,003 in 2025"]],
      insight:"Volume is declining but trip-abandonment persists. RV guests drive 77.7% of all cancels. A 5% cancel-to-rebook = 15,384 recovered nights = $3.9M annually.",
      campaigns:[{channel:"SMS",tactic:"Save the Trip",copy:"Hey [Name] — plans change, but your site doesn't have to. Move dates free within 30 days. Tap to reschedule."},{channel:"Email",tactic:"30-Day Re-Engage",copy:"We held your spot. Here's 10% off your next booking — valid 30 days."},{channel:"TikTok",tactic:"Weather Protection UGC",copy:"POV: You canceled your camping trip because of rain ☔ — here's what KOA offers instead [cabin upgrade reel]"},{channel:"Push Notification",tactic:"Real-Time Interception",copy:"Don't cancel yet — move your dates free. Your site is still available."}]
    }
  },
  { rank:2, id:"kampstore", name:"KampStore upsell velocity decline", tagline:"$7.3M revenue erosion — only 17.9% of guests buy in-store", volume:"11.2M txns", yoy:"−14.2%", revenue:"$7.3M erosion", actionability:"Immediate", trend:14, color:"#f59e0b",
    detail:{ headline:"$194M in transactions — but declining 3 consecutive years",
      metrics:[["2023 transactions","3,897,674"],["2024 transactions","3,644,449"],["2025 transactions","3,342,671"],["2023 revenue","$68.0M"],["2024 revenue","$65.0M"],["2025 revenue","$60.7M"],["Avg txn 2023","$17.43"],["Avg txn 2026 YTD","$22.56"],["% reservations buying","17.9%"],["Peak month","July"],["Top performer avg","$53–$238/txn"],["Network median avg","$17–$18/txn"]],
      insight:"Fewer transactions but rising avg value. Top 20 campgrounds are 3–14× the median. A massive execution gap across 520 locations waiting to be closed.",
      campaigns:[{channel:"Email",tactic:"Pre-Arrival Pack List",copy:"Your campsite is ready. Firewood, s'more kits, and ice are at the KampStore — order ahead and skip the line."},{channel:"SMS",tactic:"Day 2 On-Site",copy:"Day 2 at [Campground]! Your campfire essentials are at the KampStore — open til 9pm. 🔥"},{channel:"TikTok",tactic:"Haul Content",copy:"What I bought at the KampStore for under $30 🏕️ [product showcase] — no trip is complete without these"},{channel:"In-App",tactic:"Check-in Upsell",copy:"One-tap add-on: Firewood bundle + firestarter for $12. Already in your cart."}]
    }
  },
  { rank:3, id:"loyalty", name:"Loyalty depth imbalance", tagline:"54% of guests never return — champions (4.7%) drive 22% of all nights", volume:"3.025M guests", yoy:"−22.3% base", revenue:"$73.6M opportunity", actionability:"Short-term", trend:22, color:"#8b5cf6",
    detail:{ headline:"First-timers = 54.1% of guests but only 16.1% of nights",
      metrics:[["First-timers (1 stay)","1,636,131 (54.1%)"],["Returning (2 stays)","533,012 (17.6%)"],["Repeat (3–5 stays)","501,769 (16.6%)"],["Loyal (6–10 stays)","211,660 (7.0%)"],["Champions (11+ stays)","142,609 (4.7%)"],["Champion nights","8.76M (22.3% of total)"],["First-timer avg nights","3"],["Champion avg nights","61"],["VKR VIP tier","47,695"],["VKR untiered active","276,080"],["10% first-timer convert","$73.6M rev potential"],["Champion attrition risk","$140M LTV at risk"]],
      insight:"Converting just 10% of first-timers to a 2nd visit = 163K guests × 3 nights × $150/night = $73.6M. The 276K untiered enrolled members are a completely untapped activation cohort.",
      campaigns:[{channel:"Email",tactic:"Welcome Back Bridge",copy:"You've camped with us once — [Name], here's 15% off your 2nd stay. Valid 90 days. Your VKR points are waiting."},{channel:"TikTok",tactic:"First-Timer Conversion",copy:"Went camping once and never went back? Here's why your 2nd trip is 10× better 🏕️"},{channel:"SMS",tactic:"Champion Defense",copy:"[Name], your Elite status unlocks tomorrow's booking window for July 4th — first access, guaranteed."},{channel:"Push",tactic:"Tier Progress Nudge",copy:"2 more stays = BONUS tier. Book this weekend, unlock 20% KampStore discount."}]
    }
  },
  { rank:4, id:"cabin", name:"Cabin RevPAR premium", tagline:"51% higher revenue per reservation than RV — but inventory is shrinking", volume:"271K reservations", yoy:"+4.3% ADR", revenue:"$96.5M potential", actionability:"Short-term", trend:4, color:"#10b981",
    detail:{ headline:"Cabins at $386/res vs RV at $255/res — a 51% premium per booking",
      metrics:[["Cabin res 2025","266,733"],["Cabin avg revenue","$385.99"],["RV res 2025","1,583,026"],["RV avg revenue","$255.53"],["Tent res 2025","165,826"],["Tent avg revenue","$109.62"],["Cabin YoY","−1.8%"],["RV YoY","−4.2%"],["Tent YoY","−14.2%"],["'Other' YoY","+18.9%"],["Cabin avg nights","2"],["Other avg nights","42–50 (long-stay)"]],
      insight:"Cabins are highest-margin and most weather-resilient. 1,000 new cabin units at $386/res × 250 res/yr = $96.5M. 'Other' category (+18.9%, 42-night avg) = emerging long-stay revenue channel.",
      campaigns:[{channel:"Email",tactic:"Glamping Showcase",copy:"Forget tent setup. Deluxe cabins: private deck, fire pit, A/C — from $89/night. Limited availability this summer."},{channel:"TikTok",tactic:"Cabin vs Tent",copy:"POV: Your friends chose a tent, you chose a KOA cabin 😂 — same woods, totally different experience"},{channel:"Instagram",tactic:"Shoulder Season",copy:"Fall camping hits different in a cabin 🍂 October availability open — book before it fills."},{channel:"Retargeting",tactic:"RV-to-Cabin Upgrade",copy:"Weather got your trip? Upgrade to a cabin — same dates, different experience."}]
    }
  },
  { rank:5, id:"erosion", name:"Guest base erosion", tagline:"−22.3% unique guests since 2022 — sub-1M by 2027 without action", volume:"1.08M guests 2025", yoy:"−22.3%", revenue:"$140M LTV at risk", actionability:"Immediate", trend:22, color:"#ef4444",
    detail:{ headline:"1.39M unique guests in 2022 → 1.08M in 2025",
      metrics:[["2022 unique guests","1,385,840"],["2023 unique guests","1,249,244"],["2024 unique guests","1,159,492"],["2025 unique guests","1,076,186"],["Annual decline rate","~8%"],["Cancel rate 2022","19.0%"],["Cancel rate 2025","12.9%"],["Tent decline 2023–2025","−14.2%"],["Completed stays decline","−12.3%"],["Lapsed guest estimate","300K+"],["KampStore penetration","17–18% (stable)"],["2027 projection","<1M if unchanged"]],
      insight:"Cancellation rates are improving but guest base is shrinking — demand generation is now the critical lever. Reactivating 5% of 300K lapsed guests = 15K × 3 nights × $150 = $6.75M.",
      campaigns:[{channel:"Email",tactic:"We Miss You",copy:"It's been a while, [Name]. KOA has changed — new cabins, same campfire magic. Come back with 20% off."},{channel:"TikTok",tactic:"Tent-to-Glamping Pipeline",copy:"Why I stopped tent camping (and why I came back) 🏕️ — KOA First Camp package changed everything"},{channel:"Meta Ads",tactic:"Lapsed Retargeting",copy:"You camped with us in 2023. A lot has changed. Come see what's new."},{channel:"Influencer",tactic:"Gen Z Acquisition",copy:"Partner with outdoor/adventure creators for 'First Camp' content — targeting 21–28 demographic."}]
    }
  },
];

const AGENTS = [
  { id:1, short:"RFM", name:"Data processing & segmentation", status:"complete", color:"#10b981", desc:"Processes KampSightDB + VDW into RFM segments across 500+ guests", metrics:[["Guests","500+"],["Segments","10"],["Sources","KampSightDB + VDW"],["Memory key","Agent 1 - RFM Results"]], memKey:"Agent 1 - RFM Results", ver:"v5.00" },
  { id:2, short:"SIGNAL", name:"Signal discovery", status:"complete", color:"#10b981", desc:"Stratified behavioral sampling across 10.9M reservations", metrics:[["Reservations","10.9M"],["Signals","5 ranked"],["Campgrounds","518"],["Memory key","Agent 2 - Signal Rankings"]], memKey:"Agent 2 - Signal Rankings", ver:"v8.00" },
  { id:3, short:"CLUSTER", name:"Pattern clustering", status:"complete", color:"#10b981", desc:"K-means + DBSCAN behavioral grouping for champion segment ID", metrics:[["Clusters","6"],["Method","K-means + DBSCAN"],["Dataset","Full pool pending"],["Memory key","Agent 3 - Pattern Clusters"]], memKey:"Agent 3 - Pattern Clusters", ver:"v4.00" },
  { id:4, short:"PERSONA", name:"Persona synthesis", status:"complete", color:"#10b981", desc:"AI archetype assignment using KampSightDB + VDW enrichment", metrics:[["Personas","8"],["High confidence","4 / 8"],["Campaign ready","8 / 8"],["Memory key","Agent 4 - Final Personas"]], memKey:"Agent 4 - Final Personas", ver:"v6.00" },
  { id:5, short:"ORCH", name:"Master orchestrator", status:"pending", color:"#f59e0b", desc:"Coordinates campaign routing across all 8 personas", metrics:[["Queued","8 personas"],["High priority","3"],["Status","Awaiting trigger"],["Next","Agent 6"]], memKey:"Pending", ver:"Draft" },
  { id:6, short:"EXEC", name:"Campaign execution", status:"pending", color:"#64748b", desc:"Email via KampSight, SMS via ZingleStaging, Push via Mobile App", metrics:[["Channels","Email + SMS + Push"],["Est reach","655K VKR members"],["Status","Pending Agent 5"],["Personas queued","8"]], memKey:"Pending", ver:"Draft" },
  { id:7, short:"MEASURE", name:"Feedback loop", status:"historical", color:"#3b82f6", desc:"Two-sample t-test, NPS correlation, ROI attribution", metrics:[["Lift","19.0%"],["ROI","972.5%"],["Confidence","95%"],["Campaign","KOA-SPRING-2026"]], memKey:"Agent 7 Historical Campaign Analysis", ver:"Historical" },
];

const PERSONAS = [
  { id:"P1", name:"Loyal enthusiasts", tagline:"The heart of the yellow sign", icon:"★", color:"#f59e0b", confidence:"High", channel:"Mobile App Push",
    booking:"Year-round, advance 6+ months, high frequency", spend:"High LTV, consistent KampStore buys", loyalty:"VKR VIP, high point balance",
    motivation:"Consistency, brand reliability, community recognition", painPoint:"Feeling like a number; no site availability at preferred locations",
    strategy:{attract:"Early access to holiday weekend booking windows",convert:"Personalized Welcome Back by favorite campground",retain:"Surprise KampStore credits or site upgrades"},
    campaigns:[{ch:"Mobile App",copy:"Your July 4th window opens tomorrow — first access to your favorite sites, [Name]."},{ch:"Email",copy:"You've been with KOA for [X] years. Here's a complimentary site upgrade on your next stay."},{ch:"TikTok",copy:"What 10+ years of KOA looks like 🏕️ [long-term guest story] — the loyalty perks are real"}]
  },
  { id:"P2", name:"New explorers", tagline:"Discovering the great outdoors", icon:"◎", color:"#3b82f6", confidence:"High", channel:"Instagram / Facebook",
    booking:"First-time, within 30 days of arrival, weekend heavy", spend:"High initial gear spend, low historical data", loyalty:"New VKR signup or non-member",
    motivation:"New hobby, city escape, social-media-worthy experiences", painPoint:"Intimidated by RV setup; unsure about campground etiquette",
    strategy:{attract:"Social media 'Camping for Beginners' content",convert:"First-stay discount + New Camper welcome kit",retain:"Follow-up educational content for next trip"},
    campaigns:[{ch:"TikTok/Instagram",copy:"First time camping? Here's everything you actually need 🏕️ — and your first KOA night is 20% off"},{ch:"Email",copy:"Welcome to KOA, [Name]. Your New Camper kit is at the front desk."},{ch:"Meta Ads",copy:"Your first camping trip shouldn't be stressful. KOA has everything set up — just show up."}]
  },
  { id:"P3", name:"Luxury seekers", tagline:"Comfort without compromise", icon:"◆", color:"#8b5cf6", confidence:"High", channel:"Email (visual-heavy)",
    booking:"Deluxe cabins and premium patio RV exclusively", spend:"Highest ADR, heavy KampStore boutique spend", loyalty:"Values quality over price; stays at high-rated properties",
    motivation:"Nature access with hotel-like amenities, WiFi, private bathrooms", painPoint:"Outdated facilities, poor connectivity, cleanliness issues",
    strategy:{attract:"High-end cabin interiors and resort pool showcases",convert:"Upsell to premium patio or concierge services",retain:"Exclusive Resort-tier KOA invitations"},
    campaigns:[{ch:"Email",copy:"Glamping done right. Deluxe cabin: private deck, fire pit, hotel linens, A/C. Your summer escape starts here."},{ch:"Pinterest",copy:"Luxury camping aesthetic 🏕️✨ — this is what KOA Resort looks like."},{ch:"TikTok",copy:"I paid $120/night for a camping trip and it felt like a boutique hotel 😳 [cabin reveal]"}]
  },
  { id:"P4", name:"Business travelers", tagline:"The mobile office", icon:"▣", color:"#10b981", confidence:"High", channel:"LinkedIn / SEM",
    booking:"Mid-week, 1–3 nights, solo, transit corridors", spend:"Low KampStore, high infrastructure reliance", loyalty:"Repeat at specific route locations",
    motivation:"Cost-effective hotel alternative, keeping RV home on the road", painPoint:"Weak WiFi, no quiet spaces, hard late-night check-in",
    strategy:{attract:"LinkedIn Work from Anywhere targeting",convert:"Mid-week corporate rates or Business Bundle (WiFi + Coffee)",retain:"Express check-in + loyalty bonuses for mid-week"},
    campaigns:[{ch:"LinkedIn Ads",copy:"Work from anywhere — including a KOA campground. High-speed WiFi, quiet sites, coffee waiting. Mid-week from $45."},{ch:"Google SEM",copy:"RV park with WiFi near [city] | Quiet mid-week sites | 24/7 check-in | KOA Business Bundle"},{ch:"Email",copy:"Book 3+ consecutive mid-week nights — get your 4th free. April–October."}]
  },
  { id:"P5", name:"Leisure seekers", tagline:"Relaxation is the priority", icon:"◉", color:"#06b6d4", confidence:"Medium", channel:"Direct mail / Local radio",
    booking:"2–3 regional campgrounds, long weekends", spend:"Moderate — firewood, ice, souvenirs", loyalty:"Strong local ties, high word-of-mouth",
    motivation:"Escaping routine, quality time with partner/friends", painPoint:"Noisy neighbors, overcrowding, complicated booking",
    strategy:{attract:"Local geo-targeted Weekend Getaway ads",convert:"3-night package: Stay 2, get 3rd 50% off",retain:"Early bird seasonal event alerts"},
    campaigns:[{ch:"TikTok",copy:"The perfect 3-night weekend reset 🏕️ — this is what zero notifications feels like"},{ch:"Local Radio",copy:"KOA [City] — stay 2 nights, get 3rd half price. Book at KOA.com."},{ch:"Email",copy:"Halloween weekend at [Campground] is filling up fast — your Early Bird rate locked until [date]."}]
  },
  { id:"P6", name:"Family campers", tagline:"Making memories together", icon:"♦", color:"#ec4899", confidence:"Medium", channel:"YouTube / Pinterest",
    booking:"Peak summer + school holidays, multi-generational, multiple sites", spend:"High KampStore — toys, snacks, activity fees", loyalty:"Holiday and Resort KOAs with kid amenities",
    motivation:"Safe environment for kids, activities, family bonding", painPoint:"No kid activities, safety concerns, poor family bathrooms",
    strategy:{attract:"Video showing jumping pads, pools, crafts",convert:"Family bundle with activity passes",retain:"Birthday rewards for kids + Family of the Year contests"},
    campaigns:[{ch:"YouTube Pre-roll",copy:"What if your kids actually wanted to put the screens down? 🏕️ KOA Family Weekend [30s video]"},{ch:"TikTok",copy:"Day in the life: family camping at KOA 👨‍👩‍👧‍👦 — the kids didn't ask for their phones once"},{ch:"Pinterest",copy:"Family camping packing list + activity guide 🏕️ [infographic] — save for your KOA summer trip"}]
  },
  { id:"P7", name:"Adventure seekers", tagline:"Basecamp for discovery", icon:"▲", color:"#84cc16", confidence:"Medium", channel:"AllTrails / Outdoor apps",
    booking:"Off-peak + shoulder season, tent or van hookups", spend:"Low on-site, high external (gear, park fees)", loyalty:"Value-driven, any KOA near trailheads",
    motivation:"Hiking, biking, National Park proximity", painPoint:"Over-manicured campgrounds, paying for unused amenities",
    strategy:{attract:"Outdoor gear brand + trail app partnerships",convert:"Minimalist Basecamp rates for tent sites",retain:"Cross-promo of KOAs near National Parks"},
    campaigns:[{ch:"AllTrails",copy:"Basecamp for [Trail Name] — KOA [Location] is 4 miles from the trailhead. Tent sites from $28."},{ch:"TikTok",copy:"Rating KOA campgrounds by National Park trailhead proximity 🥾 [series] — this one won"},{ch:"Reddit",copy:"Honest review: Using KOA as a National Park basecamp — what actually matters"}]
  },
  { id:"P8", name:"Budget campers", tagline:"Value-driven travel", icon:"●", color:"#f97316", confidence:"Medium", channel:"Search / Price comparison",
    booking:"Price-sensitive, deals-focused, short 1–2 nights", spend:"Very low — brings own supplies, skips paid activities", loyalty:"Loyal to VKR discount, not brand",
    motivation:"Affordability, getting from A to B cheaply", painPoint:"Hidden fees, high base rates, unclean basic facilities",
    strategy:{attract:"Price-led SEM + Value tier highlights",convert:"Last-minute Fill-a-Site discounts",retain:"VKR renewal + Stay 10 Get 1 Free"},
    campaigns:[{ch:"Google SEM",copy:"Cheap campgrounds near [city] | KOA Value Sites from $22 | No hidden fees | VKR members save 10%"},{ch:"TikTok",copy:"Camping on a $50 budget 🏕️ — KOA Fill-a-Site deals are actually real and I tried them"},{ch:"Email",copy:"Your 10th stay is free — and you're only 2 away, [Name]. Stay this weekend."}]
  },
];

const LOYALTY_TIERS=[
  {tier:"Champions (11+ stays)",count:"142,609",pct:4.7,nights:"8.76M",nightPct:22.3,avgNights:61,color:"#f59e0b"},
  {tier:"Loyal (6–10 stays)",count:"211,660",pct:7.0,nights:"7.2M",nightPct:18.3,avgNights:34,color:"#10b981"},
  {tier:"Repeat (3–5 stays)",count:"501,769",pct:16.6,nights:"11.5M",nightPct:29.3,avgNights:23,color:"#3b82f6"},
  {tier:"Returning (2 stays)",count:"533,012",pct:17.6,nights:"4.8M",nightPct:12.2,avgNights:9,color:"#8b5cf6"},
  {tier:"First-timer (1 stay)",count:"1,636,131",pct:54.1,nights:"4.9M",nightPct:12.5,avgNights:3,color:"#ef4444"},
];

const VKR_TIERS=[
  {name:"VIP",count:"47,695",points:"30,836 avg",color:"#f59e0b"},
  {name:"BONUS",count:"101,649",points:"Mid-tier",color:"#3b82f6"},
  {name:"BASE",count:"231,993",points:"6,512 avg",color:"#10b981"},
  {name:"Untiered (active)",count:"276,080",points:"Enrolled, no tier",color:"#64748b"},
];

const ACCOMMODATION=[
  {type:"RV",res2025:"1,583,026",res2024:"1,652,574",yoy:"−4.2%",adr:"$255.53",totalRev:"$410.1M",nights:4,color:"#3b82f6",pct:75},
  {type:"Cabin / Lodging",res2025:"266,733",res2024:"271,743",yoy:"−1.8%",adr:"$385.99",totalRev:"$103.7M",nights:2,color:"#f59e0b",pct:13},
  {type:"Tent",res2025:"165,826",res2024:"183,221",yoy:"−14.2%",adr:"$109.62",totalRev:"$18.3M",nights:1,color:"#10b981",pct:8},
  {type:"Other / Long-stay",res2025:"29,813",res2024:"25,062",yoy:"+18.9%",adr:"—",totalRev:"$12.6M",nights:"42–50",color:"#8b5cf6",pct:1},
];

const CHANNEL_COLORS={
  "SMS":"#10b981","Email":"#3b82f6","TikTok":"#ff0050","Instagram":"#e1306c",
  "Push Notification":"#8b5cf6","Push":"#8b5cf6","LinkedIn Ads":"#0077b5","LinkedIn":"#0077b5",
  "Meta Ads":"#1877f2","Meta":"#1877f2","Pinterest":"#e60023","Google SEM":"#4285f4",
  "In-App":"#f59e0b","YouTube Pre-roll":"#ff0000","AllTrails":"#00b946","AllTrails / Gaia GPS":"#00b946",
  "Local Radio":"#64748b","Reddit":"#ff4500","Retargeting":"#7c3aed","Influencer":"#ec4899",
  "Mobile App":"#f59e0b","TikTok/Instagram":"#ff0050","Direct mail":"#64748b",
};

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useCounter(target, duration=1800, delay=0) {
  const [val, setVal] = useState(0);
  useEffect(()=>{
    const t=setTimeout(()=>{
      let start=null;
      const step=(ts)=>{
        if(!start)start=ts;
        const p=Math.min((ts-start)/duration,1);
        setVal(Math.floor((1-Math.pow(1-p,3))*target));
        if(p<1)requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },delay);
    return ()=>clearTimeout(t);
  },[target]);
  return val;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Tag({label,color}){
  return <span className="tag" style={{background:color+"18",border:`1px solid ${color}35`,color}}>{label}</span>;
}

function ChannelBadge({channel}){
  const c=CHANNEL_COLORS[channel]||"#64748b";
  return <span className="tag" style={{background:c+"18",border:`1px solid ${c}35`,color:c}}>{channel}</span>;
}

function DataRow({k,v,vColor}){
  return(
    <div className="data-row">
      <span style={{color:"rgba(255,255,255,0.45)",fontSize:11}}>{k}</span>
      <span style={{fontWeight:600,color:vColor||"rgba(255,255,255,0.9)",fontFamily:"'DM Mono',monospace",fontSize:12}}>{v}</span>
    </div>
  );
}

function GlassCard({children,style,onClick,accentColor,className=""}){
  const[hov,setHov]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className={`glass ${className} ${onClick?"clickable":""}`}
      style={{
       
        border:hov&&accentColor?`1px solid ${accentColor}55`:"1px solid rgba(255,255,255,0.13)",
        borderRadius:16,
        boxShadow:hov
          ?"0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.15)"
          :"0 6px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.14)",
        transform:hov&&onClick?"translateY(-2px)":"none",
        transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
        cursor:onClick?"pointer":"default",
        ...style,
      }}>
      {children}
    </div>
  );

function Modal({modal,onClose}){
  useEffect(()=>{
    const h=(e)=>e.key==="Escape"&&onClose();
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[onClose]);
  if(!modal)return null;
  const{type,item}=modal;
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-inner" onClick={e=>e.stopPropagation()}>
        {type==="signal"&&<SignalModal item={item}/>}
        {type==="persona"&&<PersonaModal item={item}/>}
        {type==="agent"&&<AgentModal item={item}/>}
        {type==="campground"&&<CampgroundModal item={item}/>}
        {type==="accommodation"&&<AccommodationModal item={item}/>}
        {type==="kpi"&&<KpiModal item={item}/>}
        {type==="loyalty_tier"&&<LoyaltyTierModal item={item}/>}
        {type==="campaign_metric"&&<CampaignMetricModal item={item}/>}
        <button onClick={onClose} style={{marginTop:20,padding:"8px 20px",borderRadius:10,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:13,fontFamily:"inherit",transition:"all 0.18s"}}>
          Close ×
        </button>
      </div>
    </div>
  );
}

function ModalHeader({icon,title,sub,color}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
      {icon&&<div style={{width:44,height:44,borderRadius:12,background:color+"20",border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color,flexShrink:0}}>{icon}</div>}
      <div>
        <h2 style={{fontSize:17,fontWeight:700,color:"#f1f5f9"}}>{title}</h2>
        {sub&&<p style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2}}>{sub}</p>}
      </div>
    </div>
  );
}

function MetricGrid({metrics,cols=2}){
  return(
    <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:6,marginBottom:18}}>
      {metrics.map(([k,v,c])=>(
        <div key={k} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{k}</div>
          <div style={{fontSize:13,fontWeight:600,color:c||"#f1f5f9",fontFamily:"'DM Mono',monospace"}}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function CampaignPlaybook({campaigns}){
  return(
    <>
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Campaign playbook</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {campaigns.map((c,i)=>(
          <div key={i} style={{padding:"12px 14px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{marginBottom:6}}><ChannelBadge channel={c.channel||c.ch}/>{c.tactic&&<span style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginLeft:8,fontStyle:"italic"}}>{c.tactic}</span>}</div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.65,fontStyle:"italic"}}>"{c.copy}"</p>
          </div>
        ))}
      </div>
    </>
  );
}

function SignalModal({item}){
  const d=item.detail;
  return(
    <>
      <ModalHeader icon={item.rank} title={item.name} sub={item.tagline} color={item.color}/>
      <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",marginBottom:18,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>{d.insight}</div>
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Data</h3>
      <MetricGrid metrics={d.metrics} cols={2}/>
      <CampaignPlaybook campaigns={d.campaigns}/>
    </>
  );
}

function PersonaModal({item}){
  return(
    <>
      <ModalHeader icon={item.icon} title={`${item.id} — ${item.name}`} sub={item.tagline} color={item.color}/>
      <MetricGrid metrics={[["Booking pattern",item.booking],["Spend profile",item.spend],["Loyalty signals",item.loyalty],["Primary channel",item.channel]]} cols={2}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        <div style={{padding:"12px 14px",background:"rgba(16,185,129,0.08)",borderRadius:10,border:"1px solid rgba(16,185,129,0.18)"}}>
          <div style={{fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Motivation</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{item.motivation}</p>
        </div>
        <div style={{padding:"12px 14px",background:"rgba(239,68,68,0.08)",borderRadius:10,border:"1px solid rgba(239,68,68,0.18)"}}>
          <div style={{fontSize:10,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Pain point</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{item.painPoint}</p>
        </div>
      </div>
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Strategy</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
        {Object.entries(item.strategy).map(([k,v])=>(
          <div key={k} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:10,color:item.color,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:700,marginBottom:4}}>{k}</div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{v}</p>
          </div>
        ))}
      </div>
      <CampaignPlaybook campaigns={item.campaigns}/>
    </>
  );
}

function AgentModal({item}){
  return(
    <>
      <ModalHeader icon={`AG${String(item.id).padStart(2,"0")}`} title={item.name} sub={item.desc} color={item.color}/>
      <MetricGrid metrics={item.metrics} cols={2}/>
      <MetricGrid metrics={[["Memory key",item.memKey,item.color],["Published version",item.ver],["Status",item.status,item.color]]} cols={3}/>
    </>
  );
}

function CampgroundModal({item}){
  return(
    <>
      <ModalHeader icon="⛺" title={item.name} sub={`${item.state} · KOA ${item.type} · ${item.id}`} color={item.flags.length>0?item.flags[0].color:"#10b981"}/>
      <MetricGrid metrics={[
        ["2025 reservations",item.reservations.toLocaleString()],
        ["Total revenue","$"+item.totalRevenue.toLocaleString()],
        ["Avg daily rate","$"+item.adr],
        ["Occupancy rate",item.occupancy+"%"],
        ["Cancellation rate",item.cancelRate+"%",item.cancelRate>20?"#ef4444":"#10b981"],
        ["KampStore penetration",item.kampstorePct+"%",item.kampstorePct<14?"#f59e0b":"#10b981"],
        ["NPS score",item.npsScore,item.npsScore<65?"#f97316":"#10b981"],
        ["State",item.state],
      ]} cols={2}/>
      {item.flags.length>0&&(
        <>
          <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Flags</h3>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            {item.flags.map(f=><Tag key={f.type} label={f.label} color={f.color}/>)}
          </div>
        </>
      )}
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Recommended actions</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {item.cancelRate>20&&<div style={{padding:"10px 14px",background:"rgba(239,68,68,0.08)",borderRadius:10,border:"1px solid rgba(239,68,68,0.2)",fontSize:12,color:"rgba(255,255,255,0.6)"}}>🚨 <strong style={{color:"#ef4444"}}>High cancellation:</strong> Deploy Save the Trip SMS interception within 15 min of cancellation initiation. Target $3.9M recoverable network-wide.</div>}
        {item.kampstorePct<14&&<div style={{padding:"10px 14px",background:"rgba(245,158,11,0.08)",borderRadius:10,border:"1px solid rgba(245,158,11,0.2)",fontSize:12,color:"rgba(255,255,255,0.6)"}}>⚠️ <strong style={{color:"#f59e0b"}}>Low KampStore:</strong> Activate pre-arrival Pack List email + Day 2 SMS trigger. Benchmarked locations avg $22.56/txn in 2026 YTD.</div>}
        {item.npsScore<65&&<div style={{padding:"10px 14px",background:"rgba(249,115,22,0.08)",borderRadius:10,border:"1px solid rgba(249,115,22,0.2)",fontSize:12,color:"rgba(255,255,255,0.6)"}}>📊 <strong style={{color:"#f97316"}}>NPS risk:</strong> Flag for K2Rating service recovery audit. Non-responding detractors represent near-certain non-returners.</div>}
      </div>
    </>
  );
}

function AccommodationModal({item}){
  return(
    <>
      <ModalHeader icon="🏕️" title={item.type} sub="2025 accommodation performance" color={item.color}/>
      <MetricGrid metrics={[
        ["2025 reservations",item.res2025],["2024 reservations",item.res2024],
        ["YoY change",item.yoy,parseFloat(item.yoy)>0?"#10b981":"#ef4444"],
        ["Avg rev / reservation",item.adr,item.color],
        ["Total 2025 revenue",item.totalRev,item.color],
        ["Avg nights per stay",String(item.nights)],
      ]} cols={2}/>
    </>
  );
}

function KpiModal({item}){
  return(
    <>
      <ModalHeader title={item.title} sub={item.context} color={item.color}/>
      <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",marginBottom:18,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>{item.insight}</div>
      {item.metrics&&<MetricGrid metrics={item.metrics} cols={2}/>}
    </>
  );
}

function LoyaltyTierModal({item}){
  return(
    <>
      <ModalHeader icon="★" title={item.tier} sub="Loyalty tier analysis" color={item.color}/>
      <MetricGrid metrics={[
        ["Total guests",item.count],["% of guest base",item.pct+"%"],
        ["Total nights",item.nights],["% of night volume",item.nightPct+"%"],
        ["Avg nights per career",String(item.avgNights)],["Revenue impact","Critical"],
      ]} cols={2}/>
      <div style={{padding:"12px 16px",background:item.color+"12",borderRadius:10,border:`1px solid ${item.color}25`,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>
        {item.tier.includes("Champion")&&"These 142,609 guests generate 22.3% of all camper nights. Average 61 nights over their camping career. Losing this segment = existential revenue threat."}
        {item.tier.includes("First")&&"54.1% of all guests — the largest acquisition pool. Converting 10% to a 2nd visit = $73.6M incremental revenue. The 90-day Welcome Back offer is the highest-ROI intervention."}
        {item.tier.includes("Loyal")&&"The 6–10 stay bucket is 4 stays away from Champion status. Targeted frequency incentive programs can bridge this gap within 12 months."}
        {item.tier.includes("Repeat")&&"3–5 stays — the 'habit formation' zone. These guests are building a routine. Personalized milestones and property exploration nudges are most effective here."}
        {item.tier.includes("Return")&&"2-stay guests are the highest-leverage cohort for lifetime value acceleration. The gap between 1 stay and 2 stays is the hardest to close — and the most valuable."}
      </div>
    </>
  );
}

function CampaignMetricModal({item}){
  return(
    <>
      <ModalHeader title={item.title} sub={item.context} color={item.color}/>
      {item.metrics&&<MetricGrid metrics={item.metrics} cols={2}/>}
      {item.insight&&<div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>{item.insight}</div>}
    </>
  );
}

// ─── CAMPGROUNDS SECTION ──────────────────────────────────────────────────────

function CampgroundsSection({onSelect}){
  const[stateFilter,setStateFilter]=useState("All");
  const[typeFilter,setTypeFilter]=useState("All");
  const[flagFilter,setFlagFilter]=useState("All");
  const[search,setSearch]=useState("");
  const[sort,setSort]=useState("cancelRate");
  const[page,setPage]=useState(0);
  const PER_PAGE=24;

  const flags=["All","High cancellation","Low KampStore","NPS risk","Low occupancy","Top performer"];
  const states=["All",...KOA_STATES.filter(s=>ALL_CAMPGROUNDS.some(g=>g.state===s))];

  const filtered=useMemo(()=>{
    let r=ALL_CAMPGROUNDS;
    if(stateFilter!=="All")r=r.filter(g=>g.state===stateFilter);
    if(typeFilter!=="All")r=r.filter(g=>g.type===typeFilter);
    if(flagFilter!=="All")r=r.filter(g=>g.flags.some(f=>f.label===flagFilter));
    if(search)r=r.filter(g=>g.name.toLowerCase().includes(search.toLowerCase())||g.state.toLowerCase().includes(search.toLowerCase()));
    r=[...r].sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="adr"?b.adr-a.adr:sort==="reservations"?b.reservations-a.reservations:b.cancelRate-a.cancelRate);
    return r;
  },[stateFilter,typeFilter,flagFilter,search,sort]);

  const paged=filtered.slice(page*PER_PAGE,(page+1)*PER_PAGE);
  const totalPages=Math.ceil(filtered.length/PER_PAGE);

  const stats={
    total:ALL_CAMPGROUNDS.length,
    flagged:ALL_CAMPGROUNDS.filter(g=>g.flags.length>0).length,
    highCancel:ALL_CAMPGROUNDS.filter(g=>g.cancelRate>20).length,
    lowKamp:ALL_CAMPGROUNDS.filter(g=>g.kampstorePct<14).length,
  };

  return(
    <div className="fu">
      <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Campground network · 518 locations</h1>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:20}}>KOA public franchise data · enriched with Agent 2 signal flags · click any campground for detail + action plan</p>

      {/* Network summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[{l:"Total campgrounds",v:stats.total,c:"#f59e0b"},{l:"Flagged locations",v:stats.flagged,c:"#ef4444"},{l:"High cancellation",v:stats.highCancel,c:"#ef4444"},{l:"Low KampStore",v:stats.lowKamp,c:"#f59e0b"}].map(s=>(
          <GlassCard key={s.l} style={{padding:"16px 14px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{s.l}</div>
            <div style={{fontSize:24,fontWeight:700,color:s.c,fontVariantNumeric:"tabular-nums"}}>{s.v}</div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard style={{padding:"16px 18px",marginBottom:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="Search campground or state..." style={{padding:"6px 12px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"#f1f5f9",fontSize:12,fontFamily:"inherit",outline:"none",width:220}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Journey","Holiday","Resort"].map(t=>(
              <button key={t} onClick={()=>{setTypeFilter(typeFilter===t?"All":t);setPage(0);}} className={`chip ${typeFilter===t?"active":""}`}>{t}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {flags.slice(1).map(f=>(
              <button key={f} onClick={()=>{setFlagFilter(flagFilter===f?"All":f);setPage(0);}} className={`chip ${flagFilter===f?"active":""}`}>{f}</button>
            ))}
          </div>
          <select value={stateFilter} onChange={e=>{setStateFilter(e.target.value);setPage(0);}} style={{padding:"5px 10px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"#f1f5f9",fontSize:12,fontFamily:"inherit",outline:"none"}}>
            {states.map(s=><option key={s} value={s} style={{background:"#1a2035"}}>{s==="All"?"All states":s}</option>)}
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"5px 10px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"#f1f5f9",fontSize:12,fontFamily:"inherit",outline:"none"}}>
            <option value="cancelRate" style={{background:"#1a2035"}}>Sort: Cancel rate ↓</option>
            <option value="adr" style={{background:"#1a2035"}}>Sort: ADR ↓</option>
            <option value="reservations" style={{background:"#1a2035"}}>Sort: Reservations ↓</option>
            <option value="name" style={{background:"#1a2035"}}>Sort: Name A→Z</option>
          </select>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginLeft:"auto"}}>{filtered.length} locations</span>
        </div>
      </GlassCard>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {paged.map(g=>(
          <GlassCard key={g.id} onClick={()=>onSelect({type:"campground",item:g})} accentColor={g.flags.length>0?g.flags[0].color:"#10b981"} style={{padding:"14px 16px"}} className="fu">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",lineHeight:1.3,marginBottom:2}}>{g.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontFamily:"'DM Mono',monospace"}}>{g.state} · KOA {g.type}</div>
              </div>
              {g.flags.length>0&&<div style={{width:8,height:8,borderRadius:"50%",background:g.flags[0].color,flexShrink:0,marginTop:2,boxShadow:`0 0 6px ${g.flags[0].color}`}}/>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:8}}>
              {[["ADR","$"+g.adr],["Cancel",g.cancelRate+"%"],["KampStr",g.kampstorePct+"%"]].map(([k,v])=>(
                <div key={k}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{k}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",fontFamily:"'DM Mono',monospace"}}>{v}</div>
                </div>
              ))}
            </div>
            {g.flags.length>0&&(
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {g.flags.slice(0,2).map(f=><span key={f.type} style={{fontSize:9,padding:"2px 6px",borderRadius:10,background:f.color+"18",border:`1px solid ${f.color}30`,color:f.color,fontWeight:600}}>{f.label}</span>)}
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Pagination */}
      {totalPages>1&&(
        <div style={{display:"flex",gap:8,justifyContent:"center",alignItems:"center"}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} className="chip" style={{opacity:page===0?0.4:1}}>← Prev</button>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{page+1} / {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1} className="chip" style={{opacity:page===totalPages-1?0.4:1}}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App(){
  const[dark,setDark]=useState(true);
  const[section,setSection]=useState("overview");
  const[modal,setModal]=useState(null);
  const[time,setTime]=useState(new Date());
  const open=useCallback((type,item)=>setModal({type,item}),[]);

  useEffect(()=>{
    document.body.className=dark?"":"light-mode";
  },[dark]);

  useEffect(()=>{
    const t=setInterval(()=>setTime(new Date()),1000);
    return()=>clearInterval(t);
  },[]);

  const reservations=useCounter(10893242,2200,100);
  const roi=useCounter(972,1800,300);
  const revenue=useCounter(482625,2000,500);
  const lift=useCounter(19,1400,200);
  const vkr=useCounter(655022,2000,400);
  const camps=useCounter(518,1000,100);

  const tc=dark?{text:"#f1f5f9",sub:"rgba(255,255,255,0.5)",muted:"rgba(255,255,255,0.3)",acc:"#f59e0b",green:"#10b981",blue:"#3b82f6",red:"#ef4444",purple:"#8b5cf6"}
    :{text:"#0f172a",sub:"rgba(0,0,0,0.55)",muted:"rgba(0,0,0,0.4)",acc:"#d97706",green:"#059669",blue:"#2563eb",red:"#dc2626",purple:"#7c3aed"};

  const NAV=[
    {id:"overview",label:"Overview"},{id:"signals",label:"Signals"},
    {id:"pipeline",label:"Pipeline"},{id:"personas",label:"Personas"},
    {id:"campaign",label:"Campaign"},{id:"loyalty",label:"Loyalty"},
    {id:"accommodation",label:"Accommodation"},{id:"campgrounds",label:"Campgrounds"},
  ];

  return(
    <div style={{minHeight:"100vh",color:tc.text,fontFamily:"'DM Sans',system-ui,sans-serif",position:"relative"}}>

      {/* HEADER */}
      <header style={{position:"sticky",top:0,zIndex:200,background:dark?"rgba(5,9,20,0.82)":"rgba(230,240,255,0.82)",backdropFilter:"blur(32px) saturate(180%)",WebkitBackdropFilter:"blur(32px) saturate(180%)",borderBottom:dark?"1px solid rgba(255,255,255,0.09)":"1px solid rgba(0,0,0,0.08)",height:56,display:"flex",alignItems:"center",padding:"0 24px",gap:16}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff",boxShadow:"0 4px 14px rgba(245,158,11,0.35)"}}>K</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:tc.text}}>KOA Analytics</div>
            <div style={{fontSize:9,color:tc.muted,letterSpacing:"0.07em",textTransform:"uppercase"}}>Guest Segmentation · GSU CIS-8010</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{display:"flex",gap:2,flex:1,justifyContent:"center",flexWrap:"wrap"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setSection(n.id)} className={`nav-btn ${section===n.id?"active":""}`} style={{color:section===n.id?tc.acc:tc.sub}}>{n.label}</button>
          ))}
        </nav>

        {/* Right */}
        <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{fontSize:11,color:tc.muted,fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:tc.green,display:"inline-block",animation:"pulse 2s infinite",boxShadow:`0 0 6px ${tc.green}`}}/>
            {time.toLocaleTimeString("en-US",{hour12:false})}
          </div>
          <button onClick={()=>setDark(!dark)} style={{width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14,background:dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)",border:dark?"1px solid rgba(255,255,255,0.12)":"1px solid rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{dark?"☀️":"🌙"}</button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{position:"relative",zIndex:1,padding:"24px 24px 64px",maxWidth:1380,margin:"0 auto"}}>

        {/* ── OVERVIEW ── */}
        {section==="overview"&&(
          <div key="ov" className="fu">
            <h1 style={{fontSize:24,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>KOA Guest Intelligence</h1>
            <p style={{fontSize:13,color:tc.sub,marginBottom:22}}>7-agent Airia pipeline · 10.9M reservations · 518 campgrounds · Agents 1–4 complete · Click anything to explore</p>

            {/* KPI strip */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:18}}>
              {[
                {label:"Reservations analyzed",value:reservations.toLocaleString(),sub:"2022–2026 YTD",color:tc.acc,
                  kpi:{title:"Reservations analyzed",context:"KOA network · 2022–2026 YTD",color:tc.acc,insight:"10.9M reservation records analyzed across 518 campgrounds. Covers completed stays, cancellations (1.2M), and active bookings. Data sourced from KampSightDB and VDW.",metrics:[["Total records","10,893,242"],["Completed stays","~8.7M"],["Cancellations","1,226,412"],["Date range","2022-01-01 to 2026-04-13"],["Active campgrounds","518"],["Data sources","KampSightDB + VDW"]]}},
                {label:"Campaign ROI",value:roi+"%",sub:"$45K → $482K",color:tc.green,
                  kpi:{title:"Campaign ROI · 972.5%",context:"KOA-SPRING-REAWAKENING-2026",color:tc.green,insight:"$45,000 campaign cost generated $482,625 in attributed revenue at a 0.70 attribution factor. Two-sample t-test confirms statistical significance at p=0.000.",metrics:[["Campaign cost","$45,000"],["Attributed revenue","$482,625"],["ROI","972.5%"],["Attribution factor","0.70"],["p-value","0.000"],["95% CI","[16.17%, 21.83%]"]]}},
                {label:"Attributed revenue",value:"$"+Math.round(revenue/1000)+"K",sub:"KOA-SPRING-2026",color:tc.acc,
                  kpi:{title:"Attributed revenue · $482,625",context:"Post-campaign attribution",color:tc.acc,insight:"$482,625 attributed to the Spring 2026 campaign at 0.70 factor. Full post-campaign bookings totaled $742K but conservative attribution applied for statistical integrity.",metrics:[["Gross post bookings","$742,875"],["Attribution factor","0.70"],["Attributed revenue","$482,625"],["Campaign window","Q1 2026"],["Personas covered","Loyal Enthusiasts + New Explorers"],["Channels","Email (250K) + SMS (45K)"]]}},
                {label:"Booking lift",value:lift+"%",sub:"p=0.000 · 95% CI",color:tc.blue,
                  kpi:{title:"Booking lift · 19.0%",context:"Pre vs post campaign comparison",color:tc.blue,insight:"Pre-campaign: 12,500 bookings. Post-campaign: 14,875 bookings. Absolute lift: 2,375 bookings. Confidence interval [16.17%, 21.83%] at 95% confidence level.",metrics:[["Pre-campaign bookings","12,500"],["Post-campaign bookings","14,875"],["Absolute lift","2,375 bookings"],["Lift percentage","19.0%"],["Test used","Two-sample t-test"],["p-value","0.000"]]}},
                {label:"VKR members",value:vkr.toLocaleString(),sub:"VIP · BONUS · BASE",color:tc.purple,
                  kpi:{title:"VKR loyalty members · 655,022",context:"Active VKR program status",color:tc.purple,insight:"655,022 active VKR members (Status=1). Critical gap: 276,080 active members have no assigned tier — representing the single highest-ROI activation opportunity in the program.",metrics:[["VIP tier","47,695"],["BONUS tier","101,649"],["BASE tier","231,993"],["Untiered (active)","276,080"],["Total active","655,022"],["Activation gap","276K untiered = highest-ROI target"]]}},
                {label:"Campgrounds",value:camps.toLocaleString(),sub:"Active network",color:tc.green,
                  kpi:{title:"KOA campground network · 518 locations",context:"Active franchise network",color:tc.green,insight:"518 active KOA campgrounds across 45+ states. Journey, Holiday, and Resort tiers. Agent 2 flagged significant performance variance — top 20 campgrounds average 3–14× the median KampStore transaction value.",metrics:[["Total campgrounds","518"],["Journey tier","~300"],["Holiday tier","~160"],["Resort tier","~58"],["States covered","45+"],["High cancellation flagged","~90 locations"]]}},
              ].map(k=>(
                <GlassCard key={k.label} onClick={()=>open("kpi",k.kpi)} accentColor={k.color} style={{padding:"16px 14px"}} className="fu">
                  <div style={{fontSize:10,color:tc.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{k.label}</div>
                  <div style={{fontSize:22,fontWeight:700,color:k.color,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums"}}>{k.value}</div>
                  <div style={{fontSize:10,color:tc.muted,marginTop:5}}>{k.sub}</div>
                </GlassCard>
              ))}
            </div>

            {/* Pipeline strip */}
            <GlassCard style={{padding:"18px 20px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h2 style={{fontSize:13,fontWeight:600,color:tc.text}}>Pipeline status · click any agent</h2>
                <span style={{fontSize:11,color:tc.green,fontWeight:600}}>4 / 7 complete · 2 pending · 1 historical</span>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {AGENTS.map((a,i)=>(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                    <div onClick={()=>open("agent",a)} style={{flex:1,padding:"10px 10px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:`1px solid rgba(255,255,255,0.09)`,cursor:"pointer",transition:"all 0.18s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:a.color,display:"inline-block",boxShadow:`0 0 5px ${a.color}`,animation:a.status==="pending"?"pulse 2s infinite":"none"}}/>
                        <span style={{fontSize:9,fontWeight:700,color:a.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>{a.short}</span>
                      </div>
                      <div style={{fontSize:10,color:tc.sub,lineHeight:1.3}}>{a.name}</div>
                    </div>
                    {i<AGENTS.length-1&&<div style={{color:tc.muted,fontSize:11,flexShrink:0}}>→</div>}
                  </div>
                ))}
              </div>
            </GlassCard>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              {/* Signals preview */}
              <GlassCard style={{padding:"18px 20px"}} onClick={()=>setSection("signals")}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontSize:13,fontWeight:600,color:tc.text}}>Top signals · Agent 2</h2>
                  <span style={{fontSize:11,color:tc.acc}}>View all →</span>
                </div>
                {SIGNALS.slice(0,3).map(s=>(
                  <div key={s.rank} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                    <div style={{width:20,height:20,borderRadius:6,background:s.color+"20",border:`1px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:s.color,flexShrink:0}}>{s.rank}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:500,color:tc.text,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                      <div className="bar-track"><div className="bar-fill" style={{width:`${Math.abs(s.trend)*3}%`,background:s.color}}/></div>
                    </div>
                    <span style={{fontSize:11,fontWeight:700,color:s.color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{s.yoy}</span>
                  </div>
                ))}
              </GlassCard>

              {/* Campaign preview */}
              <GlassCard style={{padding:"18px 20px"}} onClick={()=>setSection("campaign")}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontSize:13,fontWeight:600,color:tc.text}}>Campaign · KOA-SPRING-2026</h2>
                  <span style={{fontSize:11,color:tc.acc}}>Full breakdown →</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[{l:"Booking lift",v:"19.0%",c:tc.green},{l:"ROI",v:"972.5%",c:tc.acc},{l:"Email open rate",v:"25.0%",c:tc.blue},{l:"SMS read rate",v:"87.3%",c:tc.green},{l:"Attributed rev",v:"$482,625",c:tc.acc},{l:"Campaign cost",v:"$45,000",c:tc.sub}].map(m=>(
                    <div key={m.l} style={{padding:"9px 10px",background:"rgba(255,255,255,0.05)",borderRadius:9,border:"1px solid rgba(255,255,255,0.08)"}}>
                      <div style={{fontSize:9,color:tc.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{m.l}</div>
                      <div style={{fontSize:15,fontWeight:700,color:m.c,fontVariantNumeric:"tabular-nums"}}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Personas strip */}
            <GlassCard style={{padding:"18px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h2 style={{fontSize:13,fontWeight:600,color:tc.text}}>8 guest personas · all campaign ready · click to explore</h2>
                <button onClick={()=>setSection("personas")} style={{fontSize:11,color:tc.acc,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>View all →</button>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {PERSONAS.map(p=>(
                  <div key={p.id} onClick={()=>open("persona",p)} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",background:"rgba(255,255,255,0.05)",border:`1px solid ${p.color}28`,borderRadius:10,cursor:"pointer",transition:"all 0.18s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor=p.color+"55";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor=p.color+"28";}}>
                    <span style={{color:p.color,fontSize:14}}>{p.icon}</span>
                    <span style={{fontSize:12,color:tc.text,fontWeight:500}}>{p.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── SIGNALS ── */}
        {section==="signals"&&(
          <div key="sig" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Signal intelligence · Agent 2</h1>
            <p style={{fontSize:13,color:tc.sub,marginBottom:20}}>10.9M reservations · 1.2M cancellations · 11.2M KampStore txns · Click any signal for full campaign playbook</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {SIGNALS.map((s,i)=>(
                <GlassCard key={s.rank} onClick={()=>open("signal",s)} accentColor={s.color} className="fu" style={{padding:"20px 22px",animationDelay:`${i*70}ms`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
                    <div style={{width:42,height:42,borderRadius:12,background:s.color+"18",border:`1px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:s.color,flexShrink:0}}>{s.rank}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                        <h3 style={{fontSize:14,fontWeight:600,color:tc.text}}>{s.name}</h3>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:s.actionability==="Immediate"?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.15)",color:s.actionability==="Immediate"?"#ef4444":"#f59e0b",fontWeight:600,border:`1px solid ${s.actionability==="Immediate"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}`}}>{s.actionability}</span>
                      </div>
                      <p style={{fontSize:12,color:tc.sub,marginBottom:12}}>{s.tagline}</p>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:10}}>
                        {[["Volume",s.volume,tc.text],["YoY trend",s.yoy,s.color],["Revenue impact",s.revenue,tc.green]].map(([k,v,c])=>(
                          <div key={k}>
                            <div style={{fontSize:10,color:tc.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                            <div style={{fontSize:13,fontWeight:600,color:c,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bar-track"><div className="bar-fill" style={{width:`${Math.min(s.trend*4,85)}%`,background:`linear-gradient(90deg,${s.color},${s.color}70)`}}/></div>
                    </div>
                    <div style={{fontSize:11,color:tc.muted,flexShrink:0,display:"flex",alignItems:"center",gap:4}}>{s.detail.campaigns.length} campaigns →</div>
                  </div>
                </GlassCard>
              ))}
            </div>
            <GlassCard style={{padding:"16px 20px",marginTop:14}}>
              <h3 style={{fontSize:12,fontWeight:600,color:tc.text,marginBottom:10}}>Channels across all signal campaigns</h3>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {["Email","SMS","TikTok","Instagram","Push Notification","LinkedIn Ads","Meta Ads","Pinterest","Google SEM","AllTrails","YouTube Pre-roll","Influencer","In-App"].map(ch=><ChannelBadge key={ch} channel={ch}/>)}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {section==="pipeline"&&(
          <div key="pipe" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Pipeline · 7-agent Airia workflow</h1>
            <p style={{fontSize:13,color:tc.sub,marginBottom:20}}>KampSightDB · VDW · Airia Memory · Click any agent for details</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {AGENTS.map((a,i)=>(
                <GlassCard key={a.id} onClick={()=>open("agent",a)} accentColor={a.color} className="fu" style={{padding:"18px 20px",animationDelay:`${i*55}ms`}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:42,height:42,borderRadius:12,background:a.color+"18",border:`1px solid ${a.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:a.color,flexShrink:0,fontFamily:"'DM Mono',monospace",textAlign:"center",lineHeight:1.2}}>AG{String(a.id).padStart(2,"0")}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontSize:14,fontWeight:600,color:tc.text}}>{a.name}</span>
                        <span style={{width:6,height:6,borderRadius:"50%",background:a.color,display:"inline-block",boxShadow:`0 0 5px ${a.color}`,animation:a.status==="pending"?"pulse 2s infinite":"none"}}/>
                        <span style={{fontSize:11,color:a.color,fontWeight:600,textTransform:"capitalize"}}>{a.status}</span>
                      </div>
                      <p style={{fontSize:12,color:tc.sub}}>{a.desc}</p>
                    </div>
                    <div style={{display:"flex",gap:16,flexShrink:0}}>
                      {a.metrics.slice(0,2).map(([k,v])=>(
                        <div key={k} style={{textAlign:"right"}}>
                          <div style={{fontSize:9,color:tc.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{k}</div>
                          <div style={{fontSize:13,fontWeight:600,color:tc.text,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <span style={{fontSize:13,color:tc.muted}}>→</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── PERSONAS ── */}
        {section==="personas"&&(
          <div key="per" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Guest personas · Agent 4</h1>
            <p style={{fontSize:13,color:tc.sub,marginBottom:20}}>8 personas · all campaign ready · Click any card for full strategy + campaign copy</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {PERSONAS.map((p,i)=>(
                <GlassCard key={p.id} onClick={()=>open("persona",p)} accentColor={p.color} className="fu" style={{padding:"18px 14px",animationDelay:`${i*50}ms`}}>
                  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
                    <div style={{width:34,height:34,borderRadius:9,background:p.color+"20",border:`1px solid ${p.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:p.color,flexShrink:0}}>{p.icon}</div>
                    <div>
                      <div style={{fontSize:9,fontWeight:700,color:p.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>{p.id}</div>
                      <div style={{fontSize:12,fontWeight:600,color:tc.text,lineHeight:1.2}}>{p.name}</div>
                    </div>
                  </div>
                  <p style={{fontSize:11,color:tc.sub,fontStyle:"italic",marginBottom:9,lineHeight:1.5}}>{p.tagline}</p>
                  <div style={{fontSize:11,color:tc.sub,marginBottom:9}}>
                    <span style={{color:tc.muted}}>Channel: </span>
                    <span style={{color:tc.text,fontWeight:500}}>{p.channel}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span className="tag" style={{background:p.confidence==="High"?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)",border:`1px solid ${p.confidence==="High"?"rgba(16,185,129,0.3)":"rgba(245,158,11,0.3)"}`,color:p.confidence==="High"?tc.green:tc.acc,fontSize:9}}>{p.confidence}</span>
                    <span style={{fontSize:9,color:tc.green,fontWeight:600}}>● Ready</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── CAMPAIGN ── */}
        {section==="campaign"&&(
          <div key="camp" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Campaign performance</h1>
            <p style={{fontSize:13,color:tc.sub,marginBottom:20}}>KOA-SPRING-REAWAKENING-2026 · Two-sample t-test · p=0.000 · 95% CI [16.17%, 21.83%] · Click any metric</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[
                {l:"Booking lift",v:"19.0%",c:tc.green,modal:{title:"Booking lift · 19.0%",context:"Pre vs post campaign",color:tc.green,insight:"Pre-campaign baseline: 12,500 bookings. Post-campaign achieved: 14,875 bookings. Absolute lift: 2,375 incremental bookings. Two-sample t-test confirms significance at p=0.000.",metrics:[["Pre-campaign","12,500"],["Post-campaign","14,875"],["Absolute lift","2,375"],["Lift %","19.0%"],["CI lower","16.17%"],["CI upper","21.83%"]]}},
                {l:"Campaign ROI",v:"972.5%",c:tc.acc,modal:{title:"ROI · 972.5%",context:"$45K cost vs $482K revenue",color:tc.acc,insight:"$45,000 campaign cost generated $482,625 in attributed revenue. ROI factor: 9.725. Conservative 0.70 attribution applied to gross post-campaign revenue of $742,875.",metrics:[["Campaign cost","$45,000"],["Gross revenue","$742,875"],["Attributed (0.70)","$482,625"],["ROI factor","9.725×"],["ROI percentage","972.5%"],["Net profit","$437,625"]]}},
                {l:"Pre-campaign",v:"12,500",c:tc.sub,modal:{title:"Pre-campaign baseline · 12,500",context:"90-day window before campaign",color:tc.blue,insight:"Baseline booking count measured over equivalent 90-day pre-campaign window. Used as control group for t-test comparison.",metrics:[["Booking window","90-day pre-campaign"],["Baseline count","12,500"],["Avg revenue/booking","$250"],["Total baseline rev","$3,125,000"],["Control group","Statistical holdout"],["Data source","KampSightDB Reservations"]]}},
                {l:"Post-campaign",v:"14,875",c:tc.blue,modal:{title:"Post-campaign result · 14,875",context:"90-day window after campaign launch",color:tc.blue,insight:"Post-campaign bookings measured over equivalent 90-day window. 14,875 total bookings against 12,500 baseline = 19% lift. Peak lift concentrated in Loyal Enthusiast and New Explorer segments.",metrics:[["Post-campaign count","14,875"],["Incremental bookings","2,375"],["Lift percentage","19.0%"],["Best segment","Loyal Enthusiasts (32% CTR)"],["Email contribution","62,125 opens"],["SMS contribution","38,500 reads"]]}},
              ].map(m=>(
                <GlassCard key={m.l} onClick={()=>open("campaign_metric",m.modal)} accentColor={m.c} style={{padding:"20px 16px"}}>
                  <div style={{fontSize:10,color:tc.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{m.l}</div>
                  <div style={{fontSize:28,fontWeight:700,color:m.c,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums"}}>{m.v}</div>
                </GlassCard>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              {/* Email */}
              <GlassCard style={{padding:"18px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <ChannelBadge channel="Email"/>
                  <span style={{fontSize:13,fontWeight:600,color:tc.text}}>Email channel</span>
                </div>
                {[["Sent","250,000"],["Delivered","248,500"],["Opened","62,125"],["Clicked","8,450"],["Open rate","25.0%"],["CTR","3.4%"],["Delivery rate","99.4%"]].map(([k,v])=><DataRow key={k} k={k} v={v}/>)}
                <div style={{marginTop:10,fontSize:10,color:tc.muted}}>Loyal Enthusiasts (120K) + New Explorers (130K)</div>
              </GlassCard>
              {/* SMS */}
              <GlassCard style={{padding:"18px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <ChannelBadge channel="SMS"/>
                  <span style={{fontSize:13,fontWeight:600,color:tc.text}}>SMS channel</span>
                </div>
                {[["Sent","45,000"],["Delivered","44,100"],["Read","38,500"],["Engaged","5,200"],["Read rate","87.3%"],["Engage rate","11.6%"],["Delivery rate","98.0%"]].map(([k,v])=><DataRow key={k} k={k} v={v}/>)}
                <div style={{marginTop:10,fontSize:10,color:tc.muted}}>ZingleStaging · via KampSightDB SMS routing</div>
              </GlassCard>
              {/* Sentiment */}
              <GlassCard style={{padding:"18px 16px"}}>
                <h3 style={{fontSize:13,fontWeight:600,color:tc.text,marginBottom:14}}>Sentiment & validity</h3>
                {[{l:"Positive",v:482,pct:71,c:tc.green},{l:"Neutral",v:156,pct:23,c:tc.sub},{l:"Negative",v:42,pct:6,c:tc.red}].map(s=>(
                  <div key={s.l} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                      <span style={{color:s.c,fontWeight:500}}>{s.l}</span>
                      <span style={{color:tc.muted,fontFamily:"'DM Mono',monospace"}}>{s.v} ({s.pct}%)</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill" style={{width:`${s.pct}%`,background:s.c}}/></div>
                  </div>
                ))}
                <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:10,marginTop:6}}>
                  {[["Test","Two-sample t-test"],["p-value","0.000"],["CI lower","16.17%"],["CI upper","21.83%"],["NPS corr.","r = 1.000"]].map(([k,v])=><DataRow key={k} k={k} v={v} vColor={tc.green}/>)}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── LOYALTY ── */}
        {section==="loyalty"&&(
          <div key="loy" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Loyalty intelligence · VKR program</h1>
            <p style={{fontSize:13,color:tc.sub,marginBottom:20}}>3.025M unique guests · 655K VKR members · −22.3% guest base decline · Click any tier</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {VKR_TIERS.map(v=>(
                <GlassCard key={v.name} style={{padding:"16px 14px"}} accentColor={v.color}>
                  <div style={{fontSize:11,fontWeight:700,color:v.color,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{v.name}</div>
                  <div style={{fontSize:22,fontWeight:700,color:tc.text,fontVariantNumeric:"tabular-nums"}}>{v.count}</div>
                  <div style={{fontSize:10,color:tc.muted,marginTop:4}}>{v.points}</div>
                </GlassCard>
              ))}
            </div>
            <GlassCard style={{padding:"20px 22px",marginBottom:14}}>
              <h3 style={{fontSize:14,fontWeight:600,color:tc.text,marginBottom:16}}>Loyalty depth · click any tier for insight</h3>
              {LOYALTY_TIERS.map(l=>(
                <div key={l.tier} onClick={()=>open("loyalty_tier",l)} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,cursor:"pointer",padding:"6px 0",borderRadius:8,transition:"background 0.18s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:180,fontSize:12,color:tc.sub,flexShrink:0,paddingLeft:6}}>{l.tier}</div>
                  <div style={{flex:1}}><div className="bar-track"><div className="bar-fill" style={{width:`${l.pct*1.6}%`,background:`linear-gradient(90deg,${l.color},${l.color}70)`}}/></div></div>
                  <div style={{width:90,textAlign:"right",fontSize:12,fontWeight:700,color:l.color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{l.count}</div>
                  <div style={{width:36,textAlign:"right",fontSize:11,color:tc.muted,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{l.pct}%</div>
                  <div style={{width:80,textAlign:"right",fontSize:11,color:tc.sub,flexShrink:0}}>{l.nights} nights</div>
                  <span style={{fontSize:12,color:tc.muted,flexShrink:0}}>→</span>
                </div>
              ))}
              <div style={{marginTop:12,padding:"12px 16px",borderRadius:10,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",fontSize:12,color:tc.sub,lineHeight:1.7}}>
                <strong style={{color:tc.acc}}>Champion insight:</strong> 4.7% of guests (142,609) generate 22.3% of all nights (8.76M). Average 61 nights per career. This segment is existential — losing it = losing the revenue backbone.
              </div>
            </GlassCard>
            <GlassCard style={{padding:"20px 22px"}}>
              <h3 style={{fontSize:14,fontWeight:600,color:tc.text,marginBottom:14}}>Unique guest erosion · 2022–2025</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
                {[{y:"2022",g:"1,385,840",c:tc.green},{y:"2023",g:"1,249,244",c:tc.blue},{y:"2024",g:"1,159,492",c:tc.acc},{y:"2025",g:"1,076,186",c:tc.red}].map(r=>(
                  <div key={r.y} style={{padding:"14px",borderRadius:12,background:r.c+"10",border:`1px solid ${r.c}22`}}>
                    <div style={{fontSize:12,fontWeight:700,color:r.c,marginBottom:4}}>{r.y}</div>
                    <div style={{fontSize:18,fontWeight:700,color:tc.text,fontVariantNumeric:"tabular-nums"}}>{r.g}</div>
                  </div>
                ))}
              </div>
              <p style={{fontSize:12,color:tc.sub,lineHeight:1.6}}><span style={{fontWeight:700,color:tc.red,fontFamily:"'DM Mono',monospace"}}>−22.3%</span> decline 2022–2025 · At −8%/yr → sub-1M unique guests by 2027. Reactivating 5% of 300K+ lapsed guests = $6.75M. The Guest Base Erosion signal is the most systemic risk in the dataset.</p>
            </GlassCard>
          </div>
        )}

        {/* ── ACCOMMODATION ── */}
        {section==="accommodation"&&(
          <div key="acc" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Accommodation mix · revenue analysis</h1>
            <p style={{fontSize:13,color:tc.sub,marginBottom:20}}>2025 reservations · Cabin = 51% higher RevPAR than RV · Click any type for detail</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:16}}>
              {ACCOMMODATION.map((a,i)=>(
                <GlassCard key={a.type} onClick={()=>open("accommodation",a)} accentColor={a.color} className="fu" style={{padding:"20px 20px",animationDelay:`${i*70}ms`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div>
                      <h3 style={{fontSize:15,fontWeight:700,color:tc.text}}>{a.type}</h3>
                      <div style={{fontSize:11,fontWeight:700,color:parseFloat(a.yoy)>0?tc.green:tc.red,marginTop:3,fontFamily:"'DM Mono',monospace"}}>{a.yoy} YoY</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontWeight:700,color:a.color,fontVariantNumeric:"tabular-nums"}}>{a.adr}</div>
                      <div style={{fontSize:10,color:tc.muted}}>avg / reservation</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                    {[["2025 res",a.res2025],["Total rev",a.totalRev],["Avg nights",String(a.nights)]].map(([k,v])=>(
                      <div key={k}>
                        <div style={{fontSize:9,color:tc.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                        <div style={{fontSize:12,fontWeight:600,color:tc.text,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${a.pct}%`,background:a.color}}/></div>
                </GlassCard>
              ))}
            </div>
            <GlassCard style={{padding:"18px 20px"}}>
              <h3 style={{fontSize:13,fontWeight:600,color:tc.text,marginBottom:14}}>Revenue premium analysis</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[{l:"Cabin vs RV premium",v:"51%",c:tc.green,sub:"$385.99 vs $255.53/res"},{l:"Cabin vs Tent premium",v:"252%",c:tc.acc,sub:"$385.99 vs $109.62/res"},{l:"Oct–Nov cabin floor",v:"23K",c:tc.blue,sub:"vs tent 16K — off-season resilience"}].map(m=>(
                  <div key={m.l} style={{padding:"14px",borderRadius:12,background:m.c+"10",border:`1px solid ${m.c}22`}}>
                    <div style={{fontSize:11,color:tc.sub,marginBottom:5}}>{m.l}</div>
                    <div style={{fontSize:22,fontWeight:700,color:m.c}}>{m.v}</div>
                    <div style={{fontSize:10,color:tc.muted,marginTop:3}}>{m.sub}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── CAMPGROUNDS ── */}
        {section==="campgrounds"&&<CampgroundsSection onSelect={({type,item})=>open(type,item)}/>}

      </main>

      {/* Status bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:28,zIndex:200,background:dark?"rgba(4,8,20,0.88)":"rgba(220,232,252,0.88)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderTop:dark?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",padding:"0 24px",gap:24,fontSize:10,color:tc.muted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em"}}>
        <span style={{color:tc.green}}>● AGENTS 1–4 COMPLETE</span>
        <span>10.9M RESERVATIONS · 518 CAMPGROUNDS</span>
        <span>655K VKR MEMBERS · AGENTS 5–6 PENDING</span>
        <span style={{marginLeft:"auto"}}>AIRIA GUEST SEGMENTATION v2.0 · GSU CIS-8010 · {new Date().toLocaleDateString()}</span>
      </div>

      {/* Modal */}
      <Modal modal={modal} onClose={()=>setModal(null)}/>
    </div>
  );
}
