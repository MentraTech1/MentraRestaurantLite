window.StoreProAd = function() {
    return (
        <div className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 group w-full shrink-0">
            <div className="absolute right-0 top-0 w-48 h-48 bg-[#EA580C] rounded-full mix-blend-screen filter blur-[70px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-[#EA580C] flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
                    <i className="fas fa-crown"></i>
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-black text-white">MentraResto <span className="text-amber-400">PRO</span></h3>
                    <p className="text-slate-400 font-bold text-xs leading-relaxed mt-1 max-w-md">
                        نظام إدارة مخازن سحابي مركزي، جرد آلي للفروع، وربط الموردين بالفواتير الإلكترونية.
                    </p>
                </div>
            </div>

            <div className="relative z-10 w-full md:w-auto shrink-0">
                <button onClick={() => window.open('https://wa.me/01211934816', '_blank')} className="w-full md:w-auto bg-gradient-to-l from-amber-500 to-[#EA580C] hover:from-amber-400 text-white font-black px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                    <i className="fab fa-whatsapp text-lg"></i> الترقية السحابية
                </button>
            </div>
        </div>
    );
};