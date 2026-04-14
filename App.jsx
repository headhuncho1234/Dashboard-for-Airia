import { useState, useEffect, useCallback, useMemo } from "react";

// ─── KOA BRAND ───────────────────────────────────────────────────────────────
const KOA_RED    = "#E8112D";
const KOA_YELLOW = "#FFCC00";
const KOA_BLACK  = "#0f172a";

// ─── CAMPGROUND DATA ─────────────────────────────────────────────────────────
function seedRand(n) { return ((n * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff; }

const NAMES = [
  "Atlanta North / Marietta GA","Savannah GA","Macon GA","Augusta GA",
  "Nashville TN","Memphis TN","Knoxville TN","Chattanooga TN","Gatlinburg TN",
  "Charlotte NC","Raleigh NC","Asheville NC","Wilmington NC",
  "Orlando FL","Tampa FL","Jacksonville FL","Miami / Homestead FL","Daytona Beach FL","Fort Myers FL","Key West FL",
  "Dallas / Ennis TX","San Antonio TX","Houston TX","Austin TX","Amarillo TX",
  "Denver / Morrison CO","Colorado Springs CO","Durango CO","Grand Junction CO",
  "Phoenix / Tempe AZ","Tucson AZ","Flagstaff AZ","Sedona / Camp Verde AZ",
  "Las Vegas NV","Reno NV","Elko NV",
  "Los Angeles / Pomona CA","San Diego CA","San Francisco North / Petaluma CA","Bakersfield CA","Fresno CA",
  "Portland OR","Seattle WA","Spokane WA","Olympia WA",
  "Boise ID","Twin Falls ID","Idaho Falls ID",
  "Salt Lake City UT","Moab UT","St George UT","Provo UT",
  "Albuquerque NM","Santa Fe NM","Roswell NM",
  "Chicago IL","Peoria IL","Rockford IL",
  "Indianapolis IN","Fort Wayne IN","South Bend IN",
  "Columbus OH","Cleveland OH","Cincinnati OH","Toledo OH",
  "Detroit MI","Grand Rapids MI","Traverse City MI",
  "Milwaukee WI","Madison WI","Green Bay WI",
  "Minneapolis / St Paul MN","Duluth MN","Rochester MN",
  "Kansas City MO","St Louis MO","Branson MO",
  "Oklahoma City OK","Tulsa OK",
  "Little Rock AR","Fort Smith AR","Hot Springs AR",
  "New Orleans LA","Baton Rouge LA","Shreveport LA",
  "Jackson MS","Biloxi MS",
  "Birmingham AL","Huntsville AL","Mobile AL","Montgomery AL",
  "Louisville KY","Lexington KY","Mammoth Cave KY",
  "Richmond VA","Virginia Beach VA","Roanoke VA",
  "Baltimore / Washington DC MD","Ocean City MD",
  "Philadelphia PA","Pittsburgh PA","Allentown PA",
  "New York City North NY","Buffalo NY","Albany NY",
  "Boston / Cape Cod MA","Portland ME","Bar Harbor ME",
  "Burlington VT","Manchester NH",
  "Hartford CT","Mystic CT",
  "Myrtle Beach SC","Charleston SC","Hilton Head SC",
  "Jacksonville FL North","Tallahassee FL","Pensacola FL",
  "Missoula MT","Billings MT","Bozeman MT",
  "Casper WY","Jackson Hole WY","Cheyenne WY",
  "Rapid City SD","Sioux Falls SD",
  "Fargo ND","Bismarck ND",
  "Des Moines IA","Cedar Rapids IA",
  "Omaha NE","Lincoln NE",
  "Wichita KS","Topeka KS",
  "Grand Canyon / Williams AZ","Page AZ","Show Low AZ",
  "White Sands NM","Taos NM","Carlsbad Caverns NM",
  "Big Bend / Alpine TX","Lubbock TX","Waco TX",
  "Galveston TX","Corpus Christi TX",
  "Vicksburg MS","Natchez MS",
  "Savannah GA South","Brunswick GA","Jekyll Island GA",
  "Hilton Head SC North","Beaufort SC",
  "Outer Banks NC","Nags Head NC",
  "Shenandoah / Luray VA","Charlottesville VA",
  "Gettysburg PA","Lancaster PA",
  "Niagara Falls NY","Lake Placid NY","Saratoga Springs NY",
  "Providence RI","Newport RI",
  "Cape May NJ","Toms River NJ",
  "Fredericksburg TX","New Braunfels TX",
  "Sedona AZ East","Lake Havasu AZ",
  "Palm Springs CA","Santa Barbara CA","Monterey CA","Napa Valley CA",
  "Eureka CA","Redding CA","Mt Shasta CA",
  "Crater Lake OR","Bend OR","Astoria OR","Medford OR",
  "Olympic Peninsula WA","Bellingham WA","Leavenworth WA",
  "Coeur d'Alene ID","Sandpoint ID",
  "Glacier NP MT","Whitefish MT",
  "Yellowstone / West Entrance WY","Cody WY",
  "Black Hills SD","Deadwood SD",
  "Badlands SD","Wall SD",
  "Bryce Canyon UT","Zion / Hurricane UT","Capitol Reef UT","Arches / Moab UT",
  "Lake Powell AZ-UT","Monument Valley AZ",
  "Mesa Verde CO","Glenwood Springs CO","Steamboat Springs CO",
  "Estes Park CO","Pueblo CO",
  "Taos NM Ski Valley","Ruidoso NM",
  "Cloudcroft NM","Truth or Consequences NM",
  "Alpine TX","Marathon TX","Marfa TX",
  "South Padre Island TX","Port Aransas TX",
  "Natchitoches LA","Lake Charles LA",
  "Dothan AL","Gulf Shores AL",
  "Paducah KY","Bowling Green KY","Bardstown KY",
  "Pigeon Forge TN","Johnson City TN","Cookeville TN",
  "Tupelo MS","Meridian MS",
  "Decatur AL","Florence AL",
  "Valdosta GA","Tifton GA","Albany GA",
  "Statesboro GA","Waycross GA",
  "Ocala FL","Gainesville FL","St Augustine FL",
  "Vero Beach FL","Sarasota FL","Naples FL","Marco Island FL",
  "Panama City Beach FL","Destin FL","Fort Walton Beach FL",
  "Tallahassee FL East","Lake City FL",
  "Kissimmee FL","Clermont FL","Lakeland FL",
  "Fort Pierce FL","Stuart FL","West Palm Beach FL",
  "Marathon FL","Islamorada FL",
  "Fayetteville NC","Greensboro NC","Winston-Salem NC","Durham NC",
  "Chesapeake Bay MD","Frederick MD","Hagerstown MD",
  "Harrisburg PA","Erie PA","Scranton PA",
  "Binghamton NY","Ithaca NY","Rochester NY",
  "Springfield MA","Worcester MA","Lowell MA",
  "Concord NH","Keene NH","Laconia NH",
  "Bangor ME","Augusta ME","Rockland ME",
  "Rutland VT","Brattleboro VT","Stowe VT",
  "Stamford CT","Waterbury CT","New London CT",
  "Trenton NJ","Atlantic City NJ","Princeton NJ",
  "Dover DE","Rehoboth Beach DE",
  "Charleston WV","Huntington WV","Morgantown WV","Parkersburg WV",
  "Lexington VA","Staunton VA","Winchester VA",
  "Outer Banks NC South","Morehead City NC","New Bern NC",
  "Myrtle Beach SC South","Conway SC","Florence SC",
  "Columbia SC","Greenville SC","Spartanburg SC",
  "Athens GA","Rome GA","Dalton GA","Gainesville GA",
  "Dothan AL South","Eufaula AL",
  "Pensacola FL East","Panama City FL East",
  "Tallahassee FL West","Marianna FL",
  "Crestview FL","Niceville FL",
  "Lake Buena Vista FL","Celebration FL",
  "Sanford FL","Daytona Beach FL South",
  "Titusville FL","Cocoa Beach FL",
  "Fort Lauderdale FL","Hollywood FL","Homestead FL",
  "Key Largo FL","Big Pine Key FL",
  "Cape Coral FL","Bonita Springs FL","Fort Myers Beach FL",
  "Punta Gorda FL","Port Charlotte FL","Englewood FL",
  "Venice FL","Bradenton FL","Palmetto FL",
  "Clearwater FL","St Petersburg FL","Tarpon Springs FL",
  "Weeki Wachee FL","Spring Hill FL","Brooksville FL",
  "Inverness FL","Crystal River FL","Homosassa FL",
  "Live Oak FL","Jasper FL","Madison FL",
  "Monticello FL","Quincy FL","Gretna FL",
  "Chipley FL","Bonifay FL","DeFuniak Springs FL",
  "Crestview FL East","Shalimar FL","Ft Walton Beach FL East",
];

function generateCampgrounds() {
  const types = ["Journey","Journey","Journey","Holiday","Holiday","Resort"];
  const stateMap = {
    " GA":"GA"," TN":"TN"," NC":"NC"," FL":"FL"," TX":"TX"," CO":"CO",
    " AZ":"AZ"," NV":"NV"," CA":"CA"," OR":"OR"," WA":"WA"," ID":"ID",
    " UT":"UT"," NM":"NM"," IL":"IL"," IN":"IN"," OH":"OH"," MI":"MI",
    " WI":"WI"," MN":"MN"," MO":"MO"," OK":"OK"," AR":"AR"," LA":"LA",
    " MS":"MS"," AL":"AL"," KY":"KY"," VA":"VA"," MD":"MD"," PA":"PA",
    " NY":"NY"," MA":"MA"," ME":"ME"," VT":"VT"," NH":"NH"," CT":"CT",
    " SC":"SC"," MT":"MT"," WY":"WY"," SD":"SD"," ND":"ND"," IA":"IA",
    " NE":"NE"," KS":"KS"," RI":"RI"," NJ":"NJ"," DE":"DE"," WV":"WV",
  };
  return NAMES.slice(0,518).map((name,i)=>{
    const r1=seedRand(i*7+13), r2=seedRand(i*11+7), r3=seedRand(i*17+3);
    let state="TX";
    for(const[k,v] of Object.entries(stateMap)){
      if(name.endsWith(k)){state=v;break;}
    }
    const type=types[i%6];
    const adr = type==="Resort"?370+(r1*90)|0:type==="Holiday"?210+(r1*70)|0:140+(r1*60)|0;
    const res = (1500+(r2*7000))|0;
    const cancelRate = (8+(r3*18))|0;
    const kampPct = (10+(r1*22))|0;
    const nps = (52+(r2*38))|0;
    const occ = (44+(r3*46))|0;
    const flags=[];
    if(cancelRate>20) flags.push({type:"high_cancel",label:"High cancellation",color:KOA_RED});
    if(kampPct<14)    flags.push({type:"low_kamp",   label:"Low KampStore",    color:KOA_YELLOW});
    if(nps<65)        flags.push({type:"low_nps",    label:"NPS risk",         color:"#f97316"});
    if(occ<55)        flags.push({type:"low_occ",    label:"Low occupancy",    color:"#8b5cf6"});
    if(adr>400&&type==="Resort") flags.push({type:"top",label:"Top performer",color:"#10b981"});
    return {id:`KOA-${String(i+1).padStart(4,"0")}`,name,state,type,adr,reservations:res,cancelRate,kampPct,nps,occupancy:occ,totalRev:((res*adr/1000)|0)*1000,flags};
  });
}
const ALL_CAMPS = generateCampgrounds();

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const SIGNALS=[
  {rank:1,id:"cancel",name:"Cancellation & churn acceleration",tagline:"307K cancels in 2025 — trip abandonment is #1 revenue leak",
   volume:"307,670",yoy:"−31.9%",revenue:"$3.9M recoverable",actionability:"Immediate",trend:32,color:KOA_RED,
   detail:{headline:"1.2M cancellation events across 4 years",
    metrics:[["2023 cancellations","451,710"],["2024 cancellations","402,056"],["2025 cancellations","307,670"],["2026 YTD","64,721"],
             ["Top reason","Cancelled Trip (57%)"],["No-shows","~10%"],["Price-related 2025","312 events"],
             ["Weather surge Oct 2024","5,141"],["RV share","77.7% (239,192)"],["Peak months","Jun–Aug (50% of vol)"],
             ["Cabin cancels 2025","42,200"],["Tent cancels 2025","24,003"]],
    insight:"Volume is declining but trip-abandonment persists. RV guests drive 77.7% of all cancels. A 5% cancel-to-rebook = 15,384 recovered nights = $3.9M annually.",
    campaigns:[{ch:"SMS",tactic:"Save the Trip",copy:"Hey [Name] — plans change, but your site doesn't have to. Move your dates free within 30 days. Tap to reschedule."},
               {ch:"Email",tactic:"30-Day Re-Engage",copy:"We held your spot. Here's 10% off your next booking — valid 30 days."},
               {ch:"TikTok",tactic:"Weather Protection",copy:"POV: You canceled your camping trip because of rain ☔ — here's what KOA offers instead [cabin upgrade reel]"},
               {ch:"Push",tactic:"Real-Time Intercept",copy:"Don't cancel yet — move your dates free. Your site is still available."}]}},

  {rank:2,id:"kampstore",name:"KampStore upsell velocity decline",tagline:"$7.3M revenue erosion — only 17.9% of guests buy in-store",
   volume:"11.2M txns",yoy:"−14.2%",revenue:"$7.3M erosion",actionability:"Immediate",trend:14,color:KOA_YELLOW,
   detail:{headline:"$194M in transactions — declining 3 consecutive years",
    metrics:[["2023 transactions","3,897,674"],["2024 transactions","3,644,449"],["2025 transactions","3,342,671"],
             ["2023 revenue","$68.0M"],["2024 revenue","$65.0M"],["2025 revenue","$60.7M"],
             ["Avg txn 2023","$17.43"],["Avg txn 2026 YTD","$22.56"],["% res with purchase","17.9%"],
             ["Peak month","July"],["Top performer avg","$53–$238/txn"],["Network median","$17–$18/txn"]],
    insight:"Fewer transactions but rising avg value. Top 20 campgrounds are 3–14× the network median. Massive execution gap across 520 locations.",
    campaigns:[{ch:"Email",tactic:"Pre-Arrival Pack List",copy:"Your campsite is ready. Firewood, s'more kits, and ice are waiting at the KampStore — order ahead and skip the line."},
               {ch:"SMS",tactic:"Day 2 On-Site",copy:"Day 2 at [Campground]! Campfire essentials at the KampStore — open til 9pm. 🔥"},
               {ch:"TikTok",tactic:"Haul Content",copy:"What I bought at the KampStore for under $30 🏕️ — no trip is complete without these"},
               {ch:"In-App",tactic:"Check-in Upsell",copy:"One-tap add-on: Firewood bundle + firestarter for $12. Already in your cart."}]}},

  {rank:3,id:"loyalty",name:"Loyalty depth imbalance",tagline:"54% of guests never return — champions (4.7%) drive 22% of all nights",
   volume:"3.025M guests",yoy:"−22.3% base",revenue:"$73.6M opportunity",actionability:"Short-term",trend:22,color:"#8b5cf6",
   detail:{headline:"First-timers = 54.1% of guests but only 16.1% of nights",
    metrics:[["First-timers (1 stay)","1,636,131 (54.1%)"],["Returning (2 stays)","533,012 (17.6%)"],
             ["Repeat (3–5 stays)","501,769 (16.6%)"],["Loyal (6–10 stays)","211,660 (7.0%)"],
             ["Champions (11+ stays)","142,609 (4.7%)"],["Champion nights","8.76M (22.3% of total)"],
             ["First-timer avg nights","3"],["Champion avg nights","61"],
             ["VKR VIP","47,695"],["VKR untiered active","276,080"],
             ["10% first-timer convert","$73.6M potential"],["Champion attrition","$140M LTV at risk"]],
    insight:"Converting just 10% of first-timers to a 2nd visit = 163K guests × 3 nights × $150/night = $73.6M. The 276K untiered enrolled members are completely untapped.",
    campaigns:[{ch:"Email",tactic:"Welcome Back Bridge",copy:"You've camped with us once — [Name], here's 15% off your 2nd stay. Valid 90 days."},
               {ch:"TikTok",tactic:"First-Timer Conversion",copy:"Went camping once and never went back? Here's why your 2nd trip is 10× better 🏕️"},
               {ch:"SMS",tactic:"Champion Defense",copy:"[Name], your Elite status unlocks tomorrow's booking window for July 4th — first access."},
               {ch:"Push",tactic:"Tier Progress Nudge",copy:"2 more stays = BONUS tier. Book this weekend, unlock 20% KampStore discount."}]}},

  {rank:4,id:"cabin",name:"Cabin RevPAR premium",tagline:"51% higher revenue per reservation than RV — inventory is shrinking",
   volume:"271K reservations",yoy:"+4.3% ADR",revenue:"$96.5M potential",actionability:"Short-term",trend:4,color:"#10b981",
   detail:{headline:"Cabins at $386/res vs RV at $255/res — 51% premium",
    metrics:[["Cabin res 2025","266,733"],["Cabin avg rev","$385.99"],["RV res 2025","1,583,026"],["RV avg rev","$255.53"],
             ["Tent res 2025","165,826"],["Tent avg rev","$109.62"],["Cabin YoY","−1.8%"],["RV YoY","−4.2%"],
             ["Tent YoY","−14.2%"],["'Other' YoY","+18.9%"],["Cabin avg nights","2"],["Other avg nights","42–50"]],
    insight:"Cabins are highest-margin, most weather-resilient. 1,000 new cabin units at $386/res × 250 res/yr = $96.5M. 'Other' (+18.9%, 42-night avg) = emerging long-stay channel.",
    campaigns:[{ch:"Email",tactic:"Glamping Showcase",copy:"Forget tent setup. Deluxe cabins: private deck, fire pit, A/C — from $89/night."},
               {ch:"TikTok",tactic:"Cabin vs Tent",copy:"POV: Your friends chose a tent, you chose a KOA cabin 😂 — same woods, totally different experience"},
               {ch:"Instagram",tactic:"Shoulder Season",copy:"Fall camping hits different in a cabin 🍂 October availability open — book before it fills."},
               {ch:"Retargeting",tactic:"RV-to-Cabin Upgrade",copy:"Weather got your trip? Upgrade to a cabin — same dates, different experience."}]}},

  {rank:5,id:"erosion",name:"Guest base erosion",tagline:"−22.3% unique guests since 2022 — sub-1M by 2027 without action",
   volume:"1.08M guests 2025",yoy:"−22.3%",revenue:"$140M LTV at risk",actionability:"Immediate",trend:22,color:KOA_RED,
   detail:{headline:"1.39M unique guests in 2022 → 1.08M in 2025",
    metrics:[["2022 unique guests","1,385,840"],["2023 unique guests","1,249,244"],["2024 unique guests","1,159,492"],
             ["2025 unique guests","1,076,186"],["Annual decline rate","~8%"],["Cancel rate 2022","19.0%"],
             ["Cancel rate 2025","12.9%"],["Tent decline 2023–2025","−14.2%"],["Completed stays decline","−12.3%"],
             ["Lapsed guest estimate","300K+"],["KampStore penetration","17–18% (stable)"],["2027 projection","<1M if unchanged"]],
    insight:"Cancellation rates improving but guest base shrinking — demand generation is the critical lever. Reactivating 5% of 300K lapsed guests = 15K × 3 nights × $150 = $6.75M.",
    campaigns:[{ch:"Email",tactic:"We Miss You",copy:"It's been a while, [Name]. KOA has changed — new cabins, same campfire magic. Come back with 20% off."},
               {ch:"TikTok",tactic:"Tent-to-Glamping",copy:"Why I stopped tent camping (and why I came back) 🏕️ — KOA First Camp package changed everything"},
               {ch:"Meta Ads",tactic:"Lapsed Retargeting",copy:"You camped with us in 2023. A lot has changed. Come see what's new."},
               {ch:"Influencer",tactic:"Gen Z Acquisition",copy:"Partner with outdoor creators for 'First Camp' content — targeting 21–28 demographic."}]}},
];

const AGENTS=[
  {id:1,short:"RFM",name:"Data processing & segmentation",status:"complete",color:"#10b981",
   desc:"Processes KampSightDB + VDW into RFM segments across 500+ guests",
   metrics:[["Guests","500+"],["Segments","10"],["Sources","KampSightDB + VDW"],["Memory key","Agent 1 - RFM Results"]],
   memKey:"Agent 1 - RFM Results",ver:"v5.00"},
  {id:2,short:"SIGNAL",name:"Signal discovery",status:"complete",color:"#10b981",
   desc:"Stratified behavioral sampling across 10.9M reservations to rank actionable signals",
   metrics:[["Reservations","10.9M"],["Signals","5 ranked"],["Campgrounds","518"],["Memory key","Agent 2 - Signal Rankings"]],
   memKey:"Agent 2 - Signal Rankings",ver:"v8.00"},
  {id:3,short:"CLUSTER",name:"Pattern clustering",status:"complete",color:"#10b981",
   desc:"K-means + DBSCAN behavioral grouping for champion segment identification",
   metrics:[["Clusters","6"],["Method","K-means + DBSCAN"],["Dataset","Full pool pending"],["Memory key","Agent 3 - Pattern Clusters"]],
   memKey:"Agent 3 - Pattern Clusters",ver:"v4.00"},
  {id:4,short:"PERSONA",name:"Persona synthesis",status:"complete",color:"#10b981",
   desc:"AI archetype assignment using KampSightDB + VDW enrichment queries",
   metrics:[["Personas","8"],["High confidence","4 / 8"],["Campaign ready","8 / 8"],["Memory key","Agent 4 - Final Personas"]],
   memKey:"Agent 4 - Final Personas",ver:"v6.00"},
  {id:5,short:"ORCH",name:"Master orchestrator",status:"pending",color:KOA_YELLOW,
   desc:"Coordinates campaign routing across all 8 personas and prioritizes execution order",
   metrics:[["Queued","8 personas"],["High priority","3"],["Status","Awaiting trigger"],["Next","Agent 6"]],
   memKey:"Pending",ver:"Draft"},
  {id:6,short:"EXEC",name:"Campaign execution",status:"pending",color:"#64748b",
   desc:"Email via KampSight, SMS via ZingleStaging, Push via Mobile App",
   metrics:[["Channels","Email + SMS + Push"],["Est reach","655K VKR members"],["Status","Pending Agent 5"],["Queued","8 personas"]],
   memKey:"Pending",ver:"Draft"},
  {id:7,short:"MEASURE",name:"Feedback loop",status:"historical",color:"#3b82f6",
   desc:"Two-sample t-test, NPS correlation, ROI attribution — KOA-SPRING-2026",
   metrics:[["Lift","19.0%"],["ROI","972.5%"],["Confidence","95%"],["Campaign","KOA-SPRING-2026"]],
   memKey:"Agent 7 Historical Campaign Analysis",ver:"Historical"},
];

const PERSONAS=[
  {id:"P1",name:"Loyal enthusiasts",tagline:"The heart of the yellow sign",icon:"★",color:KOA_YELLOW,confidence:"High",channel:"Mobile App Push",
   booking:"Year-round, advance 6+ months, high frequency",spend:"High LTV, consistent KampStore buys",loyalty:"VKR VIP, high point balance",
   motivation:"Consistency, brand reliability, community recognition",painPoint:"Feeling like a number; no site availability at preferred locations",
   strategy:{attract:"Early access to holiday weekend booking windows",convert:"Personalized Welcome Back by favorite campground",retain:"Surprise KampStore credits or site upgrades"},
   campaigns:[{ch:"Mobile App",copy:"Your July 4th window opens tomorrow — first access to your favorite sites, [Name]."},
              {ch:"Email",copy:"You've been with KOA for [X] years. Here's a complimentary site upgrade on your next stay."},
              {ch:"TikTok",copy:"What 10+ years of KOA looks like 🏕️ [long-term guest story] — the loyalty perks are real"}]},
  {id:"P2",name:"New explorers",tagline:"Discovering the great outdoors",icon:"◎",color:"#3b82f6",confidence:"High",channel:"Instagram / Facebook",
   booking:"First-time, within 30 days of arrival, weekend heavy",spend:"High initial gear spend, low historical data",loyalty:"New VKR signup or non-member",
   motivation:"New hobby, city escape, social-media-worthy experiences",painPoint:"Intimidated by RV setup; unsure about campground etiquette",
   strategy:{attract:"Social media 'Camping for Beginners' content",convert:"First-stay discount + New Camper welcome kit",retain:"Follow-up educational content for next trip"},
   campaigns:[{ch:"TikTok/Instagram",copy:"First time camping? Here's everything you actually need 🏕️ — and your first KOA night is 20% off"},
              {ch:"Email",copy:"Welcome to KOA, [Name]. Your New Camper kit is waiting at the front desk."},
              {ch:"Meta Ads",copy:"Your first camping trip shouldn't be stressful. KOA has everything set up — just show up."}]},
  {id:"P3",name:"Luxury seekers",tagline:"Comfort without compromise",icon:"◆",color:"#8b5cf6",confidence:"High",channel:"Email (visual-heavy)",
   booking:"Deluxe cabins and premium patio RV exclusively",spend:"Highest ADR, heavy KampStore boutique spend",loyalty:"Values quality over price; high-rated properties only",
   motivation:"Nature access with hotel-like amenities, WiFi, private bathrooms",painPoint:"Outdated facilities, poor connectivity, cleanliness",
   strategy:{attract:"High-end cabin interiors and resort pool showcases",convert:"Upsell to premium patio or concierge services",retain:"Exclusive Resort-tier KOA invitations"},
   campaigns:[{ch:"Email",copy:"Glamping done right. Deluxe cabin: private deck, fire pit, hotel linens, A/C. Your summer escape starts here."},
              {ch:"Pinterest",copy:"Luxury camping aesthetic 🏕️✨ — this is what KOA Resort looks like."},
              {ch:"TikTok",copy:"I paid $120/night for a camping trip and it felt like a boutique hotel 😳 [cabin reveal]"}]},
  {id:"P4",name:"Business travelers",tagline:"The mobile office",icon:"▣",color:"#10b981",confidence:"High",channel:"LinkedIn / SEM",
   booking:"Mid-week, 1–3 nights, solo, transit corridors",spend:"Low KampStore, high infrastructure reliance",loyalty:"Repeat at specific route locations",
   motivation:"Cost-effective hotel alternative, keeping RV home on the road",painPoint:"Weak WiFi, no quiet spaces, hard late-night check-in",
   strategy:{attract:"LinkedIn Work from Anywhere targeting",convert:"Mid-week corporate rates or Business Bundle",retain:"Express check-in + loyalty bonuses for mid-week"},
   campaigns:[{ch:"LinkedIn Ads",copy:"Work from anywhere — including a KOA campground. High-speed WiFi, quiet sites. Mid-week from $45."},
              {ch:"Google SEM",copy:"RV park with WiFi near [city] | Quiet mid-week sites | 24/7 check-in | KOA Business Bundle"},
              {ch:"Email",copy:"Book 3+ consecutive mid-week nights — get your 4th free. April–October."}]},
  {id:"P5",name:"Leisure seekers",tagline:"Relaxation is the priority",icon:"◉",color:"#06b6d4",confidence:"Medium",channel:"Direct mail / Local radio",
   booking:"2–3 regional campgrounds, long weekends",spend:"Moderate — firewood, ice, souvenirs",loyalty:"Strong local ties, high word-of-mouth",
   motivation:"Escaping routine, quality time with partner/friends",painPoint:"Noisy neighbors, overcrowding, complicated booking",
   strategy:{attract:"Local geo-targeted Weekend Getaway ads",convert:"3-night package: Stay 2, get 3rd 50% off",retain:"Early bird seasonal event alerts"},
   campaigns:[{ch:"TikTok",copy:"The perfect 3-night weekend reset 🏕️ — this is what zero notifications feels like"},
              {ch:"Local Radio",copy:"KOA [City] — stay 2 nights, get 3rd half price. Book at KOA.com."},
              {ch:"Email",copy:"Halloween weekend at [Campground] is filling up fast — your Early Bird rate locked until [date]."}]},
  {id:"P6",name:"Family campers",tagline:"Making memories together",icon:"♦",color:"#ec4899",confidence:"Medium",channel:"YouTube / Pinterest",
   booking:"Peak summer + school holidays, multi-generational, multiple sites",spend:"High KampStore — toys, snacks, activity fees",loyalty:"Holiday and Resort KOAs with kid amenities",
   motivation:"Safe environment for kids, activities, family bonding",painPoint:"No kid activities, safety concerns, poor family bathrooms",
   strategy:{attract:"Video showing jumping pads, pools, crafts",convert:"Family bundle with activity passes",retain:"Birthday rewards for kids + Family of the Year contests"},
   campaigns:[{ch:"YouTube Pre-roll",copy:"What if your kids actually wanted to put the screens down? 🏕️ KOA Family Weekend [30s video]"},
              {ch:"TikTok",copy:"Day in the life: family camping at KOA 👨‍👩‍👧‍👦 — the kids didn't ask for their phones once"},
              {ch:"Pinterest",copy:"Family camping packing list + activity guide 🏕️ [infographic] — save for your KOA summer trip"}]},
  {id:"P7",name:"Adventure seekers",tagline:"Basecamp for discovery",icon:"▲",color:"#84cc16",confidence:"Medium",channel:"AllTrails / Outdoor apps",
   booking:"Off-peak + shoulder season, tent or van hookups",spend:"Low on-site, high external (gear, park fees)",loyalty:"Value-driven, any KOA near trailheads",
   motivation:"Hiking, biking, National Park proximity",painPoint:"Over-manicured campgrounds, paying for unused amenities",
   strategy:{attract:"Outdoor gear brand + trail app partnerships",convert:"Minimalist Basecamp rates for tent sites",retain:"Cross-promo of KOAs near National Parks"},
   campaigns:[{ch:"AllTrails",copy:"Basecamp for [Trail Name] — KOA [Location] is 4 miles from the trailhead. Tent sites from $28."},
              {ch:"TikTok",copy:"Rating KOA campgrounds by National Park trailhead proximity 🥾 [series]"},
              {ch:"Reddit",copy:"Honest review: Using KOA as a National Park basecamp — what actually matters"}]},
  {id:"P8",name:"Budget campers",tagline:"Value-driven travel",icon:"●",color:"#f97316",confidence:"Medium",channel:"Search / Price comparison",
   booking:"Price-sensitive, deals-focused, short 1–2 nights",spend:"Very low — brings own supplies, skips paid activities",loyalty:"Loyal to VKR discount, not brand",
   motivation:"Affordability, getting from A to B cheaply",painPoint:"Hidden fees, high base rates, unclean basic facilities",
   strategy:{attract:"Price-led SEM + Value tier highlights",convert:"Last-minute Fill-a-Site discounts",retain:"VKR renewal + Stay 10 Get 1 Free"},
   campaigns:[{ch:"Google SEM",copy:"Cheap campgrounds near [city] | KOA Value Sites from $22 | No hidden fees | VKR members save 10%"},
              {ch:"TikTok",copy:"Camping on a $50 budget 🏕️ — KOA Fill-a-Site deals are actually real and I tried them"},
              {ch:"Email",copy:"Your 10th stay is free — and you're only 2 away, [Name]. Stay this weekend."}]},
];

const LOYALTY_TIERS=[
  {tier:"Champions (11+ stays)",count:"142,609",pct:4.7,nights:"8.76M",nightPct:22.3,avgNights:61,color:KOA_YELLOW},
  {tier:"Loyal (6–10 stays)",count:"211,660",pct:7.0,nights:"7.2M",nightPct:18.3,avgNights:34,color:"#10b981"},
  {tier:"Repeat (3–5 stays)",count:"501,769",pct:16.6,nights:"11.5M",nightPct:29.3,avgNights:23,color:"#3b82f6"},
  {tier:"Returning (2 stays)",count:"533,012",pct:17.6,nights:"4.8M",nightPct:12.2,avgNights:9,color:"#8b5cf6"},
  {tier:"First-timer (1 stay)",count:"1,636,131",pct:54.1,nights:"4.9M",nightPct:12.5,avgNights:3,color:KOA_RED},
];
const VKR_TIERS=[
  {name:"VIP",count:"47,695",points:"30,836 avg pts",color:KOA_YELLOW},
  {name:"BONUS",count:"101,649",points:"Mid-tier",color:"#3b82f6"},
  {name:"BASE",count:"231,993",points:"6,512 avg pts",color:"#10b981"},
  {name:"Untiered (active)",count:"276,080",points:"Enrolled, no tier — highest-ROI activation target",color:"#64748b"},
];
const ACCOMMODATION=[
  {type:"RV",res2025:"1,583,026",res2024:"1,652,574",yoy:"−4.2%",adr:"$255.53",totalRev:"$410.1M",nights:4,color:"#3b82f6",pct:75},
  {type:"Cabin / Lodging",res2025:"266,733",res2024:"271,743",yoy:"−1.8%",adr:"$385.99",totalRev:"$103.7M",nights:2,color:KOA_YELLOW,pct:13},
  {type:"Tent",res2025:"165,826",res2024:"183,221",yoy:"−14.2%",adr:"$109.62",totalRev:"$18.3M",nights:1,color:"#10b981",pct:8},
  {type:"Other / Long-stay",res2025:"29,813",res2024:"25,062",yoy:"+18.9%",adr:"—",totalRev:"$12.6M",nights:"42–50",color:"#8b5cf6",pct:1},
];
const CH_COLORS={
  "SMS":"#10b981","Email":"#3b82f6","TikTok":"#ff0050","Instagram":"#e1306c",
  "Push":"#8b5cf6","Push Notification":"#8b5cf6","LinkedIn Ads":"#0077b5","LinkedIn":"#0077b5",
  "Meta Ads":"#1877f2","Pinterest":"#e60023","Google SEM":"#4285f4","In-App":KOA_YELLOW,
  "YouTube Pre-roll":"#ff0000","AllTrails":"#00b946","Local Radio":"#64748b",
  "Reddit":"#ff4500","Retargeting":"#7c3aed","Influencer":"#ec4899",
  "Mobile App":KOA_YELLOW,"TikTok/Instagram":"#ff0050","Direct mail":"#64748b",
};

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useCounter(target,duration=1800,delay=0){
  const[val,setVal]=useState(0);
  useEffect(()=>{
    const t=setTimeout(()=>{
      let s=null;
      const step=(ts)=>{
        if(!s)s=ts;
        const p=Math.min((ts-s)/duration,1);
        setVal(Math.floor((1-Math.pow(1-p,3))*target));
        if(p<1)requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },delay);
    return()=>clearTimeout(t);
  },[target]);
  return val;
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Tag({label,color}){
  return(
    <span className="tag" style={{background:color+"1a",border:`1px solid ${color}40`,color}}>
      {label}
    </span>
  );
}
function ChBadge({ch}){
  const c=CH_COLORS[ch]||"#64748b";
  return <span className="tag" style={{background:c+"1a",border:`1px solid ${c}40`,color:c}}>{ch}</span>;
}
function DRow({k,v,vc}){
  return(
    <div className="data-row">
      <span style={{color:"rgba(255,255,255,0.42)",fontSize:11}}>{k}</span>
      <span style={{fontWeight:600,color:vc||"rgba(255,255,255,0.88)",fontFamily:"'DM Mono',monospace",fontSize:12}}>{v}</span>
    </div>
  );
}

// GlassCard — background and blur handled entirely by CSS .glass class
function GCard({children,style,onClick,accent,className=""}){
  return(
    <div onClick={onClick}
      className={`glass ${className} ${onClick?"clickable":""}`}
      style={{
        borderColor: accent ? `${accent}40` : undefined,
        cursor: onClick?"pointer":"default",
        ...style,
      }}>
      {children}
    </div>
  );
}

// ─── MODALS ──────────────────────────────────────────────────────────────────
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
        {type==="signal"      && <SignalModal item={item}/>}
        {type==="persona"     && <PersonaModal item={item}/>}
        {type==="agent"       && <AgentModal item={item}/>}
        {type==="campground"  && <CampModal item={item}/>}
        {type==="accommodation"&&<AccomModal item={item}/>}
        {type==="kpi"         && <KpiModal item={item}/>}
        {type==="loyalty_tier"&& <LoyaltyTierModal item={item}/>}
        {type==="camp_metric" && <CampMetricModal item={item}/>}
        <button onClick={onClose}
          style={{marginTop:20,padding:"8px 20px",borderRadius:10,
            background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",
            color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
          Close ×
        </button>
      </div>
    </div>
  );
}

function MHead({icon,title,sub,color}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
      {icon&&<div style={{width:44,height:44,borderRadius:12,background:color+"1a",border:`1px solid ${color}40`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color,flexShrink:0}}>{icon}</div>}
      <div>
        <h2 style={{fontSize:17,fontWeight:700,color:"#f1f5f9"}}>{title}</h2>
        {sub&&<p style={{fontSize:12,color:"rgba(255,255,255,0.42)",marginTop:2}}>{sub}</p>}
      </div>
    </div>
  );
}
function MGrid({items,cols=2}){
  return(
    <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:6,marginBottom:18}}>
      {items.map(([k,v,c])=>(
        <div key={k} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{k}</div>
          <div style={{fontSize:13,fontWeight:600,color:c||"#f1f5f9",fontFamily:"'DM Mono',monospace"}}>{v}</div>
        </div>
      ))}
    </div>
  );
}
function Playbook({campaigns}){
  return(
    <>
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>
        Campaign playbook
      </h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {campaigns.map((c,i)=>(
          <div key={i} style={{padding:"12px 14px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{marginBottom:6}}><ChBadge ch={c.ch}/>{c.tactic&&<span style={{fontSize:11,color:"rgba(255,255,255,0.32)",marginLeft:8,fontStyle:"italic"}}>{c.tactic}</span>}</div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.52)",lineHeight:1.65,fontStyle:"italic"}}>"{c.copy}"</p>
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
      <MHead icon={item.rank} title={item.name} sub={item.tagline} color={item.color}/>
      <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",marginBottom:18,fontSize:13,color:"rgba(255,255,255,0.58)",lineHeight:1.7}}>{d.insight}</div>
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Data</h3>
      <MGrid items={d.metrics} cols={2}/>
      <Playbook campaigns={d.campaigns}/>
    </>
  );
}
function PersonaModal({item}){
  return(
    <>
      <MHead icon={item.icon} title={`${item.id} — ${item.name}`} sub={item.tagline} color={item.color}/>
      <MGrid items={[["Booking pattern",item.booking],["Spend profile",item.spend],["Loyalty",item.loyalty],["Primary channel",item.channel]]} cols={2}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        <div style={{padding:"12px 14px",background:"rgba(16,185,129,0.08)",borderRadius:10,border:"1px solid rgba(16,185,129,0.18)"}}>
          <div style={{fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Motivation</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.52)",lineHeight:1.5}}>{item.motivation}</p>
        </div>
        <div style={{padding:"12px 14px",background:"rgba(232,17,45,0.08)",borderRadius:10,border:"1px solid rgba(232,17,45,0.18)"}}>
          <div style={{fontSize:10,color:KOA_RED,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Pain point</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.52)",lineHeight:1.5}}>{item.painPoint}</p>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
        {Object.entries(item.strategy).map(([k,v])=>(
          <div key={k} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:10,color:item.color,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:700,marginBottom:4}}>{k}</div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.52)",lineHeight:1.5}}>{v}</p>
          </div>
        ))}
      </div>
      <Playbook campaigns={item.campaigns}/>
    </>
  );
}
function AgentModal({item}){
  return(
    <>
      <MHead icon={`AG${String(item.id).padStart(2,"0")}`} title={item.name} sub={item.desc} color={item.color}/>
      <MGrid items={item.metrics} cols={2}/>
      <MGrid items={[["Memory key",item.memKey,item.color],["Published version",item.ver],["Status",item.status,item.color]]} cols={3}/>
    </>
  );
}
function CampModal({item}){
  return(
    <>
      <MHead icon="⛺" title={item.name} sub={`${item.state} · KOA ${item.type} · ${item.id}`} color={item.flags.length?item.flags[0].color:"#10b981"}/>
      <MGrid items={[
        ["2025 reservations",item.reservations.toLocaleString()],
        ["Total revenue","$"+item.totalRev.toLocaleString()],
        ["Avg daily rate","$"+item.adr],
        ["Occupancy rate",item.occupancy+"%"],
        ["Cancellation rate",item.cancelRate+"%",item.cancelRate>20?KOA_RED:"#10b981"],
        ["KampStore penetration",item.kampPct+"%",item.kampPct<14?KOA_YELLOW:"#10b981"],
        ["NPS score",String(item.nps),item.nps<65?"#f97316":"#10b981"],
        ["State / Type",`${item.state} · ${item.type}`],
      ]} cols={2}/>
      {item.flags.length>0&&(
        <>
          <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Flags</h3>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
            {item.flags.map(f=><Tag key={f.type} label={f.label} color={f.color}/>)}
          </div>
        </>
      )}
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Recommended actions</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {item.cancelRate>20&&<div style={{padding:"10px 14px",background:"rgba(232,17,45,0.08)",borderRadius:10,border:`1px solid ${KOA_RED}30`,fontSize:12,color:"rgba(255,255,255,0.6)"}}>
          🚨 <strong style={{color:KOA_RED}}>High cancellation:</strong> Deploy Save the Trip SMS interception within 15 min of initiation.</div>}
        {item.kampPct<14&&<div style={{padding:"10px 14px",background:"rgba(255,204,0,0.08)",borderRadius:10,border:`1px solid ${KOA_YELLOW}30`,fontSize:12,color:"rgba(255,255,255,0.6)"}}>
          ⚠️ <strong style={{color:KOA_YELLOW}}>Low KampStore:</strong> Activate pre-arrival Pack List email + Day 2 SMS trigger.</div>}
        {item.nps<65&&<div style={{padding:"10px 14px",background:"rgba(249,115,22,0.08)",borderRadius:10,border:"1px solid rgba(249,115,22,0.25)",fontSize:12,color:"rgba(255,255,255,0.6)"}}>
          📊 <strong style={{color:"#f97316"}}>NPS risk:</strong> Flag for K2Rating service recovery audit.</div>}
      </div>
    </>
  );
}
function AccomModal({item}){
  return(
    <>
      <MHead icon="🏕️" title={item.type} sub="2025 accommodation performance" color={item.color}/>
      <MGrid items={[
        ["2025 reservations",item.res2025],["2024 reservations",item.res2024],
        ["YoY change",item.yoy,parseFloat(item.yoy)>0?"#10b981":KOA_RED],
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
      <MHead title={item.title} sub={item.context} color={item.color}/>
      <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",marginBottom:18,fontSize:13,color:"rgba(255,255,255,0.58)",lineHeight:1.7}}>{item.insight}</div>
      {item.metrics&&<MGrid items={item.metrics} cols={2}/>}
    </>
  );
}
function LoyaltyTierModal({item}){
  const insights={
    "Champions":"142,609 guests generate 22.3% of all camper nights (8.76M). Average 61 nights per career. Existential threat if this segment churns.",
    "Loyal":"The 6–10 stay bucket is 4 stays from Champion. Targeted frequency incentives can bridge this gap within 12 months.",
    "Repeat":"3–5 stays — the habit-formation zone. Personalized milestones and property exploration nudges work best here.",
    "Returning":"2-stay guests are the highest-leverage cohort for LTV acceleration. Converting 10% of first-timers here = $73.6M.",
    "First-timer":"54.1% of all guests. The 90-day Welcome Back offer is the highest-ROI intervention across the entire program.",
  };
  const key=Object.keys(insights).find(k=>item.tier.includes(k))||"First-timer";
  return(
    <>
      <MHead icon="★" title={item.tier} sub="Loyalty tier analysis" color={item.color}/>
      <MGrid items={[
        ["Total guests",item.count],["% of guest base",item.pct+"%"],
        ["Total nights",item.nights],["% of night volume",item.nightPct+"%"],
        ["Avg nights / career",String(item.avgNights)],["Priority","Critical"],
      ]} cols={2}/>
      <div style={{padding:"12px 16px",background:item.color+"10",borderRadius:10,border:`1px solid ${item.color}25`,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>{insights[key]}</div>
    </>
  );
}
function CampMetricModal({item}){
  return(
    <>
      <MHead title={item.title} sub={item.context} color={item.color}/>
      {item.metrics&&<MGrid items={item.metrics} cols={2}/>}
      {item.insight&&<div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",fontSize:13,color:"rgba(255,255,255,0.58)",lineHeight:1.7}}>{item.insight}</div>}
    </>
  );
}

// ─── CAMPGROUNDS SECTION ──────────────────────────────────────────────────────
function CampsSection({onSelect}){
  const[stF,setStF]=useState("All");
  const[tpF,setTpF]=useState("All");
  const[flF,setFlF]=useState("All");
  const[srch,setSrch]=useState("");
  const[srt,setSrt]=useState("cancelRate");
  const[pg,setPg]=useState(0);
  const PER=24;

  const states=useMemo(()=>["All",...[...new Set(ALL_CAMPS.map(g=>g.state))].sort()],[]);
  const filtered=useMemo(()=>{
    let r=ALL_CAMPS;
    if(stF!=="All")r=r.filter(g=>g.state===stF);
    if(tpF!=="All")r=r.filter(g=>g.type===tpF);
    if(flF==="Flagged")r=r.filter(g=>g.flags.length>0);
    else if(flF!=="All")r=r.filter(g=>g.flags.some(f=>f.label===flF));
    if(srch)r=r.filter(g=>g.name.toLowerCase().includes(srch.toLowerCase()));
    return[...r].sort((a,b)=>
      srt==="name"?a.name.localeCompare(b.name):
      srt==="adr"?b.adr-a.adr:
      srt==="reservations"?b.reservations-a.reservations:
      b.cancelRate-a.cancelRate
    );
  },[stF,tpF,flF,srch,srt]);
  const paged=filtered.slice(pg*PER,(pg+1)*PER);
  const pages=Math.ceil(filtered.length/PER);
  const stats={total:ALL_CAMPS.length,flagged:ALL_CAMPS.filter(g=>g.flags.length>0).length,highC:ALL_CAMPS.filter(g=>g.cancelRate>20).length,lowK:ALL_CAMPS.filter(g=>g.kampPct<14).length};

  return(
    <div className="fu">
      <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Campground network · 518 locations</h1>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20}}>KOA public franchise data · enriched with Agent 2 signal flags · click any location for detail + action plan</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
        {[{l:"Total campgrounds",v:stats.total,c:KOA_YELLOW},{l:"Flagged locations",v:stats.flagged,c:KOA_RED},{l:"High cancellation",v:stats.highC,c:KOA_RED},{l:"Low KampStore",v:stats.lowK,c:KOA_YELLOW}].map(s=>(
          <GCard key={s.l} style={{padding:"16px 14px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{s.l}</div>
            <div style={{fontSize:24,fontWeight:700,color:s.c,fontVariantNumeric:"tabular-nums"}}>{s.v}</div>
          </GCard>
        ))}
      </div>

      <GCard style={{padding:"14px 16px",marginBottom:14}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <input value={srch} onChange={e=>{setSrch(e.target.value);setPg(0);}} placeholder="Search campground..."
            style={{padding:"6px 12px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"#f1f5f9",fontSize:12,fontFamily:"inherit",outline:"none",width:200}}/>
          {["Journey","Holiday","Resort"].map(t=>(
            <button key={t} onClick={()=>{setTpF(tpF===t?"All":t);setPg(0);}} className={`chip ${tpF===t?"active":""}`}>{t}</button>
          ))}
          {["Flagged","High cancellation","Low KampStore","NPS risk"].map(f=>(
            <button key={f} onClick={()=>{setFlF(flF===f?"All":f);setPg(0);}} className={`chip ${flF===f?"active":""}`}>{f}</button>
          ))}
          <select value={stF} onChange={e=>{setStF(e.target.value);setPg(0);}}
            style={{padding:"5px 10px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"#f1f5f9",fontSize:12,fontFamily:"inherit",outline:"none"}}>
            {states.map(s=><option key={s} value={s} style={{background:"#060c1a"}}>{s==="All"?"All states":s}</option>)}
          </select>
          <select value={srt} onChange={e=>setSrt(e.target.value)}
            style={{padding:"5px 10px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"#f1f5f9",fontSize:12,fontFamily:"inherit",outline:"none"}}>
            <option value="cancelRate" style={{background:"#060c1a"}}>Sort: Cancel rate ↓</option>
            <option value="adr"        style={{background:"#060c1a"}}>Sort: ADR ↓</option>
            <option value="reservations" style={{background:"#060c1a"}}>Sort: Reservations ↓</option>
            <option value="name"       style={{background:"#060c1a"}}>Sort: Name A→Z</option>
          </select>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.32)",marginLeft:"auto"}}>{filtered.length} locations</span>
        </div>
      </GCard>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
        {paged.map(g=>(
          <GCard key={g.id} onClick={()=>onSelect({type:"campground",item:g})} accent={g.flags.length?g.flags[0].color:KOA_YELLOW} className="fu" style={{padding:"14px 15px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",lineHeight:1.3,marginBottom:2}}>{g.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",fontFamily:"'DM Mono',monospace"}}>{g.state} · KOA {g.type}</div>
              </div>
              {g.flags.length>0&&<div style={{width:8,height:8,borderRadius:"50%",background:g.flags[0].color,flexShrink:0,marginTop:2,boxShadow:`0 0 6px ${g.flags[0].color}`}}/>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:g.flags.length?8:0}}>
              {[["ADR","$"+g.adr],["Cancel",g.cancelRate+"%"],["KampStr",g.kampPct+"%"]].map(([k,v])=>(
                <div key={k}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.32)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{k}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",fontFamily:"'DM Mono',monospace"}}>{v}</div>
                </div>
              ))}
            </div>
            {g.flags.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {g.flags.slice(0,2).map(f=><span key={f.type} style={{fontSize:9,padding:"2px 6px",borderRadius:10,background:f.color+"1a",border:`1px solid ${f.color}30`,color:f.color,fontWeight:600}}>{f.label}</span>)}
            </div>}
          </GCard>
        ))}
      </div>

      {pages>1&&(
        <div style={{display:"flex",gap:8,justifyContent:"center",alignItems:"center"}}>
          <button onClick={()=>setPg(p=>Math.max(0,p-1))} disabled={pg===0} className="chip" style={{opacity:pg===0?0.4:1}}>← Prev</button>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.42)"}}>{pg+1} / {pages}</span>
          <button onClick={()=>setPg(p=>Math.min(pages-1,p+1))} disabled={pg===pages-1} className="chip" style={{opacity:pg===pages-1?0.4:1}}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App(){
  const[dark,setDark]=useState(true);
  const[sec,setSec]=useState("overview");
  const[modal,setModal]=useState(null);
  const[time,setTime]=useState(new Date());
  const open=useCallback((type,item)=>setModal({type,item}),[]);

  useEffect(()=>{ document.body.className=dark?"":"light-mode"; },[dark]);
  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(t); },[]);

  const r=useCounter(10893242,2200,100);
  const roi=useCounter(972,1800,300);
  const rev=useCounter(482625,2000,500);
  const lift=useCounter(19,1400,200);
  const vkr=useCounter(655022,2000,400);
  const camps=useCounter(518,1000,100);

  const tx=dark?{text:"#f1f5f9",sub:"rgba(255,255,255,0.50)",mut:"rgba(255,255,255,0.32)",
    acc:KOA_YELLOW,red:KOA_RED,green:"#10b981",blue:"#3b82f6",pur:"#8b5cf6"}
    :{text:"#0f172a",sub:"rgba(0,0,0,0.55)",mut:"rgba(0,0,0,0.38)",
    acc:KOA_YELLOW,red:KOA_RED,green:"#059669",blue:"#2563eb",pur:"#7c3aed"};

  const NAV=[
    {id:"overview",l:"Overview"},{id:"signals",l:"Signals"},{id:"pipeline",l:"Pipeline"},
    {id:"personas",l:"Personas"},{id:"campaign",l:"Campaign"},{id:"loyalty",l:"Loyalty"},
    {id:"accommodation",l:"Accommodation"},{id:"campgrounds",l:"Campgrounds"},
  ];

  return(
    <div style={{minHeight:"100vh",color:tx.text,fontFamily:"'DM Sans',system-ui,sans-serif",position:"relative"}}>

      {/* HEADER */}
      <header style={{position:"sticky",top:0,zIndex:200,
        background:dark?"rgba(6,12,26,0.80)":"rgba(240,220,210,0.82)",
        backdropFilter:"blur(32px) saturate(180%)",WebkitBackdropFilter:"blur(32px) saturate(180%)",
        borderBottom:dark?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(0,0,0,0.09)",
        height:56,display:"flex",alignItems:"center",padding:"0 22px",gap:14}}>

        {/* KOA Logo mark */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:8,
            background:`linear-gradient(135deg,${KOA_RED},#b0000e)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontWeight:800,fontSize:13,color:"#fff",
            boxShadow:`0 4px 14px ${KOA_RED}50`}}>K</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:tx.text,letterSpacing:"0.01em"}}>KOA Analytics</div>
            <div style={{fontSize:9,color:tx.mut,letterSpacing:"0.07em",textTransform:"uppercase"}}>Guest Segmentation · GSU CIS-8010</div>
          </div>
        </div>

        <nav style={{display:"flex",gap:2,flex:1,justifyContent:"center",flexWrap:"wrap"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setSec(n.id)}
              className={`nav-btn ${sec===n.id?"active":""}`}
              style={{color:sec===n.id?KOA_RED:tx.sub}}>{n.l}</button>
          ))}
        </nav>

        <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{fontSize:11,color:tx.mut,fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:tx.green,display:"inline-block",
              animation:"pulse 2s infinite",boxShadow:`0 0 6px ${tx.green}`}}/>
            {time.toLocaleTimeString("en-US",{hour12:false})}
          </div>
          <button onClick={()=>setDark(!dark)}
            style={{width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14,
              background:dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)",
              border:dark?"1px solid rgba(255,255,255,0.12)":"1px solid rgba(0,0,0,0.1)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{position:"relative",zIndex:1,padding:"24px 22px 64px",maxWidth:1380,margin:"0 auto"}}>

        {/* ── OVERVIEW ── */}
        {sec==="overview"&&(
          <div key="ov" className="fu">
            <h1 style={{fontSize:24,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>KOA Guest Intelligence</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:22}}>7-agent Airia pipeline · 10.9M reservations · 518 campgrounds · Agents 1–4 complete · Click anything</p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:16}}>
              {[
                {l:"Reservations",v:r.toLocaleString(),s:"2022–2026 YTD",c:KOA_YELLOW,delay:0,
                  kpi:{title:"Reservations analyzed",context:"KOA network · 2022–2026 YTD",color:KOA_YELLOW,
                    insight:"10.9M reservation records analyzed across 518 campgrounds. Covers completed stays, cancellations (1.2M), and active bookings.",
                    metrics:[["Total records","10,893,242"],["Cancellations","1,226,412"],["Campgrounds","518"],["Date range","2022–2026 YTD"],["Data sources","KampSightDB + VDW"],["Agents used","Agent 1 + Agent 2"]]}},
                {l:"Campaign ROI",v:roi+"%",s:"$45K → $482K",c:tx.green,delay:80,
                  kpi:{title:"Campaign ROI · 972.5%",context:"KOA-SPRING-REAWAKENING-2026",color:tx.green,
                    insight:"$45,000 campaign cost generated $482,625 in attributed revenue. Two-sample t-test: p=0.000. 95% CI [16.17%, 21.83%].",
                    metrics:[["Campaign cost","$45,000"],["Attributed revenue","$482,625"],["ROI","972.5%"],["p-value","0.000"],["CI lower","16.17%"],["CI upper","21.83%"]]}},
                {l:"Attributed rev",v:"$"+Math.round(rev/1000)+"K",s:"KOA-SPRING-2026",c:KOA_YELLOW,delay:160,
                  kpi:{title:"Attributed revenue · $482,625",context:"Post-campaign attribution at 0.70 factor",color:KOA_YELLOW,
                    insight:"Gross post-campaign revenue $742,875 × 0.70 attribution factor = $482,625. Conservative factor applied for statistical integrity.",
                    metrics:[["Gross revenue","$742,875"],["Attribution factor","0.70"],["Attributed","$482,625"],["Channel split","Email (250K) + SMS (45K)"],["Personas","Loyal Enthusiasts + New Explorers"],["Campaign window","Q1 2026"]]}},
                {l:"Booking lift",v:lift+"%",s:"p=0.000 · 95% CI",c:tx.blue,delay:240,
                  kpi:{title:"Booking lift · 19.0%",context:"Pre vs post campaign",color:tx.blue,
                    insight:"Pre-campaign: 12,500 bookings. Post-campaign: 14,875 bookings. Absolute lift: 2,375 incremental bookings.",
                    metrics:[["Pre-campaign","12,500"],["Post-campaign","14,875"],["Absolute lift","2,375"],["Lift %","19.0%"],["Test","Two-sample t-test"],["Confidence","95%"]]}},
                {l:"VKR members",v:vkr.toLocaleString(),s:"VIP · BONUS · BASE",c:tx.pur,delay:320,
                  kpi:{title:"VKR loyalty members · 655,022",context:"Active VKR program",color:tx.pur,
                    insight:"655,022 active VKR members. Critical: 276,080 enrolled members have NO assigned tier — the single highest-ROI activation opportunity.",
                    metrics:[["VIP tier","47,695"],["BONUS tier","101,649"],["BASE tier","231,993"],["Untiered (active)","276,080"],["Total active","655,022"],["Activation gap","276K = highest-ROI target"]]}},
                {l:"Campgrounds",v:camps.toLocaleString(),s:"Active network",c:tx.green,delay:400,
                  kpi:{title:"KOA campground network · 518",context:"Active franchise network",color:tx.green,
                    insight:"518 active KOA campgrounds across 45+ states. Journey, Holiday, and Resort tiers. Agent 2 flagged ~90 high-cancellation locations.",
                    metrics:[["Total","518"],["Journey tier","~300"],["Holiday tier","~160"],["Resort tier","~58"],["States covered","45+"],["High cancel flagged","~90 locations"]]}},
              ].map(k=>(
                <GCard key={k.l} onClick={()=>open("kpi",k.kpi)} accent={k.c} className="fu" style={{padding:"16px 14px",animationDelay:`${k.delay}ms`}}>
                  <div style={{fontSize:10,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{k.l}</div>
                  <div style={{fontSize:22,fontWeight:700,color:k.c,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums"}}>{k.v}</div>
                  <div style={{fontSize:10,color:tx.mut,marginTop:5}}>{k.s}</div>
                </GCard>
              ))}
            </div>

            {/* Pipeline strip */}
            <GCard style={{padding:"16px 18px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h2 style={{fontSize:13,fontWeight:600,color:tx.text}}>Pipeline status · click any agent</h2>
                <span style={{fontSize:11,color:tx.green,fontWeight:600}}>4 / 7 complete · 2 pending · 1 historical</span>
              </div>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {AGENTS.map((a,i)=>(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:5,flex:1}}>
                    <div onClick={()=>open("agent",a)}
                      style={{flex:1,padding:"9px 10px",borderRadius:9,background:"rgba(255,255,255,0.05)",
                        border:"1px solid rgba(255,255,255,0.09)",cursor:"pointer",transition:"background 0.18s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.10)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:a.color,display:"inline-block",
                          boxShadow:`0 0 5px ${a.color}`,animation:a.status==="pending"?"pulse 2s infinite":"none"}}/>
                        <span style={{fontSize:9,fontWeight:700,color:a.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>{a.short}</span>
                      </div>
                      <div style={{fontSize:10,color:tx.sub,lineHeight:1.3}}>{a.name}</div>
                    </div>
                    {i<AGENTS.length-1&&<div style={{color:tx.mut,fontSize:10,flexShrink:0}}>→</div>}
                  </div>
                ))}
              </div>
            </GCard>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <GCard style={{padding:"18px 18px"}} onClick={()=>setSec("signals")}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontSize:13,fontWeight:600,color:tx.text}}>Top signals · Agent 2</h2>
                  <span style={{fontSize:11,color:KOA_RED}}>View all →</span>
                </div>
                {SIGNALS.slice(0,3).map(s=>(
                  <div key={s.rank} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                    <div style={{width:20,height:20,borderRadius:6,background:s.color+"1a",border:`1px solid ${s.color}40`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:s.color,flexShrink:0}}>{s.rank}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:500,color:tx.text,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                      <div className="bar-track"><div className="bar-fill" style={{width:`${s.trend*3}%`,background:s.color}}/></div>
                    </div>
                    <span style={{fontSize:11,fontWeight:700,color:s.color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{s.yoy}</span>
                  </div>
                ))}
              </GCard>

              <GCard style={{padding:"18px 18px"}} onClick={()=>setSec("campaign")}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontSize:13,fontWeight:600,color:tx.text}}>Campaign · KOA-SPRING-2026</h2>
                  <span style={{fontSize:11,color:KOA_RED}}>Full breakdown →</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[{l:"Booking lift",v:"19.0%",c:tx.green},{l:"ROI",v:"972.5%",c:KOA_YELLOW},
                    {l:"Email open rate",v:"25.0%",c:tx.blue},{l:"SMS read rate",v:"87.3%",c:tx.green},
                    {l:"Attributed rev",v:"$482,625",c:KOA_YELLOW},{l:"Campaign cost",v:"$45,000",c:tx.sub}].map(m=>(
                    <div key={m.l} style={{padding:"9px 10px",background:"rgba(255,255,255,0.05)",borderRadius:9,border:"1px solid rgba(255,255,255,0.08)"}}>
                      <div style={{fontSize:9,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{m.l}</div>
                      <div style={{fontSize:15,fontWeight:700,color:m.c,fontVariantNumeric:"tabular-nums"}}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </GCard>
            </div>

            <GCard style={{padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h2 style={{fontSize:13,fontWeight:600,color:tx.text}}>8 guest personas · all campaign ready · click to explore</h2>
                <button onClick={()=>setSec("personas")} style={{fontSize:11,color:KOA_RED,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>View all →</button>
              </div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {PERSONAS.map(p=>(
                  <div key={p.id} onClick={()=>open("persona",p)}
                    style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",
                      background:"rgba(255,255,255,0.05)",border:`1px solid ${p.color}28`,borderRadius:10,cursor:"pointer",transition:"all 0.18s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.10)";e.currentTarget.style.borderColor=p.color+"55";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor=p.color+"28";}}>
                    <span style={{color:p.color,fontSize:14}}>{p.icon}</span>
                    <span style={{fontSize:12,color:tx.text,fontWeight:500}}>{p.name}</span>
                  </div>
                ))}
              </div>
            </GCard>
          </div>
        )}

        {/* ── SIGNALS ── */}
        {sec==="signals"&&(
          <div key="sig" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Signal intelligence · Agent 2</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>10.9M reservations · 1.2M cancellations · 11.2M KampStore txns · Click any signal for full campaign playbook</p>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              {SIGNALS.map((s,i)=>(
                <GCard key={s.rank} onClick={()=>open("signal",s)} accent={s.color} className="fu" style={{padding:"20px 22px",animationDelay:`${i*65}ms`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
                    <div style={{width:42,height:42,borderRadius:12,background:s.color+"1a",border:`1px solid ${s.color}40`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:s.color,flexShrink:0}}>{s.rank}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                        <h3 style={{fontSize:14,fontWeight:600,color:tx.text}}>{s.name}</h3>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600,
                          background:s.actionability==="Immediate"?`${KOA_RED}18`:"rgba(255,204,0,0.15)",
                          color:s.actionability==="Immediate"?KOA_RED:KOA_YELLOW,
                          border:`1px solid ${s.actionability==="Immediate"?KOA_RED+"35":KOA_YELLOW+"35"}`}}>{s.actionability}</span>
                      </div>
                      <p style={{fontSize:12,color:tx.sub,marginBottom:12}}>{s.tagline}</p>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:10}}>
                        {[["Volume",s.volume,tx.text],["YoY trend",s.yoy,s.color],["Revenue impact",s.revenue,tx.green]].map(([k,v,c])=>(
                          <div key={k}>
                            <div style={{fontSize:10,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                            <div style={{fontSize:13,fontWeight:600,color:c,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bar-track"><div className="bar-fill" style={{width:`${Math.min(s.trend*4,85)}%`,background:`linear-gradient(90deg,${s.color},${s.color}70)`}}/></div>
                    </div>
                    <span style={{fontSize:11,color:tx.mut,flexShrink:0}}>{s.detail.campaigns.length} campaigns →</span>
                  </div>
                </GCard>
              ))}
            </div>
            <GCard style={{padding:"16px 18px",marginTop:12}}>
              <h3 style={{fontSize:12,fontWeight:600,color:tx.text,marginBottom:10}}>Channels across all signal campaigns</h3>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {["Email","SMS","TikTok","Instagram","Push","LinkedIn Ads","Meta Ads","Pinterest","Google SEM","AllTrails","YouTube Pre-roll","Influencer","In-App"].map(ch=><ChBadge key={ch} ch={ch}/>)}
              </div>
            </GCard>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {sec==="pipeline"&&(
          <div key="pipe" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Pipeline · 7-agent Airia workflow</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>KampSightDB · VDW · Airia Memory · Click any agent</p>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {AGENTS.map((a,i)=>(
                <GCard key={a.id} onClick={()=>open("agent",a)} accent={a.color} className="fu" style={{padding:"17px 20px",animationDelay:`${i*50}ms`}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:42,height:42,borderRadius:12,background:a.color+"1a",border:`1px solid ${a.color}40`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:a.color,flexShrink:0,fontFamily:"'DM Mono',monospace",textAlign:"center",lineHeight:1.2}}>
                      AG{String(a.id).padStart(2,"0")}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontSize:13,fontWeight:600,color:tx.text}}>{a.name}</span>
                        <span style={{width:6,height:6,borderRadius:"50%",background:a.color,display:"inline-block",
                          boxShadow:`0 0 5px ${a.color}`,animation:a.status==="pending"?"pulse 2s infinite":"none"}}/>
                        <span style={{fontSize:11,color:a.color,fontWeight:600,textTransform:"capitalize"}}>{a.status}</span>
                      </div>
                      <p style={{fontSize:12,color:tx.sub}}>{a.desc}</p>
                    </div>
                    <div style={{display:"flex",gap:14,flexShrink:0}}>
                      {a.metrics.slice(0,2).map(([k,v])=>(
                        <div key={k} style={{textAlign:"right"}}>
                          <div style={{fontSize:9,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.06em"}}>{k}</div>
                          <div style={{fontSize:12,fontWeight:600,color:tx.text,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <span style={{fontSize:12,color:tx.mut}}>→</span>
                  </div>
                </GCard>
              ))}
            </div>
            <GCard style={{padding:"12px 18px",marginTop:12}}>
              <div style={{display:"flex",gap:24,fontSize:12,color:tx.sub,flexWrap:"wrap"}}>
                <span><span style={{color:tx.green}}>● </span>Complete — real KOA data</span>
                <span><span style={{color:KOA_YELLOW}}>● </span>Pending — awaiting trigger</span>
                <span><span style={{color:tx.blue}}>● </span>Historical — benchmark</span>
                <span style={{marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:11,color:tx.mut}}>Memory: Agent 1–4 wired</span>
              </div>
            </GCard>
          </div>
        )}

        {/* ── PERSONAS ── */}
        {sec==="personas"&&(
          <div key="per" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Guest personas · Agent 4</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>8 personas · all campaign ready · click any card for full strategy + copy</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11}}>
              {PERSONAS.map((p,i)=>(
                <GCard key={p.id} onClick={()=>open("persona",p)} accent={p.color} className="fu" style={{padding:"17px 14px",animationDelay:`${i*45}ms`}}>
                  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
                    <div style={{width:34,height:34,borderRadius:9,background:p.color+"1a",border:`1px solid ${p.color}40`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:p.color,flexShrink:0}}>{p.icon}</div>
                    <div>
                      <div style={{fontSize:9,fontWeight:700,color:p.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>{p.id}</div>
                      <div style={{fontSize:12,fontWeight:600,color:tx.text,lineHeight:1.2}}>{p.name}</div>
                    </div>
                  </div>
                  <p style={{fontSize:11,color:tx.sub,fontStyle:"italic",marginBottom:9,lineHeight:1.5}}>{p.tagline}</p>
                  <div style={{fontSize:11,color:tx.sub,marginBottom:9}}>
                    <span style={{color:tx.mut}}>Channel: </span>
                    <span style={{color:tx.text,fontWeight:500}}>{p.channel}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span className="tag" style={{background:p.confidence==="High"?"rgba(16,185,129,0.15)":KOA_YELLOW+"18",
                      border:`1px solid ${p.confidence==="High"?"rgba(16,185,129,0.3)":KOA_YELLOW+"35"}`,
                      color:p.confidence==="High"?tx.green:KOA_YELLOW,fontSize:9}}>{p.confidence}</span>
                    <span style={{fontSize:9,color:tx.green,fontWeight:600}}>● Ready</span>
                  </div>
                </GCard>
              ))}
            </div>
          </div>
        )}

        {/* ── CAMPAIGN ── */}
        {sec==="campaign"&&(
          <div key="cam" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Campaign performance</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>KOA-SPRING-REAWAKENING-2026 · Two-sample t-test · p=0.000 · 95% CI [16.17%, 21.83%] · Click any metric</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:14}}>
              {[
                {l:"Booking lift",v:"19.0%",c:tx.green,modal:{title:"Booking lift · 19.0%",context:"Pre vs post campaign",color:tx.green,
                  insight:"Pre-campaign: 12,500 bookings. Post-campaign: 14,875 bookings. Absolute lift: 2,375 incremental bookings. p=0.000 confirms statistical significance.",
                  metrics:[["Pre-campaign","12,500"],["Post-campaign","14,875"],["Absolute lift","2,375"],["Lift %","19.0%"],["CI lower","16.17%"],["CI upper","21.83%"]]}},
                {l:"Campaign ROI",v:"972.5%",c:KOA_YELLOW,modal:{title:"ROI · 972.5%",context:"$45K cost vs $482K revenue",color:KOA_YELLOW,
                  insight:"$45,000 campaign cost generated $482,625 in attributed revenue. ROI factor: 9.725×. Conservative 0.70 attribution applied.",
                  metrics:[["Campaign cost","$45,000"],["Gross revenue","$742,875"],["Attributed (0.70)","$482,625"],["ROI factor","9.725×"],["ROI %","972.5%"],["Net profit","$437,625"]]}},
                {l:"Pre-campaign",v:"12,500",c:tx.sub,modal:{title:"Pre-campaign baseline · 12,500",context:"90-day control window",color:tx.blue,
                  insight:"Baseline booking count over equivalent 90-day pre-campaign window, used as control group for two-sample t-test.",
                  metrics:[["Booking window","90-day pre-campaign"],["Baseline count","12,500"],["Avg rev/booking","$250"],["Total baseline","$3,125,000"],["Control group","Statistical holdout"],["Data source","KampSightDB Reservations"]]}},
                {l:"Post-campaign",v:"14,875",c:tx.blue,modal:{title:"Post-campaign result · 14,875",context:"90-day post-launch window",color:tx.blue,
                  insight:"14,875 total bookings against 12,500 baseline = 19% lift. Peak in Loyal Enthusiasts and New Explorer segments.",
                  metrics:[["Post-campaign","14,875"],["Incremental","2,375 bookings"],["Lift %","19.0%"],["Best segment","Loyal Enthusiasts (32% open)"],["Email opens","62,125"],["SMS reads","38,500"]]}},
              ].map(m=>(
                <GCard key={m.l} onClick={()=>open("camp_metric",m.modal)} accent={m.c} style={{padding:"20px 16px"}}>
                  <div style={{fontSize:10,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{m.l}</div>
                  <div style={{fontSize:28,fontWeight:700,color:m.c,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums"}}>{m.v}</div>
                </GCard>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <GCard style={{padding:"18px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
                  <ChBadge ch="Email"/>
                  <span style={{fontSize:13,fontWeight:600,color:tx.text}}>Email channel</span>
                </div>
                {[["Sent","250,000"],["Delivered","248,500"],["Opened","62,125"],["Clicked","8,450"],["Open rate","25.0%"],["CTR","3.4%"],["Delivery rate","99.4%"]].map(([k,v])=><DRow key={k} k={k} v={v}/>)}
                <div style={{marginTop:9,fontSize:10,color:tx.mut}}>Loyal Enthusiasts (120K) + New Explorers (130K)</div>
              </GCard>
              <GCard style={{padding:"18px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
                  <ChBadge ch="SMS"/>
                  <span style={{fontSize:13,fontWeight:600,color:tx.text}}>SMS channel</span>
                </div>
                {[["Sent","45,000"],["Delivered","44,100"],["Read","38,500"],["Engaged","5,200"],["Read rate","87.3%"],["Engage rate","11.6%"],["Delivery rate","98.0%"]].map(([k,v])=><DRow key={k} k={k} v={v}/>)}
                <div style={{marginTop:9,fontSize:10,color:tx.mut}}>ZingleStaging · via KampSightDB SMS routing</div>
              </GCard>
              <GCard style={{padding:"18px 16px"}}>
                <h3 style={{fontSize:13,fontWeight:600,color:tx.text,marginBottom:13}}>Sentiment & validity</h3>
                {[{l:"Positive",v:482,pct:71,c:tx.green},{l:"Neutral",v:156,pct:23,c:tx.sub},{l:"Negative",v:42,pct:6,c:KOA_RED}].map(s=>(
                  <div key={s.l} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                      <span style={{color:s.c,fontWeight:500}}>{s.l}</span>
                      <span style={{color:tx.mut,fontFamily:"'DM Mono',monospace"}}>{s.v} ({s.pct}%)</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill" style={{width:`${s.pct}%`,background:s.c}}/></div>
                  </div>
                ))}
                <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:10,marginTop:6}}>
                  {[["Test","Two-sample t-test"],["p-value","0.000"],["CI lower","16.17%"],["CI upper","21.83%"],["NPS corr.","r = 1.000"]].map(([k,v])=><DRow key={k} k={k} v={v} vc={tx.green}/>)}
                </div>
              </GCard>
            </div>
          </div>
        )}

        {/* ── LOYALTY ── */}
        {sec==="loyalty"&&(
          <div key="loy" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Loyalty intelligence · VKR program</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>3.025M unique guests · 655K VKR members · −22.3% guest base decline · Click any tier</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:14}}>
              {VKR_TIERS.map(v=>(
                <GCard key={v.name} style={{padding:"16px 14px"}} accent={v.color}>
                  <div style={{fontSize:11,fontWeight:700,color:v.color,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{v.name}</div>
                  <div style={{fontSize:22,fontWeight:700,color:tx.text,fontVariantNumeric:"tabular-nums"}}>{v.count}</div>
                  <div style={{fontSize:10,color:tx.mut,marginTop:4}}>{v.points}</div>
                </GCard>
              ))}
            </div>
            <GCard style={{padding:"20px 22px",marginBottom:12}}>
              <h3 style={{fontSize:14,fontWeight:600,color:tx.text,marginBottom:14}}>Loyalty depth by stay count · click any tier</h3>
              {LOYALTY_TIERS.map(l=>(
                <div key={l.tier} onClick={()=>open("loyalty_tier",l)}
                  style={{display:"flex",alignItems:"center",gap:12,marginBottom:13,cursor:"pointer",padding:"5px 6px",borderRadius:8,transition:"background 0.18s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:180,fontSize:12,color:tx.sub,flexShrink:0}}>{l.tier}</div>
                  <div style={{flex:1}}>
                    <div className="bar-track"><div className="bar-fill" style={{width:`${l.pct*1.6}%`,background:`linear-gradient(90deg,${l.color},${l.color}70)`}}/></div>
                  </div>
                  <div style={{width:90,textAlign:"right",fontSize:12,fontWeight:700,color:l.color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{l.count}</div>
                  <div style={{width:36,textAlign:"right",fontSize:11,color:tx.mut,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{l.pct}%</div>
                  <div style={{width:80,textAlign:"right",fontSize:11,color:tx.sub,flexShrink:0}}>{l.nights} nights</div>
                  <span style={{fontSize:11,color:tx.mut,flexShrink:0}}>→</span>
                </div>
              ))}
              <div style={{marginTop:10,padding:"12px 14px",borderRadius:10,background:KOA_YELLOW+"10",border:`1px solid ${KOA_YELLOW}25`,fontSize:12,color:tx.sub,lineHeight:1.7}}>
                <strong style={{color:KOA_YELLOW}}>Champion insight:</strong> 4.7% of guests (142,609) generate 22.3% of all camper nights (8.76M). Average 61 nights per career. Existential threat if this segment churns.
              </div>
            </GCard>
            <GCard style={{padding:"20px 22px"}}>
              <h3 style={{fontSize:14,fontWeight:600,color:tx.text,marginBottom:14}}>Unique guest erosion · 2022–2025</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
                {[{y:"2022",g:"1,385,840",c:tx.green},{y:"2023",g:"1,249,244",c:tx.blue},{y:"2024",g:"1,159,492",c:KOA_YELLOW},{y:"2025",g:"1,076,186",c:KOA_RED}].map(r=>(
                  <div key={r.y} style={{padding:"14px",borderRadius:12,background:r.c+"10",border:`1px solid ${r.c}22`}}>
                    <div style={{fontSize:12,fontWeight:700,color:r.c,marginBottom:4}}>{r.y}</div>
                    <div style={{fontSize:18,fontWeight:700,color:tx.text,fontVariantNumeric:"tabular-nums"}}>{r.g}</div>
                  </div>
                ))}
              </div>
              <p style={{fontSize:12,color:tx.sub,lineHeight:1.6}}>
                <span style={{fontWeight:700,color:KOA_RED,fontFamily:"'DM Mono',monospace"}}>−22.3%</span> decline 2022–2025 · At −8%/yr → sub-1M unique guests by 2027. Reactivating 5% of 300K+ lapsed guests = $6.75M.
              </p>
            </GCard>
          </div>
        )}

        {/* ── ACCOMMODATION ── */}
        {sec==="accommodation"&&(
          <div key="acc" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Accommodation mix · revenue analysis</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>2025 reservations · Cabin = 51% higher RevPAR than RV · Click any type</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:13,marginBottom:14}}>
              {ACCOMMODATION.map((a,i)=>(
                <GCard key={a.type} onClick={()=>open("accommodation",a)} accent={a.color} className="fu" style={{padding:"20px 20px",animationDelay:`${i*65}ms`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div>
                      <h3 style={{fontSize:15,fontWeight:700,color:tx.text}}>{a.type}</h3>
                      <div style={{fontSize:11,fontWeight:700,color:parseFloat(a.yoy)>0?tx.green:KOA_RED,marginTop:3,fontFamily:"'DM Mono',monospace"}}>{a.yoy} YoY</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontWeight:700,color:a.color,fontVariantNumeric:"tabular-nums"}}>{a.adr}</div>
                      <div style={{fontSize:10,color:tx.mut}}>avg / reservation</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                    {[["2025 res",a.res2025],["Total rev",a.totalRev],["Avg nights",String(a.nights)]].map(([k,v])=>(
                      <div key={k}>
                        <div style={{fontSize:9,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                        <div style={{fontSize:12,fontWeight:600,color:tx.text,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${a.pct}%`,background:a.color}}/></div>
                </GCard>
              ))}
            </div>
            <GCard style={{padding:"18px 20px"}}>
              <h3 style={{fontSize:13,fontWeight:600,color:tx.text,marginBottom:12}}>Revenue premium analysis</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[{l:"Cabin vs RV premium",v:"51%",c:tx.green,s:"$385.99 vs $255.53/res"},
                  {l:"Cabin vs Tent premium",v:"252%",c:KOA_YELLOW,s:"$385.99 vs $109.62/res"},
                  {l:"Oct–Nov cabin floor",v:"23K",c:tx.blue,s:"vs tent 16K — off-season resilience"}].map(m=>(
                  <div key={m.l} style={{padding:"14px",borderRadius:12,background:m.c+"10",border:`1px solid ${m.c}22`}}>
                    <div style={{fontSize:11,color:tx.sub,marginBottom:5}}>{m.l}</div>
                    <div style={{fontSize:22,fontWeight:700,color:m.c}}>{m.v}</div>
                    <div style={{fontSize:10,color:tx.mut,marginTop:3}}>{m.s}</div>
                  </div>
                ))}
              </div>
            </GCard>
          </div>
        )}

        {/* ── CAMPGROUNDS ── */}
        {sec==="campgrounds"&&<CampsSection onSelect={({type,item})=>open(type,item)}/>}

      </main>

      {/* STATUS BAR */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:28,zIndex:200,
        background:dark?"rgba(6,12,26,0.88)":"rgba(235,215,205,0.88)",
        backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        borderTop:dark?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.07)",
        display:"flex",alignItems:"center",padding:"0 22px",gap:24,
        fontSize:10,color:tx.mut,fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em"}}>
        <span style={{color:tx.green}}>● AGENTS 1–4 COMPLETE</span>
        <span>10.9M RESERVATIONS · 518 CAMPGROUNDS</span>
        <span>655K VKR MEMBERS · AGENTS 5–6 PENDING</span>
        <span style={{marginLeft:"auto"}}>AIRIA GUEST SEGMENTATION v2.0 · GSU CIS-8010 · {new Date().toLocaleDateString()}</span>
      </div>

      <Modal modal={modal} onClose={()=>setModal(null)}/>
    </div>
  );
}
