'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Shield, Zap, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 grid-background opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center glass-strong px-4 py-2 rounded-full mb-8"
          >
            <Shield className="w-4 h-4 text-primary-500 mr-2" />
            <span className="text-sm text-gray-300">AI-Powered Traffic Enforcement</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-gradient-cyan">Smart Traffic</span>
            <br />
            <span className="text-white">Violation Detection</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Revolutionary AI-powered system that detects traffic violations in real-time,
            generates digital challans, and makes our roads safer.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="lg" className="btn-primary">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="btn-secondary">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <FeatureCard
              icon={<Camera className="w-8 h-8" />}
              title="AI Detection"
              description="Real-time violation detection using advanced computer vision"
              delay={0.7}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Processing"
              description="Process violations in seconds with automated challan generation"
              delay={0.8}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Reliable"
              description="Government-grade security with 99.9% uptime guarantee"
              delay={0.9}
            />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <StatCard number="99.5%" label="Detection Accuracy" />
          <StatCard number="<100ms" label="Processing Time" />
          <StatCard number="10M+" label="Vehicles Monitored" />
          <StatCard number="24/7" label="Live Monitoring" />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <FloatingElements />
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-hover p-6 text-center"
    >
      <div className="text-primary-500 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  )
}

interface StatCardProps {
  number: string
  label: string
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gradient-cyan mb-2">
        {number}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

function FloatingElements() {
  return (
    <>
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-20 h-20 glass-strong rounded-full hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-10 w-16 h-16 glass-strong rounded-full hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, -10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-40 right-20 w-12 h-12 glass-strong rounded-full hidden md:block"
      />
    </>
  )
}
