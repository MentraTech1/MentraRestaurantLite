window.MainContainer = function(props) {
    const { useState, useEffect } = React;
    const { MainStatsCards, MainQuickAccess, MainActiveOrders, MainProAd } = window;
    const { setActiveModule } = props;

    const todayStr = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);
    
    const [stats, setStats] = useState({ totalIncome: 0, totalOrders: 0, completedOrders: 0, activeTables: 0 });

    const dayStart = new Date(startDate).setHours(0, 0, 0, 0);
    const dayEnd = new Date(endDate).setHours(23, 59, 59, 999);

    const ordersQuery = window.useLiveQuery(() => window.db.orders.where('created_at').between(dayStart, dayEnd).toArray(), [startDate, endDate]);
    const tablesQuery = window.useLiveQuery(() => window.db.table('tables').toArray(), []);

    useEffect(() => {
        if (ordersQuery && tablesQuery) {
            let income = 0; let completed = 0;
            ordersQuery.forEach(order => { if (order.status === 'closed') { income += order.final_total; completed++; }});
            const activeTbls = tablesQuery.filter(t => t.status === 'occupied').length;
            setStats({ totalIncome: income, totalOrders: ordersQuery.length, completedOrders: completed, activeTables: activeTbls });
        }
    }, [ordersQuery, tablesQuery]);

    const activeOrders = ordersQuery ? ordersQuery.filter(o => o.status === 'open').sort((a, b) => b.created_at - a.created_at) : [];

    return (
        <div className="space-y-6 fade-up pb-24 md:pb-6 w-full max-w-full overflow-x-hidden flex flex-col h-full">
            
            {/* الهيدر وفلتر التاريخ */}
            <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 w-full">
                <div className="flex items-center gap-3 text-slate-800 w-full xl:w-auto">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#EA580C] text-lg shrink-0">
                        <i className="fas fa-chart-pie"></i>
                    </div>
                    <div>
                        <h3 className="font-black text-lg">ملخص الأداء والمبيعات</h3>
                        <p className="text-xs font-bold text-slate-400">إحصائيات المطعم للفترة المحددة</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-auto">
                        <span className="text-xs font-bold text-slate-400">من:</span>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer w-full text-left dir-ltr" />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-auto">
                        <span className="text-xs font-bold text-slate-400">إلى:</span>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer w-full text-left dir-ltr" />
                    </div>
                </div>
            </div>

            <MainStatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-1">
                <MainQuickAccess setActiveModule={setActiveModule} />
                {/* نمرر المفتاح (dateFilterKey) لكي يقوم المكون بتصفير الصفحة عند تغيير التاريخ */}
                <MainActiveOrders activeOrders={activeOrders} dateFilterKey={startDate + endDate} />
            </div>

            <MainProAd />
        </div>
    );
};