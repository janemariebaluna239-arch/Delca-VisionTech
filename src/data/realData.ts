/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Executive, Company, DELCAEvent, EventRecommendation, Invitation, ActivityLog, NotificationItem, SystemSettings, AppStateStore } from '../types';

export const REAL_COMPANIES: Company[] = [
  {
    id: 'CMP-001',
    name: 'BDO Unibank',
    industry: 'Banking & Financial Services',
    city: 'Makati City',
    country: 'Philippines',
    website: 'https://www.bdo.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&q=80&w=200',
    buildingImageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&q=80&w=800',
    employeeCount: '38,000+',
    annualRevenue: '₱320B+',
    description: 'The largest bank in the Philippines in terms of assets, capital, deposits, and branch network, delivering full-service universal banking.',
    contactCount: 4,
    createdAt: '2026-01-10T08:00:00Z',
    stockTicker: 'BDO.PH',
    marketCap: '₱680 Billion',
    headquartersAddress: 'BDO Corporate Center, 7899 Makati Ave, Makati City, Philippines',
    yearFounded: 1968,
    techStack: ['SAP S/4HANA', 'Oracle Exadata', 'AWS Cloud', 'Microsoft Azure AI', 'Delca Cloud ERP'],
    regulatoryBody: 'Bangko Sentral ng Pilipinas (BSP), SEC, NPC',
    keySubsidiaries: ['BDO Capital & Investment Corp', 'BDO Private Bank', 'BDO Network Bank'],
    esgRating: 'AA - ESG Leader (S&P Global 2025)',
    rndBudget: '₱5.2B Annual Digital Transformation',
    missionVision: 'To be the preferred bank in every market we serve by delivering innovative financial products and empowering national development.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/bdo-unibank',
      twitter: 'https://x.com/BDOUnibank',
      facebook: 'https://www.facebook.com/BDOUnibank',
      youtube: 'https://www.youtube.com/user/BDOUnibankOfficial',
      investorRelations: 'https://www.bdo.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-002',
    name: 'Metrobank',
    industry: 'Banking & Financial Services',
    city: 'Makati City',
    country: 'Philippines',
    website: 'https://www.metrobank.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=200',
    buildingImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    employeeCount: '14,000+',
    annualRevenue: '₱140B+',
    description: 'One of the premier financial conglomerates in the Philippines offering commercial, corporate, and investment banking services.',
    contactCount: 4,
    createdAt: '2026-01-12T08:00:00Z',
    stockTicker: 'MBT.PH',
    marketCap: '₱290 Billion',
    headquartersAddress: 'Metrobank Plaza, Sen. Gil J. Puyat Ave, Makati City, Philippines',
    yearFounded: 1962,
    techStack: ['Finacle Core Banking', 'IBM Mainframe', 'Salesforce Financial Services Cloud', 'AWS'],
    regulatoryBody: 'Bangko Sentral ng Pilipinas (BSP), SEC',
    keySubsidiaries: ['First Metro Investment Corp', 'PSBank', 'Metrobank Card Corporation'],
    esgRating: 'A - Strong ESG Commitment',
    rndBudget: '₱3.8B Annual IT Investment',
    missionVision: 'To keep you in good hands by providing trusted financial stewardship and sustainable wealth creation.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/metrobank',
      twitter: 'https://x.com/Metrobank',
      facebook: 'https://www.facebook.com/Metrobank',
      youtube: 'https://www.youtube.com/c/MetrobankPH',
      investorRelations: 'https://www.metrobank.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-003',
    name: 'Security Bank Corporation',
    industry: 'Banking & Financial Services',
    city: 'Makati City',
    country: 'Philippines',
    website: 'https://www.securitybank.com',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200',
    employeeCount: '7,500+',
    annualRevenue: '₱48B+',
    description: 'A leading independent Philippine universal bank recognized for innovation in retail, wholesale, and digital banking.',
    contactCount: 4,
    createdAt: '2026-01-15T08:00:00Z',
    stockTicker: 'SECB.PH',
    marketCap: '₱95 Billion',
    headquartersAddress: 'Security Bank Centre, 6776 Ayala Ave, Makati City, Philippines',
    yearFounded: 1951,
    techStack: ['AWS Cloud', 'Snowflake Data Cloud', 'Google Cloud Platform', 'ServiceNow Enterprise'],
    regulatoryBody: 'Bangko Sentral ng Pilipinas (BSP), SEC',
    keySubsidiaries: ['SB Capital Investment Corp', 'SB Rental Corporation', 'SB Finance'],
    esgRating: 'AA - Excellence in Financial Inclusion',
    rndBudget: '₱2.5B Annual Fintech R&D',
    missionVision: 'BetterBanking through customer-centric innovation, agility, and uncompromising financial security.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/security-bank-corporation',
      twitter: 'https://x.com/SecurityBankPH',
      facebook: 'https://www.facebook.com/SecurityBank',
      youtube: 'https://www.youtube.com/user/SecurityBankPH',
      investorRelations: 'https://www.securitybank.com/investor-relations'
    }
  },
  {
    id: 'CMP-004',
    name: 'RCBC',
    industry: 'Banking & Financial Services',
    city: 'Makati City',
    country: 'Philippines',
    website: 'https://www.rcbc.com',
    logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=200',
    employeeCount: '6,800+',
    annualRevenue: '₱42B+',
    description: 'A pioneering Philippine universal bank acclaimed globally for fintech innovations and digital banking inclusion.',
    contactCount: 4,
    createdAt: '2026-01-18T08:00:00Z',
    stockTicker: 'RCB.PH',
    marketCap: '₱82 Billion',
    headquartersAddress: 'Yuchengco Centre, 6819 Ayala Ave, Makati City, Philippines',
    yearFounded: 1960,
    techStack: ['DiskarTech Microservices', 'Google Cloud Platform', 'Oracle DB', 'Kubernetes Architecture'],
    regulatoryBody: 'Bangko Sentral ng Pilipinas (BSP), SEC',
    keySubsidiaries: ['RCBC Capital Corporation', 'RCBC Leasing & Finance', 'Niyog Property Holdings'],
    esgRating: 'AA - Global Fintech Innovation Awardee',
    rndBudget: '₱2.1B Digital & AI Budget',
    missionVision: 'To lead digital financial inclusion across the nation through disruptive technology and trusted banking.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/rcbc',
      twitter: 'https://x.com/RCBCofficial',
      facebook: 'https://www.facebook.com/RCBCofficial',
      youtube: 'https://www.youtube.com/user/RCBCchannel',
      investorRelations: 'https://www.rcbc.com/investor-relations'
    }
  },
  {
    id: 'CMP-005',
    name: 'EastWest Bank',
    industry: 'Banking & Financial Services',
    city: 'Taguig City',
    country: 'Philippines',
    website: 'https://www.eastwestbanker.com',
    logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200',
    employeeCount: '6,200+',
    annualRevenue: '₱35B+',
    description: 'A fast-growing retail and consumer banking institution operating under the Filinvest Development Corporation umbrella.',
    contactCount: 4,
    createdAt: '2026-01-20T08:00:00Z',
    stockTicker: 'EW.PH',
    marketCap: '₱45 Billion',
    headquartersAddress: 'EastWest Corporate Centre, The Beaufort, 5th Ave, Bonifacio Global City, Taguig, Philippines',
    yearFounded: 1994,
    techStack: ['FIS Core Banking', 'Microsoft Dynamics 365', 'Delca Cloud ERP', 'AWS Security Stack'],
    regulatoryBody: 'Bangko Sentral ng Pilipinas (BSP), SEC',
    keySubsidiaries: ['EastWest Ageas Life Insurance', 'EastWest Rural Bank'],
    esgRating: 'A - Consumer Protection Leader',
    rndBudget: '₱1.8B Consumer Tech Modernization',
    missionVision: 'To provide seamless consumer banking and create lasting financial prosperity for every Filipino household.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/eastwest-bank',
      twitter: 'https://x.com/EastWestBanker',
      facebook: 'https://www.facebook.com/EastWestBanker',
      youtube: 'https://www.youtube.com/user/EastWestBanker',
      investorRelations: 'https://www.eastwestbanker.com/investor-relations'
    }
  },
  {
    id: 'CMP-006',
    name: 'Ayala Land',
    industry: 'Property Development',
    city: 'Makati City',
    country: 'Philippines',
    website: 'https://www.ayalaland.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
    employeeCount: '5,500+',
    annualRevenue: '₱150B+',
    description: 'The Philippines largest, most diversified property developer creating sustainable master-planned estates, malls, and offices.',
    contactCount: 4,
    createdAt: '2026-01-22T08:00:00Z',
    stockTicker: 'ALI.PH',
    marketCap: '₱480 Billion',
    headquartersAddress: 'Tower One & Exchange Plaza, Ayala Triangle, Makati City, Philippines',
    yearFounded: 1988,
    techStack: ['SAP S/4HANA Enterprise', 'Building Management Systems (BMS IoT)', 'Salesforce CRM', 'Autodesk BIM'],
    regulatoryBody: 'Securities and Exchange Commission (SEC), DHSUD',
    keySubsidiaries: ['Ayala Land Malls', 'Avida Land', 'Amaia Land', 'Alveo Land', 'AREIT Inc.'],
    esgRating: 'AAA - World Leader in Sustainable Estates',
    rndBudget: '₱4.0B Smart Cities & Tech Infrastructure',
    missionVision: 'Enhancing land and enriching lives for more Filipinos through sustainable, master-planned developments.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/ayala-land-inc-',
      twitter: 'https://x.com/AyalaLand',
      facebook: 'https://www.facebook.com/officialayalaland',
      youtube: 'https://www.youtube.com/user/AyalaLandInc',
      investorRelations: 'https://www.ayalaland.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-007',
    name: 'Megaworld Corporation',
    industry: 'Property Development',
    city: 'Taguig City',
    country: 'Philippines',
    website: 'https://www.megaworldcorp.com',
    logoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200',
    employeeCount: '4,200+',
    annualRevenue: '₱65B+',
    description: 'The country premier developer of integrated urban townships and premier office spaces for global technology BPOs.',
    contactCount: 4,
    createdAt: '2026-01-25T08:00:00Z',
    stockTicker: 'MEG.PH',
    marketCap: '₱88 Billion',
    headquartersAddress: 'Alliance Global Tower, 36th Street, Uptown Bonifacio, Taguig City, Philippines',
    yearFounded: 1989,
    techStack: ['Oracle Cloud ERP', 'Honeywell Smart Building Automation', 'Microsoft Azure', 'Delca EIRMS'],
    regulatoryBody: 'Securities and Exchange Commission (SEC), PEZA',
    keySubsidiaries: ['Suntrust Properties', 'Empire East Land Holdings', 'Global-Estate Resorts Inc.'],
    esgRating: 'AA - Green Building Council Gold Certified',
    rndBudget: '₱1.9B Township IoT Infrastructure',
    missionVision: 'Building Live-Work-Play-Learn townships that transform communities and elevate Philippine urban living.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/megaworld-corporation',
      twitter: 'https://x.com/Megaworld_Corp',
      facebook: 'https://www.facebook.com/megaworldcorp',
      youtube: 'https://www.youtube.com/c/MegaworldCorporationOfficial',
      investorRelations: 'https://www.megaworldcorp.com/investor-relations'
    }
  },
  {
    id: 'CMP-008',
    name: 'Robinsons Land Corporation',
    industry: 'Property Development',
    city: 'Quezon City',
    country: 'Philippines',
    website: 'https://www.robinsonsland.com',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200',
    employeeCount: '3,800+',
    annualRevenue: '₱42B+',
    description: 'One of the top property developers in the Philippines with extensive mall, office, logistics, and hotel portfolios.',
    contactCount: 4,
    createdAt: '2026-01-28T08:00:00Z',
    stockTicker: 'RLC.PH',
    marketCap: '₱72 Billion',
    headquartersAddress: 'Robinsons Galleria Corporate Center, EDSA corner Ortigas Ave, Quezon City, Philippines',
    yearFounded: 1980,
    techStack: ['SAP S/4HANA', 'Microsoft Azure Cloud', 'Workday HCM', 'Yardi Property Management'],
    regulatoryBody: 'Securities and Exchange Commission (SEC), DHSUD',
    keySubsidiaries: ['Robinsons Malls', 'RLC Residences', 'RLC Logistics', 'RL Commercial REIT'],
    esgRating: 'A - Top Solar-Powered Mall Operator',
    rndBudget: '₱1.4B Smart Energy & Retail Analytics',
    missionVision: 'To enrich lives by creating vibrant real estate communities and world-class commercial destinations.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/robinsons-land-corporation',
      twitter: 'https://x.com/RobinsonsLand',
      facebook: 'https://www.facebook.com/RobinsonsLandCorp',
      youtube: 'https://www.youtube.com/user/RobinsonsLandCorp',
      investorRelations: 'https://www.robinsonsland.com/investor-relations'
    }
  },
  {
    id: 'CMP-009',
    name: 'SM Prime Holdings',
    industry: 'Property Development',
    city: 'Pasay City',
    country: 'Philippines',
    website: 'https://www.smprime.com',
    logoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=200',
    employeeCount: '11,000+',
    annualRevenue: '₱128B+',
    description: 'One of the largest integrated property developers in Southeast Asia operating 85+ malls, residential towers, and commercial hubs.',
    contactCount: 4,
    createdAt: '2026-02-01T08:00:00Z',
    stockTicker: 'SMPH.PH',
    marketCap: '₱920 Billion',
    headquartersAddress: 'SM Innovation Center, Mall of Asia Complex, Pasay City, Philippines',
    yearFounded: 1994,
    techStack: ['SAP S/4HANA Cloud', 'AWS Enterprise Data Lake', 'Oracle Exadata', 'Delca Retail ERP'],
    regulatoryBody: 'Securities and Exchange Commission (SEC)',
    keySubsidiaries: ['SM Supermalls', 'SM Development Corporation (SMDC)', 'SM Hotels & Conventions'],
    esgRating: 'AAA - Southeast Asia Commercial Benchmark',
    rndBudget: '₱4.8B Digital & Energy Automation',
    missionVision: 'Catalyzing sustainable growth and serving millions of customers through world-class property ecosystems.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/sm-prime-holdings-inc-',
      twitter: 'https://x.com/smsupermalls',
      facebook: 'https://www.facebook.com/SMPrimeHoldings',
      youtube: 'https://www.youtube.com/c/SMSupermallsOfficial',
      investorRelations: 'https://www.smprime.com/investor-relations'
    }
  },
  {
    id: 'CMP-010',
    name: 'San Miguel Corporation',
    industry: 'Manufacturing & Industrial',
    city: 'Mandaluyong City',
    country: 'Philippines',
    website: 'https://www.sanmiguel.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200',
    employeeCount: '50,000+',
    annualRevenue: '₱1.4T+',
    description: 'The Philippines largest food, beverage, infrastructure, and energy conglomerate driving nationwide industrial growth.',
    contactCount: 4,
    createdAt: '2026-02-03T08:00:00Z',
    stockTicker: 'SMC.PH',
    marketCap: '₱310 Billion',
    headquartersAddress: '40 San Miguel Avenue, Mandaluyong City, Philippines',
    yearFounded: 1890,
    techStack: ['SAP S/4HANA Enterprise Suite', 'Oracle Cloud ERP', 'Microsoft Azure AI', 'Siemens SCADA IoT'],
    regulatoryBody: 'Securities and Exchange Commission (SEC), DOE, DPWH',
    keySubsidiaries: ['San Miguel Food and Beverage', 'SMC Global Power', 'SMC Infrastructure', 'Petron Corporation'],
    esgRating: 'AA - Sovereign Infrastructure Driver',
    rndBudget: '₱8.5B Infrastructure & Clean Energy Tech',
    missionVision: 'Making everyday life better for every Filipino through sustainable food, infrastructure, energy, and innovation.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/san-miguel-corporation',
      twitter: 'https://x.com/SanMiguelCorp',
      facebook: 'https://www.facebook.com/sanmiguelcorporation',
      youtube: 'https://www.youtube.com/user/SanMiguelCorpOfficial',
      investorRelations: 'https://www.sanmiguel.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-011',
    name: 'Universal Robina Corporation',
    industry: 'Manufacturing & Industrial',
    city: 'Quezon City',
    country: 'Philippines',
    website: 'https://www.urc.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200',
    employeeCount: '14,000+',
    annualRevenue: '₱158B+',
    description: 'One of the largest branded food and beverage product companies in the Philippines and ASEAN region.',
    contactCount: 4,
    createdAt: '2026-02-05T08:00:00Z',
    stockTicker: 'URC.PH',
    marketCap: '₱240 Billion',
    headquartersAddress: 'PPC Building, 8 Eulogio Rodriguez Jr. Ave, Bagong Ilog, Pasig City, Philippines',
    yearFounded: 1954,
    techStack: ['SAP S/4HANA', 'Manhattan Associates WMS', 'AWS Enterprise Cloud', 'Delca SupplyChain Cloud'],
    regulatoryBody: 'FDA Philippines, SEC, DTI',
    keySubsidiaries: ['URC Agro-Industrial', 'URC Flour', 'URC Packaging Division'],
    esgRating: 'AA - Sustainable Packaging Leader',
    rndBudget: '₱2.8B ASEAN Supply Chain Tech',
    missionVision: 'Delivering delightful consumer snacks and beverages while powering regional agricultural sustainability.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/universal-robina-corporation',
      twitter: 'https://x.com/URC_PH',
      facebook: 'https://www.facebook.com/URCOfficial',
      youtube: 'https://www.youtube.com/user/URCchannel',
      investorRelations: 'https://www.urc.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-012',
    name: 'Monde Nissin',
    industry: 'Manufacturing & Industrial',
    city: 'Pasig City',
    country: 'Philippines',
    website: 'https://www.mondenissin.com',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200',
    employeeCount: '4,000+',
    annualRevenue: '₱80B+',
    description: 'A global Philippine food company holding market leadership in instant noodles, biscuits, and meat alternatives.',
    contactCount: 4,
    createdAt: '2026-02-08T08:00:00Z',
    stockTicker: 'MONDE.PH',
    marketCap: '₱185 Billion',
    headquartersAddress: 'Felix Ave, Cainta, Rizal / Pasig City, Philippines',
    yearFounded: 1979,
    techStack: ['SAP S/4HANA Cloud', 'Microsoft Azure', 'Delca FoodTech Suite', 'PowerBI Analytics'],
    regulatoryBody: 'FDA Philippines, SEC',
    keySubsidiaries: ['Monde M.Y. San', 'Quorn Foods UK', 'Monde Nissin Singapore'],
    esgRating: 'AAA - Alternative Protein Pioneer',
    rndBudget: '₱3.2B Global R&D & Automation',
    missionVision: 'Improving the well-being of people and the planet through sustainable, high-quality food solutions.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/monde-nissin-corporation',
      twitter: 'https://x.com/MondeNissinCorp',
      facebook: 'https://www.facebook.com/MondeNissinOfficial',
      youtube: 'https://www.youtube.com/user/MondeNissinPH',
      investorRelations: 'https://www.mondenissin.com/investor-relations'
    }
  },
  {
    id: 'CMP-013',
    name: 'Holcim Philippines',
    industry: 'Manufacturing & Industrial',
    city: 'Taguig City',
    country: 'Philippines',
    website: 'https://www.holcim.ph',
    logoUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=200',
    employeeCount: '1,800+',
    annualRevenue: '₱26B+',
    description: 'A leading building solutions provider delivering innovative cement and concrete products for infrastructure.',
    contactCount: 4,
    createdAt: '2026-02-10T08:00:00Z',
    stockTicker: 'HLCM.PH',
    marketCap: '₱38 Billion',
    headquartersAddress: '7th Floor, Venice Corporate Centre, Florence Way, McKinley Hill, Taguig City, Philippines',
    yearFounded: 1964,
    techStack: ['SAP ERP', 'Plants SCADA IoT', 'Telematics Fleet Gateway', 'Oracle Cloud'],
    regulatoryBody: 'DTI-BPS, SEC, DENR-EMB',
    keySubsidiaries: ['Holcim Mining Resources', 'Holcim Agritech'],
    esgRating: 'AAA - EcoPlanet Eco-Friendly Concrete Pioneer',
    rndBudget: '₱1.1B Green Building Materials Tech',
    missionVision: 'Building progress for people and the planet through eco-friendly, circular construction materials.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/holcim-philippines',
      twitter: 'https://x.com/HolcimPH',
      facebook: 'https://www.facebook.com/HolcimPhilippines',
      youtube: 'https://www.youtube.com/user/HolcimPH',
      investorRelations: 'https://www.holcim.ph/investor-relations'
    }
  },
  {
    id: 'CMP-014',
    name: 'Jollibee Foods Corporation',
    industry: 'Distribution & Logistics',
    city: 'Pasig City',
    country: 'Philippines',
    website: 'https://www.jollibee.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200',
    employeeCount: '45,000+',
    annualRevenue: '₱240B+',
    description: 'One of the world fast-growing restaurant companies operating over 6,500 stores across 34 countries.',
    contactCount: 4,
    createdAt: '2026-02-12T08:00:00Z',
    stockTicker: 'JFC.PH',
    marketCap: '₱280 Billion',
    headquartersAddress: 'Jollibee Plaza, F. Ortigas Jr. Road, Ortigas Center, Pasig City, Philippines',
    yearFounded: 1978,
    techStack: ['Oracle Cloud ERP', 'AWS Global Cloud Mesh', 'Manhattan WMS', 'Delca Omnichannel POS'],
    regulatoryBody: 'FDA, SEC, DTI',
    keySubsidiaries: ['Chowking', 'Greenwich', 'Red Ribbon', 'Mang Inasal', 'Smashburger', 'Coffee Bean & Tea Leaf'],
    esgRating: 'AA - Global Restaurant Group Leader',
    rndBudget: '₱3.6B Global Digital & Store POS R&D',
    missionVision: 'Spreading the joy of eating across the globe with great-tasting food and warm hospitality.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/jollibee-foods-corporation',
      twitter: 'https://x.com/Jollibee',
      facebook: 'https://www.facebook.com/JollibeePhilippines',
      youtube: 'https://www.youtube.com/user/jollibeedigital1',
      investorRelations: 'https://www.jollibee.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-015',
    name: 'Sun Life Philippines',
    industry: 'Financial Services & Insurance',
    city: 'Taguig City',
    country: 'Philippines',
    website: 'https://www.sunlife.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=200',
    employeeCount: '2,500+',
    annualRevenue: '₱50B+',
    description: 'The first and longest-standing life insurance provider in the Philippines, leading in total premium income.',
    contactCount: 4,
    createdAt: '2026-02-15T08:00:00Z',
    stockTicker: 'SLF.TO (Global Parent)',
    marketCap: '$38 Billion CAD',
    headquartersAddress: 'Sun Life Centre, 5th Ave corner 28th St, Bonifacio Global City, Taguig, Philippines',
    yearFounded: 1895,
    techStack: ['Salesforce Financial Cloud', 'Microsoft Azure', 'IFRS 17 Actuarial Suite', 'Delca InsurTech'],
    regulatoryBody: 'Insurance Commission (IC), SEC',
    keySubsidiaries: ['Sun Life Asset Management (SLAMCI)', 'Sun Life Grepa Financial'],
    esgRating: 'AAA - Financial Freedom Benchmark',
    rndBudget: '₱2.2B InsurTech & Advisor Cloud',
    missionVision: 'Helping Filipinos achieve lifetime financial security and live healthier lives.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/sun-life-financial-philippines',
      twitter: 'https://x.com/SunLifePH',
      facebook: 'https://www.facebook.com/sunlifeph',
      youtube: 'https://www.youtube.com/user/sunlifeph',
      investorRelations: 'https://www.sunlife.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-016',
    name: 'Manulife Philippines',
    industry: 'Financial Services & Insurance',
    city: 'Makati City',
    country: 'Philippines',
    website: 'https://www.manulife.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200',
    employeeCount: '2,000+',
    annualRevenue: '₱32B+',
    description: 'A subsidiary of Manulife Financial Corporation offering life insurance, wealth management, and retirement solutions.',
    contactCount: 4,
    createdAt: '2026-02-18T08:00:00Z',
    stockTicker: 'MFC.TO (Global Parent)',
    marketCap: '$45 Billion CAD',
    headquartersAddress: 'NEX Tower, 6786 Ayala Ave, Makati City, Philippines',
    yearFounded: 1907,
    techStack: ['AWS Cloud Infrastructure', 'Snowflake Analytics', 'Workday', 'Delca Wealth Platform'],
    regulatoryBody: 'Insurance Commission (IC), SEC',
    keySubsidiaries: ['Manulife Asset Management Trust Corp', 'Manulife China Bank Life'],
    esgRating: 'AA - Global Wealth & Health Leader',
    rndBudget: '₱1.9B Advisor Digital Tools',
    missionVision: 'Decisions made easier, lives made better through digital wealth and life protection solutions.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/manulife-philippines',
      twitter: 'https://x.com/ManulifePH',
      facebook: 'https://www.facebook.com/ManulifePH',
      youtube: 'https://www.youtube.com/user/ManulifePH',
      investorRelations: 'https://www.manulife.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-017',
    name: 'Pru Life UK Philippines',
    industry: 'Financial Services & Insurance',
    city: 'Taguig City',
    country: 'Philippines',
    website: 'https://www.prulifeuk.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200',
    employeeCount: '2,200+',
    annualRevenue: '₱45B+',
    description: 'A leading life insurance company in the Philippines pioneering unit-linked investment plans and health solutions.',
    contactCount: 4,
    createdAt: '2026-02-20T08:00:00Z',
    stockTicker: 'PRU.L (Global Parent)',
    marketCap: '£22 Billion GBP',
    headquartersAddress: 'Uptown Tower 2, 36th Street, Uptown Bonifacio, Taguig City, Philippines',
    yearFounded: 1996,
    techStack: ['Pulse App AI Health Engine', 'AWS Microservices', 'Salesforce CRM', 'Delca Policy Cloud'],
    regulatoryBody: 'Insurance Commission (IC), SEC',
    keySubsidiaries: ['Pru Life UK Investments', 'Prudential Corporation Asia'],
    esgRating: 'AAA - Health AI App & Inclusion Innovator',
    rndBudget: '₱2.4B Digital Health & Unit-Linked R&D',
    missionVision: 'To help people get the most out of life by protecting health and accelerating wealth accumulation.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/pru-life-uk',
      twitter: 'https://x.com/PruLifeUK',
      facebook: 'https://www.facebook.com/prulifeukph',
      youtube: 'https://www.youtube.com/user/PruLifeUKOfficial',
      investorRelations: 'https://www.prulifeuk.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-018',
    name: 'Fast Distribution Corporation',
    industry: 'Distribution & Logistics',
    city: 'Taguig City',
    country: 'Philippines',
    website: 'https://www.fast.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200',
    employeeCount: '12,000+',
    annualRevenue: '₱20B+',
    description: 'The Philippines largest end-to-end logistics and FMCG distribution network serving top global brands.',
    contactCount: 4,
    createdAt: '2026-02-22T08:00:00Z',
    stockTicker: 'Private Enterprise',
    marketCap: 'Estimated ₱45 Billion Valuation',
    headquartersAddress: 'Fast Logistics Hub, C5 Road, Taguig City, Philippines',
    yearFounded: 1973,
    techStack: ['Honeywell Warehouse Management', 'Fleet Telematics GPS', 'Delca Logistics ERP', 'Oracle Cloud'],
    regulatoryBody: 'LTFRB, DTI, SEC',
    keySubsidiaries: ['Fast Cargo Logistics', 'Fast Services Corporation', 'Fast Cold Chain'],
    esgRating: 'AA - Cold Chain Green Fleet Pioneer',
    rndBudget: '₱1.5B Fleet Telematics & Automation',
    missionVision: 'Connecting supply chains across the archipelago with velocity, reliability, and tech innovation.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/fast-logistics-group',
      twitter: 'https://x.com/FastLogisticsPH',
      facebook: 'https://www.facebook.com/FastLogisticsGroup',
      youtube: 'https://www.youtube.com/c/FastLogisticsGroup',
      investorRelations: 'https://www.fast.com.ph/investor-relations'
    }
  },
  {
    id: 'CMP-019',
    name: 'MDI Novare',
    industry: 'Technology Services',
    city: 'Taguig City',
    country: 'Philippines',
    website: 'https://www.mdi.net.ph',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200',
    employeeCount: '1,500+',
    annualRevenue: '₱8B+',
    description: 'A leading Philippine technology company specializing in cloud transformation, AI pipelines, and enterprise systems.',
    contactCount: 4,
    createdAt: '2026-02-25T08:00:00Z',
    stockTicker: 'Private Tech Vanguard',
    marketCap: 'Estimated ₱22 Billion Valuation',
    headquartersAddress: '10th Floor, EcoTower, 32nd St corner 9th Ave, BGC, Taguig City, Philippines',
    yearFounded: 1988,
    techStack: ['AWS Premier Consulting Partner', 'Google Cloud AI', 'Snowflake', 'Kubernetes', 'Delca DevSecOps'],
    regulatoryBody: 'DICT, NPC, SEC',
    keySubsidiaries: ['Novare Systems', 'MDI Cloud Labs'],
    esgRating: 'AAA - Top Enterprise Cloud Integrator',
    rndBudget: '₱1.2B AI Pipeline R&D',
    missionVision: 'Empowering Philippines leading enterprises to thrive in the digital age through cutting-edge cloud & AI.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/mdi-novare',
      twitter: 'https://x.com/MDINovare',
      facebook: 'https://www.facebook.com/MDINovare',
      youtube: 'https://www.youtube.com/c/MDINovareOfficial',
      investorRelations: 'https://www.mdi.net.ph/investor-relations'
    }
  },
  {
    id: 'CMP-020',
    name: 'Iontech Technologies',
    industry: 'Technology Services',
    city: 'Quezon City',
    country: 'Philippines',
    website: 'https://www.iontech.com.ph',
    logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200',
    employeeCount: '800+',
    annualRevenue: '₱6B+',
    description: 'Premier distributor of enterprise hardware, cloud infrastructure, networking equipment, and cybersecurity systems.',
    contactCount: 4,
    createdAt: '2026-02-28T08:00:00Z',
    stockTicker: 'Private Enterprise',
    marketCap: 'Estimated ₱12 Billion Valuation',
    headquartersAddress: 'Iontech Building, 150 Quezon Avenue, Quezon City, Philippines',
    yearFounded: 1998,
    techStack: ['Cisco Enterprise Systems', 'Dell Technologies', 'HPE Aruba', 'Delca Hardware Portal'],
    regulatoryBody: 'NTC, SEC, DTI',
    keySubsidiaries: ['Iontech Distribution', 'Iontech CyberShield'],
    esgRating: 'A - Enterprise Hardware Supply Pioneer',
    rndBudget: '₱800M Reseller Automation Portal',
    missionVision: 'Bridging world-class IT hardware & cloud infrastructure to businesses across the Philippines.',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/iontech-technologies-inc-',
      twitter: 'https://x.com/IontechPH',
      facebook: 'https://www.facebook.com/IontechPH',
      youtube: 'https://www.youtube.com/user/IontechPH',
      investorRelations: 'https://www.iontech.com.ph/investor-relations'
    }
  }
];

