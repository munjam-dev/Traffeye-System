'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/use-language'

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      title: t('features.aiDetection.title'),
      description: t('features.aiDetection.description'),
      icon: '🤖'
    },
    {
      title: t('features.multiLanguage.title'),
      description: t('features.multiLanguage.description'),
      icon: '🌐'
    },
    {
      title: t('features.realTime.title'),
      description: t('features.realTime.description'),
      icon: '⚡'
    },
    {
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
      icon: '📊'
    }
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-300">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
