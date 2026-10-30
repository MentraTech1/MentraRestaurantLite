window.BackupLoaderOverlay = function({ isLoading, loadingText, progress = null }) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-view p-4">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-sm text-center border border-slate-100">
                <div className="relative mb-4 md:mb-6">
                    <i className="fas fa-database text-5xl text-[#EA580C] animate-bounce"></i>
                    {progress !== null && (
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                            {progress}%
                        </div>
                    )}
                </div>
                
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2">الرجاء الانتظار</h3>
                <p className="text-xs md:text-sm font-bold text-slate-500 leading-relaxed min-h-[40px] flex items-center justify-center">
                    {loadingText}
                </p>
                
                <div className="w-full bg-slate-100 h-3 rounded-full mt-5 overflow-hidden relative shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-[#EA580C] to-[#F97316] transition-all duration-300 ease-out"
                        style={{ width: progress !== null ? `${progress}%` : '100%' }}
                    >
                        {progress === null && <div className="w-full h-full animate-pulse bg-white/30"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};