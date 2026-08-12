import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Main Glass Container */}
      <div className="glass-panel max-w-4xl w-full rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        
        {/* Top Accents */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 opacity-80" />
        
        <div className="flex justify-center mb-6">
          <Image 
            src="/jpan-logo-color.png" 
            alt="JPAN Logo" 
            width={140} 
            height={140} 
            className="object-contain drop-shadow-lg"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mb-4 drop-shadow-sm">
          Unit Perolehan <span className="text-blue-600 dark:text-blue-400">JPAN</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
          Sistem Pengurusan & Pengesanan Dokumen Bersepadu
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-1 text-center"
          >
            Log Masuk Sistem
          </Link>
          <Link 
            href="/dashboard" 
            className="px-8 py-4 bg-white/70 hover:bg-white/90 text-slate-800 rounded-xl font-bold text-lg transition-all duration-300 shadow-sm border border-slate-200/50 backdrop-blur-sm hover:shadow-md hover:-translate-y-1 text-center"
          >
            Semak Status Dokumen
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {["Sebut Harga & Tender", "Pakej, Latihan & Waran", "Katering & Sajian", "Pengangkutan & Penginapan"].map((category, idx) => (
            <span key={idx} className="px-4 py-2 rounded-full bg-white/40 dark:bg-black/20 border border-white/50 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
              {category}
            </span>
          ))}
        </div>

      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} Jabatan Perkhidmatan Awam Negeri Sabah
      </div>
    </div>
  );
}
