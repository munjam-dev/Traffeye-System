'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Camera, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LivePreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedViolation, setSelectedViolation] = useState<number | null>(null)

  const mockViolations = [
    {
      id: 1,
      type: 'No Helmet',
      vehicle: 'MH12 AB 1234',
      time: '2:34 PM',
      location: 'Main Street & 5th Avenue',
      status: 'unpaid',
      confidence: 0.95
    },
    {
      id: 2,
      type: 'Triple Riding',
      vehicle: 'MH15 CD 5678',
      time: '2:31 PM',
      location: 'Highway 20, Exit 15',
      status: 'unpaid',
      confidence: 0.88
    },
    {
      id: 3,
      type: 'No Helmet',
      vehicle: 'MH20 EF 9012',
      time: '2:28 PM',
      location: 'City Center Plaza',
      status: 'paid',
      confidence: 0.92
    }
  ]

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live <span className="text-gradient-cyan">Detection</span> Preview
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience real-time traffic violation detection with our advanced AI system
          </p>
        </motion.div>

        {/* Main Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass-strong p-6">
              {/* Video Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Camera className="w-5 h-5 text-primary-500 mr-2" />
                  <span className="text-white font-semibold">Camera 01 - Main Street</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-sm text-gray-400">LIVE</span>
                </div>
              </div>

              {/* Video Placeholder */}
              <div className="relative bg-dark-800 rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
                
                {/* Mock Detection Overlay */}
                <div className="absolute inset-0 p-4">
                  <div className="border-2 border-primary-500 rounded-lg absolute top-20 left-10 w-32 h-24">
                    <div className="absolute -top-6 left-0 bg-primary-500 text-dark-900 text-xs px-2 py-1 rounded">
                      No Helmet (95%)
                    </div>
                  </div>
                  <div className="border-2 border-warning rounded-lg absolute top-40 right-20 w-40 h-32">
                    <div className="absolute -top-6 left-0 bg-warning text-white text-xs px-2 py-1 rounded">
                      Triple Riding (88%)
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="glass hover:bg-white/10"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <div className="text-sm text-gray-300">
                      2:34 PM - Real-time Detection
                    </div>
                  </div>
                </div>
              </div>

              {/* Detection Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="glass p-3 text-center">
                  <div className="text-2xl font-bold text-primary-500">12</div>
                  <div className="text-xs text-gray-400">Detections</div>
                </div>
                <div className="glass p-3 text-center">
                  <div className="text-2xl font-bold text-warning">3</div>
                  <div className="text-xs text-gray-400">Violations</div>
                </div>
                <div className="glass p-3 text-center">
                  <div className="text-2xl font-bold text-success">94%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Violations List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-strong p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Violations</h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mockViolations.map((violation, index) => (
                  <motion.div
                    key={violation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedViolation(violation.id)}
                    className={`glass-hover p-3 cursor-pointer border-l-4 ${
                      selectedViolation === violation.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          {violation.status === 'unpaid' ? (
                            <AlertTriangle className="w-4 h-4 text-warning mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-success mr-2" />
                          )}
                          <span className="text-white font-medium text-sm">
                            {violation.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {violation.vehicle} • {violation.time}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {violation.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          {Math.round(violation.confidence * 100)}%
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          violation.status === 'unpaid'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-success/20 text-success'
                        }`}>
                          {violation.status}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selected Violation Details */}
              {selectedViolation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-gray-700"
                >
                  <div className="glass p-3">
                    <h4 className="text-white font-medium mb-2">Violation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fine Amount:</span>
                        <span className="text-warning font-medium">₹500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Due Date:</span>
                        <span className="text-white">15 Dec 2024</span>
                      </div>
                      <Button size="sm" className="w-full btn-primary mt-3">
                        Pay Challan
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FeatureHighlight
            icon={<Camera className="w-6 h-6" />}
            title="Multi-Camera Support"
            description="Monitor multiple intersections simultaneously with unified dashboard"
          />
          <FeatureHighlight
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Real-time Alerts"
            description="Instant notifications for critical violations requiring immediate attention"
          />
          <FeatureHighlight
            icon={<CheckCircle className="w-6 h-6" />}
            title="High Accuracy"
            description="Advanced AI ensures 95%+ accuracy in violation detection"
          />
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureHighlightProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureHighlight({ icon, title, description }: FeatureHighlightProps) {
  return (
    <div className="glass-hover p-6 text-center">
      <div className="text-primary-500 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}
