window.OrdersToolbar = function({ 
    searchQuery, setSearchQuery, statusFilter, setStatusFilter, fromDate, setFromDate, toDate, setToDate 
}) {
    const hasActiveFilters = fromDate || toDate || searchQuery || statusFilter !== 'all';

    const clearFilters = () => {
        setFromDate(''); setToDate(''); setSearchQuery(''); setStatusFilter('all');
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 text-lg shrink-0">
                        <i className="fas fa-list-alt"></i>
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-slate-800">سجل الطلبات</h3>
                        <p className="text-xs font-bold text-slate-400">إدارة ومراجعة الفواتير</p>
                    </div>
                </div>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-rose-500 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                        مسح الفلاتر <i className="fas fa-times"></i>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-3 py-2.5 outline-none focus:border-[#EA580C]">
                    <option value="all">جميع الحالات</option>
                    <option value="open">قيد التجهيز (مفتوحة)</option>
                    <option value="closed">مكتملة (مدفوعة)</option>
                </select>

                <div className="flex gap-2 col-span-1 sm:col-span-2">
                    <div className="relative w-full">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">من</span>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-8 pl-2 py-2.5 outline-none focus:border-[#EA580C] text-xs font-bold text-slate-700 dir-ltr" />
                    </div>
                    <div className="relative w-full">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">إلى</span>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-8 pl-2 py-2.5 outline-none focus:border-[#EA580C] text-xs font-bold text-slate-700 dir-ltr" />
                    </div>
                </div>

                <div className="relative w-full sm:col-span-2 md:col-span-1">
                    <input type="text" placeholder="بحث برقم الطلب..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 outline-none focus:border-[#EA580C] text-sm font-bold text-slate-700 placeholder:text-slate-400" />
                    <i className="fas fa-search absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
            </div>
        </div>
    );
};