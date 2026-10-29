window.TablesStats = function({ stats }) {
    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 shrink-0">
            <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-right">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm sm:text-xl mb-1 sm:mb-0"><i className="fas fa-hashtag"></i></div>
                <div><p className="text-[8px] sm:text-[10px] font-bold text-slate-400">الإجمالي</p><h4 className="font-black text-base sm:text-xl text-slate-700">{stats.total}</h4></div>
            </div>
            <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-right">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-sm sm:text-xl mb-1 sm:mb-0"><i className="fas fa-check"></i></div>
                <div><p className="text-[8px] sm:text-[10px] font-bold text-slate-400">متاحة</p><h4 className="font-black text-base sm:text-xl text-emerald-600">{stats.available}</h4></div>
            </div>
            <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-right">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-sm sm:text-xl mb-1 sm:mb-0"><i className="fas fa-lock"></i></div>
                <div><p className="text-[8px] sm:text-[10px] font-bold text-slate-400">مشغولة</p><h4 className="font-black text-base sm:text-xl text-rose-600">{stats.occupied}</h4></div>
            </div>
        </div>
    );
};