export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚦 TraffEye
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered Traffic Violation Detection System
          </p>
        </header>

        <main className="space-y-8">
          <section className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎯 System Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-white">Frontend Working</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-white">API Routes Working</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-white">Deployment Success</div>
              </div>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              🚀 Features
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                AI-powered violation detection
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Multi-language support (10+ Indian languages)
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Real-time monitoring
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Automated e-challan generation
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Analytics dashboard
              </li>
            </ul>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              🌐 Test API Endpoints
            </h2>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <code className="text-green-400">GET /api/health</code>
                <p className="text-gray-400 text-sm mt-1">System health check</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <code className="text-green-400">GET /api/violations</code>
                <p className="text-gray-400 text-sm mt-1">Get all violations</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <code className="text-green-400">GET /api/users</code>
                <p className="text-gray-400 text-sm mt-1">Get all users</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center text-gray-400">
          <p>© 2024 TraffEye. All rights reserved.</p>
          <p className="text-sm mt-2">
            Successfully deployed on Vercel with Next.js 14
          </p>
        </footer>
      </div>
    </div>
  )
}
