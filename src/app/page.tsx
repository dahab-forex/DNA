import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-white mb-6">
          🧬 EuroDNA
        </h1>
        <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
          نظام تحليل متقدم لمستويات الأسعار في زوج اليورو/دولار
        </p>
        
        <Link
          href="/data-center"
          className="inline-block px-8 py-4 bg-white text-purple-900 font-bold text-xl rounded-full hover:bg-purple-100 transition-all transform hover:scale-105 shadow-2xl"
        >
          🚀 الدخول إلى مركز البيانات
        </Link>

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">بيانات الشموع</h3>
            <p className="text-white/70">رفع وإدارة بيانات الشموع لجميع الفترات الزمنية</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-white mb-2">الأخبار الاقتصادية</h3>
            <p className="text-white/70">تتبع الأحداث الاقتصادية وتأثيرها على الأسعار</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-xl font-bold text-white mb-2">التحليل الذكي</h3>
            <p className="text-white/70">منع إعادة التحليل وحفظ النتائج تلقائياً</p>
          </div>
        </div>
      </div>
    </div>
  )
}