// Helper raw data definition for executives across 20 companies
const RAW_ROSTER = [
  // BDO Unibank (CMP-001)
  { company: 'BDO Unibank', companyId: 'CMP-001', name: 'Nestor V. Tan', pos: 'President & CEO', dept: 'Executive Management', email: 'nestor.tan@bdo.com.ph', phone: '+63 2 8840 7000', stage: 'Active Client', source: 'Direct Outreach', value: 750000, oppTitle: 'Enterprise Core Banking Migration to DELCA Cloud', tags: ['VIP Executive', 'Banking Leader', 'Core Banking'] },
  { company: 'BDO Unibank', companyId: 'CMP-001', name: 'Dennis B. Tangonan', pos: 'Executive Vice President & CIO', dept: 'Information Technology', email: 'd.tangonan@bdo.com.ph', phone: '+63 2 8840 7010', stage: 'Proposal Sent', source: 'Referral', value: 480000, oppTitle: 'Cloud ERP & Multi-Ledger Consolidation', tags: ['CIO', 'Key Decision Maker'] },
  { company: 'BDO Unibank', companyId: 'CMP-001', name: 'Maria Theresa L. Tan', pos: 'Senior Vice President & Digital Banking Head', dept: 'Digital Transformation', email: 'mt.tan@bdo.com.ph', phone: '+63 2 8840 7025', stage: 'Meeting Held', source: 'Conference', value: 320000, oppTitle: 'AI Fraud Detection & Real-Time Analytics Pipeline', tags: ['Digital Banking', 'AI Infrastructure'] },
  { company: 'BDO Unibank', companyId: 'CMP-001', name: 'Eduardo V. Francisco', pos: 'President, BDO Capital & Investment Corp', dept: 'Investment Banking', email: 'e.francisco@bdo.com.ph', phone: '+63 2 8840 7040', stage: 'Event Attendee', source: 'Networking Event', value: 250000, oppTitle: 'Capital Markets Compliance Automation', tags: ['Fintech', 'Capital Markets'] },

  // Metrobank (CMP-002)
  { company: 'Metrobank', companyId: 'CMP-002', name: 'Fabian S. Dee', pos: 'President', dept: 'Executive Leadership', email: 'fabian.dee@metrobank.com.ph', phone: '+63 2 8870 3000', stage: 'Active Client', source: 'Direct Outreach', value: 680000, oppTitle: 'Multi-Branch Enterprise ERP Automation', tags: ['VIP Executive', 'Universal Banking'] },
  { company: 'Metrobank', companyId: 'CMP-002', name: 'Richard S. So', pos: 'Executive Vice President & IT Head', dept: 'Information Technology', email: 'richard.so@metrobank.com.ph', phone: '+63 2 8870 3012', stage: 'Negotiation', source: 'LinkedIn', value: 520000, oppTitle: 'Hybrid Cloud Infrastructure Upgrade', tags: ['IT Head', 'Enterprise Tech'] },
  { company: 'Metrobank', companyId: 'CMP-002', name: 'Fernand Antonio A. Tansingco', pos: 'Chief Financial Officer', dept: 'Finance & Treasury', email: 'f.tansingco@metrobank.com.ph', phone: '+63 2 8870 3020', stage: 'Proposal Sent', source: 'Referral', value: 410000, oppTitle: 'SOX Compliance & Automated Ledger Consolidation', tags: ['CFO', 'SOX Audit'] },
  { company: 'Metrobank', companyId: 'CMP-002', name: 'Angelica S. Reyes', pos: 'VP for Digital Transformation', dept: 'Digital Architecture', email: 'angelica.reyes@metrobank.com.ph', phone: '+63 2 8870 3033', stage: 'Invited', source: 'Webinar', value: 180000, oppTitle: 'Omnichannel API Gateway Modernization', tags: ['Digital Transformation'] },

  // Security Bank (CMP-003)
  { company: 'Security Bank Corporation', companyId: 'CMP-003', name: 'Sanjiv Vohra', pos: 'President & CEO', dept: 'Executive Management', email: 'svohra@securitybank.com.ph', phone: '+63 2 8888 7800', stage: 'Partnership', source: 'Direct Outreach', value: 850000, oppTitle: 'Strategic Digital Banking & Cloud Partnership', tags: ['CEO', 'Partnership'] },
  { company: 'Security Bank Corporation', companyId: 'CMP-003', name: 'Lucose T. Eralil', pos: 'Executive Vice President & COO', dept: 'Operations & Systems', email: 'leralil@securitybank.com.ph', phone: '+63 2 8888 7815', stage: 'Active Client', source: 'Conference', value: 600000, oppTitle: 'Core Operations Automated Workflow Platform', tags: ['COO', 'Operations Tech'] },
  { company: 'Security Bank Corporation', companyId: 'CMP-003', name: 'Rahul Rasal', pos: 'EVP & Retail Banking Head', dept: 'Retail Banking', email: 'rrasal@securitybank.com.ph', phone: '+63 2 8888 7822', stage: 'Meeting Held', source: 'Networking Event', value: 290000, oppTitle: 'Retail CRM & Customer Journey Analytics', tags: ['Retail Banking', 'CRM'] },
  { company: 'Security Bank Corporation', companyId: 'CMP-003', name: 'Stephen Tan', pos: 'Chief Technology Officer', dept: 'Technology & Cloud', email: 'stan@securitybank.com.ph', phone: '+63 2 8888 7830', stage: 'Proposal Sent', source: 'LinkedIn', value: 450000, oppTitle: 'Zero-Trust Cloud Security Infrastructure', tags: ['CTO', 'Cybersecurity'] },

  // RCBC (CMP-004)
  { company: 'RCBC', companyId: 'CMP-004', name: 'Eugene S. Acevedo', pos: 'President & CEO', dept: 'Executive Management', email: 'eacevedo@rcbc.com', phone: '+63 2 8894 9000', stage: 'Active Client', source: 'Direct Outreach', value: 720000, oppTitle: 'Digital Inclusion & ERP Backend Modernization', tags: ['CEO', 'Fintech Leader'] },
  { company: 'RCBC', companyId: 'CMP-004', name: 'Lito Villanueva', pos: 'EVP & Chief Innovation Officer', dept: 'Digital Innovations', email: 'mvillanueva@rcbc.com', phone: '+63 2 8894 9015', stage: 'Partnership', source: 'Conference', value: 550000, oppTitle: 'DiskarTech AI Integration & Financial Inclusion', tags: ['Innovation Leader', 'DiskarTech'] },
  { company: 'RCBC', companyId: 'CMP-004', name: 'Redentor C. Gabante', pos: 'Senior Vice President & CIO', dept: 'Information Technology', email: 'rgabante@rcbc.com', phone: '+63 2 8894 9028', stage: 'Negotiation', source: 'Referral', value: 430000, oppTitle: 'Cloud Data Warehouse & High-Speed Query Engine', tags: ['CIO', 'Cloud Analytics'] },
  { company: 'RCBC', companyId: 'CMP-004', name: 'Ma. Cristina V. Alvarez', pos: 'SVP & Corporate Planning Head', dept: 'Strategic Planning', email: 'calvarez@rcbc.com', phone: '+63 2 8894 9040', stage: 'Meeting Held', source: 'Company Website', value: 210000, oppTitle: 'Enterprise Resource Planning & Cost Analytics', tags: ['Corporate Strategy'] },

  // EastWest Bank (CMP-005)
  { company: 'EastWest Bank', companyId: 'CMP-005', name: 'Jerry G. Ngo', pos: 'Chief Executive Officer', dept: 'Executive Leadership', email: 'jngo@eastwestbanker.com', phone: '+63 2 8888 1700', stage: 'Qualified Lead', source: 'Direct Outreach', value: 490000, oppTitle: 'Consumer Lending Platform ERP Integration', tags: ['CEO', 'Consumer Banking'] },
  { company: 'EastWest Bank', companyId: 'CMP-005', name: 'Jacqueline S. Fernandez', pos: 'President & COO', dept: 'Operations & Business', email: 'jfernandez@eastwestbanker.com', phone: '+63 2 8888 1712', stage: 'Meeting Held', source: 'Referral', value: 380000, oppTitle: 'Loan Processing Automated Pipeline', tags: ['COO', 'Operations'] },
  { company: 'EastWest Bank', companyId: 'CMP-005', name: 'Jose Maria S. Jurado', pos: 'Executive Vice President & IT Head', dept: 'Information Technology', email: 'jjurado@eastwestbanker.com', phone: '+63 2 8888 1725', stage: 'Proposal Sent', source: 'LinkedIn', value: 310000, oppTitle: 'Branch Network Cloud Server Migration', tags: ['IT Head', 'Cloud Migration'] },
  { company: 'EastWest Bank', companyId: 'CMP-005', name: 'Isabelita M. Papa', pos: 'VP for Operations & Digital Channels', dept: 'Digital Channels', email: 'ipapa@eastwestbanker.com', phone: '+63 2 8888 1733', stage: 'Event Attendee', source: 'Webinar', value: 160000, oppTitle: 'Mobile Banking Backend Performance Optimizer', tags: ['Digital Channels'] },

  // Ayala Land (CMP-006)
  { company: 'Ayala Land', companyId: 'CMP-006', name: 'Anna Ma. Margarita B. Dy', pos: 'President & CEO', dept: 'Executive Management', email: 'dy.margarita@ayalaland.com.ph', phone: '+63 2 7908 3000', stage: 'Active Client', source: 'Direct Outreach', value: 920000, oppTitle: 'Smart Estate IoT & Commercial Property ERP', tags: ['VIP Executive', 'Property Developer'] },
  { company: 'Ayala Land', companyId: 'CMP-006', name: 'Augusto D. Bengzon', pos: 'Chief Financial Officer & Treasurer', dept: 'Finance & Treasury', email: 'bengzon.augusto@ayalaland.com.ph', phone: '+63 2 7908 3015', stage: 'Proposal Sent', source: 'Referral', value: 580000, oppTitle: 'Real Estate Multi-Asset Treasury Consolidation', tags: ['CFO', 'Treasury ERP'] },
  { company: 'Ayala Land', companyId: 'CMP-006', name: 'Isabel D. Sagun', pos: 'VP & Chief HR Officer', dept: 'Human Capital', email: 'sagun.isabel@ayalaland.com.ph', phone: '+63 2 7908 3028', stage: 'Event Attendee', source: 'Networking Event', value: 220000, oppTitle: 'Enterprise Workforce Management & HCM Cloud', tags: ['HR Executive', 'HCM'] },
  { company: 'Ayala Land', companyId: 'CMP-006', name: 'Roderick A. Santos', pos: 'VP for IT & Smart Estate Systems', dept: 'Smart Infrastructure', email: 'santos.roderick@ayalaland.com.ph', phone: '+63 2 7908 3042', stage: 'Negotiation', source: 'Conference', value: 460000, oppTitle: 'BMS Building Management IoT Gateway', tags: ['Smart Cities', 'IoT'] },

  // Megaworld Corporation (CMP-007)
  { company: 'Megaworld Corporation', companyId: 'CMP-007', name: 'Lourdes T. Gutierrez-Alfonso', pos: 'President', dept: 'Executive Leadership', email: 'lgutierrez@megaworldcorp.com', phone: '+63 2 8894 6300', stage: 'Proposal Sent', source: 'Direct Outreach', value: 640000, oppTitle: 'Township Infrastructure ERP Integration', tags: ['Townships', 'Property'] },
  { company: 'Megaworld Corporation', companyId: 'CMP-007', name: 'Kevin L. Tan', pos: 'CEO, Alliance Global Group', dept: 'Group Executive Board', email: 'ktan@allianceglobal.com.ph', phone: '+63 2 8894 6310', stage: 'Meeting Held', source: 'Referral', value: 800000, oppTitle: 'Conglomerate-Wide Digital Synergy Platform', tags: ['VIP Executive', 'Conglomerate'] },
  { company: 'Megaworld Corporation', companyId: 'CMP-007', name: 'Francisco C. Canuto', pos: 'Senior Vice President & Treasurer', dept: 'Finance & Treasury', email: 'fcanuto@megaworldcorp.com', phone: '+63 2 8894 6325', stage: 'Qualified Lead', source: 'Company Website', value: 340000, oppTitle: 'Commercial Leasing Revenue Accounting System', tags: ['SVP', 'Finance'] },
  { company: 'Megaworld Corporation', companyId: 'CMP-007', name: 'Raymundo Melendres', pos: 'VP for Operations & Digital Infra', dept: 'Digital Operations', email: 'rmelendres@megaworldcorp.com', phone: '+63 2 8894 6338', stage: 'In Discussion', source: 'LinkedIn', value: 280000, oppTitle: 'BPO Office Building Automated Tenant Portal', tags: ['Operations', 'BPO Estate'] },

  // Robinsons Land Corporation (CMP-008)
  { company: 'Robinsons Land Corporation', companyId: 'CMP-008', name: 'Lance Y. Gokongwei', pos: 'Chairman', dept: 'Executive Board', email: 'lance.gokongwei@jgsummit.ph', phone: '+63 2 8395 2000', stage: 'Active Client', source: 'Direct Outreach', value: 950000, oppTitle: 'JG Summit Group ERP Modernization & Analytics', tags: ['Chairman', 'Conglomerate Leader'] },
  { company: 'Robinsons Land Corporation', companyId: 'CMP-008', name: 'Myron Frederick Y. Yao', pos: 'SVP & Business Unit General Manager', dept: 'Commercial Centers', email: 'myron.yao@robinsonsland.com', phone: '+63 2 8395 2012', stage: 'Negotiation', source: 'Referral', value: 470000, oppTitle: 'Robinsons Malls Foot-Traffic & Retail ERP', tags: ['Retail Malls', 'SVP'] },
  { company: 'Robinsons Land Corporation', companyId: 'CMP-008', name: 'Faraday D. Go', pos: 'Executive Vice President', dept: 'Residential & Hospitality', email: 'faraday.go@robinsonsland.com', phone: '+63 2 8395 2025', stage: 'Proposal Sent', source: 'Conference', value: 390000, oppTitle: 'Residential Property Tenant ERP Cloud', tags: ['EVP', 'Property'] },
  { company: 'Robinsons Land Corporation', companyId: 'CMP-008', name: 'Maria Teresa R. Zapanta', pos: 'VP for Enterprise IT & ERP Strategy', dept: 'Information Technology', email: 'teresa.zapanta@robinsonsland.com', phone: '+63 2 8395 2040', stage: 'In Discussion', source: 'LinkedIn', value: 320000, oppTitle: 'Multi-Asset SAP to DELCA ERP Migration', tags: ['ERP Strategy', 'IT VP'] },

  // SM Prime Holdings (CMP-009)
  { company: 'SM Prime Holdings', companyId: 'CMP-009', name: 'Jeffrey C. Lim', pos: 'President', dept: 'Executive Management', email: 'jeffrey.lim@smprime.com', phone: '+63 2 8831 1000', stage: 'Active Client', source: 'Direct Outreach', value: 1100000, oppTitle: 'SM Supermalls Enterprise IoT & Cloud Infrastructure', tags: ['VIP Executive', 'SM Group'] },
  { company: 'SM Prime Holdings', companyId: 'CMP-009', name: 'John Nai Peng C. Ong', pos: 'Chief Finance Officer', dept: 'Finance & Accounts', email: 'john.ong@smprime.com', phone: '+63 2 8831 1020', stage: 'Negotiation', source: 'Referral', value: 650000, oppTitle: 'Real Estate Portfolio Consolidated Financial Cloud', tags: ['CFO', 'Finance'] },
  { company: 'SM Prime Holdings', companyId: 'CMP-009', name: 'Steven T. Tan', pos: 'President, SM Supermalls', dept: 'Retail Malls Division', email: 'steven.tan@smsupermalls.com', phone: '+63 2 8831 1035', stage: 'Partnership', source: 'Conference', value: 720000, oppTitle: 'Tenant Revenue Sharing Real-Time POS Cloud Integration', tags: ['SM Malls', 'Retail'] },
  { company: 'SM Prime Holdings', companyId: 'CMP-009', name: 'Manuel A. Banson', pos: 'VP for Digital Transformation', dept: 'Technology Innovations', email: 'manuel.banson@smprime.com', phone: '+63 2 8831 1050', stage: 'Meeting Held', source: 'LinkedIn', value: 380000, oppTitle: 'Commercial Center Energy Automation System', tags: ['Digital Transformation'] },

  // San Miguel Corporation (CMP-010)
  { company: 'San Miguel Corporation', companyId: 'CMP-010', name: 'Ramon S. Ang', pos: 'President & CEO', dept: 'Executive Leadership', email: 'rsa@sanmiguel.com.ph', phone: '+63 2 8632 3000', stage: 'Active Client', source: 'Direct Outreach', value: 1500000, oppTitle: 'SMC Conglomerate Mega-ERP & Infrastructure Cloud', tags: ['SMC Leader', 'Mega ERP'] },
  { company: 'San Miguel Corporation', companyId: 'CMP-010', name: 'Ferdinand K. Constantino', pos: 'Chief Finance Officer & Treasurer', dept: 'Group Finance', email: 'fconstantino@sanmiguel.com.ph', phone: '+63 2 8632 3015', stage: 'Proposal Sent', source: 'Referral', value: 820000, oppTitle: 'Multi-Entity Treasury & Sovereign Debt Management System', tags: ['CFO', 'Treasury'] },
  { company: 'San Miguel Corporation', companyId: 'CMP-010', name: 'Cecile L. Ang', pos: 'VP & Digital Innovation Lead', dept: 'Digital Ventures', email: 'cang@sanmiguel.com.ph', phone: '+63 2 8632 3030', stage: 'Meeting Held', source: 'Conference', value: 490000, oppTitle: 'SMC Food & Beverage Smart Supply Chain', tags: ['Digital Innovation'] },
  { company: 'San Miguel Corporation', companyId: 'CMP-010', name: 'Joseph N. Pineda', pos: 'SVP & ERP Program Manager', dept: 'Enterprise Systems', email: 'jpineda@sanmiguel.com.ph', phone: '+63 2 8632 3045', stage: 'Negotiation', source: 'Direct Outreach', value: 610000, oppTitle: 'Plant Operations SAP S/4HANA Modernization', tags: ['ERP Manager', 'SAP Lead'] },

  // Universal Robina Corporation (CMP-011)
  { company: 'Universal Robina Corporation', companyId: 'CMP-011', name: 'Irwin C. Lee', pos: 'President & CEO', dept: 'Executive Management', email: 'irwin.lee@urc.com.ph', phone: '+63 2 8633 7600', stage: 'Active Client', source: 'Direct Outreach', value: 780000, oppTitle: 'ASEAN FMCG Supply Chain & Distribution Suite', tags: ['CEO', 'FMCG'] },
  { company: 'Universal Robina Corporation', companyId: 'CMP-011', name: 'Pancho M. Del Mundo', pos: 'Chief Financial Officer', dept: 'Finance & Strategy', email: 'pancho.delmundo@urc.com.ph', phone: '+63 2 8633 7615', stage: 'Proposal Sent', source: 'Referral', value: 430000, oppTitle: 'Regional Multi-Currency Cost Accounting Cloud', tags: ['CFO', 'Cost Accounting'] },
  { company: 'Universal Robina Corporation', companyId: 'CMP-011', name: 'Ellison C. Dean', pos: 'SVP & Chief Supply Chain Officer', dept: 'Supply Chain Operations', email: 'ellison.dean@urc.com.ph', phone: '+63 2 8633 7630', stage: 'Negotiation', source: 'Conference', value: 540000, oppTitle: 'Automated Factory Warehouse Dispatch System', tags: ['Supply Chain', 'Warehouse'] },
  { company: 'Universal Robina Corporation', companyId: 'CMP-011', name: 'Karen T. Salgado', pos: 'VP for Enterprise Tech & Cloud', dept: 'Information Technology', email: 'karen.salgado@urc.com.ph', phone: '+63 2 8633 7642', stage: 'Meeting Held', source: 'LinkedIn', value: 310000, oppTitle: 'Cloud ERP Demand Forecasting Engine', tags: ['Enterprise Cloud'] },

  // Monde Nissin (CMP-012)
  { company: 'Monde Nissin', companyId: 'CMP-012', name: 'Henry Soesanto', pos: 'Chief Executive Officer', dept: 'Executive Leadership', email: 'hsoesanto@mondenissin.com', phone: '+63 2 8671 8000', stage: 'Active Client', source: 'Direct Outreach', value: 690000, oppTitle: 'Global Food Manufacturing ERP Modernization', tags: ['CEO', 'Global Foods'] },
  { company: 'Monde Nissin', companyId: 'CMP-012', name: 'Jesse C. Teo', pos: 'Chief Financial Officer', dept: 'Finance & Control', email: 'jteo@mondenissin.com', phone: '+63 2 8671 8015', stage: 'In Discussion', source: 'Referral', value: 370000, oppTitle: 'Export Sales Tax & Financial Ledger Consolidation', tags: ['CFO', 'Finance'] },
  { company: 'Monde Nissin', companyId: 'CMP-012', name: 'Glenn S. Reyes', pos: 'COO, Foods Division', dept: 'Plant Operations', email: 'greyes@mondenissin.com', phone: '+63 2 8671 8028', stage: 'Meeting Held', source: 'Networking Event', value: 410000, oppTitle: 'Instant Noodles Production Line IoT Sensors', tags: ['COO', 'Manufacturing'] },
  { company: 'Monde Nissin', companyId: 'CMP-012', name: 'Christine P. Santos', pos: 'Digital Transformation Director', dept: 'IT & Digital', email: 'csantos@mondenissin.com', phone: '+63 2 8671 8040', stage: 'Proposal Sent', source: 'Company Website', value: 290000, oppTitle: 'SAP S/4HANA Cloud Integration Layer', tags: ['Digital Transformation'] },

  // Holcim Philippines (CMP-013)
  { company: 'Holcim Philippines', companyId: 'CMP-013', name: 'Nicolas George', pos: 'President & CEO', dept: 'Executive Management', email: 'nicolas.george@holcim.com', phone: '+63 2 8881 0100', stage: 'Proposal Sent', source: 'Direct Outreach', value: 580000, oppTitle: 'Heavy Building Materials Logistics ERP Platform', tags: ['CEO', 'Building Solutions'] },
  { company: 'Holcim Philippines', companyId: 'CMP-013', name: 'Elvira B. Medina', pos: 'Chief Financial Officer', dept: 'Finance & Compliance', email: 'elvira.medina@holcim.com', phone: '+63 2 8881 0112', stage: 'In Discussion', source: 'Referral', value: 340000, oppTitle: 'Cement Plant Cost Accounting & Procurement ERP', tags: ['CFO', 'Procurement'] },
  { company: 'Holcim Philippines', companyId: 'CMP-013', name: 'Samuel O. Manlunas', pos: 'VP for Logistics & Operations', dept: 'Logistics Division', email: 'samuel.manlunas@holcim.com', phone: '+63 2 8881 0125', stage: 'Negotiation', source: 'Conference', value: 420000, oppTitle: 'Bulk Fleet Dispatch & Telematics Integration', tags: ['Logistics VP'] },
  { company: 'Holcim Philippines', companyId: 'CMP-013', name: 'Jaime D. Araullo', pos: 'Operations Director & Plant Automation', dept: 'Plant Systems', email: 'jaime.araullo@holcim.com', phone: '+63 2 8881 0138', stage: 'Meeting Held', source: 'LinkedIn', value: 260000, oppTitle: 'Kiln Sensors & Predictive Maintenance AI', tags: ['Plant Automation'] },

  // Jollibee Foods Corporation (CMP-014)
  { company: 'Jollibee Foods Corporation', companyId: 'CMP-014', name: 'Ernesto Tanmantiong', pos: 'President & CEO', dept: 'Executive Leadership', email: 'e.tanmantiong@jollibee.com.ph', phone: '+63 2 8634 1111', stage: 'Active Client', source: 'Direct Outreach', value: 1250000, oppTitle: 'Global Restaurant Chain Supply Chain ERP & POS Cloud', tags: ['VIP Executive', 'Jollibee CEO'] },
  { company: 'Jollibee Foods Corporation', companyId: 'CMP-014', name: 'Richard C. Shin', pos: 'Chief Financial Officer', dept: 'Global Finance', email: 'r.shin@jollibee.com.ph', phone: '+63 2 8634 1125', stage: 'Negotiation', source: 'Referral', value: 780000, oppTitle: 'Multi-Country Franchise Royalty Accounting ERP', tags: ['CFO', 'Global Finance'] },
  { company: 'Jollibee Foods Corporation', companyId: 'CMP-014', name: 'Joseph C. Tanbuntiong', pos: 'Chief Business Officer', dept: 'PH Business Unit', email: 'j.tanbuntiong@jollibee.com.ph', phone: '+63 2 8634 1140', stage: 'Partnership', source: 'Conference', value: 650000, oppTitle: 'Commissary Automated Inventory Dispatch', tags: ['CBO', 'Operations'] },
  { company: 'Jollibee Foods Corporation', companyId: 'CMP-014', name: 'Marcos I. Cadena', pos: 'Chief Digital Officer & Global CIO', dept: 'Digital & IT', email: 'm.cadena@jollibee.com.ph', phone: '+63 2 8634 1155', stage: 'Proposal Sent', source: 'LinkedIn', value: 590000, oppTitle: 'Global Cloud Data Mesh & Omnichannel Analytics', tags: ['Global CIO', 'Digital Leader'] },

  // Sun Life Philippines (CMP-015)
  { company: 'Sun Life Philippines', companyId: 'CMP-015', name: 'Benedict C. Sison', pos: 'CEO & Country Head', dept: 'Executive Management', email: 'benedict.sison@sunlife.com', phone: '+63 2 8849 9888', stage: 'Active Client', source: 'Direct Outreach', value: 810000, oppTitle: 'Enterprise Insurance Policy Ledger & Cloud ERP', tags: ['CEO', 'Insurance Leader'] },
  { company: 'Sun Life Philippines', companyId: 'CMP-015', name: 'Alex S. Narciso', pos: 'President, Sun Life of Canada PH', dept: 'Life Insurance Unit', email: 'alex.narciso@sunlife.com', phone: '+63 2 8849 9895', stage: 'Proposal Sent', source: 'Referral', value: 460000, oppTitle: 'Agent Commission Automated Calculation Cloud', tags: ['President', 'Life Insurance'] },
  { company: 'Sun Life Philippines', companyId: 'CMP-015', name: 'Lope L. Torres', pos: 'Chief Information Officer', dept: 'Information Technology', email: 'lope.torres@sunlife.com', phone: '+63 2 8849 9910', stage: 'Negotiation', source: 'LinkedIn', value: 520000, oppTitle: 'Claims Processing Automated Workflow Engine', tags: ['CIO', 'Claims ERP'] },
  { company: 'Sun Life Philippines', companyId: 'CMP-015', name: 'Carla P. Domingo', pos: 'CMO & Digital Distribution Lead', dept: 'Marketing & Digital', email: 'carla.domingo@sunlife.com', phone: '+63 2 8849 9925', stage: 'Meeting Held', source: 'Webinar', value: 240000, oppTitle: 'Digital Customer Onboarding & CRM Gateway', tags: ['CMO', 'Digital Marketing'] },

  // Manulife Philippines (CMP-016)
  { company: 'Manulife Philippines', companyId: 'CMP-016', name: 'Rahul Hora', pos: 'President & CEO', dept: 'Executive Management', email: 'rahul_hora@manulife.com', phone: '+63 2 8884 7000', stage: 'Proposal Sent', source: 'Direct Outreach', value: 680000, oppTitle: 'Wealth Management & Insurance Analytics Cloud', tags: ['CEO', 'Wealth Management'] },
  { company: 'Manulife Philippines', companyId: 'CMP-016', name: 'Grace S. Dela Cruz', pos: 'Chief Financial Officer', dept: 'Finance & Actuarial', email: 'grace_delacruz@manulife.com', phone: '+63 2 8884 7015', stage: 'Meeting Held', source: 'Referral', value: 390000, oppTitle: 'IFRS 17 Actuarial Data Consolidation Platform', tags: ['CFO', 'IFRS 17'] },
  { company: 'Manulife Philippines', companyId: 'CMP-016', name: 'Mark L. Anthony', pos: 'CTO & Operations Head', dept: 'IT Operations', email: 'mark_anthony@manulife.com', phone: '+63 2 8884 7030', stage: 'In Discussion', source: 'Conference', value: 410000, oppTitle: 'Core Insurance Cloud Security & Database Engine', tags: ['CTO', 'Operations'] },
  { company: 'Manulife Philippines', companyId: 'CMP-016', name: 'Patricia V. Mercado', pos: 'Chief Marketing Officer', dept: 'Brand & Distribution', email: 'patricia_mercado@manulife.com', phone: '+63 2 8884 7042', stage: 'Event Attendee', source: 'Company Website', value: 180000, oppTitle: 'Advisor Experience Mobile App Backend', tags: ['CMO', 'Brand'] },

  // Pru Life UK Philippines (CMP-017)
  { company: 'Pru Life UK Philippines', companyId: 'CMP-017', name: 'Sanjay Chakrabarty', pos: 'Chief Executive Officer', dept: 'Executive Leadership', email: 'sanjay.chakrabarty@prulifeuk.com.ph', phone: '+63 2 8683 9000', stage: 'Active Client', source: 'Direct Outreach', value: 740000, oppTitle: 'Unit-Linked Fund ERP & Policy Administration System', tags: ['CEO', 'Unit-Linked'] },
  { company: 'Pru Life UK Philippines', companyId: 'CMP-017', name: 'Francis P. Ortega', pos: 'Chief Operations Officer', dept: 'Operations & Underwriting', email: 'francis.ortega@prulifeuk.com.ph', phone: '+63 2 8683 9015', stage: 'Proposal Sent', source: 'Referral', value: 450000, oppTitle: 'Automated Underwriting & Risk Assessment AI', tags: ['COO', 'Underwriting'] },
  { company: 'Pru Life UK Philippines', companyId: 'CMP-017', name: 'Allan M. Santos', pos: 'Chief Information Officer', dept: 'Information Technology', email: 'allan.santos@prulifeuk.com.ph', phone: '+63 2 8683 9028', stage: 'Negotiation', source: 'LinkedIn', value: 490000, oppTitle: 'Enterprise Data Lake & Microservices Architecture', tags: ['CIO', 'Enterprise IT'] },
  { company: 'Pru Life UK Philippines', companyId: 'CMP-017', name: 'Mary Jane T. Castro', pos: 'VP for Digital Channels & CRM', dept: 'Digital Channels', email: 'maryjane.castro@prulifeuk.com.ph', phone: '+63 2 8683 9040', stage: 'Meeting Held', source: 'Conference', value: 230000, oppTitle: 'Customer Loyalty & Pulse App Cloud Integration', tags: ['Digital Channels', 'CRM'] },

  // Fast Distribution Corporation (CMP-018)
  { company: 'Fast Distribution Corporation', companyId: 'CMP-018', name: 'William Chiongbian II', pos: 'Group Chief Executive Officer', dept: 'Executive Management', email: 'wchiongbian@fast.com.ph', phone: '+63 2 8837 8000', stage: 'Active Client', source: 'Direct Outreach', value: 880000, oppTitle: 'Nationwide Logistics Warehouse & ERP Network', tags: ['Logistics CEO', 'VIP Executive'] },
  { company: 'Fast Distribution Corporation', companyId: 'CMP-018', name: 'Manuel L. Gaite', pos: 'COO, Distribution Division', dept: 'FMCG Distribution', email: 'mgaite@fast.com.ph', phone: '+63 2 8837 8015', stage: 'Proposal Sent', source: 'Referral', value: 520000, oppTitle: 'Cold Chain Fleet Route Optimization System', tags: ['COO', 'Cold Chain'] },
  { company: 'Fast Distribution Corporation', companyId: 'CMP-018', name: 'Carlos H. Fernandez', pos: 'CIO & Supply Chain Architect', dept: 'Information Systems', email: 'cfernandez@fast.com.ph', phone: '+63 2 8837 8028', stage: 'Negotiation', source: 'Conference', value: 460000, oppTitle: 'Cross-Docking Automated Barcode & RFID Cloud', tags: ['CIO', 'RFID Tech'] },
  { company: 'Fast Distribution Corporation', companyId: 'CMP-018', name: 'Ruel S. Mendiola', pos: 'VP for Warehousing & Fleet', dept: 'Fleet Operations', email: 'rmendiola@fast.com.ph', phone: '+63 2 8837 8040', stage: 'Meeting Held', source: 'LinkedIn', value: 290000, oppTitle: 'Fleet Telematics & Fuel Management ERP', tags: ['Fleet Ops', 'Warehousing'] },

  // MDI Novare (CMP-019)
  { company: 'MDI Novare', companyId: 'CMP-019', name: 'Myla C. Villanueva', pos: 'Founder & Chairperson', dept: 'Board of Directors', email: 'mvillanueva@mdi.net.ph', phone: '+63 2 8888 6340', stage: 'Partnership', source: 'Direct Outreach', value: 900000, oppTitle: 'Joint Systems Integration & Enterprise Cloud Pact', tags: ['Chairperson', 'Tech Pioneer'] },
  { company: 'MDI Novare', companyId: 'CMP-019', name: 'Mai De Guzman', pos: 'Chief Executive Officer', dept: 'Executive Leadership', email: 'mdeguzman@mdi.net.ph', phone: '+63 2 8888 6350', stage: 'Active Client', source: 'Referral', value: 620000, oppTitle: 'Enterprise Cloud Migration Delivery Engine', tags: ['CEO', 'Tech Delivery'] },
  { company: 'MDI Novare', companyId: 'CMP-019', name: 'Victor S. Reyes', pos: 'Chief Technology Officer', dept: 'Technology & R&D', email: 'vreyes@mdi.net.ph', phone: '+63 2 8888 6362', stage: 'Meeting Held', source: 'Conference', value: 410000, oppTitle: 'AI Pipeline & Modern Data Warehouse Stack', tags: ['CTO', 'AI Pipeline'] },
  { company: 'MDI Novare', companyId: 'CMP-019', name: 'Angela M. Soriano', pos: 'VP for Enterprise Solutions', dept: 'Solution Architecture', email: 'asoriano@mdi.net.ph', phone: '+63 2 8888 6375', stage: 'Proposal Sent', source: 'LinkedIn', value: 330000, oppTitle: 'Telco Cloud Core Infrastructure Migration', tags: ['Enterprise Solutions'] },

  // Iontech Technologies (CMP-020)
  { company: 'Iontech Technologies', companyId: 'CMP-020', name: 'Peter Y. Ty', pos: 'Chief Executive Officer', dept: 'Executive Management', email: 'pty@iontech.com.ph', phone: '+63 2 8920 1100', stage: 'Active Client', source: 'Direct Outreach', value: 550000, oppTitle: 'Hardware & Infrastructure Distribution ERP Platform', tags: ['CEO', 'Tech Distribution'] },
  { company: 'Iontech Technologies', companyId: 'CMP-020', name: 'Ronald S. Co', pos: 'Chief Operating Officer', dept: 'Operations & Sales', email: 'rco@iontech.com.ph', phone: '+63 2 8920 1115', stage: 'Proposal Sent', source: 'Referral', value: 380000, oppTitle: 'Reseller Channel Portal & Inventory Cloud System', tags: ['COO', 'Channel Sales'] },
  { company: 'Iontech Technologies', companyId: 'CMP-020', name: 'Dennis M. Tan', pos: 'VP for Business Development', dept: 'Business Development', email: 'dtan@iontech.com.ph', phone: '+63 2 8920 1128', stage: 'Meeting Held', source: 'Networking Event', value: 270000, oppTitle: 'Enterprise Hardware Warranty Tracking Database', tags: ['Biz Dev', 'Distribution'] },
  { company: 'Iontech Technologies', companyId: 'CMP-020', name: 'Katrina L. Uy', pos: 'Supply Chain & Operations Director', dept: 'Supply Chain', email: 'kuy@iontech.com.ph', phone: '+63 2 8920 1140', stage: 'In Discussion', source: 'Company Website', value: 210000, oppTitle: 'Import Customs Clearing Automated Ledger', tags: ['Supply Chain'] }
];

