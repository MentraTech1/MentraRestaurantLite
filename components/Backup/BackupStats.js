window.BackupStats = function({ dbStats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0">
            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm text-center md:text-right">
                <div className="text-slate-400 mb-1.5 md:mb-2 text-lg md:text-xl"><i className="fas fa-receipt"></i></div>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5 md:mb-1">إجمالي الفواتير</p>
                <h4 className="font-black text-xl md:text-2xl text-slate-700">{dbStats.totalOrders.toLocaleString()}</h4>
            </div>
            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm text-center md:text-right">
                <div className="text-sky-400 mb-1.5 md:mb-2 text-lg md:text-xl"><i className="fas fa-hamburger"></i></div>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5 md:mb-1">أصناف المنيو</p>
                <h4 className="font-black text-xl md:text-2xl text-slate-700">{dbStats.menuItemsCount.toLocaleString()}</h4>
            </div>
            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm text-center md:text-right">
                <div className="text-emerald-400 mb-1.5 md:mb-2 text-lg md:text-xl"><i className="fas fa-wallet"></i></div>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5 md:mb-1">الإيرادات التاريخية</p>
                <h4 className="font-black text-xl md:text-2xl text-slate-700">{dbStats.totalIncome.toLocaleString()} <span className="text-[10px] md:text-xs">ج</span></h4>
            </div>
            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm text-center md:text-right">
                <div className="text-purple-400 mb-1.5 md:mb-2 text-lg md:text-xl"><i className="fas fa-users"></i></div>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5 md:mb-1">الموظفين المسجلين</p>
                <h4 className="font-black text-xl md:text-2xl text-slate-700">{dbStats.usersCount.toLocaleString()}</h4>
            </div>
        </div>
    );
};