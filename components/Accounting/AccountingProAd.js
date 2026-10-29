window.AccountingProAd = function() {
    return (
        <div className="mt-8 bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-center shadow-xl border border-yellow-500/20 relative overflow-hidden group w-full shrink-0">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl group-hover:bg-yellow-500/30 transition-colors"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#EA580C]/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-4 transform -rotate-6 group-hover:rotate-0 transition-transform">
                    <i className="fas fa-crown text-3xl text-white"></i>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">ارتقِ بأعمالك مع <span className="text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 to-yellow-200">النسخة المدفوعة</span>!</h3>
                <p className="text-sm font-bold text-slate-300 mb-6 max-w-lg mx-auto">
                    احصل على تقارير مالية متقدمة، مزامنة سحابية للفروع، حسابات موردين ورواتب الموظفين، ودعم فني مباشر لضمان نجاح مطعمك.
                </p>
                <a href="https://wa.me/201211934816" target="_blank" className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base transition-transform active:scale-95 shadow-[0_10px_20px_rgba(37,211,102,0.3)] w-full sm:w-auto">
                    <i className="fab fa-whatsapp text-2xl"></i><span>تواصل معنا الآن: 01211934816</span>
                </a>
            </div>
        </div>
    );
};