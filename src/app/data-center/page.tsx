'use client'

import { useState, useEffect } from 'react'

export default function DataCenterPage() {
  const [stats, setStats] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleCandlesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Extract timeframe from filename (e.g., CandleData_EURUSD_H1.csv -> H1)
    const match = file.name.match(/_([A-Z0-9]+)\.csv$/i)
    const timeframe = match ? match[1] : 'UNKNOWN'

    setUploading(true)
    setProgress(0)
    setMessage(`جاري رفع ${file.name}...`)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('timeframe', timeframe)

    try {
      const res = await fetch('/api/upload-candles', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      
      if (result.success) {
        setMessage(`✅ تم رفع ${result.inserted} شمعة جديدة، تم تخطي ${result.skipped} مكررة`)
        fetchStats()
      } else {
        setMessage(`❌ خطأ: ${result.error}`)
      }
    } catch (error: any) {
      setMessage(`❌ خطأ: ${error.message}`)
    } finally {
      setUploading(false)
      setProgress(100)
    }
  }

  const handleNewsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)
    setMessage('جاري رفع ملف الأخبار...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-news', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      
      if (result.success) {
        setMessage(`✅ تم رفع ${result.inserted} خبر جديد، تم تخطي ${result.skipped} مكرر`)
        fetchStats()
      } else {
        setMessage(`❌ خطأ: ${result.error}`)
      }
    } catch (error: any) {
      setMessage(`❌ خطأ: ${error.message}`)
    } finally {
      setUploading(false)
      setProgress(100)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          🧬 مركز بيانات EuroDNA
        </h1>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📊 رفع ملفات الشموع</h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleCandlesUpload}
              disabled={uploading}
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50"
            />
            <p className="text-white/70 text-sm mt-2">
              اختر ملف CSV (مثال: CandleData_EURUSD_H1.csv)
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📰 رفع ملف الأخبار</h2>
            <input
              type="file"
              accept=".json"
              onChange={handleNewsUpload}
              disabled={uploading}
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50"
            />
            <p className="text-white/70 text-sm mt-2">
              اختر ملف JSON (news.json)
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white text-center mt-2">{message}</p>
          </div>
        )}

        {message && !uploading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 mb-8">
            <p className="text-white text-center">{message}</p>
          </div>
        )}

        {/* Stats Section */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">📈 بيانات الشموع</h3>
              <p className="text-3xl font-bold text-purple-400 mb-4">
                {stats.candles.total.toLocaleString()}
              </p>
              <div className="space-y-2">
                {Object.entries(stats.candles.timeframes || {}).map(([tf, data]: [string, any]) => (
                  <div key={tf} className="flex justify-between text-white/80">
                    <span>{tf}:</span>
                    <span className="font-mono">{data.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">📰 الأخبار</h3>
              <p className="text-3xl font-bold text-pink-400 mb-4">
                {stats.news.total.toLocaleString()}
              </p>
              {stats.news.minDate && (
                <div className="text-white/80 text-sm">
                  <p>من: {new Date(stats.news.minDate).toLocaleDateString('ar-EG')}</p>
                  <p>إلى: {new Date(stats.news.maxDate).toLocaleDateString('ar-EG')}</p>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">⚙️ المهام</h3>
              <div className="space-y-2 text-white/80">
                <div className="flex justify-between">
                  <span>المكتملة:</span>
                  <span className="text-green-400 font-bold">{stats.jobs.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span>قيد التنفيذ:</span>
                  <span className="text-yellow-400 font-bold">{stats.jobs.running}</span>
                </div>
                <div className="flex justify-between">
                  <span>فشلت:</span>
                  <span className="text-red-400 font-bold">{stats.jobs.failed}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
