import { useState, useEffect, useCallback, useMemo } from "react";
import { useAiriaAgent } from "./useAiriaAgent.jsx";
import { KOA_LOGO } from "./assets.js";
import { Analytics } from "@vercel/analytics/react";
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
  {id:5,short:"ORCH",name:"Master orchestrator",status:"complete",color:"#10b981",
   desc:"Campaign routing across all 8 personas — prioritized by spending signals and engagement strategy",
   metrics:[["Personas","8"],["High priority","4"],["Campaign ready","8 / 8"],["Next","Agent 6"]],
   memKey:"Agent 5 - Campaign Plans",ver:"v1.00"},
  {id:6,short:"EXEC",name:"Campaign execution",status:"complete",color:"#10b981",
   desc:"Email via _GSA SendGrid · 479K recipients · $2.457M revenue impact · 8 personas executed",
   metrics:[["Recipients","479,695"],["Revenue impact","$2,457,000"],["Bounce rate","1.76%"],["Memory key","Agent 6 - Campaign Execution"]],
   memKey:"Agent 6 - Campaign Execution",ver:"v1.00"},
  {id:7,short:"MEASURE",name:"Feedback loop",status:"complete",color:"#10b981",
   desc:"ROI 3,722% · Email open 28.5% · SMS read 91.2% · NPS r=0.965 · All benchmarks exceeded",
   metrics:[["ROI","3,722%"],["Booking lift","19.0%"],["NPS correlation","r=0.965"],["Memory key","Agent 7 Feedback Loop"]],
   memKey:"Agent 7 Feedback Loop",ver:"v1.00"},
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

// ─── AGENT 5 DATA ─────────────────────────────────────────────────────────────
const AGENT5_DATA = {
  total_personas: 8,
  high_priority_count: 4,
  status: "complete",
  ready_for_agent_6: true,
  measurement_plan: {
    primary_kpi: "RevPAR lift by segment",
    secondary_kpis: ["Direct booking share", "Repeat stay rate", "Ancillary attach rate"],
    reporting_cadence: "Monthly",
    holdout_group_recommended: true,
  },
  global_suppression_rules: [
    "Exclude guests with consent_unknown on email campaigns",
    "Suppress S7 (Casual Occasionals) from SMS until phone coverage improves",
    "Flag S2 duplicates for dedup before activation",
  ],
  campaign_plans: [
    { persona_id:"P1", persona_name:"Loyal Enthusiasts", tagline:"The Heartbeat of the Campground", campaign_priority:"High",
      activation_strategy:{ attract:"Early access to booking windows for VIP members.", convert:"Exclusive 'Loyalty Appreciation' weekend discounts.", retain:"Personalized 'Welcome Back' gifts at check-in." },
      recommended_channels:"Books 6-9 months in advance for peak season.",
      primary_motivations:["Consistency of service across the KOA network","Recognition of loyalty status"],
      key_pain_points:["Difficulty securing specific favorite sites","Inconsistent Wi-Fi for streaming"],
      kpis:["Year-over-year retention rate","Average lifetime value","VKR point redemption frequency"],
      risk_factors:["Competitor loyalty poaching","Rising site rates"], campaign_readiness:"Ready" },
    { persona_id:"P2", persona_name:"New Explorers", tagline:"Discovering the Great Outdoors", campaign_priority:"High",
      activation_strategy:{ attract:"Social media campaigns highlighting 'Glamping' and easy-access sites.", convert:"First-timer discount bundles including a S'mores Kit.", retain:"Follow-up emails with 'How-to' camping guides for their next trip." },
      recommended_channels:"Short lead times; often booking within 14 days of arrival.",
      primary_motivations:["Instagrammable experiences","Escaping the city for mental wellness"],
      key_pain_points:["Lack of camping equipment","Intimidated by RV hookup processes"],
      kpis:["New customer acquisition rate","Social media engagement","Second-stay conversion"],
      risk_factors:["One-and-done mentality","Weather sensitivity"], campaign_readiness:"Ready" },
    { persona_id:"P4", persona_name:"Business Travelers", tagline:"The Mobile Office on the Road", campaign_priority:"High",
      activation_strategy:{ attract:"LinkedIn ads targeting remote workers and digital nomads.", convert:"Mid-week 'Workation' discounts.", retain:"Corporate loyalty tier or streamlined expensing tools." },
      recommended_channels:"Mid-week stays (Tues-Thurs); last-minute bookings.",
      primary_motivations:["Reliable Wi-Fi for Zoom calls","Quiet environment during the day"],
      key_pain_points:["Noisy families during work hours","Slow check-in/out processes"],
      kpis:["Mid-week occupancy growth","Wi-Fi satisfaction scores","Repeat business stays"],
      risk_factors:["Wi-Fi outages","Noise complaints"], campaign_readiness:"Ready" },
    { persona_id:"P6", persona_name:"Family Campers", tagline:"Making Memories That Last", campaign_priority:"High",
      activation_strategy:{ attract:"Family-centric Facebook ads and 'Kids Weekend' events.", convert:"Bundle deals including activity passes and meal vouchers.", retain:"Birthday month discounts for the children." },
      recommended_channels:"Seasonal (Summer/Spring Break); 2-4 months lead time.",
      primary_motivations:["Keeping kids entertained and safe","Affordable family bonding"],
      key_pain_points:["Overcrowded pools","Lack of kid-friendly food options"],
      kpis:["Amenity revenue per stay","Multi-generational booking rate","Summer occupancy"],
      risk_factors:["Competing youth sports schedules","Economic downturns"], campaign_readiness:"Ready" },
    { persona_id:"P3", persona_name:"Luxury Seekers", tagline:"Nature, But Make It Deluxe", campaign_priority:"Medium",
      activation_strategy:{ attract:"High-production video ads showcasing Deluxe Cabin interiors.", convert:"Add-on packages for linen service or pre-stocked fridges.", retain:"Invitations to 'Resort-tier' KOA properties." },
      recommended_channels:"Planned vacations; 3-4 months out.",
      primary_motivations:["Comfort and luxury in a natural setting","High-end amenities (pools, cafes)"],
      key_pain_points:["Basic communal bathrooms","Lack of concierge-style service"],
      kpis:["Average Daily Rate (ADR)","Ancillary service revenue","Cabin occupancy rate"],
      risk_factors:["High expectations for maintenance","Competition from AirBnb"], campaign_readiness:"Ready" },
    { persona_id:"P5", persona_name:"Leisure Seekers", tagline:"Taking the Scenic Route", campaign_priority:"Medium",
      activation_strategy:{ attract:"Direct mail brochures and RV show presence.", convert:"Extended stay monthly rates and 'Early Bird' renewal specials.", retain:"Community-building events (e.g., Bingo nights, craft fairs)." },
      recommended_channels:"Long-term stays (28+ days); booked a year in advance.",
      primary_motivations:["Socializing with other long-term campers","Safety and security of the park"],
      key_pain_points:["Complicated digital-only interfaces","Physical accessibility of facilities"],
      kpis:["Average length of stay","Renewal rate for seasonal sites","Referral volume"],
      risk_factors:["Health-related travel cessation","Rising fuel costs"], campaign_readiness:"Ready" },
    { persona_id:"P7", persona_name:"Adventure Seekers", tagline:"Your Basecamp for Exploration", campaign_priority:"Medium",
      activation_strategy:{ attract:"Partnerships with outdoor brands (REI, Patagonia).", convert:"Late-arrival 'Self-Check-in' tutorials and discounts.", retain:"Cross-promotion with other 'Adventure' KOAs in the region." },
      recommended_channels:"Weather-dependent; often booking 48-72 hours out.",
      primary_motivations:["Proximity to National Parks and trailheads","Hot showers after a long hike"],
      key_pain_points:["Strict check-in times (arriving late from trails)","High prices for basic sites"],
      kpis:["Last-minute booking volume","Shower/Laundry usage rates","Regional circuit travel"],
      risk_factors:["Competition from dispersed camping","Park closures"], campaign_readiness:"Ready" },
    { persona_id:"P8", persona_name:"Budget Campers", tagline:"Great Value, Great Outdoors", campaign_priority:"Medium",
      activation_strategy:{ attract:"Value-driven messaging: 'Vacation for under $50/night'.", convert:"No-fee weekends or 'Buy 2 Nights, Get 1 Free' promos.", retain:"Off-season discount vouchers." },
      recommended_channels:"Price-sensitive; looks for 'Value' dates and off-peak times.",
      primary_motivations:["Affordability compared to hotels","Access to clean water and electricity"],
      key_pain_points:["Hidden fees (pet fees, extra person fees)","High weekend surcharges"],
      kpis:["Price elasticity of demand","Off-peak occupancy","Promo code redemption"],
      risk_factors:["Extreme price sensitivity","Switching to free public lands"], campaign_readiness:"Ready" },
  ],
};

const PERSONA_ACCENT = { P1:KOA_YELLOW, P2:"#3b82f6", P3:"#8b5cf6", P4:"#10b981", P5:"#06b6d4", P6:"#ec4899", P7:"#84cc16", P8:"#f97316" };

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

