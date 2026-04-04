'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/use-language'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              🚦 TraffEye
            </h3>
            <p className="text-gray-300">
              {t('footer.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('footer.features')}
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>{t('footer.aiDetection')}</li>
              <li>{t('footer.realTime')}</li>
              <li>{t('footer.analytics')}</li>
              <li>{t('footer.multiLanguage')}</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>{t('footer.documentation')}</li>
              <li>{t('footer.apiDocs')}</li>
              <li>{t('footer.contact')}</li>
              <li>{t('footer.help')}</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('footer.connect')}
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-gray-400">
            © 2024 TraffEye. {t('footer.allRightsReserved')}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