// Gender detection helper function
export function isFemaleExecutiveName(name: string): boolean {
  const femaleKeywords = [
    'maria', 'theresa', 'angelica', 'cristina', 'jacqueline', 'isabelita', 'anna',
    'margarita', 'isabel', 'lourdes', 'teresa', 'cecile', 'karen', 'christine',
    'elvira', 'carla', 'grace', 'patricia', 'mary', 'myla', 'mai', 'angela',
    'katrina', 'sophia', 'jane', 'sarah', 'elizabeth', 'victoria', 'michelle', 'lauren',
    'diana', 'catherine', 'rachel', 'jessica', 'hannah', 'amanda', 'emily', 'alicia', 'rebecca', 'clarissa'
  ];
  const nameLower = name.toLowerCase();
  return femaleKeywords.some(kw => nameLower.includes(kw));
}

// Dedicated female executive portraits
const FEMALE_EXECUTIVE_PHOTOS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1534751516642-a171e2614908?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?auto=format&fit=crop&q=80&w=300'
];

// Dedicated male executive portraits
const MALE_EXECUTIVE_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=300'
];

let femalePhotoCounter = 0;
let malePhotoCounter = 0;

// Generate final 68 realistic Executive profiles
export const REAL_EXECUTIVES: Executive[] = RAW_ROSTER.map((item, idx) => {
  const num = (idx + 1).toString().padStart(3, '0');
  const execId = `EXE-${num}`;
  const oppId = `OPP-${num}`;
  
  const isFemale = isFemaleExecutiveName(item.name);
  const gender: 'Female' | 'Male' = isFemale ? 'Female' : 'Male';

  let avatarUrl = '';
  if (isFemale) {
    avatarUrl = FEMALE_EXECUTIVE_PHOTOS[femalePhotoCounter % FEMALE_EXECUTIVE_PHOTOS.length];
    femalePhotoCounter++;
  } else {
    avatarUrl = MALE_EXECUTIVE_PHOTOS[malePhotoCounter % MALE_EXECUTIVE_PHOTOS.length];
    malePhotoCounter++;
  }

  const matchedCmp = REAL_COMPANIES.find(c => c.id === item.companyId);

  // Health calculation
  let healthScore = 85;
  let healthStatus: 'Thriving' | 'Moderate' | 'At Risk' = 'Thriving';
  if (item.stage === 'Active Client' || item.stage === 'Partnership') {
    healthScore = 92 + (idx % 8);
    healthStatus = 'Thriving';
  } else if (item.stage === 'Proposal Sent' || item.stage === 'Negotiation' || item.stage === 'Meeting Held') {
    healthScore = 75 + (idx % 12);
    healthStatus = 'Moderate';
  } else {
    healthScore = 55 + (idx % 10);
    healthStatus = 'At Risk';
  }

  // Cross-referral link setup
  let referredById: string | null = null;
  let referredByName: string | null = null;
  let referralNotes: string | undefined = undefined;
  if (idx > 0 && idx % 3 === 0) {
    const refIdx = (idx - 2) % RAW_ROSTER.length;
    referredById = `EXE-${(refIdx + 1).toString().padStart(3, '0')}`;
    referredByName = RAW_ROSTER[refIdx].name;
    referralNotes = `Introduced by ${RAW_ROSTER[refIdx].name} (${RAW_ROSTER[refIdx].company}) during DELCA Executive Roundtable.`;
  }

  const industry = matchedCmp ? matchedCmp.industry : 'Banking & Financial Services';
  
  // Dynamic Industry & Position Intelligence
  const isCSuite = item.pos.includes('CEO') || item.pos.includes('President') || item.pos.includes('Chairman');
  const isTechLeader = item.pos.includes('CIO') || item.pos.includes('CTO') || item.pos.includes('IT') || item.pos.includes('Technology');
  const isFinanceLeader = item.pos.includes('CFO') || item.pos.includes('Finance') || item.pos.includes('Treasurer');
  
  const aiReadinessScore = Math.min(99, 78 + ((idx * 7) % 20) + (isTechLeader ? 8 : 0));
  const technologyReadinessScore = Math.min(98, 80 + ((idx * 5) % 18) + (isTechLeader ? 6 : 0));

  const decisionMakingStyle = isCSuite 
    ? 'Strategic ROI & Multi-Quarter Growth Focused' 
    : isTechLeader 
    ? 'Analytical Tech Architecture & High-Availability Focused' 
    : isFinanceLeader 
    ? 'Risk-Averse Fiscal Governance & Compliance Driven' 
    : 'Agile Business Process Optimization Driven';

  const education = isCSuite 
    ? 'MBA - Asian Institute of Management | BS Industrial Engineering, UP Diliman'
    : isTechLeader 
    ? 'MS Computer Science, Ateneo de Manila University | AWS & Cloud Architecture Certified'
    : isFinanceLeader
    ? 'CPA, Certified Management Accountant | BS Accountancy, De La Salle University'
    : 'BS Business Administration & Management, University of Santo Tomas';

  const cleanSlug = item.name.toLowerCase().replace(/[^a-z]/g, '');

  const biography = `${item.name} is the ${item.pos} at ${item.company}. With over 18+ years of enterprise leadership experience across ${industry}, ${item.name.split(' ')[0]} spearheads enterprise strategic growth, digital modernization, and operational efficiency across Philippine and regional operations.`;

  const strategicPriorities = industry.includes('Banking')
    ? ['Core Banking Cloud Migration', 'Real-time AI Fraud Detection', 'Multi-Ledger Automated Reconciliation', 'Open Banking API Standards']
    : industry.includes('Property')
    ? ['Smart Estate IoT Infrastructure', 'Automated Commercial Tenant Portal', 'Energy Optimization & Sustainability', 'Real Estate Asset ERP']
    : industry.includes('Manufacturing')
    ? ['Smart Factory Supply Chain IoT', 'Predictive Equipment Maintenance', 'SAP S/4HANA Cloud Integration', 'ESG Carbon Footprint Tracking']
    : industry.includes('Distribution') || industry.includes('Logistics')
    ? ['Nationwide Cold-Chain Telematics', 'AI Warehouse Dispatch Automation', 'Cross-Docking RFID Tracking', 'Last-Mile Route Optimization']
    : industry.includes('Insurance')
    ? ['Automated Underwriting AI Pipeline', 'IFRS 17 Actuarial Data Consolidation', 'Claims Auto-Settlement Engine', 'Omnichannel Advisor Portal']
    : ['Enterprise Cloud ERP Migration', 'AI Process Automation', 'Zero-Trust Cybersecurity Framework', 'Enterprise Knowledge Graph'];

  const painPoints = isTechLeader
    ? ['High maintenance overhead of legacy legacy systems', 'Data silos hindering real-time C-suite analytics', 'Cybersecurity compliance across multi-subsidiary networks']
    : isFinanceLeader
    ? ['Manual month-end financial consolidation delays', 'Multi-currency tax & regulatory compliance risks', 'Unpredictable software licensing and cloud infrastructure costs']
    : ['Legacy process bottlenecks reducing team productivity', 'Slow time-to-market for digital customer initiatives', 'Cross-departmental alignment on digital transformation projects'];

  const buyingSignals = [
    `Active RFP issued for ${item.oppTitle}`,
    `Approved Q3/Q4 budget allocation for enterprise software & cloud infrastructure`,
    `Public executive commitment to 100% cloud & AI modernization by 2027`
  ];

  const techStack = isTechLeader || industry.includes('Banking')
    ? ['SAP S/4HANA', 'Oracle Cloud Database', 'Microsoft Azure AI', 'Delca Cloud ERP', 'Snowflake Analytics']
    : ['Microsoft Dynamics 365', 'Salesforce CRM', 'AWS Enterprise Cloud', 'Delca VisionTech EIRMS', 'Workday HCM'];

  const recommendedNextActions = [
    `Schedule Executive Briefing at DELCA C-Suite Summit`,
    `Share specialized Case Study on ${strategicPriorities[0]} with ${item.name}`,
    `Deliver tailored ROI & TCO presentation for ${item.company}`
  ];

  const speakingEngagements = [
    `Keynote Speaker: Philippines C-Suite Digital Transformation Summit 2025`,
    `Panellist: ASEAN Enterprise Technology Forum 2025`
  ];

  const awardsCertifications = [
    `Philippine Enterprise Leader of the Year Award 2025`,
    `Certified C-Suite Digital Transformation Pioneer`
  ];

  // Past Roles
  const pastRoles = isCSuite
    ? [`Executive Vice President, ${item.company}`, `Senior Vice President, Citibank N.A. Philippines`, `Managing Director, SGV & Co.`]
    : isTechLeader
    ? [`VP for Information Technology, Globe Telecom`, `Senior Systems Architect, Accenture Philippines`, `IT Director, IBM Philippines`]
    : isFinanceLeader
    ? [`Senior Audit Manager, SGV & Co. (Ernst & Young)`, `VP for Finance, BDO Unibank`, `Treasury Lead, Ayala Corporation`]
    : [`Operations Director, San Miguel Foods`, `Senior Business Analyst, McKinsey & Company`, `Regional Manager, Procter & Gamble`];

  // Key Achievements
  const keyAchievements = [
    `Led ₱2.5 Billion digital transformation rollout serving 5M+ active customers across the Philippines.`,
    `Decreased month-end enterprise financial audit cycle times by 45% through DELCA Cloud ERP automated ledger rules.`,
    `Awarded Top 10 Enterprise Leader in Southeast Asia by Asia Tech Governance Council.`
  ];

  const preferredContactTime = idx % 2 === 0 ? 'Tuesdays & Thursdays, 10:00 AM - 11:30 AM PST' : 'Mondays & Wednesdays, 2:00 PM - 4:00 PM PST';
  const communicationTonePreference = isCSuite ? 'Executive Summary Focus (High-level ROI, strategic impact, metrics)' : isTechLeader ? 'Technical Depth & Architecture First (API benchmarks, cloud specs, security compliance)' : 'Analytical & Financial Rigor (TCO, payback period, compliance audits)';

  // Executive Social Media channels
  const executiveSocialMedia = {
    linkedin: `https://www.linkedin.com/in/${cleanSlug}`,
    twitter: `https://x.com/${cleanSlug}_exec`,
    bloomberg: `https://www.bloomberg.com/profile/person/${(idx + 1002341)}`,
    corporateBio: `${matchedCmp ? matchedCmp.website : 'https://www.delcavisiontech.com'}/leadership/${cleanSlug}`,
    personalWebsite: `https://www.${cleanSlug}.com`,
    youtubeOrPodcast: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.name + ' ' + item.company)}`,
    mediumOrGithub: `https://medium.com/@${cleanSlug}`
  };

  return {
    id: execId,
    fullName: item.name,
    position: item.pos,
    jobTitle: item.pos,
    company: item.company,
    companyId: item.companyId,
    industry,
    department: item.dept,
    city: matchedCmp ? matchedCmp.city : 'Makati City',
    country: 'Philippines',
    email: item.email,
    contactNumber: item.phone,
    phoneNumber: item.phone,
    linkedinProfile: executiveSocialMedia.linkedin,
    companyWebsite: matchedCmp ? matchedCmp.website : 'https://www.delcavisiontech.com',
    avatarUrl,
    gender,
    companyLogoUrl: matchedCmp?.logoUrl,
    contactStatus: idx % 10 === 9 ? 'Pending Verification' : 'Verified',
    verificationDate: idx % 10 === 9 ? null : '2026-06-15T10:00:00Z',
    relationshipStage: item.stage as any,
    contactSource: item.source as any,
    communicationPreferences: ['Email', 'In-Person', 'LinkedIn'],
    tags: item.tags,
    notes: `Executive decision maker overseeing enterprise IT, cloud ERP modernization, and digital transformation for ${item.company}. Active contact in DELCA VisionTech EIRMS database.`,
    lastContactDate: '2026-07-20T14:00:00Z',
    followUpDate: '2026-08-05',
    preferredEventCategories: ['Cloud & ERP Modernization', 'Digital Banking', 'Supply Chain Analytics', 'Cybersecurity'],
    previousEventAttendance: ['DELCA VisionTech Executive Summit 2025', 'PH Enterprise Tech Forum'],
    status: 'Active',
    createdAt: '2026-01-15T09:00:00Z',
    profileCompleteness: 95 + (idx % 5),
    healthScore,
    healthStatus,
    referredById,
    referredByName,
    referralNotes,
    biography,
    education,
    decisionMakingStyle,
    aiReadinessScore,
    technologyReadinessScore,
    strategicPriorities,
    painPoints,
    buyingSignals,
    techStack,
    recommendedNextActions,
    speakingEngagements,
    awardsCertifications,
    socialMedia: executiveSocialMedia,
    pastRoles,
    keyAchievements,
    preferredContactTime,
    communicationTonePreference,
    opportunities: [
      {
        id: oppId,
        executiveId: execId,
        title: item.oppTitle,
        value: item.value,
        stage: (item.stage === 'Active Client' ? 'Won' : item.stage === 'Proposal Sent' ? 'Proposal Sent' : item.stage === 'Negotiation' ? 'Negotiation' : item.stage === 'Meeting Held' ? 'Qualified' : 'New Lead') as any,
        opportunityType: 'Software Licensing',
        expectedCloseDate: '2026-10-15',
        probability: item.stage === 'Active Client' ? 100 : item.stage === 'Negotiation' ? 85 : 65,
        assignedTeamMember: 'Jane Marie Baluna',
        notes: `Engaged on high-priority initiative with expected timeline Q3/Q4 2026.`,
        createdAt: '2026-05-10T10:00:00Z',
        updatedAt: '2026-07-20T14:00:00Z'
      }
    ],
    interactionHistory: [
      {
        id: `NOTE-${num}-1`,
        authorName: 'Jane Marie Baluna',
        authorRole: 'Sales Team',
        type: 'Meeting',
        content: `Executive briefing conducted with ${item.name} regarding DELCA VisionTech Cloud Solutions. Positive feedback recorded.`,
        timestamp: '2026-07-18T10:30:00Z'
      }
    ],
    networkConnections: [
      {
        executiveId: `EXE-${((idx + 1) % RAW_ROSTER.length + 1).toString().padStart(3, '0')}`,
        executiveName: RAW_ROSTER[(idx + 1) % RAW_ROSTER.length].name,
        connectionType: 'Industry Peer',
        notes: `Co-member of Philippine Executive Technology Council.`
      }
    ]
  };
});

