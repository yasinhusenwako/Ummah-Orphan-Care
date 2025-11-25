import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'am' ? 'am' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translations = getTranslations(language);
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Translation function
const getTranslations = (lang: Language): Record<string, string> => {
  const translations: Record<Language, Record<string, string>> = {
    en: {
      // Navbar
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.causes': 'Causes',
      'nav.donate': 'Donate',
      'nav.gallery': 'Gallery',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.logout': 'Logout',
      'nav.dashboard': 'Dashboard',
      'nav.adminPanel': 'Admin Panel',
      'nav.donateMonthly': 'Donate Monthly',
      
      // Hero Section
      'hero.title': 'Ethiopian Orphan Care',
      'hero.subtitle': 'Supporting orphans across all Ethiopian regions - from Addis Ababa to Mekelle, Bahir Dar to Hawassa. Every monthly donation in Birr creates lasting change.',
      'hero.donateNow': 'Donate Now',
      'hero.learnMore': 'Learn More',
      
      // Stats
      'stats.childrenHelped': 'Ethiopian Children Helped',
      'stats.raisedThisYear': 'Raised This Year',
      'stats.educated': 'Educated Across Regions',
      'stats.regionalCenters': 'Regional Centers',
      
      // Causes
      'causes.title': 'Our Causes',
      'causes.subtitle': 'Support the causes that matter most. Each contribution directly impacts the lives of children in need.',
      'causes.viewAll': 'View All Causes',
      'causes.education': 'Education',
      'causes.food': 'Food & Nutrition',
      'causes.shelter': 'Safe Shelter',
      'causes.healthcare': 'Healthcare',
      
      // Mission
      'mission.title': 'Our Mission: Building Hope',
      'mission.description': 'We provide comprehensive support to orphaned children across all 12 Ethiopian regions - from Addis Ababa to Mekelle, Bahir Dar to Hawassa.',
      'mission.detail': 'Every Ethiopian child deserves love, education, proper nutrition, and a safe place to call home. Your monthly donations in Birr help us build a brighter future across Ethiopian communities.',
      'mission.discover': 'Discover Our Story',
      
      // CTA
      'cta.title': 'Start Making a Difference Today',
      'cta.subtitle': 'Your monthly donation in Ethiopian Birr provides consistent support that transforms lives across all regions. Join thousands of compassionate donors building hope for Ethiopian orphaned children.',
      'cta.contactUs': 'Contact Us',
      
      // Footer
      'footer.tagline': 'Supporting Ethiopian Children',
      'footer.description': 'Dedicated to providing comprehensive care and support to orphaned children across all 12 Ethiopian regions.',
      'footer.quickLinks': 'Quick Links',
      'footer.contact': 'Contact',
      'footer.followUs': 'Follow Us',
      'footer.rights': 'All rights reserved.',
      
      // Login
      'login.donor': 'Donor',
      'login.admin': 'Admin',
      'login.donorTitle': 'Donor Login',
      'login.adminTitle': 'Admin Login',
      'login.donorSubtitle': 'Sign in to support orphans and make a difference',
      'login.adminSubtitle': 'Access the admin panel to manage the platform',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.fullName': 'Full Name',
      'login.signIn': 'Sign In',
      'login.createAccount': 'Create Account',
      'login.haveAccount': 'Already have an account? Sign in',
      'login.noAccount': "Don't have an account? Sign up",
      'login.googleSignIn': 'Continue with Google',
      'login.testCredentials': 'Test Credentials:',
      
      // About Page
      'about.title': 'About Us',
      'about.subtitle': 'Building hope and transforming lives through compassion, education, and sustainable support for Ethiopian orphaned children across all 12 regions.',
      'about.mission': 'Our Mission',
      'about.missionText': 'To provide comprehensive care, quality education, nutritious traditional Ethiopian food, safe shelter, and healthcare to orphaned children across all 12 Ethiopian regions, empowering them to build bright futures and become contributing members of Ethiopian society.',
      'about.vision': 'Our Vision',
      'about.visionText': 'An Ethiopia where every orphaned child across all 12 regions has access to love, care, education, and opportunities to thrive—building a stronger, more compassionate Ethiopian society united in service to those most vulnerable.',
      'about.story': 'Our Story',
      'about.storyP1': 'Founded in 2010, Ethiopian Orphan Support began with a simple yet powerful vision: to provide hope and opportunity to Ethiopian children who had lost their parents. What started as a small initiative supporting 50 children in Addis Ababa has grown into a nationwide movement serving over 5,000 children across all 12 Ethiopian regions.',
      'about.storyP2': 'Our founders, inspired by Ethiopian values of community and compassion, recognized that orphaned children needed more than just basic needs—they needed love, education, healthcare, and a sense of belonging rooted in Ethiopian culture. This holistic approach has become the cornerstone of our work.',
      'about.storyP3': 'Today, Ethiopian Orphan Support operates 12 regional care centers across Ethiopia - from Addis Ababa to Mekelle, Bahir Dar to Hawassa. We run education programs serving hundreds of children, and provide monthly support in Ethiopian Birr to thousands of families. Through the generous contributions of our community of donors, we continue to expand our reach and deepen our impact.',
      'about.storyP4': 'Every Ethiopian child we serve is a testament to the power of collective compassion and the enduring spirit of community working together for positive change.',
      'about.values': 'Our Core Values',
      'about.valuesSubtitle': 'These Ethiopian values guide everything we do and inspire us to serve with excellence.',
      'about.impact': 'Our Impact in Numbers',
      'about.childrenSupported': 'Ethiopian Children Supported',
      'about.regions': 'Ethiopian Regions',
      'about.graduates': 'Graduates',
      'about.donors': 'Monthly Donors',
      
      // Causes Page
      'causes.pageTitle': 'Our Causes',
      'causes.pageSubtitle': 'Every cause represents a pathway to hope, dignity, and a brighter future for Ethiopian orphaned children across all 12 regions. Your support in Ethiopian Birr makes lasting change possible.',
      'causes.howItWorks': 'How Your Ethiopian Birr Donations Work',
      'causes.howItWorksText': '98% of every Birr donation goes directly to our programs supporting Ethiopian children across all 12 regions. We maintain complete transparency with regular impact reports showing exactly how your contributions are transforming Ethiopian lives.',
      'causes.toPrograms': 'Goes to Programs',
      'causes.transparency': 'Transparency',
      'causes.verified': 'Verified',
      'causes.impactReports': 'Impact Reports',
      'causes.donateNow': 'Donate Now',
      
      // Individual Causes
      'cause.education.title': 'Education for Every Ethiopian Child',
      'cause.education.desc': 'Provide quality education, school supplies, tutoring, and vocational training across all 12 Ethiopian regions to help children build successful futures.',
      'cause.food.title': 'Food & Nutrition Program',
      'cause.food.desc': 'Ensure Ethiopian children receive three nutritious traditional meals daily, supplemented with vitamins to support their physical and mental development.',
      'cause.shelter.title': 'Safe Shelter & Housing',
      'cause.shelter.desc': 'Build and maintain safe, comfortable homes in Ethiopian communities where children can grow with dignity, security, and a sense of belonging.',
      'cause.healthcare.title': 'Healthcare & Medical Support',
      'cause.healthcare.desc': 'Provide essential healthcare services including regular checkups, vaccinations, dental care, and emergency medical treatment across Ethiopian regions.',
      'cause.mental.title': 'Mental Health & Counseling',
      'cause.mental.desc': 'Offer psychological support and trauma counseling to help Ethiopian children heal emotionally and develop healthy coping mechanisms.',
      'cause.skills.title': 'Skills Training & Development',
      'cause.skills.desc': 'Equip Ethiopian youth with vocational skills, computer literacy, and job readiness training for successful transition to independent living.',
      'cause.emergency.title': 'Emergency Relief Fund',
      'cause.emergency.desc': 'Rapid response fund for Ethiopian children affected by natural disasters or emergencies requiring immediate food, shelter, and medical aid.',
      'cause.sports.title': 'Sports & Recreation Programs',
      'cause.sports.desc': 'Provide opportunities for physical activity, traditional Ethiopian sports, arts, and recreational activities promoting healthy development.',
      
      // Gallery Page
      'gallery.title': 'Our Gallery',
      'gallery.subtitle': 'Witness the impact of your generosity through moments captured in our community',
      'gallery.allPhotos': 'All Photos',
      'gallery.noImages': 'No images found in this category',
      
      // Contact Page
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Get in touch with us. We\'d love to hear from you.',
      'contact.info': 'Contact Information',
      'contact.address': 'Address',
      'contact.phone': 'Phone',
      'contact.email': 'Email',
      'contact.followUs': 'Follow Us',
      'contact.sendMessage': 'Send us a Message',
      'contact.name': 'Your Name',
      'contact.yourEmail': 'Your Email',
      'contact.subject': 'Subject',
      'contact.message': 'Message',
      'contact.send': 'Send Message',
      
      // Sponsor/Donate Page
      'sponsor.title': 'Donate to Ethiopian Children',
      'sponsor.subtitle': 'Your monthly donation in Ethiopian Birr provides consistent, life-changing support. Join our community of donors making a lasting difference across all 12 Ethiopian regions.',
      'sponsor.monthlyDetails': 'Monthly Donation Details',
      'sponsor.selectAmount': 'Select Monthly Amount (Ethiopian Birr)',
      'sponsor.customAmount': 'Custom Amount (Birr)',
      'sponsor.enterAmount': 'Enter amount in Birr',
      'sponsor.supportArea': 'Support Area',
      'sponsor.whereMostNeeded': 'Where Most Needed',
      'sponsor.region': 'Ethiopian Region',
      'sponsor.anyRegion': 'Any Region',
      'sponsor.yourInfo': 'Your Information',
      'sponsor.firstName': 'First Name',
      'sponsor.lastName': 'Last Name',
      'sponsor.emailAddress': 'Email Address',
      'sponsor.phoneNumber': 'Phone Number',
      'sponsor.terms': 'I agree to monthly recurring donations and understand I can cancel anytime. I accept the terms and privacy policy.',
      'sponsor.proceedPayment': 'Proceed to Secure Payment',
      'sponsor.yourImpact': 'Your Impact',
      'sponsor.foodForChild': 'Food for 1 child',
      'sponsor.educationSupport': 'Education support',
      'sponsor.fullSupport': 'Full child support',
      'sponsor.multipleSupport': 'Multiple children support',
      'sponsor.secureTransparent': 'Secure & Transparent',
      'sponsor.bankEncryption': 'Bank-level encryption',
      'sponsor.impactUpdates': 'Regular impact updates',
      'sponsor.cancelAnytime': 'Cancel anytime',
      'sponsor.taxDeductible': 'Tax-deductible receipt',
      'sponsor.joinDonors': 'Join 15,000+ Donors',
      'sponsor.communityText': 'Our community has raised over ብር 100M this year, directly impacting 5,000+ Ethiopian children across all 12 regions.',
    },
    am: {
      // Navbar
      'nav.home': 'መነሻ',
      'nav.about': 'ስለ እኛ',
      'nav.causes': 'ምክንያቶች',
      'nav.donate': 'ይለግሱ',
      'nav.gallery': 'ምስሎች',
      'nav.contact': 'ያግኙን',
      'nav.login': 'ግባ',
      'nav.logout': 'ውጣ',
      'nav.dashboard': 'ዳሽቦርድ',
      'nav.adminPanel': 'የአስተዳዳሪ ፓነል',
      'nav.donateMonthly': 'በየወሩ ይለግሱ',
      
      // Hero Section
      'hero.title': 'የኢትዮጵያ ወላጅ አልባ ህጻናት እንክብካቤ',
      'hero.subtitle': 'ከአዲስ አበባ እስከ መቀሌ፣ ከባህር ዳር እስከ ሀዋሳ ባሉ የኢትዮጵያ ክልሎች ወላጅ አልባ ህጻናትን እንደግፋለን። በየወሩ በብር የሚደረግ ልገሳ ዘላቂ ለውጥ ይፈጥራል።',
      'hero.donateNow': 'አሁን ይለግሱ',
      'hero.learnMore': 'ተጨማሪ ይወቁ',
      
      // Stats
      'stats.childrenHelped': 'የተረዱ የኢትዮጵያ ህጻናት',
      'stats.raisedThisYear': 'በዚህ ዓመት የተሰበሰበ',
      'stats.educated': 'በክልሎች የተማሩ',
      'stats.regionalCenters': 'የክልል ማዕከላት',
      
      // Causes
      'causes.title': 'ምክንያቶቻችን',
      'causes.subtitle': 'በጣም አስፈላጊ የሆኑትን ምክንያቶች ይደግፉ። እያንዳንዱ አስተዋፅዖ በህጻናት ህይወት ላይ በቀጥታ ተጽዕኖ ያሳድራል።',
      'causes.viewAll': 'ሁሉንም ምክንያቶች ይመልከቱ',
      'causes.education': 'ትምህርት',
      'causes.food': 'ምግብ እና ስነ-ምግብ',
      'causes.shelter': 'ደህንነቱ የተጠበቀ መጠለያ',
      'causes.healthcare': 'ጤና አጠባበቅ',
      
      // Mission
      'mission.title': 'ተልዕኮአችን፡ ተስፋ እየገነባን',
      'mission.description': 'ከአዲስ አበባ እስከ መቀሌ፣ ከባህር ዳር እስከ ሀዋሳ ባሉ 12 የኢትዮጵያ ክልሎች ለወላጅ አልባ ህጻናት አጠቃላይ ድጋፍ እንሰጣለን።',
      'mission.detail': 'እያንዳንዱ የኢትዮጵያ ልጅ ፍቅር፣ ትምህርት፣ ትክክለኛ ምግብ እና ደህንነቱ የተጠበቀ ቤት ይገባዋል። በየወሩ በብር የሚደረግ ልገሳዎ በኢትዮጵያ ማህበረሰቦች ብሩህ ወደፊት እንድንገነባ ይረዳናል።',
      'mission.discover': 'ታሪካችንን ያውቁ',
      
      // CTA
      'cta.title': 'ዛሬ ለውጥ ይፍጠሩ',
      'cta.subtitle': 'በየወሩ በኢትዮጵያ ብር የሚደረግ ልገሳዎ በሁሉም ክልሎች ህይወትን የሚለውጥ ቋሚ ድጋፍ ይሰጣል። ለኢትዮጵያ ወላጅ አልባ ህጻናት ተስፋ እየገነቡ ከሺዎች ርህሩህ ለጋሾች ጋር ይቀላቀሉ።',
      'cta.contactUs': 'ያግኙን',
      
      // Footer
      'footer.tagline': 'የኢትዮጵያ ህጻናትን መደገፍ',
      'footer.description': 'በሁሉም 12 የኢትዮጵያ ክልሎች ለወላጅ አልባ ህጻናት አጠቃላይ እንክብካቤ እና ድጋፍ ለመስጠት ቆርጠናል።',
      'footer.quickLinks': 'ፈጣን አገናኞች',
      'footer.contact': 'ያግኙን',
      'footer.followUs': 'ይከተሉን',
      'footer.rights': 'መብቱ በህግ የተጠበቀ ነው።',
      
      // Login
      'login.donor': 'ለጋሽ',
      'login.admin': 'አስተዳዳሪ',
      'login.donorTitle': 'የለጋሽ መግቢያ',
      'login.adminTitle': 'የአስተዳዳሪ መግቢያ',
      'login.donorSubtitle': 'ወላጅ አልባ ህጻናትን ለመደገፍ እና ለውጥ ለማምጣት ይግቡ',
      'login.adminSubtitle': 'መድረኩን ለማስተዳደር የአስተዳዳሪ ፓነል ይድረሱ',
      'login.email': 'ኢሜይል',
      'login.password': 'የይለፍ ቃል',
      'login.fullName': 'ሙሉ ስም',
      'login.signIn': 'ግባ',
      'login.createAccount': 'መለያ ፍጠር',
      'login.haveAccount': 'መለያ አለዎት? ይግቡ',
      'login.noAccount': 'መለያ የለዎትም? ይመዝገቡ',
      'login.googleSignIn': 'በGoogle ይቀጥሉ',
      'login.testCredentials': 'የሙከራ ምስክርነቶች፡',
      
      // About Page
      'about.title': 'ስለ እኛ',
      'about.subtitle': 'በርህራሄ፣ በትምህርት እና በዘላቂ ድጋፍ በሁሉም 12 የኢትዮጵያ ክልሎች ለወላጅ አልባ ህጻናት ተስፋ እየገነባን እና ህይወትን እየለወጥን ነው።',
      'about.mission': 'ተልዕኮአችን',
      'about.missionText': 'በሁሉም 12 የኢትዮጵያ ክልሎች ለወላጅ አልባ ህጻናት አጠቃላይ እንክብካቤ፣ ጥራት ያለው ትምህርት፣ ባህላዊ የኢትዮጵያ ምግብ፣ ደህንነቱ የተጠበቀ መጠለያ እና ጤና አጠባበቅ በመስጠት ብሩህ ወደፊት እንዲገነቡ እና የኢትዮጵያ ማህበረሰብ አስተዋፅዖ አበርካቾች እንዲሆኑ ማብቃት።',
      'about.vision': 'ራዕያችን',
      'about.visionText': 'በሁሉም 12 ክልሎች እያንዳንዱ ወላጅ አልባ ልጅ ፍቅር፣ እንክብካቤ፣ ትምህርት እና እድሎች የሚያገኝበት ኢትዮጵያ - በጣም ተጋላጭ ለሆኑት በአገልግሎት የተዋሃደ ጠንካራ እና ርህሩህ የኢትዮጵያ ማህበረሰብ መገንባት።',
      'about.story': 'ታሪካችን',
      'about.storyP1': 'በ2010 የተመሰረተው የኢትዮጵያ ወላጅ አልባ ድጋፍ ቀላል ግን ኃይለኛ ራዕይ ነበረው፡ ወላጆቻቸውን ላጡ የኢትዮጵያ ህጻናት ተስፋ እና እድል መስጠት። በአዲስ አበባ 50 ህጻናትን የሚደግፍ ትንሽ ተነሳሽነት የጀመረው በሁሉም 12 የኢትዮጵያ ክልሎች ከ5,000 በላይ ህጻናትን የሚያገለግል ብሄራዊ እንቅስቃሴ ሆኗል።',
      'about.storyP2': 'በኢትዮጵያ የማህበረሰብ እና የርህራሄ እሴቶች የተነሳሱ መስራቾቻችን ወላጅ አልባ ህጻናት ከመሰረታዊ ፍላጎቶች በላይ የሚፈልጉትን ተገንዝበዋል - ፍቅር፣ ትምህርት፣ ጤና አጠባበቅ እና በኢትዮጵያ ባህል ላይ የተመሰረተ የባለቤትነት ስሜት ያስፈልጋቸዋል። ይህ አጠቃላይ አቀራረብ የስራችን መሰረት ሆኗል።',
      'about.storyP3': 'ዛሬ የኢትዮጵያ ወላጅ አልባ ድጋፍ በኢትዮጵያ ውስጥ 12 የክልል እንክብካቤ ማዕከላትን ያስተዳድራል - ከአዲስ አበባ እስከ መቀሌ፣ ከባህር ዳር እስከ ሀዋሳ። በመቶዎች የሚቆጠሩ ህጻናትን የሚያገለግሉ የትምህርት ፕሮግራሞችን እናስተዳድራለን፣ እና በየወሩ በኢትዮጵያ ብር ለሺዎች ቤተሰቦች ድጋፍ እንሰጣለን። በለጋሾች ማህበረሰባችን ለጋስ አስተዋፅዖ፣ ተደራሽነታችንን እያስፋፋን እና ተጽእኖአችንን እያጠበቅን ነው።',
      'about.storyP4': 'የምናገለግለው እያንዳንዱ የኢትዮጵያ ልጅ የጋራ ርህራሄ ኃይል እና ለአዎንታዊ ለውጥ አብረው የሚሰሩ የማህበረሰብ ዘላቂ መንፈስ ምስክር ነው።',
      'about.values': 'ዋና እሴቶቻችን',
      'about.valuesSubtitle': 'እነዚህ የኢትዮጵያ እሴቶች የምናደርገውን ሁሉ ይመራሉ እና በላቀ ሁኔታ እንድናገለግል ያነሳሱናል።',
      'about.impact': 'በቁጥር የምናሳየው ተጽእኖ',
      'about.childrenSupported': 'የተደገፉ የኢትዮጵያ ህጻናት',
      'about.regions': 'የኢትዮጵያ ክልሎች',
      'about.graduates': 'ተመራቂዎች',
      'about.donors': 'ወርሃዊ ለጋሾች',
      
      // Causes Page
      'causes.pageTitle': 'ምክንያቶቻችን',
      'causes.pageSubtitle': 'እያንዳንዱ ምክንያት በሁሉም 12 የኢትዮጵያ ክልሎች ለወላጅ አልባ ህጻናት ወደ ተስፋ፣ ክብር እና ብሩህ ወደፊት መንገድ ነው። በኢትዮጵያ ብር ድጋፍዎ ዘላቂ ለውጥ ያመጣል።',
      'causes.howItWorks': 'የኢትዮጵያ ብር ልገሳዎ እንዴት እንደሚሰራ',
      'causes.howItWorksText': 'ከእያንዳንዱ ብር ልገሳ 98% በሁሉም 12 የኢትዮጵያ ክልሎች ህጻናትን በሚደግፉ ፕሮግራሞቻችን በቀጥታ ይሄዳል። አስተዋፅዖዎ የኢትዮጵያ ህይወትን እንዴት እንደሚለውጥ በትክክል የሚያሳዩ መደበኛ የተጽእኖ ሪፖርቶችን በመስጠት ሙሉ ግልጽነትን እንጠብቃለን።',
      'causes.toPrograms': 'ወደ ፕሮግራሞች ይሄዳል',
      'causes.transparency': 'ግልጽነት',
      'causes.verified': 'የተረጋገጠ',
      'causes.impactReports': 'የተጽእኖ ሪፖርቶች',
      'causes.donateNow': 'አሁን ይለግሱ',
      
      // Individual Causes
      'cause.education.title': 'ለእያንዳንዱ የኢትዮጵያ ልጅ ትምህርት',
      'cause.education.desc': 'በሁሉም 12 የኢትዮጵያ ክልሎች ጥራት ያለው ትምህርት፣ የትምህርት መሳሪያዎች፣ ማስተማሪያ እና ሙያዊ ስልጠና በመስጠት ህጻናት ስኬታማ ወደፊት እንዲገነቡ ይረዳል።',
      'cause.food.title': 'የምግብ እና የስነ-ምግብ ፕሮግራም',
      'cause.food.desc': 'የኢትዮጵያ ህጻናት በቀን ሶስት ጤናማ ባህላዊ ምግቦችን እንዲያገኙ፣ የአካል እና የአእምሮ እድገታቸውን ለመደገፍ በቫይታሚኖች የተጨመረ።',
      'cause.shelter.title': 'ደህንነቱ የተጠበቀ መጠለያ እና መኖሪያ ቤት',
      'cause.shelter.desc': 'በኢትዮጵያ ማህበረሰቦች ውስጥ ህጻናት በክብር፣ በደህንነት እና በባለቤትነት ስሜት እንዲያድጉ ደህንነታቸው የተጠበቀ እና ምቹ ቤቶችን መገንባት እና መጠበቅ።',
      'cause.healthcare.title': 'የጤና እንክብካቤ እና የህክምና ድጋፍ',
      'cause.healthcare.desc': 'በኢትዮጵያ ክልሎች መደበኛ ምርመራዎችን፣ ክትባቶችን፣ የጥርስ እንክብካቤን እና የአደጋ ጊዜ የህክምና ህክምናን ጨምሮ አስፈላጊ የጤና አገልግሎቶችን መስጠት።',
      'cause.mental.title': 'የአእምሮ ጤና እና ምክር',
      'cause.mental.desc': 'የኢትዮጵያ ህጻናት በስሜታዊነት እንዲፈውሱ እና ጤናማ የመቋቋም ዘዴዎችን እንዲያዳብሩ የስነ-ልቦና ድጋፍ እና የአሰቃቂ ሁኔታ ምክር መስጠት።',
      'cause.skills.title': 'የክህሎት ስልጠና እና ልማት',
      'cause.skills.desc': 'የኢትዮጵያ ወጣቶች ወደ ራሳቸው ህይወት በተሳካ ሁኔታ እንዲሸጋገሩ በሙያዊ ክህሎቶች፣ በኮምፒውተር ማንበብና መጻፍ እና በስራ ዝግጁነት ስልጠና ማስታጠቅ።',
      'cause.emergency.title': 'የአደጋ ጊዜ እርዳታ ፈንድ',
      'cause.emergency.desc': 'በተፈጥሮ አደጋዎች ወይም አስቸኳይ ምግብ፣ መጠለያ እና የህክምና እርዳታ በሚፈልጉ ድንገተኛ ሁኔታዎች ለተጎዱ የኢትዮጵያ ህጻናት ፈጣን ምላሽ ፈንድ።',
      'cause.sports.title': 'የስፖርት እና የመዝናኛ ፕሮግራሞች',
      'cause.sports.desc': 'ጤናማ እድገትን የሚያበረታቱ የአካል ብቃት እንቅስቃሴ፣ ባህላዊ የኢትዮጵያ ስፖርቶች፣ ጥበባት እና የመዝናኛ እንቅስቃሴዎች እድሎችን መስጠት።',
      
      // Gallery Page
      'gallery.title': 'የእኛ ምስሎች',
      'gallery.subtitle': 'በማህበረሰባችን ውስጥ በተያዙ ጊዜያት የለጋስነትዎን ተጽእኖ ይመልከቱ',
      'gallery.allPhotos': 'ሁሉም ፎቶዎች',
      'gallery.noImages': 'በዚህ ምድብ ምስሎች አልተገኙም',
      
      // Contact Page
      'contact.title': 'ያግኙን',
      'contact.subtitle': 'ከእኛ ጋር ይገናኙ። ከእርስዎ መስማት እንፈልጋለን።',
      'contact.info': 'የመገኛ መረጃ',
      'contact.address': 'አድራሻ',
      'contact.phone': 'ስልክ',
      'contact.email': 'ኢሜይል',
      'contact.followUs': 'ይከተሉን',
      'contact.sendMessage': 'መልእክት ይላኩልን',
      'contact.name': 'ስምዎ',
      'contact.yourEmail': 'ኢሜይልዎ',
      'contact.subject': 'ርዕስ',
      'contact.message': 'መልእክት',
      'contact.send': 'መልእክት ላክ',
      
      // Sponsor/Donate Page
      'sponsor.title': 'ለኢትዮጵያ ህጻናት ይለግሱ',
      'sponsor.subtitle': 'በየወሩ በኢትዮጵያ ብር የሚደረግ ልገሳዎ ቋሚ፣ ህይወትን የሚለውጥ ድጋፍ ይሰጣል። በሁሉም 12 የኢትዮጵያ ክልሎች ዘላቂ ለውጥ እያመጡ ካሉ ለጋሾች ማህበረሰባችን ጋር ይቀላቀሉ።',
      'sponsor.monthlyDetails': 'የወርሃዊ ልገሳ ዝርዝሮች',
      'sponsor.selectAmount': 'የወርሃዊ መጠን ይምረጡ (የኢትዮጵያ ብር)',
      'sponsor.customAmount': 'ብጁ መጠን (ብር)',
      'sponsor.enterAmount': 'መጠን በብር ያስገቡ',
      'sponsor.supportArea': 'የድጋፍ አካባቢ',
      'sponsor.whereMostNeeded': 'በጣም የሚፈለግበት',
      'sponsor.region': 'የኢትዮጵያ ክልል',
      'sponsor.anyRegion': 'ማንኛውም ክልል',
      'sponsor.yourInfo': 'የእርስዎ መረጃ',
      'sponsor.firstName': 'ስም',
      'sponsor.lastName': 'የአባት ስም',
      'sponsor.emailAddress': 'የኢሜይል አድራሻ',
      'sponsor.phoneNumber': 'ስልክ ቁጥር',
      'sponsor.terms': 'ለወርሃዊ ተደጋጋሚ ልገሳዎች እስማማለሁ እና በማንኛውም ጊዜ መሰረዝ እንደምችል ተረድቻለሁ። ውሎችን እና የግላዊነት ፖሊሲን ተቀብያለሁ።',
      'sponsor.proceedPayment': 'ወደ ደህንነቱ የተጠበቀ ክፍያ ይቀጥሉ',
      'sponsor.yourImpact': 'የእርስዎ ተጽእኖ',
      'sponsor.foodForChild': 'ለ1 ልጅ ምግብ',
      'sponsor.educationSupport': 'የትምህርት ድጋፍ',
      'sponsor.fullSupport': 'ሙሉ የልጅ ድጋፍ',
      'sponsor.multipleSupport': 'የብዙ ህጻናት ድጋፍ',
      'sponsor.secureTransparent': 'ደህንነቱ የተጠበቀ እና ግልጽ',
      'sponsor.bankEncryption': 'የባንክ ደረጃ ምስጠራ',
      'sponsor.impactUpdates': 'መደበኛ የተጽእኖ ዝመናዎች',
      'sponsor.cancelAnytime': 'በማንኛውም ጊዜ ይሰርዙ',
      'sponsor.taxDeductible': 'ከግብር የሚቀነስ ደረሰኝ',
      'sponsor.joinDonors': 'ከ15,000+ ለጋሾች ጋር ይቀላቀሉ',
      'sponsor.communityText': 'ማህበረሰባችን በዚህ ዓመት ከብር 100 ሚሊዮን በላይ አሰባስቧል፣ በሁሉም 12 ክልሎች ከ5,000+ የኢትዮጵያ ህጻናት ላይ በቀጥታ ተጽእኖ ያሳድራል።',
    }
  };

  return translations[lang] || translations.en;
};
