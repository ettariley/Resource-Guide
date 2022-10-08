const mockResources = [
  {
    provider: 'Morristown-Hamblen Central Services',
    address: '2450 S. Cumberland St. Morristown, TN 37813',
    website: 'https://mhcentralservices.org/',
    phone: '423-586-9431',
    serviceFilters: ['Food', 'Utilities', 'Housing & Rent', 'Thrift Store'],
    populationFilters: [],
    description:
      'Morristown-Hamblen Central Services is a United Way agency that provides a broad range of services and can connect you to other community resources. Primary services include Food Panty, Utility Assistance, and Thrift Store.',
    featured: {
      isFeatured: '', // boolean
      featuredText: '',
    },
  },
  {
    provider: 'Douglas-Cherokee Economic Authority',
    address: '534 East 1st North St. Morristown, TN 37814',
    website: 'https://www.douglascherokee.com/',
    phone: '423-587-4500',
    serviceFilters: [
      'Utilities',
      'Housing & Rent',
      'Education',
      'Early Childhood',
    ],
    populationFilters: ['Children', 'Seniors'],
    description:
      'Douglas-Cherokee Economic Authority is a Community Action Agency serving Hamblen County and other surrounding counties. They provide a variety of resources such as food, rent, and utility programs and education programs for children and people of all ages.',
    featured: {
      isFeatured: '', // boolean
      featuredText: '',
    },
  },
  {
    provider: 'Helen Ross McNabb',
    address: '310 W. 3rd North St. Morristown, TN 37814',
    website: 'https://mcnabbcenter.org/our-locations/hamblen-county-center',
    phone: '423-581-4761',
    serviceFilters: ['Mental Health'],
    populationFilters: ['Children', 'Adults'],
    description:
      'The Hamblen County Center provides outpatient mental health services to children, adults and families in Hamblen County and the surrounding communities.',
    featured: {
      isFeatured: '', // boolean
      featuredText: '',
    },
  },
];

const mockEvents = [
  {
    eventName: '',
    eventHost: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    description: '',
    eventLink: '',
    populationFilters: {
      name: '',
    },
  },
];

const mockFeaturedEvents = [
  {
    title: '',
    description: '',
    featuredEventLink: '',
    expirationDate: '',
  },
];

// Need to finalize with Ashley
const mockAboutText = [
  {
    text: 'The Hamblen Resource Guide was created to provide an accessible, web-based approach when searching for resources and social services in Hamblen County. The original resource guide, or “Hi-C” brochure, has been an amazing tool for businesses, churches, and other organizations when they are searching for specific resources, whether for themselves or another person in need. Based on that success, the Ready by 6 Council and Morristown-Hamblen Central Services (Hi-C) made the decision to design a progressive web-based app, the Hamblen Resource Guide. Not only does this digital guide allow for a more efficient way to keep resources updated, but it can also reach a larger audience than the previously printed guide. Further, the Hamblen Resource Guide delivers a much more environmentally friendly option, while being a fiscally responsible way of informing the community of the resources available to them.',
  },
  {
    text: "The Ready by 6 Council is made up of area service non-profits and meets monthly. The group was formed to engage the Morristown Hamblen community in strengthening systems to ensure delivery of appropriate services that promote the development and well-being of prenatal to five-year old children and their families. Morristown-Hamblen Central Services is a long-standing community non-profit that provides supportive services to anyone living or working in Hamblen County. Both of these entities understand the importance of strong partnerships among social services, therefore, strengthening the community's connection to accurate resources quickly became a vital mission for both groups.",
  },
  {
    text: 'The Hamblen Interagency Coalition (Hi-C) continues to meet monthly at Central Services for the purpose of networking and sharing current program and service information. Meetings are the last Thursday of the month at noon in the Wallace Room of Central Services (no meeting in Nov. or Dec.).',
  },
];

// Filled out, check with more from Ashley
const mockAboutPartners = [
  {
    name: 'Ready by 6',
    link: 'https://www.hcexcell.org/ready-by-6-1',
  },
  {
    name: 'Morristown-Hamblen Central Services',
    link: 'https://www.mhcentralservices.org/',
  },
];

// Filled out, not comprehensive
const mockServiceFilters = [
  'Food',
  'Utilities',
  'Housing & Rent',
  'Physical Health',
  'Mental Health',
  'Substance Use',
  'Disability',
  'Legal Aid',
  'Parenting',
  'Anger Management',
  'Education',
  'Early Childhood',
  'Government & Civil Service',
  'Employment & Training',
  'Transportation',
  'General Assistance',
  'Thrift Store',
];

// Filled out, probably all but need to check
const mockPopulationFilters = ['Children', 'Adults', 'Seniors', 'Veterans'];

export {
  mockResources,
  mockEvents,
  mockFeaturedEvents,
  mockAboutText,
  mockAboutPartners,
  mockServiceFilters,
  mockPopulationFilters,
};
