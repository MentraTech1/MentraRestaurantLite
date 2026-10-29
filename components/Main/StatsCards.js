window.MainStatsCards = function({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <div className="bg-gradient-to-br from-[#EA580C] to-[#F97316] p-6 rounded-2xl shadow-lg shadow-orange-500/20 relative overflow-hidden text-white w-full">
                <i className="fas fa-wallet absolute left-0 bottom-0 text-7xl opacity-20 transform -translate-x-4 translate-y-4"></i>
                <h4 className="text-orange-100 font-bold text-sm mb-1">المبيعات للفترة المحددة</h4>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-black">{stats.totalIncome.toLocaleString()}</span>
                    <span className="text-sm font-bold mb-1 pb-1">ج.م</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center text-2xl">
                    <i className="fas fa-receipt"></i>
                </div>
                <h4 className="text-slate-400 font-bold text-sm mb-1">إجمالي الطلبات</h4>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-slate-800">{stats.totalOrders}</span>
                    <span className="text-xs font-bold text-emerald-500 mb-1 pb-1 bg-emerald-50 px-2 py-0.5 rounded">مكتمل: {stats.completedOrders}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden w-full sm:col-span-2 md:col-span-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-2xl">
                    <i className="fas fa-chair"></i>
                </div>
                <h4 className="text-slate-400 font-bold text-sm mb-1">الطاولات المشغولة حالياً</h4>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-slate-800">{stats.activeTables}</span>
                    <span className="text-xs font-bold text-slate-400 mb-1 pb-1">طاولة</span>
                </div>
            </div>
        </div>
    );
};