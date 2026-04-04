'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/use-language'

export function AnalyticsPreview() {
  const { t } = useLanguage()

  const stats = [
    { label: t('analytics.totalViolations'), value: '1,234', change: '+12%' },
    { label: t('analytics.activeCameras'), value: '45', change: '+5' },
    { label: t('analytics.revenue'), value: '₹2.3L', change: '+18%' },
    { label: t('analytics.accuracy'), value: '98.5%', change: '+0.5%' }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('analytics.title')}
          </h2>
          <p className="text-xl text-gray-300">
            {t('analytics.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-300">
                  {stat.label}
                </h3>
                <span className="text-green-400 text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-white">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            {t('analytics.chartTitle')}
          </h3>
          <div className="h-64 flex items-center justify-center bg-black/30 rounded-lg">
            <p className="text-gray-400">
              {t('analytics.chartPlaceholder')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
