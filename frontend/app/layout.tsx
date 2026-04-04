import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { LanguageProvider } from '@/components/language-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TraffEye - AI-Powered Smart Traffic Violation Detection',
  description: 'Futuristic smart city traffic monitoring platform with AI-powered violation detection and e-challan management',
  keywords: ['traffic violation', 'AI detection', 'smart city', 'e-challan', 'traffic monitoring'],
  authors: [{ name: 'TraffEye Team' }],
  openGraph: {
    title: 'TraffEye - Smart Traffic Violation Detection',
    description: 'AI-powered traffic violation detection and e-challan system',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <div className="relative min-h-screen bg-gradient-dark grid-background">
                <div className="particles-container">
                  {/* Particles will be rendered here */}
                </div>
                <div className="content-overlay">
                  {children}
                </div>
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22C55E',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