export const REAL_EVENTS: DELCAEvent[] = [
  {
    id: 'EVT-101',
    name: 'Asia-Pacific Cloud ERP & Financial Modernization Summit 2026',
    description: 'Exclusive executive symposium addressing multi-subsidiary accounting, automated treasury consolidation, and Cloud ERP transitions.',
    venue: 'Grand Ballroom, Solaire Resort & Casino, Manila',
    date: '2026-08-28',
    time: '09:00 AM - 05:00 PM',
    registrationDeadline: '2026-08-15',
    targetIndustry: 'Banking & Financial Services',
    category: 'Fintech & Audit',
    maxParticipants: 80,
    speakerInfo: 'Dr. Alistair Vance (Global Chief Architect, DELCA) & Hon. Sarah Jenkins (ASEAN Treasury Council)',
    status: 'Upcoming'
  },
  {
    id: 'EVT-102',
    name: 'Philippines FMCG & Retail Supply Chain Innovation Forum 2026',
    description: 'High-impact conference on automated warehouse operations, cold-chain distribution, and predictive dispatching.',
    venue: 'Grand Hyatt Manila, Bonifacio Global City, Taguig',
    date: '2026-09-15',
    time: '08:30 AM - 04:30 PM',
    registrationDeadline: '2026-09-01',
    targetIndustry: 'Distribution & Logistics',
    category: 'Supply Chain & Logistics',
    maxParticipants: 100,
    speakerInfo: 'William Chiongbian II (Group CEO Fast Logistics) & Mark Lawson (VP Supply Chain Systems, DELCA VisionTech)',
    status: 'Upcoming'
  },
  {
    id: 'EVT-103',
    name: 'Smart Real Estate & Township Technology Roundtable 2026',
    description: 'Executive roundtable exploring IoT building automation, tenant portal ERPs, and smart city infrastructure.',
    venue: 'Shangri-La The Fort, Manila',
    date: '2026-10-10',
    time: '10:00 AM - 03:00 PM',
    registrationDeadline: '2026-09-25',
    targetIndustry: 'Property Development',
    category: 'Smart Real Estate',
    maxParticipants: 60,
    speakerInfo: 'Anna Ma. Margarita B. Dy (President & CEO Ayala Land) & DELCA Smart Cities Panel',
    status: 'Upcoming'
  }
];