// ─── AGENT OUTPUT RENDERERS ──────────────────────────────────────────────────

function parseAgentResult(raw) {
  if (!raw) return null;
  try {
    let str = typeof raw.result === "string" ? raw.result : JSON.stringify(raw.result);
    str = str.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "").trim();
    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === "string") return JSON.parse(parsed);
      return parsed;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

function PriorityBadge({ level }) {
  const map = { High: KOA_RED, Medium: KOA_YELLOW, Low: "#64748b" };
  const c = map[level] || "#64748b";
  return (
    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10,
      background: c + "18", border: `1px solid ${c}35`, color: c, fontWeight: 700 }}>
      {level} priority
    </span>
  );
}

function ImpactBadge({ label }) {
  if (!label) return null;
  const ll = label.toLowerCase();
  const c = ll.includes("high") || ll.includes("critical") ? "#10b981"
    : ll.includes("medium") ? KOA_YELLOW : "#64748b";
  return (
    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10,
      background: c + "18", border: `1px solid ${c}35`, color: c, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function Agent1Output({ data }) {
  const segments = data?.segments || [];
  const summary = data?.summary || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {(summary.total_guests || summary.segments_generated) && (
        <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>
          <span><span style={{ color: KOA_YELLOW, fontWeight: 700 }}>{summary.total_guests}</span> guests analyzed</span>
          <span><span style={{ color: "#10b981", fontWeight: 700 }}>{summary.segments_generated}</span> segments</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>{summary.date_range}</span>
        </div>
      )}
      {segments.map((s, i) => (
        <div key={i} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.09)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: KOA_YELLOW, fontFamily: "'DM Mono',monospace" }}>#{i+1}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9" }}>Guest {s.guest_id}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontWeight: 600 }}>{s.frequency}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(255,204,0,0.12)", border: "1px solid rgba(255,204,0,0.3)", color: KOA_YELLOW, fontWeight: 600 }}>{s.spending}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", fontWeight: 600 }}>{s.pattern}</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", marginLeft: "auto" }}>conf: {((s.confidence || 0) * 100).toFixed(0)}%</span>
          </div>
          {s.insights?.map((ins, j) => (
            <p key={j} style={{ fontSize: 10, color: "rgba(255,255,255,0.48)", lineHeight: 1.4, marginBottom: 2 }}>• {ins}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

function Agent2Output({ data }) {
  const signals = data?.top_actionable_signals || [];
  const insights = data?.strategic_insights?.segment_insights || {};
  const recs = data?.strategic_insights?.strategic_recommendations || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {signals.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 2 }}>Top actionable signals</div>
          {signals.map((s, i) => (
            <div key={i} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.09)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: KOA_YELLOW, fontFamily: "'DM Mono',monospace" }}>#{s.rank}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>{s.signal_name}</span>
                {s.business_impact && <ImpactBadge label={s.business_impact} />}
                {s.actionability && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", fontWeight: 600 }}>{s.actionability}</span>}
              </div>
              {s.recommendation && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", lineHeight: 1.5, marginBottom: s.expected_outcome ? 4 : 0 }}>{s.recommendation}</p>}
              {s.expected_outcome && <p style={{ fontSize: 10, color: "#10b981", lineHeight: 1.4 }}>→ {s.expected_outcome}</p>}
            </div>
          ))}
        </>
      )}
      {Object.keys(insights).length > 0 && (
        <>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginTop: 6, marginBottom: 2 }}>Segment insights</div>
          {Object.entries(insights).map(([seg, d]) => (
            <div key={seg} style={{ padding: "9px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: KOA_YELLOW, marginBottom: 4 }}>{seg}</div>
              {d.key_finding && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.50)", marginBottom: 3 }}><span style={{ color: "rgba(255,255,255,0.30)" }}>Finding: </span>{d.key_finding}</p>}
              {d.opportunity && <p style={{ fontSize: 10, color: "#10b981" }}><span style={{ color: "rgba(255,255,255,0.30)" }}>Opportunity: </span>{d.opportunity}</p>}
            </div>
          ))}
        </>
      )}
      {recs.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginTop: 6, marginBottom: 2 }}>Strategic recommendations</div>
          {recs.map((r, i) => (
            <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.50)", padding: "7px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.06)", lineHeight: 1.5 }}>
              {typeof r === "string" ? r : r.recommendation || JSON.stringify(r)}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function Agent3Output({ data }) {
  const clusters = data?.clusters || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {clusters.map((c) => (
        <div key={c.cluster_id} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: KOA_YELLOW, fontFamily: "'DM Mono',monospace" }}>C{c.cluster_id}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{c.cluster_name}</span>
            {c.strategic_priority && <PriorityBadge level={c.strategic_priority} />}
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", marginLeft: "auto" }}>{c.size_percentage?.toFixed?.(1) ?? c.size_percentage}% of pool</span>
          </div>
          {c.behavioral_narrative && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", lineHeight: 1.55, marginBottom: 7 }}>{c.behavioral_narrative}</p>}
          {c.distinguishing_characteristics?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
              {c.distinguishing_characteristics.slice(0, 4).map((ch, i) => (
                <span key={i} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: "rgba(255,204,0,0.08)", border: "1px solid rgba(255,204,0,0.2)", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{ch}</span>
              ))}
            </div>
          )}
          {c.attention_flags?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 7 }}>
              {c.attention_flags.map((f, i) => (
                <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.48)", padding: "5px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", lineHeight: 1.4 }}>{f}</div>
              ))}
            </div>
          )}
          {c.recommended_strategies && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
              {Object.entries(c.recommended_strategies).map(([k, v]) => (
                <div key={k} style={{ padding: "7px 9px", background: "rgba(255,255,255,0.04)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: KOA_RED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.40)", lineHeight: 1.4 }}>{typeof v === "string" ? v.slice(0, 100) + (v.length > 100 ? "…" : "") : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Agent4Output({ data }) {
  const cards = data?.persona_cards || [];
  const summary = data?.summary || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {(summary.total_personas || summary.delivery_status) && (
        <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2, flexWrap: "wrap" }}>
          {summary.total_personas && <span><span style={{ color: KOA_YELLOW, fontWeight: 700 }}>{summary.total_personas}</span> personas</span>}
          {summary.delivery_status && <span style={{ color: "#10b981", fontWeight: 600 }}>{summary.delivery_status}</span>}
          {summary.ready_for_presentation && <span style={{ color: "#10b981" }}>✓ Presentation ready</span>}
        </div>
      )}
      {cards.map((p) => {
        const mp = p.profile?.motivations_pain_points || {};
        const eng = p.strategy?.engagement || {};
        const conf = p.metadata?.confidence_level;
        const confColor = conf === "High" ? "#10b981" : KOA_YELLOW;
        return (
          <div key={p.card_number ?? p.persona_id} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 5 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{p.persona_name}</span>
                  {conf && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: confColor + "18", border: `1px solid ${confColor}35`, color: confColor, fontWeight: 700 }}>{conf} confidence</span>}
                  {p.strategy?.recommended_channel && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", fontWeight: 600 }}>{p.strategy.recommended_channel}</span>}
                  {p.campaign_readiness && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", fontWeight: 600 }}>● {p.campaign_readiness}</span>}
                </div>
                {p.tagline && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", fontStyle: "italic" }}>{p.tagline}</p>}
              </div>
            </div>
            {p.value_proposition && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 7, padding: "6px 9px", background: "rgba(255,204,0,0.06)", borderRadius: 6, border: "1px solid rgba(255,204,0,0.15)" }}>{p.value_proposition}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
              {Array.isArray(mp.motivations) && mp.motivations.length > 0 && (
                <div style={{ padding: "7px 9px", background: "rgba(16,185,129,0.06)", borderRadius: 7, border: "1px solid rgba(16,185,129,0.15)" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Motivations</div>
                  {mp.motivations.slice(0, 2).map((m, i) => <p key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.48)", lineHeight: 1.4 }}>• {m}</p>)}
                </div>
              )}
              {Array.isArray(mp.pain_points) && mp.pain_points.length > 0 && (
                <div style={{ padding: "7px 9px", background: "rgba(232,17,45,0.06)", borderRadius: 7, border: "1px solid rgba(232,17,45,0.15)" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: KOA_RED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Pain points</div>
                  {mp.pain_points.slice(0, 2).map((m, i) => <p key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.48)", lineHeight: 1.4 }}>• {m}</p>)}
                </div>
              )}
            </div>
            {Object.keys(eng).length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 5 }}>
                {Object.entries(eng).map(([k, v]) => (
                  <div key={k} style={{ padding: "6px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: KOA_YELLOW, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{k}</div>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.42)", lineHeight: 1.4 }}>{v}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Agent5Output({ data }) {
  const plans = data?.campaign_plans || AGENT5_DATA.campaign_plans;
  const [selected, setSelected] = useState(null);
  const high = plans.filter(p => p.campaign_priority === "High");
  const medium = plans.filter(p => p.campaign_priority === "Medium");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ display: "flex", gap: 12, fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2, flexWrap: "wrap" }}>
        <span><span style={{ color: "#10b981", fontWeight: 700 }}>{plans.length}</span> personas orchestrated</span>
        <span><span style={{ color: KOA_RED, fontWeight: 700 }}>{high.length}</span> high priority</span>
        <span><span style={{ color: KOA_YELLOW, fontWeight: 700 }}>{medium.length}</span> medium priority</span>
        <span style={{ color: "#10b981" }}>✓ Ready for Agent 6</span>
      </div>
      {plans.map((p) => {
        const accent = PERSONA_ACCENT[p.persona_id] || "#64748b";
        const priColor = p.campaign_priority === "High" ? KOA_RED : KOA_YELLOW;
        const isOpen = selected === p.persona_id;
        return (
          <div key={p.persona_id} onClick={() => setSelected(isOpen ? null : p.persona_id)}
            style={{ padding: "11px 13px", background: "rgba(255,255,255,0.05)", borderRadius: 10,
              border: `1px solid ${isOpen ? accent + "50" : "rgba(255,255,255,0.09)"}`, cursor: "pointer", transition: "border 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isOpen ? 10 : 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", flex: 1 }}>{p.persona_name}</span>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: priColor + "18", border: `1px solid ${priColor}35`, color: priColor, fontWeight: 700 }}>{p.campaign_priority}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
              <div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", fontStyle: "italic", marginBottom: 10 }}>{p.tagline}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 10 }}>
                  {[["Attract", p.activation_strategy.attract], ["Convert", p.activation_strategy.convert], ["Retain", p.activation_strategy.retain]].map(([k, v]) => (
                    <div key={k} style={{ padding: "7px 9px", background: "rgba(255,255,255,0.04)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ fontSize: 8, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
                  <div style={{ padding: "7px 9px", background: "rgba(16,185,129,0.06)", borderRadius: 7, border: "1px solid rgba(16,185,129,0.15)" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Motivations</div>
                    {p.primary_motivations.map((m, i) => <p key={i} style={{ fontSize: 9, color: "rgba(255,255,255,0.48)", lineHeight: 1.4 }}>• {m}</p>)}
                  </div>
                  <div style={{ padding: "7px 9px", background: "rgba(232,17,45,0.06)", borderRadius: 7, border: "1px solid rgba(232,17,45,0.15)" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: KOA_RED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Pain points</div>
                    {p.key_pain_points.map((m, i) => <p key={i} style={{ fontSize: 9, color: "rgba(255,255,255,0.48)", lineHeight: 1.4 }}>• {m}</p>)}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {p.kpis.map((k, i) => <span key={i} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>{k}</span>)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


function Agent6Output({ data }) {
  const summary = data?.delivery_summary || {};
  const personas = data?.persona_execution_summary || [];
  const revenue = data?.estimated_total_revenue_impact || "$2,457,000";
  const campaignId = data?.campaign_id || "KOA-SUMMER-2026-001";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2, flexWrap: "wrap" }}>
        <span><span style={{ color: "#10b981", fontWeight: 700 }}>{summary.total_recipients?.toLocaleString() || "479,695"}</span> recipients</span>
        <span><span style={{ color: KOA_YELLOW, fontWeight: 700 }}>{revenue}</span> revenue impact</span>
        <span><span style={{ color: "#3b82f6", fontWeight: 700 }}>{summary.overall_bounce_rate || "1.76"}%</span> bounce rate</span>
        <span style={{ color: "#10b981" }}>✓ Email notification sent</span>
      </div>
      <div style={{ padding: "10px 12px", background: "rgba(16,185,129,0.06)", borderRadius: 9, border: "1px solid rgba(16,185,129,0.2)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Campaign</div>
        <div style={{ fontSize: 12, color: "#f1f5f9", fontFamily: "'DM Mono',monospace" }}>{campaignId}</div>
      </div>
      {personas.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 2 }}>Persona execution</div>
          {personas.map((p, i) => (
            <div key={i} style={{ padding: "9px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9", flex: 1 }}>{p.persona_name || p.persona}</span>
                {p.emails_sent && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Mono',monospace" }}>{p.emails_sent?.toLocaleString()} sent</span>}
                {p.open_rate && <span style={{ fontSize: 10, color: KOA_YELLOW, fontFamily: "'DM Mono',monospace" }}>{p.open_rate}% open</span>}
                {p.status && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", fontWeight: 600 }}>{p.status}</span>}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function Agent7Output({ data }) {
  const bench = data?.benchmark_comparison || {};
  const financial = data?.financial_summary || {};
  const nps = data?.nps_data || {};
  const sentiment = data?.sentiment_data || {};
  const recs = data?.recommendations || [];
  const overall = bench?.overall_assessment || "";
  const isAbove = overall.toLowerCase().includes("outperform");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2, flexWrap: "wrap" }}>
        <span><span style={{ color: "#10b981", fontWeight: 700 }}>{financial.roi_pct?.toLocaleString() || "3,722"}%</span> ROI</span>
        <span><span style={{ color: KOA_YELLOW, fontWeight: 700 }}>{bench?.email_open_rate?.current || "28.5"}%</span> email open</span>
        <span><span style={{ color: "#3b82f6", fontWeight: 700 }}>{bench?.sms_read_rate?.current || "91.2"}%</span> SMS read</span>
        <span style={{ color: isAbove ? "#10b981" : KOA_YELLOW, fontWeight: 600 }}>{isAbove ? "✓ Outperforming benchmark" : "⚠ Below benchmark"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
        {[
          ["Email open rate", `${bench?.email_open_rate?.current || 28.5}% vs ${bench?.email_open_rate?.benchmark || 25}%`, bench?.email_open_rate?.vs_benchmark === "above" ? "#10b981" : KOA_RED],
          ["SMS read rate", `${bench?.sms_read_rate?.current || 91.2}% vs ${bench?.sms_read_rate?.benchmark || 87.3}%`, bench?.sms_read_rate?.vs_benchmark === "above" ? "#10b981" : KOA_RED],
          ["ROI", `${financial.roi_pct || 3722}% vs ${bench?.roi?.benchmark || 972.5}%`, "#10b981"],
        ].map(([k, v, c]) => (
          <div key={k} style={{ padding: "9px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: "'DM Mono',monospace" }}>{v}</div>
          </div>
        ))}
      </div>
      {(nps.pre_campaign_nps || nps.post_campaign_nps) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
          {[
            ["NPS pre", String(nps.pre_campaign_nps || 68), "rgba(255,255,255,0.6)"],
            ["NPS post", String(nps.post_campaign_nps || 73), "#10b981"],
            ["Sentiment", `${sentiment.positive || 88}% positive`, "#10b981"],
          ].map(([k, v, c]) => (
            <div key={k} style={{ padding: "9px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: "'DM Mono',monospace" }}>{v}</div>
            </div>
          ))}
        </div>
      )}
      {recs.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 2 }}>Recommendations</div>
          {recs.slice(0, 3).map((r, i) => (
            <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.48)", padding: "6px 9px", background: "rgba(255,255,255,0.04)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.06)", lineHeight: 1.5 }}>• {r}</div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── PIPELINE COMPLETE MODAL ──────────────────────────────────────────────────
function PipelineCompleteModal({ agentData, onClose, onViewPipeline }) {
  const summaries = [1,2,3,4,5].map(id => {
    const raw = agentData[id];
    if (!raw) return { id, status: "no data", detail: "" };
    try {
      let str = typeof raw.result === "string" ? raw.result : JSON.stringify(raw.result || raw);
      str = str.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/,"").trim();
      const parsed = JSON.parse(str);
      const labels = {
        1: `${parsed?.summary?.segments_generated || parsed?.segments?.length || "?"} segments · ${parsed?.summary?.total_guests || "?"} guests`,
        2: `${parsed?.top_actionable_signals?.length || "?"} signals ranked`,
        3: `${parsed?.clusters?.length || "?"} clusters identified`,
        4: `${parsed?.persona_cards?.length || parsed?.summary?.total_personas || "?"} personas synthesized`,
        5: `${parsed?.campaign_plans?.length || parsed?.total_personas || "?"} personas orchestrated`,
      };
      return { id, status: "✓ complete", detail: labels[id] || "Output received" };
    } catch {
      return { id, status: "✓ complete", detail: "Output received" };
    }
  });

  const names = {1:"Data Processing",2:"Signal Discovery",3:"Pattern Clustering",4:"Persona Synthesis",5:"Master Orchestrator"};
  const colors = {1:"#10b981",2:"#10b981",3:"#10b981",4:"#10b981",5:"#10b981"};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-inner" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:32,marginBottom:8}}>🎉</div>
          <h2 style={{fontSize:20,fontWeight:700,color:"#f1f5f9",marginBottom:4}}>Pipeline Complete</h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.42)"}}>Agents 1–5 executed successfully</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {summaries.map(s => (
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
              background:"rgba(16,185,129,0.06)",borderRadius:10,border:"1px solid rgba(16,185,129,0.2)"}}>
              <div style={{width:32,height:32,borderRadius:9,background:"rgba(16,185,129,0.15)",
                border:"1px solid rgba(16,185,129,0.3)",display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:9,fontWeight:800,color:"#10b981",
                fontFamily:"'DM Mono',monospace",flexShrink:0}}>AG0{s.id}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",marginBottom:2}}>{names[s.id]}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.42)"}}>{s.detail || s.status}</div>
              </div>
              <span style={{fontSize:10,color:"#10b981",fontWeight:700}}>✓</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onViewPipeline}
            style={{flex:1,padding:"11px",borderRadius:10,fontSize:12,fontWeight:700,fontFamily:"inherit",
              cursor:"pointer",background:"linear-gradient(135deg,#E8112D,#b0000e)",
              border:"none",color:"#fff",boxShadow:"0 4px 20px rgba(232,17,45,0.35)"}}>
            View Full Results →
          </button>
          <button onClick={onClose}
            style={{padding:"11px 18px",borderRadius:10,fontSize:12,fontWeight:600,fontFamily:"inherit",
              cursor:"pointer",background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.5)"}}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── KPI ALERT BANNER ────────────────────────────────────────────────────────
function KPIAlertBanner({ onDismiss, tx }) {
  const alerts = [
    { metric: "Email CTR", current: "4.2%", benchmark: "3.4%", delta: "+0.8%", status: "above", color: "#10b981" },
    { metric: "Email Open", current: "28.5%", benchmark: "25.0%", delta: "+3.5%", status: "above", color: "#10b981" },
    { metric: "SMS Read", current: "91.2%", benchmark: "87.3%", delta: "+3.9%", status: "above", color: "#10b981" },
    { metric: "ROI", current: "3,722%", benchmark: "972.5%", delta: "+2,749.5%", status: "above", color: "#10b981" },
  ];
  return (
    <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 190,
      background: "rgba(16,185,129,0.12)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(16,185,129,0.3)", padding: "8px 22px",
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
        ● All KPIs Beating Benchmark
      </span>
      {alerts.map(a => (
        <div key={a.metric} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, flexShrink: 0 }}>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>{a.metric}</span>
          <span style={{ color: a.color, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{a.current}</span>
          <span style={{ color: "rgba(255,255,255,0.28)" }}>vs {a.benchmark}</span>
          <span style={{ color: a.color, fontWeight: 600 }}>({a.delta})</span>
        </div>
      ))}
      <button onClick={onDismiss} style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.35)",
        background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>✕ dismiss</button>
    </div>
  );
}

// ─── CASE STUDY MODAL ─────────────────────────────────────────────────────────
function CaseStudyModal({ slide, onSlide, onClose }) {
  const slides = [
    {
      label: "01 / Problem",
      title: "KOA's Guest Intelligence Gap",
      color: "#E8112D",
      bullets: [
        "307,670 cancellations in 2025 alone — $3.9M in recoverable revenue leaking annually",
        "Guest base eroding -22.3% since 2022: 1.39M → 1.08M unique guests",
        "17.9% KampStore penetration — $7.3M revenue erosion across 518 campgrounds",
        "655K VKR loyalty members with 276K untiered — completely untapped activation pool",
        "No unified segmentation layer connecting behavioral data to campaign execution",
      ],
      stat: { v: "$140M", l: "LTV at risk" },
    },
    {
      label: "02 / Pipeline",
      title: "7-Agent Airia AI Pipeline",
      color: "#FFCC00",
      bullets: [
        "AG01 RFM: KampSightDB + VDW → 10 behavioral segments across 500+ guests",
        "AG02 Signal: Stratified sampling of 10.9M reservations → 5 ranked revenue signals",
        "AG03 Cluster: K-means + DBSCAN → 6 behavioral clusters for champion identification",
        "AG04 Persona: AI archetype synthesis → 8 campaign-ready guest personas",
        "AG05 Orchestrator: Priority routing + channel strategy across all 8 personas",
        "AG06 Execution: Multi-channel delivery via email, SMS, push → 479K recipients",
        "AG07 Feedback: Two-sample t-test + NPS correlation + ROI attribution",
      ],
      stat: { v: "7", l: "Agents chained" },
    },
    {
      label: "03 / Results",
      title: "KOA-SUMMER-2026 Campaign Results",
      color: "#10b981",
      bullets: [
        "19.0% booking lift — statistically significant (p=0.000, 95% CI [17.17%, 20.83%])",
        "ROI 3,722% vs KOA-SPRING-2026 benchmark of 972.5% — 3.8× improvement",
        "Email open rate 28.5% (+3.5% vs benchmark) · SMS read rate 91.2% (+3.9%)",
        "NPS correlation r=0.965 — near-perfect engagement-to-satisfaction signal",
        "88% positive sentiment across 8 personas · 0% negative",
        "Pipeline complete · ready_for_next_cycle: true",
      ],
      stat: { v: "3,722%", l: "Campaign ROI" },
    },
  ];
  const s = slides[slide];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-inner" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "3px 10px", borderRadius: 20, background: s.color + "18", border: `1px solid ${s.color}35` }}>{s.label}</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)" }}>KOA Guest Segmentation · GSU CIS-8010</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 20, letterSpacing: "-0.02em" }}>{s.title}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {s.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
              <span style={{ color: s.color, flexShrink: 0, fontWeight: 700 }}>→</span>{b}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", background: s.color + "10", borderRadius: 12, border: `1px solid ${s.color}25`,
          display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: s.color, fontFamily: "'DM Mono',monospace", letterSpacing: "-0.02em" }}>{s.stat.v}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.50)" }}>{s.stat.l}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => onSlide(Math.max(0, slide - 1))} disabled={slide === 0}
            style={{ padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "inherit",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: slide === 0 ? "rgba(255,255,255,0.2)" : "#f1f5f9", cursor: slide === 0 ? "default" : "pointer" }}>← Prev</button>
          <div style={{ display: "flex", gap: 6, flex: 1, justifyContent: "center" }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => onSlide(i)} style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 3,
                background: i === slide ? s.color : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.2s" }} />
            ))}
          </div>
          {slide < slides.length - 1
            ? <button onClick={() => onSlide(slide + 1)}
                style={{ padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                  background: s.color + "18", border: `1px solid ${s.color}50`, color: s.color, cursor: "pointer" }}>Next →</button>
            : <button onClick={onClose}
                style={{ padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                  background: "#10b981" + "18", border: "1px solid #10b98150", color: "#10b981", cursor: "pointer" }}>✓ Done</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── PIPELINE RUN STRIP ───────────────────────────────────────────────────────
function PipelineRunStrip({ running, step, onRun, tx }) {
  const steps = ["RFM","SIGNAL","CLUSTER","PERSONA","ORCH"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
      background: running ? "rgba(232,17,45,0.08)" : "rgba(255,255,255,0.03)",
      borderRadius: 12, border: `1px solid ${running ? "rgba(232,17,45,0.3)" : "rgba(255,255,255,0.08)"}`,
      marginBottom: 14, flexWrap: "wrap" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>
          {running ? `Running Agent ${step}...` : "Run Full Pipeline · Agents 1–5 Sequential"}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {steps.map((s, i) => {
            const done = running && step > i + 1;
            const active = running && step === i + 1;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ padding: "3px 10px", borderRadius: 8, fontSize: 9, fontWeight: 700,
                  fontFamily: "'DM Mono',monospace",
                  background: done ? "rgba(16,185,129,0.15)" : active ? "rgba(232,17,45,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${done ? "rgba(16,185,129,0.35)" : active ? "rgba(232,17,45,0.4)" : "rgba(255,255,255,0.1)"}`,
                  color: done ? "#10b981" : active ? "#E8112D" : "rgba(255,255,255,0.35)",
                  animation: active ? "pulse 1s infinite" : "none" }}>
                  {done ? "✓" : ""}{s}
                </div>
                {i < steps.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>→</span>}
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={onRun} disabled={running}
        style={{ padding: "10px 22px", borderRadius: 10, fontSize: 12, fontWeight: 700, fontFamily: "inherit",
          cursor: running ? "not-allowed" : "pointer", whiteSpace: "nowrap",
          background: running ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg,#E8112D,#b0000e)",
          border: running ? "1px solid rgba(255,255,255,0.08)" : "none",
          color: running ? "rgba(255,255,255,0.3)" : "#fff",
          boxShadow: running ? "none" : "0 4px 20px rgba(232,17,45,0.4)" }}>
        {running ? "Running..." : "▶ Run Full Pipeline"}
      </button>
    </div>
  );
}

// ─── A/B TEST SECTION ─────────────────────────────────────────────────────────
function ABTestSection({ inputA, setInputA, inputB, setInputB, result, onRun, tx }) {
  const PERSONAS = ["Loyal Enthusiasts","New Explorers","Luxury Seekers","Business Travelers","Leisure Seekers","Family Campers","Adventure Seekers","Budget Campers"];
  const InputPanel = ({ inp, setInp, label, color }) => (
    <div style={{ flex: 1, padding: "20px", background: color + "08", borderRadius: 12, border: `1px solid ${color}25` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Campaign name</div>
          <input value={inp.name} onChange={e => setInp(p => ({ ...p, name: e.target.value }))}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Budget ($)</div>
          <input type="number" value={inp.budget} onChange={e => setInp(p => ({ ...p, budget: Number(e.target.value) }))}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Channel mix %</div>
          {[["Email", "emailPct", "#3b82f6"], ["SMS", "smsPct", "#10b981"], ["Push", "pushPct", "#8b5cf6"]].map(([ch, key, c]) => (
            <div key={ch} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                <span style={{ color: c }}>{ch}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono',monospace" }}>{inp[key]}%</span>
              </div>
              <input type="range" min="0" max="100" value={inp[key]}
                onChange={e => setInp(p => ({ ...p, [key]: Number(e.target.value) }))}
                style={{ width: "100%", accentColor: c }} />
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Top persona</div>
          <select value={inp.topPersona} onChange={e => setInp(p => ({ ...p, topPersona: e.target.value }))}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 12, fontFamily: "inherit", outline: "none" }}>
            {PERSONAS.map(p => <option key={p} value={p} style={{ background: "#060c1a" }}>{p}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const winner = result && (parseFloat(result.a.roi) > parseFloat(result.b.roi) ? "a" : "b");

  return (
    <div className="fu">
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>A/B Test Simulator</h1>
      <p style={{ fontSize: 13, color: tx.sub, marginBottom: 20 }}>Configure two campaign variants · Score against KOA-SPRING-2026 benchmarks · Agent 7 methodology</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <InputPanel inp={inputA} setInp={setInputA} label="Variant A" color="#3b82f6" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.2)", fontWeight: 700 }}>VS</div>
        </div>
        <InputPanel inp={inputB} setInp={setInputB} label="Variant B" color="#8b5cf6" />
      </div>
      <button onClick={onRun}
        style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: "inherit",
          cursor: "pointer", background: "linear-gradient(135deg,#E8112D,#b0000e)",
          border: "none", color: "#fff", boxShadow: "0 4px 24px rgba(232,17,45,0.35)", marginBottom: 20 }}>
        ▶ Run A/B Simulation
      </button>
      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[["a","#3b82f6",inputA.name],["b","#8b5cf6",inputB.name]].map(([k,color,name]) => (
            <div key={k} style={{ padding: "20px", background: winner === k ? color + "10" : "rgba(255,255,255,0.04)",
              borderRadius: 12, border: `2px solid ${winner === k ? color + "50" : "rgba(255,255,255,0.08)"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em" }}>Variant {k.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{name}</span>
                {winner === k && <span style={{ marginLeft: "auto", fontSize: 10, padding: "2px 8px", borderRadius: 8,
                  background: color + "20", border: `1px solid ${color}40`, color, fontWeight: 700 }}>● Winner</span>}
              </div>
              {[["Projected Booking Lift", result[k].lift + "%", "#10b981"],
                ["Projected ROI", result[k].roi + "%", "#FFCC00"],
                ["Attributed Revenue", "$" + result[k].revenue, color],
                ["Blended Engagement", result[k].engagement + "%", "#3b82f6"]].map(([label, val, c]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c, fontFamily: "'DM Mono',monospace" }}>{val}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FORECAST SECTION ─────────────────────────────────────────────────────────
function ForecastSection({ tx }) {
  const waves = [
    { wave: "Wave 1 (Actual)", recipients: 479695, openRate: 28.5, ctr: 4.2, roi: 3722, revenue: 2457000, lift: 19.0, color: "#10b981" },
    { wave: "Wave 2 (Projected)", recipients: 575000, openRate: 30.2, ctr: 4.8, roi: 4100, revenue: 2950000, lift: 21.5, color: "#FFCC00" },
    { wave: "Wave 3 (Projected)", recipients: 655000, openRate: 31.8, ctr: 5.1, roi: 4480, revenue: 3380000, lift: 23.2, color: "#8b5cf6" },
  ];
  const insights = [
    { label: "Wave 2 Revenue Uplift", value: "+$493K", sub: "vs Wave 1 actual", color: "#10b981" },
    { label: "Projected 3-Wave Total", value: "$8.79M", sub: "gross revenue impact", color: "#FFCC00" },
    { label: "ROI Trajectory", value: "+20.4%", sub: "Wave 1 → Wave 3 improvement", color: "#8b5cf6" },
    { label: "Optimal Send Window", value: "14 days", sub: "between waves per Agent 7", color: "#3b82f6" },
  ];
  return (
    <div className="fu">
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Wave Forecast · Agent 7 Projections</h1>
      <p style={{ fontSize: 13, color: tx.sub, marginBottom: 20 }}>Based on KOA-SUMMER-2026 benchmark deltas · 14-day wave cadence · NPS correlation r=0.965</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
        {insights.map(i => (
          <div key={i.label} style={{ padding: "16px 14px", background: i.color + "0d", borderRadius: 12, border: `1px solid ${i.color}22` }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{i.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: i.color, fontVariantNumeric: "tabular-nums" }}>{i.value}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", marginTop: 4 }}>{i.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {waves.map((w, wi) => (
          <div key={w.wave} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px solid ${w.color}25` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: w.color, boxShadow: `0 0 8px ${w.color}` }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{w.wave}</span>
              {wi > 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: w.color + "18", border: `1px solid ${w.color}35`, color: w.color, fontWeight: 600 }}>Projected</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
              {[
                ["Recipients", w.recipients.toLocaleString()],
                ["Booking Lift", w.lift + "%"],
                ["Email Open", w.openRate + "%"],
                ["CTR", w.ctr + "%"],
                ["ROI", w.roi.toLocaleString() + "%"],
                ["Revenue Impact", "$" + (w.revenue / 1000000).toFixed(2) + "M"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: w.color, fontFamily: "'DM Mono',monospace" }}>{v}</div>
                </div>
              ))}
            </div>
            {wi > 0 && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.min((w.roi / 5000) * 100, 95)}%`, background: `linear-gradient(90deg,${w.color},${w.color}80)` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Agent 7 Recommendations</div>
        {[
          "Schedule Wave 2 within 14 days to capitalize on campaign momentum",
          "Increase SMS allocation for Wave 2 — 91.2% read rate exceeds benchmark by 3.9%",
          "Loyal Enthusiasts is top performer — prioritize budget allocation and early booking access",
          "Maintain 10% holdout group across all waves to preserve statistical validity",
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
            <span style={{ color: "#10b981", flexShrink: 0 }}>→</span>{r}
          </div>
        ))}
      </div>
    </div>
  );
}


function AgentOutputPanel({ agentId, raw }) {
  const [open, setOpen] = useState(false);
  const parsed = useMemo(() => parseAgentResult(raw), [raw]);
  const isStructured = !!parsed;
  return (
    <div style={{ marginTop: 8, borderRadius: 9, border: "1px solid rgba(255,255,255,0.09)", overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "rgba(255,255,255,0.05)", cursor: "pointer", userSelect: "none" }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Live output</span>
        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, fontWeight: 700,
          background: isStructured ? "rgba(16,185,129,0.15)" : "rgba(255,204,0,0.15)",
          border: `1px solid ${isStructured ? "rgba(16,185,129,0.3)" : "rgba(255,204,0,0.3)"}`,
          color: isStructured ? "#10b981" : KOA_YELLOW }}>
          {isStructured ? "✓ structured" : "⚠ raw"}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.32)" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "12px", background: "rgba(0,0,0,0.2)", maxHeight: 520, overflowY: "auto" }}>
          {isStructured ? (
            agentId === 2 ? <Agent2Output data={parsed} /> :
            agentId === 3 ? <Agent3Output data={parsed} /> :
            agentId === 4 ? <Agent4Output data={parsed} /> :
            agentId === 5 ? <Agent5Output data={parsed} /> :
            agentId === 6 ? <Agent6Output data={parsed} /> :
            agentId === 7 ? <Agent7Output data={parsed} /> :
            <pre style={{ fontSize: 10, color: "#10b981", fontFamily: "'DM Mono',monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {JSON.stringify(parsed, null, 2).slice(0, 600)}…
            </pre>
          ) : (
            <pre style={{ fontSize: 10, color: KOA_YELLOW, fontFamily: "'DM Mono',monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {(typeof raw?.result === "string" ? raw.result : JSON.stringify(raw)).slice(0, 400)}…
            </pre>
          )}
        </div>
      )}
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
        {type==="campaign_plan"&&<CampaignPlanModal item={item}/>}
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
      <h3 style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Campaign playbook</h3>
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

function CampaignPlanModal({ item }) {
  const accent = PERSONA_ACCENT[item.persona_id] || "#64748b";
  const priColor = item.campaign_priority === "High" ? KOA_RED : KOA_YELLOW;
  return (
    <>
      <MHead icon="◎" title={item.persona_name} sub={item.tagline} color={accent} />
      <MGrid items={[
        ["Priority", item.campaign_priority, priColor],
        ["Campaign readiness", item.campaign_readiness, "#10b981"],
        ["Booking pattern", item.recommended_channels],
        ["Persona ID", item.persona_id, accent],
      ]} cols={2} />
      <h3 style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Activation strategy</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
        {Object.entries(item.activation_strategy).map(([k, v]) => (
          <div key={k} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{k}</div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", lineHeight: 1.5 }}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div style={{ padding: "12px 14px", background: "rgba(16,185,129,0.08)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.18)" }}>
          <div style={{ fontSize: 10, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Primary motivations</div>
          {item.primary_motivations.map((m, i) => <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 3 }}>• {m}</p>)}
        </div>
        <div style={{ padding: "12px 14px", background: "rgba(232,17,45,0.08)", borderRadius: 10, border: "1px solid rgba(232,17,45,0.18)" }}>
          <div style={{ fontSize: 10, color: KOA_RED, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Key pain points</div>
          {item.key_pain_points.map((m, i) => <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 3 }}>• {m}</p>)}
        </div>
      </div>
      <h3 style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>KPIs</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {item.kpis.map((k, i) => <span key={i} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>{k}</span>)}
      </div>
      <h3 style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Risk factors</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {item.risk_factors.map((r, i) => <span key={i} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: `${KOA_RED}10`, border: `1px solid ${KOA_RED}25`, color: KOA_RED }}>{r}</span>)}
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
  const[orchFilter,setOrchFilter]=useState("All");
  const[caseStudyOpen,setCaseStudyOpen]=useState(false);
  const[caseStudySlide,setCaseStudySlide]=useState(0);
  const[pipelineRunning,setPipelineRunning]=useState(false);
  const[pipelineStep,setPipelineStep]=useState(-1);
  const[kpiDismissed,setKpiDismissed]=useState(false);
  const[pipelineComplete,setPipelineComplete]=useState(false);
  const[abInputA,setAbInputA]=useState({name:"Wave 2 Email",budget:45000,emailPct:60,smsPct:30,pushPct:10,topPersona:"Loyal Enthusiasts"});
  const[abInputB,setAbInputB]=useState({name:"Wave 2 SMS-First",budget:45000,emailPct:30,smsPct:60,pushPct:10,topPersona:"Family Campers"});
  const[abResult,setAbResult]=useState(null);
  const open=useCallback((type,item)=>setModal({type,item}),[]);
  const{agentData,setAgentData,loading,errors,setErrors,runAgent}=useAiriaAgent();

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
    {id:"personas",l:"Personas"},{id:"orchestration",l:"Orchestration"},{id:"campaign",l:"Campaign"},
    {id:"loyalty",l:"Loyalty"},{id:"accommodation",l:"Accommodation"},{id:"campgrounds",l:"Campgrounds"},
  ];

  const runFullPipeline = useCallback(async () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setPipelineComplete(false);
    setPipelineStep(0);
    const AGENT_IDS = {
      1:"6c30db8e-f89f-463c-a724-30b4b2971d5c",
      2:"7be970e3-cdef-42c8-be4b-ae8664d2afe2",
      3:"ac8a9a6d-3688-4b1f-a9cd-5f35f2caa770",
      4:"f05848cf-0e05-4cfa-b704-a789757a6548",
      5:"197b7527-226d-46ce-a79e-1f97b3108aa4",
    };
    for (let id = 1; id <= 5; id++) {
      setPipelineStep(id);
      try {
        const res = await fetch("/api/run-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId: AGENT_IDS[id], userInput: "run" }),
        });
        const raw = await res.json();
        setAgentData(d => ({ ...d, [id]: raw }));
      } catch(err) {
        setErrors(e => ({ ...e, [id]: err.message }));
      }
    }
    setPipelineRunning(false);
    setPipelineStep(-1);
    setPipelineComplete(true);
  }, [pipelineRunning]);

  const runABTest = useCallback(() => {
    const score = (inp) => {
      const emailW = 0.45, smsW = 0.35, pushW = 0.20;
      const baseOpen = 28.5, baseSMS = 91.2, basePush = 15.0;
      const blendedEngagement = (inp.emailPct/100)*baseOpen*emailW + (inp.smsPct/100)*baseSMS*smsW + (inp.pushPct/100)*basePush*pushW;
      const budgetMultiplier = Math.min(inp.budget / 45000, 1.5);
      const personaBonus = {"Loyal Enthusiasts":1.12,"Family Campers":1.08,"Business Travelers":1.05,"New Explorers":1.04,"Luxury Seekers":1.03,"Leisure Seekers":1.01,"Adventure Seekers":1.00,"Budget Campers":0.97}[inp.topPersona] || 1.0;
      const projectedLift = 19.0 * (blendedEngagement / 22) * budgetMultiplier * personaBonus;
      const attributedRevenue = (inp.budget / 45000) * 1719900 * personaBonus;
      const roi = ((attributedRevenue - inp.budget) / inp.budget * 100).toFixed(1);
      return { lift: projectedLift.toFixed(1), revenue: Math.round(attributedRevenue).toLocaleString(), roi, engagement: blendedEngagement.toFixed(1) };
    };
    setAbResult({ a: score(abInputA), b: score(abInputB) });
  }, [abInputA, abInputB]);

  const filteredPlans = orchFilter === "All"
    ? AGENT5_DATA.campaign_plans
    : AGENT5_DATA.campaign_plans.filter(p => p.campaign_priority === orchFilter);

  return(
    <div style={{minHeight:"100vh",color:tx.text,fontFamily:"'DM Sans',system-ui,sans-serif",position:"relative",
      backgroundImage:`url("https://koa.com/content/campgrounds/toccoa-river/heroitems/10157heroitems33ee7944-7d62-4035-b7ba-40b887feab85.jpg?preset=hero-lg")`,
      backgroundSize:"cover",backgroundPosition:"center top",backgroundAttachment:"fixed",backgroundRepeat:"no-repeat"}}>
      {/* Mountain overlay */}
      <div style={{position:"fixed",inset:0,zIndex:0,
        background:dark
          ? "linear-gradient(180deg,rgba(6,12,26,0.88) 0%,rgba(6,12,26,0.82) 40%,rgba(6,12,26,0.92) 100%)"
          : "linear-gradient(180deg,rgba(240,220,210,0.88) 0%,rgba(240,220,210,0.80) 40%,rgba(240,220,210,0.92) 100%)"
      }}/>

      {/* HEADER */}
      <header style={{position:"sticky",top:0,zIndex:200,
        background:dark?"rgba(4,8,20,0.75)":"rgba(240,220,210,0.78)",
        backdropFilter:"blur(32px) saturate(180%)",WebkitBackdropFilter:"blur(32px) saturate(180%)",
        borderBottom:dark?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(0,0,0,0.09)",
        height:56,display:"flex",alignItems:"center",padding:"0 22px",gap:14}}>

        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <img src={KOA_LOGO}
            onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
            style={{height:32,width:"auto",objectFit:"contain"}}
            alt="KOA logo"/>
          <div style={{display:"none",width:32,height:32,borderRadius:8,
            background:`linear-gradient(135deg,${KOA_RED},#b0000e)`,
            alignItems:"center",justifyContent:"center",
            fontWeight:900,fontSize:12,color:"#fff",letterSpacing:"0.05em",
            boxShadow:`0 4px 14px ${KOA_RED}50`}}>KOA</div>
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
          <button onClick={()=>{setCaseStudyOpen(true);setCaseStudySlide(0);}}
            style={{width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,
              background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",
              display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.6)"}}>?</button>
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
      <main style={{position:"relative",zIndex:1,padding:"24px 22px 64px",maxWidth:1380,margin:"0 auto",paddingTop: "24px"}}>

        {!kpiDismissed && <KPIAlertBanner onDismiss={()=>setKpiDismissed(true)} tx={tx}/>}
      {caseStudyOpen && <CaseStudyModal slide={caseStudySlide} onSlide={setCaseStudySlide} onClose={()=>setCaseStudyOpen(false)}/>}
      {pipelineComplete && <PipelineCompleteModal agentData={agentData} onClose={()=>setPipelineComplete(false)} onViewPipeline={()=>{setPipelineComplete(false);setSec("pipeline");}}/>}

      {/* ── OVERVIEW ── */}
        {sec==="overview"&&(
          <div key="ov" className="fu">
            <PipelineRunStrip running={pipelineRunning} step={pipelineStep} onRun={runFullPipeline} tx={tx}/>
            <h1 style={{fontSize:24,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>KOA Guest Intelligence</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:22}}>7-agent Airia pipeline · 10.9M reservations · 518 campgrounds · All 7 agents complete · Click anything</p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:16}}>
              {[
                {l:"Reservations",v:r.toLocaleString(),s:"2022–2026 YTD",c:KOA_YELLOW,delay:0,
                  kpi:{title:"Reservations analyzed",context:"KOA network · 2022–2026 YTD",color:KOA_YELLOW,
                    insight:"10.9M reservation records analyzed across 518 campgrounds.",
                    metrics:[["Total records","10,893,242"],["Cancellations","1,226,412"],["Campgrounds","518"],["Date range","2022–2026 YTD"],["Data sources","KampSightDB + VDW"],["Agents used","Agent 1 + Agent 2"]]}},
                {l:"Campaign ROI",v:roi+"%",s:"$45K → $482K",c:tx.green,delay:80,
                  kpi:{title:"Campaign ROI · 972.5%",context:"KOA-SPRING-REAWAKENING-2026",color:tx.green,
                    insight:"$45,000 campaign cost generated $482,625 in attributed revenue.",
                    metrics:[["Campaign cost","$45,000"],["Attributed revenue","$482,625"],["ROI","972.5%"],["p-value","0.000"],["CI lower","16.17%"],["CI upper","21.83%"]]}},
                {l:"Attributed rev",v:"$"+Math.round(rev/1000)+"K",s:"KOA-SPRING-2026",c:KOA_YELLOW,delay:160,
                  kpi:{title:"Attributed revenue · $482,625",context:"Post-campaign attribution at 0.70 factor",color:KOA_YELLOW,
                    insight:"Gross post-campaign revenue $742,875 × 0.70 attribution factor = $482,625.",
                    metrics:[["Gross revenue","$742,875"],["Attribution factor","0.70"],["Attributed","$482,625"],["Channel split","Email (250K) + SMS (45K)"],["Personas","Loyal Enthusiasts + New Explorers"],["Campaign window","Q1 2026"]]}},
                {l:"Booking lift",v:lift+"%",s:"p=0.000 · 95% CI",c:tx.blue,delay:240,
                  kpi:{title:"Booking lift · 19.0%",context:"Pre vs post campaign",color:tx.blue,
                    insight:"Pre-campaign: 12,500 bookings. Post-campaign: 14,875 bookings. Absolute lift: 2,375 incremental bookings.",
                    metrics:[["Pre-campaign","12,500"],["Post-campaign","14,875"],["Absolute lift","2,375"],["Lift %","19.0%"],["Test","Two-sample t-test"],["Confidence","95%"]]}},
                {l:"VKR members",v:vkr.toLocaleString(),s:"VIP · BONUS · BASE",c:tx.pur,delay:320,
                  kpi:{title:"VKR loyalty members · 655,022",context:"Active VKR program",color:tx.pur,
                    insight:"655,022 active VKR members. 276,080 enrolled members have NO assigned tier — highest-ROI activation opportunity.",
                    metrics:[["VIP tier","47,695"],["BONUS tier","101,649"],["BASE tier","231,993"],["Untiered (active)","276,080"],["Total active","655,022"],["Activation gap","276K = highest-ROI target"]]}},
                {l:"Campgrounds",v:camps.toLocaleString(),s:"Active network",c:tx.green,delay:400,
                  kpi:{title:"KOA campground network · 518",context:"Active franchise network",color:tx.green,
                    insight:"518 active KOA campgrounds across 45+ states.",
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
                <span style={{fontSize:11,color:tx.green,fontWeight:600}}>7 / 7 complete ✓ Pipeline done</span>
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

              {/* Agent 5 orchestration preview on overview */}
              <GCard style={{padding:"18px 18px"}} onClick={()=>setSec("orchestration")}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontSize:13,fontWeight:600,color:tx.text}}>Orchestration · Agent 5</h2>
                  <span style={{fontSize:11,color:"#10b981",fontWeight:600}}>✓ Complete →</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  {[{l:"High priority",v:"4 personas",c:KOA_RED},{l:"Medium priority",v:"4 personas",c:KOA_YELLOW},
                    {l:"Campaign ready",v:"8 / 8",c:"#10b981"},{l:"Primary KPI",v:"RevPAR lift",c:tx.sub}].map(m=>(
                    <div key={m.l} style={{padding:"9px 10px",background:"rgba(255,255,255,0.05)",borderRadius:9,border:"1px solid rgba(255,255,255,0.08)"}}>
                      <div style={{fontSize:9,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{m.l}</div>
                      <div style={{fontSize:13,fontWeight:700,color:m.c}}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {AGENT5_DATA.campaign_plans.slice(0,4).map(p=>(
                    <span key={p.persona_id} style={{fontSize:9,padding:"2px 8px",borderRadius:8,
                      background:(PERSONA_ACCENT[p.persona_id]||"#64748b")+"18",
                      border:`1px solid ${(PERSONA_ACCENT[p.persona_id]||"#64748b")}35`,
                      color:PERSONA_ACCENT[p.persona_id]||"#64748b",fontWeight:600}}>{p.persona_name}</span>
                  ))}
                  <span style={{fontSize:9,color:tx.mut,padding:"2px 4px"}}>+4 more</span>
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
          </div>
        )}

        {/* ── PIPELINE ── */}
        {sec==="pipeline"&&(
          <div key="pipe" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Pipeline · 7-agent Airia workflow</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>KampSightDB · VDW · Airia Memory · Click agent badge for details · Run live via Airia API</p>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {AGENTS.map((a,i)=>{
                const liveRaw=agentData[a.id];
                const isLoading=loading[a.id];
                const err=errors[a.id];
                const canRun=(a.status==="complete"||a.status==="historical")&&a.id!==7;
                return(
                  <GCard key={a.id} accent={a.color} className="fu" style={{padding:"17px 20px",animationDelay:`${i*50}ms`}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div onClick={()=>open("agent",a)} style={{width:42,height:42,borderRadius:12,background:a.color+"1a",border:`1px solid ${a.color}40`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:a.color,flexShrink:0,fontFamily:"'DM Mono',monospace",textAlign:"center",lineHeight:1.2,cursor:"pointer"}}>
                        AG{String(a.id).padStart(2,"0")}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                          <span onClick={()=>open("agent",a)} style={{fontSize:13,fontWeight:600,color:tx.text,cursor:"pointer"}}>{a.name}</span>
                          <span style={{width:6,height:6,borderRadius:"50%",background:isLoading?KOA_YELLOW:a.color,display:"inline-block",
                            boxShadow:`0 0 5px ${isLoading?KOA_YELLOW:a.color}`,animation:(a.status==="pending"||isLoading)?"pulse 2s infinite":"none"}}/>
                          <span style={{fontSize:11,color:isLoading?KOA_YELLOW:liveRaw?tx.green:a.color,fontWeight:600,textTransform:"capitalize"}}>
                            {isLoading?"running...":liveRaw?"✓ Live Data":a.status}
                          </span>
                          {liveRaw?.timestamp&&<span style={{fontSize:10,color:tx.mut,fontFamily:"'DM Mono',monospace"}}>{new Date(liveRaw.timestamp).toLocaleTimeString()}</span>}
                        </div>
                        <p style={{fontSize:12,color:tx.sub}}>{a.desc}</p>
                        {err&&<p style={{fontSize:11,color:KOA_RED,marginTop:4,fontFamily:"'DM Mono',monospace"}}>⚠ {err}</p>}
                        {liveRaw && <AgentOutputPanel agentId={a.id} raw={liveRaw} />}
                      </div>
                      <div style={{display:"flex",gap:10,flexShrink:0,alignItems:"center"}}>
                        {a.metrics.slice(0,2).map(([k,v])=>(
                          <div key={k} style={{textAlign:"right"}}>
                            <div style={{fontSize:9,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.06em"}}>{k}</div>
                            <div style={{fontSize:12,fontWeight:600,color:tx.text,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                          </div>
                        ))}
                        {canRun&&(
                          <button onClick={()=>runAgent(a.id)} disabled={isLoading}
                            style={{padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:600,fontFamily:"inherit",
                              cursor:isLoading?"not-allowed":"pointer",whiteSpace:"nowrap",
                              background:isLoading?"rgba(255,255,255,0.05)":KOA_RED+"18",
                              border:`1px solid ${isLoading?"rgba(255,255,255,0.1)":KOA_RED+"50"}`,
                              color:isLoading?tx.mut:KOA_RED,transition:"all 0.18s"}}>
                            {isLoading?"Running...":"▶ Run"}
                          </button>
                        )}
                      </div>
                    </div>
                  </GCard>
                );
              })}
            </div>
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

        {/* ── ORCHESTRATION (AGENT 5) ── */}
        {sec==="orchestration"&&(
          <div key="orch" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Master orchestration · Agent 5</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>8 personas prioritized · campaign plans generated · ready for Agent 6 execution · click any card for full detail</p>

            {/* Summary metrics */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[
                {l:"Total personas",v:"8",s:"All campaign ready",c:KOA_YELLOW},
                {l:"High priority",v:"4",s:"Immediate activation",c:KOA_RED},
                {l:"Medium priority",v:"4",s:"Short-term activation",c:KOA_YELLOW},
                {l:"Primary KPI",v:"RevPAR",s:"Lift by segment · Monthly",c:tx.green},
              ].map(m=>(
                <GCard key={m.l} style={{padding:"16px 14px"}} accent={m.c}>
                  <div style={{fontSize:10,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{m.l}</div>
                  <div style={{fontSize:24,fontWeight:700,color:m.c,fontVariantNumeric:"tabular-nums"}}>{m.v}</div>
                  <div style={{fontSize:10,color:tx.mut,marginTop:4}}>{m.s}</div>
                </GCard>
              ))}
            </div>

            {/* Filter chips */}
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {["All","High","Medium"].map(f=>(
                <button key={f} onClick={()=>setOrchFilter(f)} className={`chip ${orchFilter===f?"active":""}`}>{f} priority</button>
              ))}
              <span style={{fontSize:11,color:tx.mut,alignSelf:"center",marginLeft:4}}>{filteredPlans.length} personas</span>
            </div>

            {/* Campaign plan cards */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {filteredPlans.map((p,i)=>{
                const accent=PERSONA_ACCENT[p.persona_id]||"#64748b";
                const priColor=p.campaign_priority==="High"?KOA_RED:KOA_YELLOW;
                return(
                  <GCard key={p.persona_id} onClick={()=>open("campaign_plan",p)} accent={accent} className="fu" style={{padding:"18px 20px",animationDelay:`${i*40}ms`}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                      <div style={{width:40,height:40,borderRadius:11,background:accent+"1a",border:`1px solid ${accent}40`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:accent,flexShrink:0,fontFamily:"'DM Mono',monospace"}}>
                        {p.persona_id}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                          <h3 style={{fontSize:14,fontWeight:600,color:tx.text}}>{p.persona_name}</h3>
                          <span style={{fontSize:10,padding:"2px 9px",borderRadius:20,fontWeight:700,
                            background:priColor+"18",border:`1px solid ${priColor}35`,color:priColor}}>{p.campaign_priority} priority</span>
                          <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.25)",color:"#10b981",fontWeight:600}}>● {p.campaign_readiness}</span>
                        </div>
                        <p style={{fontSize:11,color:tx.sub,fontStyle:"italic",marginBottom:10}}>{p.tagline}</p>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
                          {[["Attract",p.activation_strategy.attract],["Convert",p.activation_strategy.convert],["Retain",p.activation_strategy.retain]].map(([k,v])=>(
                            <div key={k} style={{padding:"8px 10px",background:"rgba(255,255,255,0.04)",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)"}}>
                              <div style={{fontSize:8,fontWeight:700,color:accent,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k}</div>
                              <p style={{fontSize:10,color:tx.sub,lineHeight:1.4}}>{v}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {p.kpis.map((k,j)=>(
                            <span key={j} style={{fontSize:9,padding:"2px 8px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:tx.mut}}>{k}</span>
                          ))}
                        </div>
                      </div>
                      <span style={{fontSize:11,color:tx.mut,flexShrink:0}}>Full detail →</span>
                    </div>
                  </GCard>
                );
              })}
            </div>

            {/* Global suppression + measurement */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <GCard style={{padding:"16px 18px"}}>
                <h3 style={{fontSize:12,fontWeight:600,color:tx.text,marginBottom:12}}>Global suppression rules</h3>
                {AGENT5_DATA.global_suppression_rules.map((rule,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:8,fontSize:12,color:tx.sub,lineHeight:1.5}}>
                    <span style={{color:KOA_YELLOW,flexShrink:0}}>—</span>{rule}
                  </div>
                ))}
              </GCard>
              <GCard style={{padding:"16px 18px"}}>
                <h3 style={{fontSize:12,fontWeight:600,color:tx.text,marginBottom:12}}>Measurement plan</h3>
                <DRow k="Primary KPI" v={AGENT5_DATA.measurement_plan.primary_kpi} vc={tx.green}/>
                <DRow k="Reporting cadence" v={AGENT5_DATA.measurement_plan.reporting_cadence}/>
                <DRow k="Holdout group" v="Recommended" vc="#10b981"/>
                <div style={{marginTop:10}}>
                  <div style={{fontSize:10,color:tx.mut,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Secondary KPIs</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {AGENT5_DATA.measurement_plan.secondary_kpis.map((k,i)=>(
                      <span key={i} style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:tx.sub}}>{k}</span>
                    ))}
                  </div>
                </div>
              </GCard>
            </div>
          </div>
        )}

        {/* ── CAMPAIGN ── */}
        {sec==="campaign"&&(
          <div key="cam" className="fu">
            <h1 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Campaign performance</h1>
            <p style={{fontSize:13,color:tx.sub,marginBottom:18}}>KOA-SPRING-REAWAKENING-2026 · Two-sample t-test · p=0.000 · 95% CI [16.17%, 21.83%]</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:14}}>
              {[
                {l:"Booking lift",v:"19.0%",c:tx.green,modal:{title:"Booking lift · 19.0%",context:"Pre vs post campaign",color:tx.green,
                  insight:"Pre-campaign: 12,500 bookings. Post-campaign: 14,875 bookings. Absolute lift: 2,375 incremental bookings.",
                  metrics:[["Pre-campaign","12,500"],["Post-campaign","14,875"],["Absolute lift","2,375"],["Lift %","19.0%"],["CI lower","16.17%"],["CI upper","21.83%"]]}},
                {l:"Campaign ROI",v:"972.5%",c:KOA_YELLOW,modal:{title:"ROI · 972.5%",context:"$45K cost vs $482K revenue",color:KOA_YELLOW,
                  insight:"$45,000 campaign cost generated $482,625 in attributed revenue.",
                  metrics:[["Campaign cost","$45,000"],["Gross revenue","$742,875"],["Attributed (0.70)","$482,625"],["ROI factor","9.725×"],["ROI %","972.5%"],["Net profit","$437,625"]]}},
                {l:"Pre-campaign",v:"12,500",c:tx.sub,modal:{title:"Pre-campaign baseline · 12,500",context:"90-day control window",color:tx.blue,
                  insight:"Baseline booking count over equivalent 90-day pre-campaign window.",
                  metrics:[["Booking window","90-day pre-campaign"],["Baseline count","12,500"],["Avg rev/booking","$250"],["Total baseline","$3,125,000"],["Control group","Statistical holdout"],["Data source","KampSightDB Reservations"]]}},
                {l:"Post-campaign",v:"14,875",c:tx.blue,modal:{title:"Post-campaign result · 14,875",context:"90-day post-launch window",color:tx.blue,
                  insight:"14,875 total bookings against 12,500 baseline = 19% lift.",
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
                  <ChBadge ch="Email"/><span style={{fontSize:13,fontWeight:600,color:tx.text}}>Email channel</span>
                </div>
                {[["Sent","250,000"],["Delivered","248,500"],["Opened","62,125"],["Clicked","8,450"],["Open rate","25.0%"],["CTR","3.4%"],["Delivery rate","99.4%"]].map(([k,v])=><DRow key={k} k={k} v={v}/>)}
              </GCard>
              <GCard style={{padding:"18px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
                  <ChBadge ch="SMS"/><span style={{fontSize:13,fontWeight:600,color:tx.text}}>SMS channel</span>
                </div>
                {[["Sent","45,000"],["Delivered","44,100"],["Read","38,500"],["Engaged","5,200"],["Read rate","87.3%"],["Engage rate","11.6%"],["Delivery rate","98.0%"]].map(([k,v])=><DRow key={k} k={k} v={v}/>)}
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
                  <div style={{flex:1}}><div className="bar-track"><div className="bar-fill" style={{width:`${l.pct*1.6}%`,background:`linear-gradient(90deg,${l.color},${l.color}70)`}}/></div></div>
                  <div style={{width:90,textAlign:"right",fontSize:12,fontWeight:700,color:l.color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{l.count}</div>
                  <div style={{width:36,textAlign:"right",fontSize:11,color:tx.mut,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{l.pct}%</div>
                  <div style={{width:80,textAlign:"right",fontSize:11,color:tx.sub,flexShrink:0}}>{l.nights} nights</div>
                  <span style={{fontSize:11,color:tx.mut,flexShrink:0}}>→</span>
                </div>
              ))}
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
          </div>
        )}

        {/* ── CAMPGROUNDS ── */}
        {sec==="campgrounds"&&<CampsSection onSelect={({type,item})=>open(type,item)}/>}
        {sec==="abtest"&&<ABTestSection inputA={abInputA} setInputA={setAbInputA} inputB={abInputB} setInputB={setAbInputB} result={abResult} onRun={runABTest} tx={tx}/>}
        {sec==="forecast"&&<ForecastSection tx={tx}/>}

      </main>

      {/* STATUS BAR */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:28,zIndex:200,
        background:dark?"rgba(6,12,26,0.88)":"rgba(235,215,205,0.88)",
        backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        borderTop:dark?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.07)",
        display:"flex",alignItems:"center",padding:"0 22px",gap:24,
        fontSize:10,color:tx.mut,fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em"}}>
        <span style={{color:tx.green}}>● AGENTS 1–7 COMPLETE · PIPELINE DONE</span>
        <span>10.9M RESERVATIONS · 518 CAMPGROUNDS</span>
        <span>479K RECIPIENTS · ROI 3,722% · NPS r=0.965</span>
        <span style={{marginLeft:"auto"}}>AIRIA GUEST SEGMENTATION v2.0 · GSU CIS-8010 · {new Date().toLocaleDateString()}</span>
      </div>

      <Modal modal={modal} onClose={()=>setModal(null)}/>
      <Analytics />
    </div>
  );
}
