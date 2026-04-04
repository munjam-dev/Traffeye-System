'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'mr' | 'bn' | 'gu' | 'ml' | 'pa'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    'app.title': 'TraffEye - AI Traffic Violation Detection',
    'app.subtitle': 'Smart Traffic Monitoring System',
    'nav.dashboard': 'Dashboard',
    'nav.violations': 'Violations',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'hero.title': 'Smart Traffic Violation Detection',
    'hero.subtitle': 'AI-powered system for real-time traffic monitoring',
    'hero.getStarted': 'Get Started',
    'hero.watchDemo': 'Watch Demo',
    'features.aiDetection': 'AI Detection',
    'features.aiDetectionDesc': 'Real-time violation detection using computer vision',
    'features.instantProcessing': 'Instant Processing',
    'features.instantProcessingDesc': 'Process violations in seconds with automated challan generation',
    'features.secureReliable': 'Secure & Reliable',
    'features.secureReliableDesc': 'Government-grade security with 99.9% uptime',
    'violations.noHelmet': 'No Helmet',
    'violations.tripleRiding': 'Triple Riding',
    'violations.signalJump': 'Signal Jump',
    'violations.overspeeding': 'Overspeeding',
    'status.paid': 'Paid',
    'status.unpaid': 'Unpaid',
    'actions.pay': 'Pay Challan',
    'actions.viewDetails': 'View Details',
    'dashboard.totalViolations': 'Total Violations',
    'dashboard.helmetViolations': 'Helmet Violations',
    'dashboard.tripleRiding': 'Triple Riding',
    'dashboard.signalViolations': 'Signal Violations',
    'dashboard.paidChallans': 'Paid Challans',
    'dashboard.unpaidChallans': 'Unpaid Challans',
    
    // Additional keys for components
    'language.select': 'Select Language',
    'language.continue': 'Continue',
    'hero.cta': 'Get Started',
    'hero.demo': 'View Demo',
    'features.title': 'Powerful Features',
    'features.subtitle': 'Everything you need for modern traffic management',
    'features.multiLanguage.title': 'Multi-Language',
    'features.multiLanguage.description': 'Support for 10+ Indian languages',
    'features.realTime.title': 'Real-Time',
    'features.realTime.description': 'Instant violation detection and notification',
    'features.analytics.title': 'Analytics',
    'features.analytics.description': 'Comprehensive traffic analytics and insights',
    'analytics.title': 'Real-Time Analytics',
    'analytics.subtitle': 'Monitor traffic violations and system performance',
    'analytics.totalViolations': 'Total Violations',
    'analytics.activeCameras': 'Active Cameras',
    'analytics.revenue': 'Revenue Generated',
    'analytics.accuracy': 'Detection Accuracy',
    'analytics.chartTitle': 'Violation Trends',
    'analytics.chartPlaceholder': 'Interactive chart will appear here',
    'footer.description': 'AI-powered traffic violation detection system for smart cities',
    'footer.features': 'Features',
    'footer.aiDetection': 'AI Detection',
    'footer.realTime': 'Real-Time Monitoring',
    'footer.analytics': 'Analytics Dashboard',
    'footer.multiLanguage': 'Multi-Language Support',
    'footer.support': 'Support',
    'footer.documentation': 'Documentation',
    'footer.apiDocs': 'API Docs',
    'footer.contact': 'Contact',
    'footer.help': 'Help Center',
    'footer.connect': 'Connect',
    'footer.allRightsReserved': 'All rights reserved.',
    'live.title': 'Live Detection Preview',
    'live.subtitle': 'See AI detection in action',
    'live.placeholder': 'Live preview will appear here',
    'live.start': 'Start Detection',
    'live.stop': 'Stop Detection',
  },
  hi: {
    'app.title': 'ट्रैफआई - AI ट्रैफिक उल्लंघन पहचान',
    'app.subtitle': 'स्मार्ट ट्रैफिक मॉनिटरिंग सिस्टम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.violations': 'उल्लंघन',
    'nav.analytics': 'विश्लेषण',
    'nav.settings': 'सेटिंग्स',
    'hero.title': 'स्मार्ट ट्रैफिक उल्लंघन पहचान',
    'hero.subtitle': 'रीयल-टाइम ट्रैफिक मॉनिटरिंग के लिए AI-संचालित सिस्टम',
    'hero.getStarted': 'शुरू करें',
    'hero.watchDemo': 'डेमो देखें',
    'features.aiDetection': 'AI पहचान',
    'features.aiDetectionDesc': 'कंप्यूटर विजन का उपयोग करके रीयल-टाइम उल्लंघन पहचान',
    'features.instantProcessing': 'तत्काल प्रसंस्करण',
    'features.instantProcessingDesc': 'स्वचालित चालान जनरेशन के साथ सेकंड में उल्लंघन प्रोसेस करें',
    'features.secureReliable': 'सुरक्षित और विश्वसनीय',
    'features.secureReliableDesc': 'सरकारी-ग्रेड सुरक्षा 99.9% अपटाइम के साथ',
    'violations.noHelmet': 'बिना हेलमेट',
    'violations.tripleRiding': 'तिपहिया सवारी',
    'violations.signalJump': 'सिग्नल जंप',
    'violations.overspeeding': 'ओवरस्पीडिंग',
    'status.paid': 'भुगतान किया गया',
    'status.unpaid': 'अभी तक भुगतान नहीं',
    'actions.pay': 'चालान भुगतान करें',
    'actions.viewDetails': 'विवरण देखें',
    'dashboard.totalViolations': 'कुल उल्लंघन',
    'dashboard.helmetViolations': 'हेलमेट उल्लंघन',
    'dashboard.tripleRiding': 'तिपहिया सवारी',
    'dashboard.signalViolations': 'सिग्नल उल्लंघन',
    'dashboard.paidChallans': 'भुगतान किए गए चालान',
    'dashboard.unpaidChallans': 'अभी तक भुगतान नहीं किए गए चालान',
  },
  // Add other languages similarly...
  te: {
    'app.title': 'ట్రాఫ్‌ఐ - AI ట్రాఫిక్ ఉల్లంఘన గుర్తింపు',
    'app.subtitle': 'స్మార్ట్ ట్రాఫిక్ మానిటరింగ్ సిస్టమ్',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.violations': 'ఉల్లంఘనలు',
    'nav.analytics': 'విశ్లేషణలు',
    'nav.settings': 'సెట్టింగ్‌లు',
    'hero.title': 'స్మార్ట్ ట్రాఫిక్ ఉల్లంఘన గుర్తింపు',
    'hero.subtitle': 'రియల్-టైమ్ ట్రాఫిక్ మానిటరింగ్ కోసం AI-ఆధారిత సిస్టమ్',
    'hero.getStarted': 'ప్రారంభించండి',
    'hero.watchDemo': 'డెమో చూడండి',
    'violations.noHelmet': 'హెల్మెట్ లేకుండా',
    'violations.tripleRiding': 'ముగ్గురు సవారీ',
    'status.paid': 'చెల్లించబడింది',
    'status.unpaid': 'ఇంకా చెల్లించబడలేదు',
    'actions.pay': 'చలాన్ చెల్లించండి',
    'actions.viewDetails': 'వివరాలు చూడండి',
  },
  ta: {
    'app.title': 'ட்ராஃப்ஐ - AI போக்குவரத்து மீறல் கண்டறிதல்',
    'app.subtitle': 'ஸ்மார்ட் போக்குவரத்து கண்காணிப்பு அமைப்பு',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.violations': 'மீறல்கள்',
    'nav.analytics': 'பகுப்பாய்வுகள்',
    'nav.settings': 'அமைப்புகள்',
    'hero.title': 'ஸ்மார்ட் போக்குவரத்து மீறல் கண்டறிதல்',
    'hero.subtitle': 'ரியல்-டைம் போக்குவரத்து கண்காணிப்புக்கு AI-இயக்கப்பட்ட அமைப்பு',
    'hero.getStarted': 'தொடங்கு',
    'hero.watchDemo': 'டெமோ பார்க்க',
    'violations.noHelmet': 'தலைக்கவசம் இல்லாமல்',
    'violations.tripleRiding': 'மூன்று பேர் சவாரி',
    'status.paid': 'செலுத்தப்பட்டது',
    'status.unpaid': 'இன்னும் செலுத்தப்படவில்லை',
    'actions.pay': 'சலான் செலுத்து',
    'actions.viewDetails': 'விவரங்களைக் காண்க',
  },
  kn: {
    'app.title': 'ಟ್ರಾಫ್‌ಐ - AI ಟ್ರಾಫಿಕ್ ಉಲ್ಲಂಘನೆ ಪತ್ತೆ',
    'app.subtitle': 'ಸ್ಮಾರ್ಟ್ ಟ್ರಾಫಿಕ್ ಮಾನಿಟರಿಂಗ್ ಸಿಸ್ಟಮ್',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.violations': 'ಉಲ್ಲಂಘನೆಗಳು',
    'nav.analytics': 'ವಿಶ್ಲೇಷಣೆಗಳು',
    'nav.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'hero.title': 'ಸ್ಮಾರ್ಟ್ ಟ್ರಾಫಿಕ್ ಉಲ್ಲಂಘನೆ ಪತ್ತೆ',
    'hero.subtitle': 'ರಿಯಲ್-ಟೈಮ್ ಟ್ರಾಫಿಕ್ ಮಾನಿಟರಿಂಗ್‌ಗಾಗಿ AI-ಚಾಲಿತ ಸಿಸ್ಟಮ್',
    'hero.getStarted': 'ಪ್ರಾರಂಭಿಸಿ',
    'hero.watchDemo': 'ಡೆಮೊ ನೋಡಿ',
    'violations.noHelmet': 'ಹೆಲ್ಮೆಟ್ ಇಲ್ಲದೆ',
    'violations.tripleRiding': 'ಮೂವರು ಸವಾರಿ',
    'status.paid': 'ಪಾವತಿಸಲಾಗಿದೆ',
    'status.unpaid': 'ಇನ್ನೂ ಪಾವತಿಸಲಾಗಿಲ್ಲ',
    'actions.pay': 'ಚಲಾನ್ ಪಾವತಿಸಿ',
    'actions.viewDetails': 'ವಿವರಗಳನ್ನು ನೋಡಿ',
  },
  mr: {
    'app.title': 'ट्रॅफआय - AI ट्रॅफिक उल्लंघन शोध',
    'app.subtitle': 'स्मार्ट ट्रॅफिक निरीक्षण प्रणाली',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.violations': 'उल्लंघने',
    'nav.analytics': 'विश्लेषण',
    'nav.settings': 'सेटिंग्ज',
    'hero.title': 'स्मार्ट ट्रॅफिक उल्लंघन शोध',
    'hero.subtitle': 'रियल-टाइम ट्रॅफिक निरीक्षणासाठी AI-चालित प्रणाली',
    'hero.getStarted': 'सुरू करा',
    'hero.watchDemo': 'डेमो पहा',
    'violations.noHelmet': 'शिरस्त्राण विना',
    'violations.tripleRiding': 'तिघा सवारी',
    'status.paid': 'भरलेले',
    'status.unpaid': 'अजून भरलेले नाही',
    'actions.pay': 'चलन भरा',
    'actions.viewDetails': 'तपशील पहा',
  },
  bn: {
    'app.title': 'ট্র্যাফআই - AI ট্রাফিক লঙ্ঘন সনাক্তকরণ',
    'app.subtitle': 'স্মার্ট ট্রাফিক মনিটরিং সিস্টেম',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.violations': 'লঙ্ঘন',
    'nav.analytics': 'বিশ্লেষণ',
    'nav.settings': 'সেটিংস',
    'hero.title': 'স্মার্ট ট্রাফিক লঙ্ঘন সনাক্তকরণ',
    'hero.subtitle': 'রিয়েল-টাইম ট্রাফিক মনিটরিংয়ের জন্য AI-চালিত সিস্টেম',
    'hero.getStarted': 'শুরু করুন',
    'hero.watchDemo': 'ডেমো দেখুন',
    'violations.noHelmet': 'হেলমেট ছাড়া',
    'violations.tripleRiding': 'তিন জন আরোহী',
    'status.paid': 'পরিশোধিত',
    'status.unpaid': 'এখনও পরিশোধিত হয়নি',
    'actions.pay': 'চালান পরিশোধ করুন',
    'actions.viewDetails': 'বিস্তারিত দেখুন',
  },
  gu: {
    'app.title': 'ટ્રાફઆય - AI ટ્રાફિક ઉલ્લંઘન શોધ',
    'app.subtitle': 'સ્માર્ટ ટ્રાફિક મોનિટરિંગ સિસ્ટમ',
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.violations': 'ઉલ્લંઘનો',
    'nav.analytics': 'વિશ્લેષણ',
    'nav.settings': 'સેટિંગ્સ',
    'hero.title': 'સ્માર્ટ ટ્રાફિક ઉલ્લંઘન શોધ',
    'hero.subtitle': 'રિયલ-ટાઇમ ટ્રાફિક મોનિટરિંગ માટે AI-સંચાલિત સિસ્ટમ',
    'hero.getStarted': 'શરૂ કરો',
    'hero.watchDemo': 'ડેમો જુઓ',
    'violations.noHelmet': 'હેલ્મેટ વગર',
    'violations.tripleRiding': 'ત્રણ સવારી',
    'status.paid': 'ચૂકવાયેલ',
    'status.unpaid': 'હજુ ચૂકવાયેલ નથી',
    'actions.pay': 'ચલણ ચૂકવો',
    'actions.viewDetails': 'વિગતો જુઓ',
  },
  ml: {
    'app.title': 'ട്രാഫ്‌ഐ - AI ട്രാഫിക് ലംഘന തിരിച്ചറിയൽ',
    'app.subtitle': 'സ്മാർട്ട് ട്രാഫിക് മോണിറ്ററിംഗ് സിസ്റ്റം',
    'nav.dashboard': 'ഡാഷ്ബോർഡ്',
    'nav.violations': 'ലംഘനങ്ങൾ',
    'nav.analytics': 'അനലിറ്റിക്സ്',
    'nav.settings': 'ക്രമീകരണങ്ങൾ',
    'hero.title': 'സ്മാർട്ട് ട്രാഫിക് ലംഘന തിരിച്ചറിയൽ',
    'hero.subtitle': 'റിയൽ-ടൈം ട്രാഫിക് മോണിറ്ററിംഗിനായി AI-പ്രവർത്തിപ്പെടുന്ന സിസ്റ്റം',
    'hero.getStarted': 'ആരംഭിക്കുക',
    'hero.watchDemo': 'ഡെമോ കാണുക',
    'violations.noHelmet': 'ഹെൽമെറ്റ് ഇല്ലാതെ',
    'violations.tripleRiding': 'മൂന്ന് യാത്രക്കാർ',
    'status.paid': 'അടച്ചു',
    'status.unpaid': 'ഇതുവരെ അടച്ചിട്ടില്ല',
    'actions.pay': 'ചലാൻ അടയ്ക്കുക',
    'actions.viewDetails': 'വിശദാംശങ്ങൾ കാണുക',
  },
  pa: {
    'app.title': 'ਟ੍ਰਾਫਆਈ - AI ਟ੍ਰਾਫਿਕ ਉਲੰਘਣ ਦੀ ਪਛਾਣ',
    'app.subtitle': 'ਸਮਾਰਟ ਟ੍ਰਾਫਿਕ ਨਿਗਰਾਨੀ ਸਿਸਟਮ',
    'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'nav.violations': 'ਉਲੰਘਣਾਂ',
    'nav.analytics': 'ਵਿਸ਼ਲੇਸ਼ਣ',
    'nav.settings': 'ਸੈਟਿੰਗਾਂ',
    'hero.title': 'ਸਮਾਰਟ ਟ੍ਰਾਫਿਕ ਉਲੰਘਣ ਦੀ ਪਛਾਣ',
    'hero.subtitle': 'ਰੀਅਲ-ਟਾਈਮ ਟ੍ਰਾਫਿਕ ਨਿਗਰਾਨੀ ਲਈ AI-ਚਲਾਇਤ ਸਿਸਟਮ',
    'hero.getStarted': 'ਸ਼ੁਰੂ ਕਰੋ',
    'hero.watchDemo': 'ਡੈਮੋ ਵੇਖੋ',
    'violations.noHelmet': 'ਬਿਨਾਂ ਹੈਲਮਟ',
    'violations.tripleRiding': 'ਤਿੰਨ ਸਵਾਰੀ',
    'status.paid': 'ਅਦਾ ਕੀਤਾ',
    'status.unpaid': 'ਹਾਲੇ ਤੱਕ ਅਦਾ ਨਹੀਂ ਕੀਤਾ',
    'actions.pay': 'ਚਲਾਨ ਅਦਾ ਕਰੋ',
    'actions.viewDetails': 'ਵੇਰਵਾ ਵੇਖੋ',
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('traffeye-language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('traffeye-language', lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
