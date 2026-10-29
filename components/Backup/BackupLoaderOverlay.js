window.BackupLoaderOverlay = function({ isLoading, loadingText }) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-view p-4">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-sm text-center">
                <i className="fas fa-database text-4xl md:text-5xl text-[#EA580C] mb-3 md:mb-4 animate-bounce"></i>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1 md:mb-2">الرجاء الانتظار</h3>
                <p className="text-xs md:text-sm font-bold text-slate-500 leading-relaxed">{loadingText}</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 md:mt-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#EA580C] to-[#F97316] w-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};