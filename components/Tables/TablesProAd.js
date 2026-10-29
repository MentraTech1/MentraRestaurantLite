window.TablesProAd = function() {
    return (
        <div className="mt-4 md:mt-6 animate-view relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] rounded-3xl p-6 md:p-8 shadow-2xl border border-indigo-500/30 w-full group shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-fuchsia-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="text-center md:text-right flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-[10px] md:text-xs font-black mb-4 shadow-inner">
                        <i className="fas fa-crown text-yellow-400 animate-pulse"></i> ارتقِ لأعلى مستوى
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                        MentraResto <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-fuchsia-400">PRO</span>
                    </h3>
                    <p className="text-slate-300 font-bold text-sm md:text-base leading-relaxed max-w-2xl text-opacity-90">
                        نسخة الكلاود الشاملة! اربط الكاشير بشاشات المطبخ الذكية (KDS)، تابع تقارير الأرباح والمخازن من موبايلك في أي مكان، واستمتع بدعم فني متواصل ومزامنة فورية للبيانات.
                    </p>
                </div>
                
                <a href="https://wa.me/201211934816" target="_blank" className="w-full md:w-auto bg-gradient-to-l from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white font-black px-8 py-4 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(99,102,241,0.6)] flex items-center justify-center gap-3 shrink-0 whitespace-nowrap text-sm md:text-base group/btn">
                    تواصل للترقية الآن
                    <i className="fas fa-arrow-left group-hover/btn:-translate-x-1 transition-transform"></i>
                </a>
            </div>
        </div>
    );
};