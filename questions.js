// ============================================================
// Impact Baselines: unavoidable annual harm for any US resident
// ============================================================

const IMPACT_BASELINES = {
  co2_kg: 2500,           // Infrastructure, grid, shared services (~2.5 tonnes, EIA)
  exploited_labor_hrs: 50, // Embedded labor in unavoidable goods (rough estimate)
  military_dollars: 3707,  // IPS 2025: per-taxpayer military spending (broader WRL FY2026 figure of $1,194B total is higher)
  carceral_dollars: 242,   // $80B prison system / 330M population
  surveillance_units: 1,   // Baseline digital presence
};

// ============================================================
// Categories
// ============================================================

const CATEGORIES = {
  labor: {
    name: "Labor & Supply Chains",
    description:
      "How your purchases and service use connect to worker exploitation, both globally and in the service economy around you.",
    structural_context:
      "The US economy runs on cheap labor, from cobalt mines in the DRC (where 40,000 children work in mining) to Amazon warehouses in Kentucky where 41% of workers report being injured on the job (UIC CUED, 2025). The federal tipped minimum wage has been frozen at $2.13/hour since 1991 (CEPR). Gig workers earn a median of $5.12/hour after expenses across 7 major platforms (Human Rights Watch, 2025). The DOL stopped enforcing Biden-era gig worker reclassification rules in May 2025. Meanwhile, UFLPA enforcement against forced labor imports collapsed 87% in 2025, from $1.4B to $178M in detained goods (Wire China). These aren't failures of the system; they're features.",
    resources: [
      { name: "KnowTheChain", url: "https://knowthechain.org", description: "Benchmarks largest companies on forced labor in supply chains" },
      { name: "Worker-driven Social Responsibility Network", url: "https://wsr-network.org", description: "Worker-led enforcement model for labor rights" },
      { name: "National Domestic Workers Alliance", url: "https://domesticworkers.org", description: "Organizing for domestic workers' rights" },
      { name: "Goods Guide / Made In A Free World", url: "https://madeinafreeworld.com", description: "Slavery Footprint and corporate tools" },
    ],
  },
  ecology: {
    name: "Ecological Extraction",
    description:
      "Your relationship to the systems that treat the living world as raw material. Not your personal carbon footprint (that framing was invented by BP).",
    structural_context:
      "100 active fossil fuel producers are linked to 71% of global industrial greenhouse gas emissions since 1988 (CDP/Climate Accountability Institute, 2017). The concept of the individual 'carbon footprint' was popularized by a BP ad campaign in 2004. Fossil CO2 emissions hit a record 38.1 billion tonnes in 2025 (Global Carbon Budget). The three-year average (2023-2025) broke through 1.5C for the first time (WMO). The remaining carbon budget for 1.5C is roughly 170 billion tonnes, or about 4 years at current rates. The One Big Beautiful Bill Act (signed July 2025) terminated EV tax credits and residential energy credits, gutting the IRA's clean energy provisions. AI data centers alone produced an estimated 32.6-79.7 million tonnes CO2 in 2025 and could consume 12% of all US electricity by 2028 (Nature Sustainability, 2025). The richest 1% globally emit 75.1 tonnes CO2/person/year, exhausting their 'fair share' of the 2026 carbon budget in 10 days (Oxfam, January 2026).",
    resources: [
      { name: "Movement Generation", url: "https://movementgeneration.org", description: "Just Transition framework: from extractive to regenerative economy" },
      { name: "Indigenous Environmental Network", url: "https://ienearth.org", description: "Indigenous-led environmental justice and climate justice" },
      { name: "350.org", url: "https://350.org", description: "Fossil fuel divestment and climate organizing" },
      { name: "Right to Repair Movement", url: "https://repair.org", description: "Fighting planned obsolescence" },
    ],
  },
  finance: {
    name: "Financial Complicity",
    description:
      "Where your money sleeps at night: banking, investing, debt, and who profits from it all.",
    structural_context:
      "The 65 largest banks committed $869 billion to fossil fuels in 2024 alone, up $162.5B year-over-year. Two-thirds of banks in the report increased fossil fuel financing. JPMorgan Chase led with $53.5 billion in a single year. Since the Paris Agreement: $6.9+ trillion cumulative (Banking on Climate Chaos, 2025). Your default 401(k) likely includes fossil fuels, weapons, and private prisons. As You Sow's screening tools give private prison operators an automatic F grade (Invest Your Values methodology). Banks profit from your precarity twice: once on deposits they lend to extractors, once on interest from your debt.",
    resources: [
      { name: "Fossil Free Funds (As You Sow)", url: "https://fossilfreefunds.org", description: "Screen your investments for fossil fuels, weapons, prisons, etc." },
      { name: "Banking on Climate Chaos", url: "https://bankingonclimatechaos.org", description: "Annual report card on major banks' fossil fuel financing" },
      { name: "National Credit Union Administration", url: "https://mycreditunion.gov", description: "Find a credit union" },
      { name: "Mighty Deposits", url: "https://mightydeposits.com", description: "See where your bank lends" },
    ],
  },
  food: {
    name: "Food Systems",
    description:
      "Your relationship to industrial agriculture, food sovereignty, and the politics of what you eat.",
    structural_context:
      "US agriculture is dominated by four companies that control 80-85% of beef processing (Cargill, Tyson, JBS, National Beef). Ranchers' share of the consumer beef dollar dropped from 70% in 1970 to roughly 30% today. Farm workers, mostly immigrants, face pesticide exposure, wage theft, and have been explicitly excluded from labor protections since the New Deal. Agricultural workers are 35x more likely to die from heat-related illness than other workers (NFWM). The Trump administration cut H-2A visa minimum wages, transferring an estimated $1.7 billion from workers to employers in 2026 (CalMatters). Meanwhile, 19 million Americans live in food deserts (USDA, 2025), and 25% of Black households are food insecure. SNAP was partially defunded during the October 2025 government shutdown, affecting 42 million people.",
    resources: [
      { name: "Food Chain Workers Alliance", url: "https://foodchainworkers.org", description: "Worker-led coalition across the food system" },
      { name: "Soul Fire Farm", url: "https://soulfirefarm.org", description: "Afro-Indigenous centered community farm and food sovereignty" },
      { name: "La Via Campesina", url: "https://viacampesina.org", description: "International peasant and small farmer movement" },
      { name: "Community Food Security Coalition", url: "https://foodsecurity.org", description: "Building community food systems" },
    ],
  },
  tech: {
    name: "Technology & Surveillance",
    description:
      "Your participation in data extraction, surveillance capitalism, and the tech monopolies that enable both.",
    structural_context:
      "A dormant Android phone with Chrome sends location data to Google 340 times per 24 hours (Schmidt/Vanderbilt, 2018). Each Facebook user is monitored by an average of 2,230 companies; LiveRamp appeared in 96% of participants' data (Consumer Reports/The Markup, 2024). In July 2025, the Pentagon awarded contracts worth up to $200M each to Google, xAI, Anthropic, and OpenAI for military AI applications. Clearview AI signed a $10M contract with the federal government in September 2025. ICE agents now use a Mobile Fortify app that runs faces against 200+ million DHS/FBI/State Department images in real time (American Immigration Council). AI data centers consumed an estimated 32.6-79.7 million tonnes CO2 in 2025, and data centers in Texas alone used 49 billion gallons of water (Lincoln Institute). The Trump administration rescinded Biden-era ethical AI mandates in favor of deregulation.",
    resources: [
      { name: "Electronic Frontier Foundation", url: "https://eff.org", description: "Digital privacy and civil liberties" },
      { name: "Surveillance Technology Oversight Project", url: "https://stopspying.org", description: "Fighting surveillance in New York and beyond" },
      { name: "Data for Black Lives", url: "https://d4bl.org", description: "Racial justice in data and technology" },
      { name: "PRISM Break", url: "https://prism-break.org", description: "Privacy-respecting alternatives to common services" },
    ],
  },
  housing: {
    name: "Housing & Land",
    description:
      "Your position in the housing market, displacement dynamics, and the stolen land beneath all of it.",
    structural_context:
      "All land in the US is indigenous land taken through genocide, treaties broken, and forced removal. On top of that: redlining (1930s-60s, effects persist), blockbusting, predatory lending. Private equity firms now own at least 10% of all US apartments (2.2 million units), 62% acquired since 2018; PE is projected to own 40% of the single-family rental market by 2030 (PE Stakeholder Project; NPR). A 1% increase in Airbnb listings raises rents by 0.018% and house prices by 0.026%, with effects strongest in renter-heavy areas (Barron, Kung & Proserpio, Marketing Science, 2021). Trump signed an executive order in January 2026 directing agencies to limit PE home purchases, but it contains no outright ban or divestment requirement. Minnesota has proposed prohibiting PE firms from owning single-family properties entirely.",
    resources: [
      { name: "Right to the City Alliance", url: "https://righttothecity.org", description: "National housing justice organizing alliance" },
      { name: "Grounded Solutions Network", url: "https://groundedsolutions.org", description: "Community land trusts and shared equity housing" },
      { name: "National Alliance of Community Economic Development Associations", url: "https://naceda.org", description: "Community-controlled development" },
      { name: "Native Land Digital", url: "https://native-land.ca", description: "Whose land are you on?" },
    ],
  },
  military_carceral: {
    name: "Military & Carceral",
    description:
      "Your proximity to and complicity in the world's largest military and incarceration systems.",
    structural_context:
      "US military spending in 2024: $997 billion, more than the next 9 countries combined, roughly 40% of global military expenditure (SIPRI, 2025). The FY2026 DoD budget request is $961.6 billion. Including nuclear weapons, CIA, NSA, veterans' benefits, and war debt interest: $1,194 billion total current military spending (War Resisters League, FY2026). US arms sales in FY2025 totaled $331 billion, 42% of all global arms transfers (State Department). This includes a $142 billion deal with Saudi Arabia and $21.7 billion to Israel since October 2023. On February 28, 2026, the US and Israel launched Operation Epic Fury against Iran. The US incarcerates 1.9 million people; Black Americans imprisoned at 5x the white rate (Sentencing Project). ICE detention surged 84% to 73,000 detainees in January 2026, with DHS aiming for 100,000 capacity (Prison Policy Initiative, Whole Pie 2026). Incarcerated workers earn 13-52 cents/hour; seven states pay nothing; prison labor produces roughly $11 billion/year in goods (ACLU). FCC adopted new prison phone rate caps in October 2025 that are up to 83% higher than the 2024 rules.",
    resources: [
      { name: "War Resisters League", url: "https://warresisters.org", description: "Anti-war organizing and 'Where Your Income Tax Money Really Goes' pie chart" },
      { name: "Worth Rises", url: "https://worthrises.org", description: "Dismantling the prison industry" },
      { name: "National Network Opposing the Militarization of Youth", url: "https://nnomy.org", description: "Counter-recruitment and anti-militarism" },
      { name: "Critical Resistance", url: "https://criticalresistance.org", description: "Prison industrial complex abolition" },
    ],
  },
  solidarity: {
    name: "Solidarity & Collective Action",
    description:
      "How you show up: mutual aid, organizing, and building alternatives to the systems above.",
    structural_context:
      "The dominant critique of ethical consumption is that it substitutes individual shopping choices for collective political action, what Coffin & Egan-Wyer (2022) call the 'ethical consumption cap': there is a structural limit on what individual consumer choices can achieve. Shopping differently won't dismantle systems, but organized people can. Union membership stands at 10.0% (BLS, 2025). However, the NLRB lost its quorum for 345 days in 2025 after Trump fired board members, and union elections fell 30% (Center for American Progress). Despite this, 306,800 workers were idled in 30 major work stoppages in 2025, including historic victories: East Coast dockworkers won a 60%+ raise, Hilton Houston housekeepers won after a 40-day strike (the first hotel strike in Texas history), and the Pittsburgh Post-Gazette strike ended after three years. Note: collective action requires time and capacity, resources that are themselves unequally distributed. A single parent working two jobs has less bandwidth for organizing than a salaried professional with free evenings. This tool can't fully account for that.",
    resources: [
      { name: "Big Door Brigade", url: "https://bigdoorbrigade.com", description: "Mutual aid toolbox and resources" },
      { name: "Mutual Aid Hub", url: "https://mutualaidhub.org", description: "Find mutual aid networks near you" },
      { name: "Cooperation Jackson", url: "https://cooperationjackson.org", description: "Building a solidarity economy in Jackson, MS" },
      { name: "Highlander Center", url: "https://highlandercenter.org", description: "Movement education and organizing since 1932" },
    ],
  },
};