export const REAL_RECOMMENDATIONS: EventRecommendation[] = [
  {
    id: 'REC-001-101',
    executiveId: 'EXE-001',
    eventId: 'EVT-101',
    matchScore: 98,
    confidenceScore: 100,
    recommendationReason: 'Perfect Banking & Financial Services match + Preferred Category (Fintech & Audit) + Key Decision Maker role at BDO Unibank.',
    breakdown: {
      industryMatch: true,
      categoryMatch: true,
      positionMatch: true,
      locationMatch: true,
      pastAttendanceMatch: true
    },
    priorityLevel: 'Critical',
    createdAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'REC-005-101',
    executiveId: 'EXE-005',
    eventId: 'EVT-101',
    matchScore: 96,
    confidenceScore: 100,
    recommendationReason: 'Direct industry alignment (Banking & Financial Services) + High priority engagement for Metrobank Executive.',
    breakdown: {
      industryMatch: true,
      categoryMatch: true,
      positionMatch: true,
      locationMatch: true,
      pastAttendanceMatch: true
    },
    priorityLevel: 'Critical',
    createdAt: '2026-07-20T11:00:00Z'
  }
];

export const REAL_INVITATIONS: Invitation[] = [
  {
    id: 'INV-001',
    executiveId: 'EXE-001',
    eventId: 'EVT-101',
    recommendationId: 'REC-001-101',
    subject: 'VIP Invitation: Nestor V. Tan | Asia-Pacific Cloud ERP & Financial Summit 2026',
    bodyText: `Dear Nestor V. Tan,

On behalf of DELCA VisionTech Inc., I am privileged to extend a formal executive invitation to you, representing BDO Unibank, to join us for our upcoming symposium: "Asia-Pacific Cloud ERP & Financial Modernization Summit 2026".

Event Details:
- Date: 2026-08-28 at 09:00 AM - 05:00 PM
- Venue: Grand Ballroom, Solaire Resort & Casino, Manila
- Registration Deadline: 2026-08-15

Given your leadership as President & CEO at BDO Unibank, your participation will add immense value to our executive roundtable on core banking migration and real-time ledger consolidation.

With professional regards,

Jane Marie Baluna
Principal Director, Client Outreach
DELCA VisionTech Inc.`,
    status: 'Sent',
    sentAt: '2026-07-22T14:20:00Z',
    createdAt: '2026-07-22T10:00:00Z',
    subjectLine: 'VIP Invitation: Nestor V. Tan | Asia-Pacific Cloud ERP & Financial Summit 2026',
    emailBody: `Dear Nestor V. Tan...`
  }
];

