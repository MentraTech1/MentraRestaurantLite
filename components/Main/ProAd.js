window.MainProAd = function() {
    return (
        <div className="mt-8 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group w-full shrink-0">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#EA580C] rounded-full mix-blend-screen filter blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-amber-500 rounded-full mix-blend-screen filter blur-[60px] opacity-10"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-right gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-[#EA580C] p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-500 text-3xl">
                        <i className="fas fa-crown"></i>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">MentraResto <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">PRO</span></h3>
                        <span className="bg-amber-500/20 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-500/30">الإصدار السحابي</span>
                    </div>
                    <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-lg">
                        ارتقِ بمطعمك لمستوى آخر! مزامنة سحابية، إدارة فروع متعددة، تقارير تحليلية ذكية بالذكاء الاصطناعي، وربط مع تطبيقات التوصيل.
                    </p>
                </div>
            </div>

            <div className="relative z-10 w-full md:w-auto shrink-0">
                <button onClick={() => window.open('https://wa.me/01211934816', '_blank')} className="w-full md:w-auto bg-gradient-to-l from-amber-500 to-[#EA580C] hover:from-amber-400 hover:to-orange-500 text-white font-black px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1">
                    <i className="fas fa-rocket text-xl"></i>
                    الترقية للنسخة السحابية
                </button>
                <p className="text-center text-[10px] text-slate-500 font-bold mt-2">تواصل معنا لمعرفة الباقات والأسعار</p>
            </div>
        </div>
    );
};