// ============================================================
// Questions
// ============================================================
// Each question has:
//   - category: which category it belongs to
//   - text: the question
//   - context: brief structural context (shown as aside)
//   - options: array of { text, score, impact, constrained? }
//     scores: 1 = deep complicity, 5 = active harm reduction/refusal
//     impact: { co2_kg, exploited_labor_hrs, military_dollars, carceral_dollars, surveillance_units }
//       values represent annual delta above baseline

const QUESTIONS = [
  // ── Labor & Supply Chains ──────────────────────────────────

  {
    category: "labor",
    text: "When you buy clothing, what does your typical purchase look like?",
    context:
      "Fast fashion relies on garment workers, mostly women in the Global South, earning poverty wages in unsafe conditions. The Rana Plaza collapse in Bangladesh killed 1,134 workers making clothes for Western brands.",
    options: [
      { text: "Mostly fast fashion, whatever's cheap and available", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 300, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I buy mostly fast fashion because it's what I can afford", score: 2, constrained: true,
        impact: { co2_kg: 0, exploited_labor_hrs: 300, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "A mix of fast fashion and some secondhand", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 150, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've started buying less new and more secondhand, but it's not consistent", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 100, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Primarily thrift, secondhand, or mending what I have", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 30, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I research labor practices before buying, or I've mostly opted out of new purchases", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 10, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "labor",
    text: "How do you relate to gig economy and service work?",
    context:
      "Gig workers earn a median of $5.12/hour after expenses, nearly 30% below the $7.25 federal minimum. Over 1/3 experienced work-related accidents (Human Rights Watch, 'The Gig Trap,' 2025). The DOL stopped enforcing Biden-era reclassification rules in May 2025, and a new proposed rule (February 2026) would further expand business-friendly contractor classifications.",
    options: [
      { text: "I use gig services (rideshare, delivery, etc.) frequently without much thought", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 200, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I use gig services frequently because I have no practical alternatives", score: 2, constrained: true,
        impact: { co2_kg: 0, exploited_labor_hrs: 200, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I use them regularly but try to tip well", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 120, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've started reducing use and thinking about alternatives", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 60, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've significantly reduced use and prefer alternatives: cooking, transit, local shops", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 20, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I rarely use them and actively support workers' organizing efforts", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 5, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "labor",
    text: "How do you think about the labor behind everyday goods (electronics, household items, groceries)?",
    context:
      "Consumer electronics depend on cobalt mining (often child labor in the DRC), rare earth extraction, and assembly lines where nets are installed to prevent worker suicides. Grocery store shelves are stocked by warehouse workers with punishing productivity quotas.",
    options: [
      { text: "I don't really think about it; I buy what I need", score: 1,
        impact: { co2_kg: 500, exploited_labor_hrs: 150, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'm aware of the issues but still buy conventionally", score: 2,
        impact: { co2_kg: 400, exploited_labor_hrs: 130, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've made some changes: buying less, repairing occasionally, being more conscious", score: 3,
        impact: { co2_kg: 250, exploited_labor_hrs: 80, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I consistently buy less, repair more, and choose smaller or worker-owned vendors when possible", score: 4,
        impact: { co2_kg: 150, exploited_labor_hrs: 40, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I actively minimize purchases, buy used/refurbished, and support worker-owned alternatives", score: 5,
        impact: { co2_kg: 80, exploited_labor_hrs: 15, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },

  // ── Ecological Extraction ──────────────────────────────────

  {
    category: "ecology",
    text: "How do you typically get around?",
    context:
      "Transportation is the largest source of US emissions. But car dependency is an infrastructure choice: the US systematically destroyed public transit and Black neighborhoods to build highways (see: Robert Moses, urban renewal).",
    options: [
      { text: "I drive alone almost everywhere", score: 1,
        impact: { co2_kg: 4600, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I drive alone because there is no viable transit, biking, or walking where I live", score: 2, constrained: true,
        impact: { co2_kg: 4600, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I drive but try to combine trips and carpool", score: 2,
        impact: { co2_kg: 3200, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Mix of driving, transit, biking, walking, depends on what's available", score: 3,
        impact: { co2_kg: 2000, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Primarily transit, bike, walk, or I've structured my life to minimize car dependence", score: 5,
        impact: { co2_kg: 400, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "ecology",
    text: "What's your relationship to stuff: buying, keeping, discarding?",
    context:
      "The US generates more waste per capita than any other country. Only 5-6% of plastic is actually recycled; the rest is landfilled, burned, or shipped to the Global South. 'Reduce' was always meant to come before 'recycle.'",
    options: [
      { text: "I buy new things regularly and don't think much about disposal", score: 1,
        impact: { co2_kg: 800, exploited_labor_hrs: 100, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I recycle when it's convenient and occasionally buy secondhand", score: 2,
        impact: { co2_kg: 600, exploited_labor_hrs: 80, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've started being more intentional: buying less, reusing more, but not consistently", score: 3,
        impact: { co2_kg: 300, exploited_labor_hrs: 40, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I actively reduce: repair, reuse, buy less, avoid packaging", score: 4,
        impact: { co2_kg: 300, exploited_labor_hrs: 40, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've significantly restructured habits around minimizing extraction (bulk, compost, borrow, make do)", score: 5,
        impact: { co2_kg: 100, exploited_labor_hrs: 20, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "ecology",
    text: "How much do you fly?",
    context:
      "A single round-trip transatlantic flight emits 1.3-1.9 tonnes CO2, more than many people in the Global South produce in a year (carbonindependent.org; Nature, 2025). The richest 1% emit 75.1 tonnes CO2/person/year, exhausting their 2026 'fair share' carbon budget in 10 days (Oxfam, January 2026). Fossil CO2 emissions hit a record 38.1 billion tonnes in 2025.",
    options: [
      { text: "Multiple flights a year, including leisure", score: 1,
        impact: { co2_kg: 5000, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "A few flights a year, mostly work or family obligations", score: 2,
        impact: { co2_kg: 2000, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Rarely, once a year or less", score: 4,
        impact: { co2_kg: 500, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I avoid flying entirely or nearly so", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I don't fly because I can't afford to", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },

  // ── Financial Complicity ───────────────────────────────────

  {
    category: "finance",
    text: "Where do you keep your money?",
    context:
      "The top 4 US banks account for 21% of all global fossil fuel financing, $6.9+ trillion cumulative since the Paris Agreement. Two-thirds of banks increased financing in 2024. JPMorgan Chase alone: $53.5B in 2024 (Banking on Climate Chaos, 2025). Credit unions are member-owned and typically don't fund extraction industries.",
    options: [
      { text: "A major bank (Chase, BofA, Wells Fargo, Citi, etc.)", score: 1,
        impact: { co2_kg: 500, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "A mix: big bank for convenience, maybe a credit union too", score: 2,
        impact: { co2_kg: 300, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've been thinking about switching or have started the process", score: 3,
        impact: { co2_kg: 300, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Credit union or community bank", score: 4,
        impact: { co2_kg: 50, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Credit union or community bank, and I've actively divested", score: 5,
        impact: { co2_kg: 20, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "finance",
    text: "If you have investments or retirement savings, do you know what they fund?",
    context:
      "Default index funds typically include fossil fuels, weapons manufacturers, private prisons, and companies flagged for labor violations. Most people never look under the hood.",
    options: [
      { text: "No idea; I use whatever the default is", score: 1,
        impact: { co2_kg: 400, exploited_labor_hrs: 0, military_dollars: 200, carceral_dollars: 50, surveillance_units: 0 } },
      { text: "I have a vague sense but haven't dug into it", score: 2,
        impact: { co2_kg: 300, exploited_labor_hrs: 0, military_dollars: 150, carceral_dollars: 30, surveillance_units: 0 } },
      { text: "I've screened my funds and moved toward impact or ESG alternatives", score: 3,
        impact: { co2_kg: 150, exploited_labor_hrs: 0, military_dollars: 50, carceral_dollars: 10, surveillance_units: 0 } },
      { text: "I've intentionally divested from harmful industries or invest in community-controlled alternatives", score: 5,
        impact: { co2_kg: 30, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I don't have investments or retirement savings", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "finance",
    text: "How do you think about where your tax dollars go?",
    context:
      "Roughly 25 cents of every federal discretionary dollar goes to the Pentagon. ICE, CBP, and federal prisons are also federally funded. You don't choose this, but how you relate to it matters.",
    options: [
      { text: "I don't really think about it", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'm aware and uncomfortable but don't take specific action", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've taken some steps: donating, contacting representatives, learning about where it goes", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I actively redirect what I can: charitable giving, community investment, sustained political advocacy", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I engage in tax resistance, war tax redirection, or deep sustained advocacy to change federal spending", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },

  // ── Food Systems ───────────────────────────────────────────

  {
    category: "food",
    text: "Where does most of your food come from?",
    context:
      "Four companies control 85% of US beef processing. Farm workers earn a median of $28k/year and face pesticide exposure, heat illness, and wage theft. Meanwhile, 23.5 million Americans live in food deserts where fresh food is simply unavailable.",
    options: [
      { text: "Conventional grocery stores and/or fast food, whatever's available and affordable", score: 2,
        impact: { co2_kg: 1200, exploited_labor_hrs: 80, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I eat conventional grocery/fast food because alternatives aren't accessible where I live", score: 2, constrained: true,
        impact: { co2_kg: 1200, exploited_labor_hrs: 80, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Mostly grocery stores but I seek out some local, seasonal, or co-op options", score: 3,
        impact: { co2_kg: 900, exploited_labor_hrs: 50, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Significant portion from farmers markets, CSAs, co-ops, or my own garden", score: 4,
        impact: { co2_kg: 500, exploited_labor_hrs: 20, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've built deep relationships with local food systems: growing, trading, community sourcing", score: 5,
        impact: { co2_kg: 200, exploited_labor_hrs: 5, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "food",
    text: "How do you think about meat and animal products?",
    context:
      "Industrial animal agriculture drives deforestation, water pollution, antibiotic resistance, and employs some of the most exploited workers in the US (meatpacking injury rates are among the highest of any industry). It's also a leading source of methane emissions.",
    options: [
      { text: "I eat meat regularly and don't think much about sourcing", score: 1,
        impact: { co2_kg: 1000, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've reduced consumption or try to source better", score: 3,
        impact: { co2_kg: 500, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Mostly plant-based with occasional exceptions", score: 4,
        impact: { co2_kg: 200, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Fully plant-based, or I source exclusively from small-scale, local, ethical producers", score: 5,
        impact: { co2_kg: 50, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },

  // ── Technology & Surveillance ──────────────────────────────

  {
    category: "tech",
    text: "How embedded are you in Big Tech ecosystems?",
    context:
      "A dormant Android phone sends location data to Google 340 times per day (Schmidt/Vanderbilt, 2018). Each Facebook user is tracked by an average of 2,230 companies (Consumer Reports/The Markup, 2024). In July 2025, the Pentagon awarded military AI contracts to Google, OpenAI, xAI, and Anthropic. Clearview AI signed a $10M federal contract. Their services are 'free' because you are the product.",
    options: [
      { text: "Fully: Google/Apple everything, Amazon Prime, active on major social platforms", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 5 } },
      { text: "Deep in but I've opted out of one or two (e.g., deleted Facebook, avoid Amazon sometimes)", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 4 } },
      { text: "I've started making deliberate switches in some areas (ad blockers, different browser, less Amazon)", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 3 } },
      { text: "I've made meaningful switches across multiple areas: privacy-respecting search, minimal Amazon, encrypted tools", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 2 } },
      { text: "I've significantly de-Googled/de-Amazoned and primarily use open source or privacy-first tools", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0.5 } },
    ],
  },
  {
    category: "tech",
    text: "How do you relate to carceral and surveillance technology in your daily life?",
    context:
      "Ring partnered with Flock Safety (an AI camera network used by ICE and police) in October 2025, then cancelled after backlash in February 2026. Ring still partners with Axon for law enforcement evidence management. ICE agents now use Mobile Fortify to run faces against 200+ million images in real time (American Immigration Council). Palantir holds a $30M contract for ICE's 'ImmigrationOS,' integrating passport, SSN, IRS, and license-plate data.",
    options: [
      { text: "I use Ring/Nest/smart home security, Nextdoor, or similar without thinking about it", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 20, surveillance_units: 4 } },
      { text: "I use some of these but I'm uneasy about the implications", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 10, surveillance_units: 3 } },
      { text: "I've started learning about this and made some changes (e.g., adjusted privacy settings, stopped using Nextdoor)", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 5, surveillance_units: 2 } },
      { text: "I've removed or avoided surveillance tech from my home and am conscious about the tools I use", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 1 } },
      { text: "I actively avoid carceral tech and support campaigns against surveillance infrastructure", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0.5 } },
    ],
  },

  // ── Housing & Land ─────────────────────────────────────────

  {
    category: "housing",
    text: "What's your housing situation?",
    context:
      "All US housing sits on indigenous land taken through genocide and broken treaties. On top of that: redlining segregated cities, predatory lending targeted Black communities, and now private equity firms buy houses to rent back to the people who can't afford to buy. Homeownership builds generational wealth, and access to it was racially gatekept for decades.",
    options: [
      { text: "I own property and my primary wealth-building strategy involves rising home values", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I own a home and am aware of the displacement dynamics in my area", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I rent and am subject to market forces", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'm in a housing co-op, community land trust, or actively support housing justice alternatives", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'm unhoused or in unstable housing", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "housing",
    text: "How do you relate to housing speculation and short-term rentals?",
    context:
      "A 1% increase in Airbnb listings raises rents by 0.018% and house prices by 0.026%, with effects strongest in renter-heavy areas (Barron et al., Marketing Science, 2021). PE firms own at least 10% of all US apartments (2.2M units) and are projected to own 40% of single-family rentals by 2030. Investors bought roughly 27% of all homes in Q1 2025 (PE Stakeholder Project).",
    options: [
      { text: "I use Airbnb regularly and/or own investment property", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 50, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I use Airbnb occasionally for travel", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 20, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've started thinking about this and try to use Airbnb less", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 15, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I avoid Airbnb and seek locally-owned accommodations", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I actively avoid housing speculation and support tenant organizing or housing justice campaigns", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },

  // ── Military & Carceral ────────────────────────────────────

  {
    category: "military_carceral",
    text: "How aware are you of military and prison industry connections in your daily consumption?",
    context:
      "Incarcerated workers earn 13-52 cents/hour on average; seven states pay nothing. Prison labor produces roughly $11 billion/year in goods and services (ACLU, 'Captive Labor'). Companies with military contracts include Amazon (CIA cloud), Microsoft (Army HoloLens), Google and OpenAI (Pentagon AI contracts as of July 2025). US arms sales totaled $331 billion in FY2025 (State Department). Your tax dollars fund $1,194 billion in military-related spending per year (War Resisters League, FY2026).",
    options: [
      { text: "I don't think about this at all", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 100, carceral_dollars: 50, surveillance_units: 0 } },
      { text: "I'm vaguely aware but it hasn't changed my behavior", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 80, carceral_dollars: 40, surveillance_units: 0 } },
      { text: "I've started learning about which companies are involved and made a few changes", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 50, carceral_dollars: 20, surveillance_units: 0 } },
      { text: "I consistently try to avoid the worst offenders and stay informed", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 20, carceral_dollars: 10, surveillance_units: 0 } },
      { text: "I actively boycott military/prison-connected companies and support abolitionist campaigns", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 5, carceral_dollars: 5, surveillance_units: 0 } },
    ],
  },
  {
    category: "military_carceral",
    text: "How do you engage with the criminal legal system in your community?",
    context:
      "The US incarcerates 1.9 million people, 5% of world population, 25% of prisoners. Black Americans imprisoned at 5x the white rate (Sentencing Project). ICE detention surged 84% to 73,000 in January 2026, with DHS aiming for 100,000 capacity (Prison Policy Initiative, Whole Pie 2026). Average cost: $33,274/year per person; New York: $115,000/year (Vera Institute). The 13th Amendment explicitly permits slavery as punishment for crime.",
    options: [
      { text: "I haven't engaged with this issue", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 50, surveillance_units: 0 } },
      { text: "I stay informed but haven't taken specific action", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 40, surveillance_units: 0 } },
      { text: "I've taken some actions: supported bail funds, attended meetings, written representatives", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 20, surveillance_units: 0 } },
      { text: "I regularly support alternatives (restorative justice programs, re-entry support, community safety initiatives)", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 10, surveillance_units: 0 } },
      { text: "I'm actively building or sustaining alternatives to carceral approaches: organizing, supporting people inside, community defense", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 5, surveillance_units: 0 } },
    ],
  },

  // ── Solidarity & Collective Action ─────────────────────────

  {
    category: "solidarity",
    text: "How do you engage with mutual aid and community support?",
    context:
      "Mutual aid is solidarity-based, not charity-based. It's about recognizing interdependence, not performing generosity. During COVID, mutual aid networks filled gaps that government and nonprofits wouldn't. They operate on the principle: we keep us safe.",
    options: [
      { text: "I mostly focus on my own household", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I donate money to charities occasionally", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'd like to participate more but don't have the time or capacity right now", score: 2, constrained: true,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've started participating: sharing resources sometimes, helping neighbors, contributing when I can", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I regularly participate in mutual aid: sharing resources, skills, time with my community", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "Mutual aid and community interdependence are central to how I live", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "solidarity",
    text: "When you see injustice in your community, how do you respond?",
    context:
      "Solidarity means showing up, not just posting. But 'showing up' looks different depending on your position, capacity, and what's actually needed. Sometimes it's physical presence; sometimes it's money; sometimes it's skilled labor; sometimes it's getting out of the way.",
    options: [
      { text: "I mostly stay out of it", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I stay informed and share things online", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'd like to participate more but don't have the time or capacity right now", score: 2, constrained: true,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've shown up a few times: signed petitions, attended a meeting, had some hard conversations", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I show up regularly: attend meetings, support campaigns, contribute skills, have hard conversations", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'm actively involved in organizing, direct action, or building alternative structures", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
  {
    category: "solidarity",
    text: "How do you relate to labor organizing and worker power?",
    context:
      "Union membership stands at 10.0% (BLS, 2025), but the NLRB lost its quorum for 345 days in 2025 after Trump fired board members, and union elections fell 30%. Despite this, 306,800 workers were idled in 30 major stoppages, including the East Coast dockworkers (60%+ raise), Hilton Houston housekeepers (40-day strike, first hotel strike in Texas history), and the three-year Pittsburgh Post-Gazette strike.",
    options: [
      { text: "I don't think about it much", score: 1,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'm generally supportive of unions but don't take active steps", score: 2,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I've taken some steps: bought union when I noticed, shared info about strikes, started paying attention", score: 3,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I actively support union drives (buying union, respecting picket lines, donating to strike funds)", score: 4,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
      { text: "I'm involved in labor organizing myself or consistently prioritize worker power in my economic choices", score: 5,
        impact: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
    ],
  },
];

// ============================================================
// Scale Positions: "Terrain Map" framing
// ============================================================
// These describe positions, not judgments. The metaphor is
// cartographic: where are you standing?

// ============================================================
// Harm Benchmarks: concrete acts on a log scale
// ============================================================
// Each benchmark is a recognizable consumer/civic act placed on
// the same 1-5 scale. Your average score gets plotted among them.
// The point: "you are roughly here, between these two things."
//
// Score meaning:
//   1.0 = maximal complicity / active harm
//   5.0 = active refusal and building alternatives
//
// These are rough placements, arguable and imperfect, meant to
// make the scale legible through concrete reference points.

const HARM_BENCHMARKS = [
  // === Deep complicity (1.0 - 1.5) ===
  { score: 1.0, act: "Owning Raytheon/Lockheed Martin stock", category: "military_carceral",
    detail: "Directly profiting from weapons sales. US arms sales totaled $331 billion in FY2025, 42% of global arms transfers. Includes a $142B Saudi deal and $21.7B to Israel since October 2023.",
    source: "SIPRI, 2025; State Department FY2025",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 5000, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.0, act: "Operating a private prison or investing in CoreCivic/GEO Group", category: "military_carceral",
    detail: "Profiting from mass incarceration. Incarcerated workers earn 13-52¢/hour; prison labor produces ~$11B/year.",
    source: "ACLU, 'Captive Labor'; As You Sow gives prison operators auto-F grade",
    harm: { co2_kg: 0, exploited_labor_hrs: 500, military_dollars: 0, carceral_dollars: 10000, surveillance_units: 0 } },
  { score: 1.1, act: "Landlording multiple properties via Airbnb in a housing crisis city", category: "housing",
    detail: "Each 1% increase in Airbnb listings raises rents 0.018% and home prices 0.026%, with the strongest effect in renter-heavy areas.",
    source: "Barron, Kung & Proserpio, Marketing Science, 2021",
    harm: { co2_kg: 0, exploited_labor_hrs: 200, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.1, act: "Working in fossil fuel lobbying", category: "ecology",
    detail: "Actively blocking climate action. 100 producers linked to 71% of industrial GHGs since 1988.",
    source: "CDP/Climate Accountability Institute, 2017",
    harm: { co2_kg: 50000, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.2, act: "Banking with Wells Fargo and never questioning it", category: "finance",
    detail: "Top 4 US banks = 21% of all global fossil fuel financing. $6.9T+ since Paris Agreement.",
    source: "Banking on Climate Chaos, 2025",
    harm: { co2_kg: 500, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.2, act: "Paying federal taxes without engagement", category: "military_carceral",
    detail: "Your taxes fund $1,194B in military spending (FY2026), $331B in arms sales including $142B to Saudi Arabia and $21.7B to Israel, and the February 2026 strikes on Iran. Also funds ICE detention (73,000 detainees and rising).",
    source: "WRL FY2026; State Department; Prison Policy Initiative",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 3707, carceral_dollars: 242, surveillance_units: 0 } },
  { score: 1.3, act: "Buying a new iPhone every year", category: "labor",
    detail: "Annual demand drives cobalt mining (child labor, DRC), Foxconn assembly conditions, and e-waste. Over 40,000 children mine cobalt in the DRC.",
    source: "Amnesty International; KnowTheChain",
    harm: { co2_kg: 100, exploited_labor_hrs: 400, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.3, act: "Installing Ring doorbell and sharing footage with police", category: "tech",
    detail: "Ring partnered with Flock Safety (AI camera network used by ICE) in October 2025, cancelled after backlash February 2026. Still partners with Axon for police evidence management.",
    source: "EFF, 2025; TechCrunch",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 50, surveillance_units: 5 } },
  { score: 1.7, act: "Heavy daily use of AI services (ChatGPT, image generation, etc.)", category: "tech",
    detail: "AI data centers produced an estimated 32.6-79.7 million tonnes CO2 in 2025 and could consume 12% of US electricity by 2028. Data annotation workers earn piece rates; content moderators suffer severe psychological harm.",
    source: "Nature Sustainability, 2025; Hao, Empire of AI, 2025",
    harm: { co2_kg: 1000, exploited_labor_hrs: 50, military_dollars: 0, carceral_dollars: 0, surveillance_units: 3 } },
  { score: 1.4, act: "Using Amazon Prime for everything", category: "labor",
    detail: "41% of Amazon warehouse workers report being injured; 69% take unpaid time off monthly due to pain or exhaustion (UIC CUED, 2025).",
    source: "UIC CUED, 2025; US Senate HELP Committee",
    harm: { co2_kg: 300, exploited_labor_hrs: 300, military_dollars: 0, carceral_dollars: 0, surveillance_units: 2 } },
  { score: 1.4, act: "Flying 10+ times a year for leisure", category: "ecology",
    detail: "One transatlantic round-trip = 1.3-1.9 tonnes CO2. Richest 1% emit as much as poorest 5 billion people.",
    source: "carbonindependent.org; Oxfam, 2023",
    harm: { co2_kg: 10000, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.5, act: "Full SHEIN hauls every month", category: "labor",
    detail: "Workers making $20/day, up to 75-hour weeks. Bloomberg found Shein using Xinjiang cotton. France fined Shein EUR 40M. De minimis loophole closure affects imports.",
    source: "KnowTheChain; Yale Global Affairs; Good On You",
    harm: { co2_kg: 500, exploited_labor_hrs: 600, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },

  // === Passive participation (1.6 - 2.4) ===
  { score: 1.6, act: "Eating fast food daily (McDonald's, Chick-fil-A, etc.)", category: "food",
    detail: "Beef produces 60 kg CO2e per kg (vs. 1 kg for peas). Industrial meat = poverty wages + deforestation + emissions.",
    source: "Poore & Nemecek, Science, 2018",
    harm: { co2_kg: 2000, exploited_labor_hrs: 100, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.7, act: "Default 401(k) you've never looked at", category: "finance",
    detail: "Likely funding fossil fuels, weapons, private prisons. Scope 3 emissions average 11.4x operational emissions.",
    source: "Invest Your Values methodology; CDP Scope 3 Technical Note",
    harm: { co2_kg: 400, exploited_labor_hrs: 0, military_dollars: 200, carceral_dollars: 50, surveillance_units: 0 } },
  { score: 1.8, act: "Scrolling Instagram/TikTok for hours daily", category: "tech",
    detail: "Each Facebook user monitored by avg 2,230 companies. LiveRamp (data broker) in 96% of users' data.",
    source: "Consumer Reports/The Markup, 2024",
    harm: { co2_kg: 50, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 5 } },
  { score: 1.8, act: "Driving a brand-new SUV", category: "ecology",
    detail: "Typical US passenger vehicle: 4.6 metric tons CO2/year. SUVs are the 2nd largest driver of global emissions increase.",
    source: "EPA; IEA",
    harm: { co2_kg: 6000, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 1.9, act: "Buying all groceries at Walmart", category: "labor",
    detail: "Largest private employer in the US. Poverty wages subsidized by billions in public benefits. Tariffs in 2025-2026 increased apparel prices 17% and food prices 2.8%, hitting Walmart shoppers hardest.",
    source: "Yale Budget Lab; Americans for Tax Fairness",
    harm: { co2_kg: 300, exploited_labor_hrs: 200, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 2.0, act: "Using Uber/Lyft as your primary transportation", category: "labor",
    detail: "California rideshare drivers earn median $5.97/hr after expenses. Nationally: $5.12/hr median.",
    source: "UC Berkeley Labor Center, 2024; HRW, 2025",
    harm: { co2_kg: 2000, exploited_labor_hrs: 200, military_dollars: 0, carceral_dollars: 0, surveillance_units: 2 } },
  { score: 2.0, act: "Paying for Spotify/Netflix without thinking about it", category: "tech",
    detail: "Artists get $0.003-0.005/stream; content moderation outsourced to traumatized workers in Global South at piece rates.",
    source: "Hao, Empire of AI, 2025",
    harm: { co2_kg: 50, exploited_labor_hrs: 20, military_dollars: 0, carceral_dollars: 0, surveillance_units: 2 } },
  { score: 2.3, act: "Using Microsoft products daily (Office, Teams, Windows)", category: "tech",
    detail: "Microsoft holds Army HoloLens contract; drained 11.5M tonnes of water in Iowa during drought for data centers. Often unavoidable for workers; this reflects the system, not always a choice.",
    source: "Hao, Empire of AI, 2025",
    harm: { co2_kg: 200, exploited_labor_hrs: 0, military_dollars: 50, carceral_dollars: 0, surveillance_units: 3 } },
  { score: 2.2, act: "Using Google for everything (search, email, maps, docs)", category: "tech",
    detail: "Dormant Android sends 340 location pings/day to Google. Pentagon awarded Google a military AI contract in July 2025.",
    source: "Schmidt/Vanderbilt, 2018; Pentagon, 2025",
    harm: { co2_kg: 100, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 5 } },
  { score: 2.3, act: "Tipping 20% at restaurants", category: "labor",
    detail: "Better than not tipping, but the tipped wage system itself is the problem: $2.13/hr since 1991.",
    source: "CEPR; EPI, 'Waiting for Change'",
    harm: { co2_kg: 0, exploited_labor_hrs: 30, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 2.4, act: "Buying 'sustainable' brands at Target", category: "ecology",
    detail: "Greenwashing: the 'ethical consumption cap' means individual choices have a structural ceiling on impact.",
    source: "Coffin & Egan-Wyer, Marketing Theory, 2022",
    harm: { co2_kg: 200, exploited_labor_hrs: 50, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },

  // === Emerging friction (2.5 - 3.4) ===
  { score: 2.5, act: "Voting in every election but doing nothing else politically", category: "solidarity",
    detail: "Necessary but insufficient. Ethical consumption cap: structural limit on what individual action achieves.",
    source: "Coffin & Egan-Wyer, 2022",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 2.7, act: "Eating less meat (a few times a week instead of daily)", category: "food",
    detail: "Going fully vegan saves ~1 tonne CO2/year. Each 100g beef serving = 15.5 kg CO2e = 78.7 km of driving.",
    source: "Poore & Nemecek, Science, 2018; Our World in Data",
    harm: { co2_kg: 500, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 2.8, act: "Using Airbnb only for travel, feeling weird about it", category: "housing",
    detail: "The discomfort is information. PE firms own 10%+ of all US apartments (2.2M units).",
    source: "PE Stakeholder Project",
    harm: { co2_kg: 0, exploited_labor_hrs: 20, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 3.0, act: "Switching to a credit union", category: "finance",
    detail: "Your deposits no longer fund fossil fuel extraction. JPMorgan alone: $53.5B to fossil fuels in 2024.",
    source: "Banking on Climate Chaos, 2025",
    harm: { co2_kg: 50, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 3.0, act: "Using ad blockers and a VPN", category: "tech",
    detail: "Basic friction against surveillance economy. Google collects 11.6 MB of data per user per day, 2/3 passively.",
    source: "Schmidt/Vanderbilt, 2018",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 2 } },
  { score: 3.1, act: "Buying most clothes secondhand", category: "labor",
    detail: "Dramatically reducing demand for new fast fashion production and its exploitation chains.",
    source: "ECRA methodology; KnowTheChain",
    harm: { co2_kg: 0, exploited_labor_hrs: 30, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 3.2, act: "Taking public transit when you could drive", category: "ecology",
    detail: "Every rider is a vote for the infrastructure. Typical car: 4.6 metric tons CO2/year avoided.",
    source: "EPA",
    harm: { co2_kg: 400, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 3.3, act: "Donating to mutual aid funds", category: "solidarity",
    detail: "Direct material support, solidarity-based, not charity-based. Builds interdependence.",
    source: "Shotwell, Against Purity, 2016",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },

  // === Active harm reduction (3.5 - 4.4) ===
  { score: 3.5, act: "Shopping at food co-ops and farmers markets", category: "food",
    detail: "Money stays local, builds alternative food infrastructure, supports food sovereignty.",
    source: "Food Chain Workers Alliance",
    harm: { co2_kg: 300, exploited_labor_hrs: 10, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 3.5, act: "Using open-source and privacy-first AI tools instead of Big Tech AI", category: "tech",
    detail: "DeepSeek trained for $6M (1/20th of ChatGPT cost), 90% less energy, open source.",
    source: "Jacobin, 2025",
    harm: { co2_kg: 100, exploited_labor_hrs: 5, military_dollars: 0, carceral_dollars: 0, surveillance_units: 1 } },
  { score: 3.6, act: "De-Googling your life (ProtonMail, Firefox, OSM)", category: "tech",
    detail: "Real friction against surveillance capitalism. Removes yourself from 340 daily location pings.",
    source: "Schmidt/Vanderbilt, 2018",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0.5 } },
  { score: 3.7, act: "Repairing electronics instead of replacing them", category: "ecology",
    detail: "Directly undermining planned obsolescence. Right to Repair movement gaining legislative wins.",
    source: "repair.org",
    harm: { co2_kg: 50, exploited_labor_hrs: 5, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 3.8, act: "Respecting picket lines even when it's inconvenient", category: "solidarity",
    detail: "Material solidarity with workers, at a cost to yourself. Union membership at ~10%, down from 35%.",
    source: "BLS",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 3.8, act: "Screening investments and divesting from fossil fuels", category: "finance",
    detail: "As You Sow screens for fossil fuels, weapons, prisons, deforestation, gender equality. A-F grading.",
    source: "Fossil Free Funds; Invest Your Values",
    harm: { co2_kg: 50, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.0, act: "Regular participation in mutual aid networks", category: "solidarity",
    detail: "Building alternative infrastructure. Complicity is universal; solidarity is the response (Shotwell).",
    source: "Shotwell, Against Purity, 2016",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.0, act: "Growing a significant portion of your own food", category: "food",
    detail: "Partial exit from industrial food system. Builds skills and food sovereignty.",
    source: "Soul Fire Farm; La Via Campesina",
    harm: { co2_kg: 100, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.2, act: "Living car-free by choice in a car-dependent country", category: "ecology",
    detail: "Structural refusal. Eliminates 4.6 metric tons CO2/year at significant personal cost.",
    source: "EPA",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },

  // === Structural refusal & building (4.3 - 5.0) ===
  { score: 4.3, act: "Active involvement in tenant organizing", category: "housing",
    detail: "Building collective power against displacement in a market where PE owns 10%+ of apartments.",
    source: "Right to the City Alliance; PE Stakeholder Project",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.4, act: "Supporting people inside prisons (commissary, letters, legal aid)", category: "military_carceral",
    detail: "Material solidarity. Cost per incarcerated person: $33,274/year avg; NY: $115,000. System designed to make them invisible.",
    source: "Vera Institute; Sentencing Project",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.5, act: "Living in a housing co-op or community land trust", category: "housing",
    detail: "Actually existing alternative to speculative housing. Removes land from commodity market.",
    source: "Grounded Solutions Network",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.5, act: "Consistent labor organizing or supporting union drives", category: "solidarity",
    detail: "Building worker power, the most proven mechanism for reducing inequality. Current wave: Starbucks, Amazon, media/tech.",
    source: "BLS; EPI",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.7, act: "Running or deeply participating in a mutual aid network", category: "solidarity",
    detail: "You are the infrastructure. The most effective harm reduction comes from organized movements, not consumers.",
    source: "Shotwell, 2016; Movement Generation",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 4.8, act: "War tax resistance", category: "military_carceral",
    detail: "Refusing to fund the military at personal legal risk. $3,707/taxpayer/year to military spending.",
    source: "IPS, 2025; War Resisters League",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
  { score: 5.0, act: "Building and sustaining cooperative/solidarity economy institutions", category: "solidarity",
    detail: "Not just refusing the system but constructing the alternative. This is where individual ethics becomes collective power.",
    source: "Cooperation Jackson; Movement Generation Just Transition Framework",
    harm: { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 } },
];

const SCALE_POSITIONS = [
  {
    range: [1, 1.8],
    label: "Default Settings",
    description:
      "You're running on the operating system the empire installed. This isn't a moral failing; it's what the system is designed to produce. Most Americans are here on most axes. The defaults are convenient because enormous amounts of violence are spent making them convenient. Seeing this clearly is the first step, not guilt, but honest inventory.",
  },
  {
    range: [1.8, 2.6],
    label: "Aware but Embedded",
    description:
      "You see the problems. You haven't yet changed much. This is the most common position for people who read the news, care about justice, and still live more or less within the default systems. The gap between knowing and doing is wide, and often has material reasons (money, time, access, exhaustion). The question is whether awareness is a resting place or a waypoint.",
  },
  {
    range: [2.6, 3.4],
    label: "Selective Friction",
    description:
      "You've introduced friction into some of your defaults: changed banks, eat differently, show up sometimes, use different tools. But the changes are uneven. Some categories feel easy to shift; others feel locked in by circumstance or habit. This is normal and honest. The terrain isn't flat; leverage points are different for everyone.",
  },
  {
    range: [3.4, 4.2],
    label: "Active Harm Reduction",
    description:
      "You've made sustained, structural changes across multiple areas of your life. You're not performing ethics for an audience; you've reorganized material reality around reducing complicity. This often means accepting inconvenience, paying more, explaining yourself, and sometimes being wrong. The practice is the point, not the purity.",
  },
  {
    range: [4.2, 5],
    label: "Structural Refusal & Building",
    description:
      "You're not just opting out; you're building alternatives. Co-ops, land trusts, mutual aid networks, organizing campaigns, alternative food systems, community defense. This position usually requires community, because it's nearly impossible alone, and individual refusal without collective infrastructure is just asceticism. The question at this level is: who else are you bringing with you?",
  },
];

// ============================================================
// Harm Methodology: converting impact values to life-years
// ============================================================

const HARM_METHODOLOGY = {
  unit: "life-years of harm",
  pipelines: {
    carbon: { factor: 0.00075, unit: "life-years per tonne CO2", source: "Bressler 2021 / EPA SCC range: $120-$255/tonne (Biden EPA finalized $255; Trump revisiting). VSL: HHS 2025 central estimate $604K/VSLY at 3% discount. Using conservative $120/tonne and $160K/VSLY for this tool; actual harm likely 2-4x higher." },
    labor: { factor: 0.001, unit: "life-years per exploited hour", source: "GBD 2019 occupational injury DALYs" },
    military: { factor: 0.000000116, unit: "life-years per dollar", source: "Brown University Costs of War" },
    carceral: { factor: 0.00000003, unit: "life-years per dollar", source: "Vera Institute / Sentencing Project" },
    surveillance: { factor: 0.0001, unit: "life-years per unit (approximate)", source: "Proxy estimate" },
  },
  life_years_per_death: 70,
};
