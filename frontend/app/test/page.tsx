export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🚦 TraffEye Test Page</h1>
        <p className="text-xl mb-4">AI Traffic Violation Detection System</p>
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-2">✅ Deployment Success!</h2>
          <p>Your TraffEye system is working correctly on Vercel.</p>
        </div>
        <div className="mt-8 space-y-2">
          <p>✅ Next.js 14 App Router</p>
          <p>✅ TypeScript</p>
          <p>✅ Tailwind CSS</p>
          <p>✅ Framer Motion</p>
          <p>✅ API Routes Working</p>
        </div>
      </div>
    </div>
  )
}
