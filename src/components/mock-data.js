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
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
const mockPopulationFilters = [
  'Children',
  'Adults',
  'Seniors',
  'Veterans',
];

export {
  mockResources,
  mockEvents,
  mockFeaturedEvents,
  mockAboutText,
  mockAboutPartners,
  mockServiceFilters,
  mockPopulationFilters,
};
