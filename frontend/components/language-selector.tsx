'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, ArrowRight } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
]

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void
}

export function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('')

  const handleSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    setTimeout(() => {
      onLanguageSelect(languageCode)
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="particles-container">
        {/* Background particles */}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-strong max-w-4xl w-full p-8 md:p-12 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-4"
          >
            <Globe className="w-12 h-12 text-primary-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-cyan">
              TraffEye
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-2"
          >
            AI-Powered Smart Traffic Violation Detection
          </motion.p>
          
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            Select your preferred language / अपनी पसंदीदा भाषा चुनें
          </motion.p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleSelect(lang.code)}
              className={`language-card cursor-pointer ${
                selectedLanguage === lang.code
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'hover:border-primary-500/50'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {lang.code === 'en' && '🇺🇸'}
                  {lang.code === 'hi' && '🇮🇳'}
                  {lang.code === 'te' && '🇮🇳'}
                  {lang.code === 'ta' && '🇮🇳'}
                  {lang.code === 'kn' && '🇮🇳'}
                  {lang.code === 'mr' && '🇮🇳'}
                  {lang.code === 'bn' && '🇮🇳'}
                  {lang.code === 'gu' && '🇮🇳'}
                  {lang.code === 'ml' && '🇮🇳'}
                  {lang.code === 'pa' && '🇮🇳'}
                </div>
                <div className="font-semibold text-white mb-1">
                  {lang.name}
                </div>
                <div className="text-sm text-gray-400">
                  {lang.native}
                </div>
              </div>
              
              {selectedLanguage === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-dark-900" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedLanguage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLanguageSelect(selectedLanguage)}
              className="btn-primary text-lg px-8 py-3"
            >
              Continue to TraffEye
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </motion.button>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>TraffEye supports 10+ Indian languages for nationwide accessibility</p>
          <p className="mt-2">Your language preference will be saved for future visits</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
