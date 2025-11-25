// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  ORPHANS: 'orphans',
  CATEGORIES: 'categories',
  DONATIONS: 'donations',
  ORPHAN_UPDATES: 'orphanUpdates'
} as const;

// Sample data for testing
export const SAMPLE_CATEGORIES = [
  {
    name: 'Education - ትምህርት',
    description: 'Support Ethiopian orphans education and school supplies across all regions',
    icon: '📚'
  },
  {
    name: 'Healthcare - ጤና',
    description: 'Provide medical care and health services for Ethiopian children',
    icon: '🏥'
  },
  {
    name: 'Food & Nutrition - ምግብ',
    description: 'Ensure proper nutrition and traditional Ethiopian meals',
    icon: '🍽️'
  },
  {
    name: 'Shelter - መጠለያ',
    description: 'Provide safe housing and accommodation in Ethiopian communities',
    icon: '🏠'
  }
];

export const SAMPLE_ORPHANS = [
  {
    name: 'Abebe Tadesse',
    age: 10,
    gender: 'male',
    location: 'Addis Ababa, Ethiopia',
    story: 'Abebe lost his parents and lives with his grandmother. He dreams of becoming a doctor to help his community in Addis Ababa.',
    photoUrl: '/placeholder.svg',
    categoryId: 'education',
    monthlySupport: 500,
    currentDonors: 0,
    status: 'active'
  },
  {
    name: 'Hanna Bekele',
    age: 8,
    gender: 'female',
    location: 'Bahir Dar, Amhara Region',
    story: 'Hanna loves to read and wants to become a teacher. She needs support for her education in Bahir Dar.',
    photoUrl: '/placeholder.svg',
    categoryId: 'education',
    monthlySupport: 500,
    currentDonors: 0,
    status: 'active'
  },
  {
    name: 'Dawit Mekonnen',
    age: 12,
    gender: 'male',
    location: 'Mekelle, Tigray Region',
    story: 'Dawit is a bright student from Mekelle who lost his family. He excels in mathematics and dreams of becoming an engineer.',
    photoUrl: '/placeholder.svg',
    categoryId: 'education',
    monthlySupport: 500,
    currentDonors: 0,
    status: 'active'
  },
  {
    name: 'Selam Girma',
    age: 7,
    gender: 'female',
    location: 'Hawassa, SNNPR',
    story: 'Selam is a cheerful girl from Hawassa who needs support for her education and healthcare. She loves singing and traditional Ethiopian music.',
    photoUrl: '/placeholder.svg',
    categoryId: 'healthcare',
    monthlySupport: 500,
    currentDonors: 0,
    status: 'active'
  },
  {
    name: 'Yonas Alemayehu',
    age: 11,
    gender: 'male',
    location: 'Dire Dawa, Ethiopia',
    story: 'Yonas from Dire Dawa is passionate about learning. He helps other children in his community and wants to become a teacher.',
    photoUrl: '/placeholder.svg',
    categoryId: 'education',
    monthlySupport: 500,
    currentDonors: 0,
    status: 'active'
  },
  {
    name: 'Bethlehem Tesfaye',
    age: 9,
    gender: 'female',
    location: 'Gondar, Amhara Region',
    story: 'Bethlehem lives in Gondar and dreams of becoming a nurse. She lost her parents but remains hopeful and hardworking.',
    photoUrl: '/placeholder.svg',
    categoryId: 'healthcare',
    monthlySupport: 500,
    currentDonors: 0,
    status: 'active'
  }
];