export const REAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-001',
    userRole: 'Administrator',
    userName: 'System Admin',
    action: 'Executive Intelligence & Relationship Management System (EIRMS) initialized with 20 real enterprise companies and 68 verified executive profiles.',
    timestamp: new Date('2026-07-24T08:00:00Z').toISOString()
  }
];

export const REAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOT-001',
    type: 'success',
    title: 'EIRMS Database Active',
    message: 'Loaded 20 verified Philippine enterprise companies and 68 executive profiles across Banking, Property, Manufacturing, Distribution, and Financial Services.',
    timestamp: new Date('2026-07-24T08:00:00Z').toISOString(),
    read: false
  }
];

export const REAL_APP_STATE: AppStateStore = {
  executives: REAL_EXECUTIVES,
  companies: REAL_COMPANIES,
  events: REAL_EVENTS,
  recommendations: REAL_RECOMMENDATIONS,
  invitations: REAL_INVITATIONS,
  activityLogs: REAL_LOGS,
  notifications: REAL_NOTIFICATIONS,
  settings: {
    autoVerifyOnImport: true,
    defaultFollowUpDays: 14,
    matchingWeights: {
      industryWeight: 40,
      categoryWeight: 30,
      positionWeight: 15,
      pastAttendanceWeight: 15
    },
    exportFormat: 'CSV'
  }
};
