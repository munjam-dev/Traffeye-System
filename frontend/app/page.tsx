'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Particles } from '@/components/particles'
import { LanguageSelector } from '@/components/language-selector'
import { HeroSection } from '@/components/hero-section'
import { LivePreview } from '@/components/live-preview'
import { FeaturesSection } from '@/components/features-section'
import { AnalyticsPreview } from '@/components/analytics-preview'
import { Footer } from '@/components/footer'
import { useLanguage } from '@/hooks/use-language'

export default function HomePage() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const { t, language } = useLanguage()

  useEffect(() => {
    // Check if language is already selected
    const savedLanguage = localStorage.getItem('traffeye-language')
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
      setShowLanguageSelector(false)
    }
  }, [])

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang)
    localStorage.setItem('traffeye-language', lang)
    setShowLanguageSelector(false)
  }

  if (showLanguageSelector) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />
  }

  return (
    <div className="min-h-screen">
      <Particles />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Live Preview */}
      <LivePreview />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Analytics Preview */}
      <AnalyticsPreview />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
