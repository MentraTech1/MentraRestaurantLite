window.StoreMaterialsContainer = function(props) {
    const { useState, useMemo } = React;
    const { showToast } = props;
    const { MaterialsTab, TransactionsTab, SuppliersTab, StoreProAd } = window; // تم إضافة StoreProAd هنا

    const [activeTab, setActiveTab] = useState('materials');
    
    const items = window.useLiveQuery(() => window.db.inventory_items.orderBy('id').reverse().toArray(), []) || [];
    const transactions = window.useLiveQuery(() => window.db.inventory_transactions.orderBy('date').reverse().toArray(), []) || [];
    const suppliers = window.useLiveQuery(() => window.db.suppliers?.orderBy('id').reverse().toArray(), []) || [];

    const stats = useMemo(() => {
        let total = items.length, outOfStock = 0, lowStock = 0;
        items.forEach(item => {
            if (item.stock_quantity <= 0) outOfStock++;
            else if (item.stock_quantity <= item.min_stock_alert) lowStock++;
        });
        return { total, outOfStock, lowStock };
    }, [items]);

    return (
        // تم إزالة h-full وزيادة pb-32 للموبايل لعدم تغطية المنيو السفلي للإعلان
        <div className="fade-up pb-32 md:pb-6 flex flex-col w-full max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-2 shrink-0">
                <button onClick={() => setActiveTab('materials')} className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'materials' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <i className="fas fa-cubes"></i> الخامات
                </button>
                <button onClick={() => setActiveTab('transactions')} className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'transactions' ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <i className="fas fa-exchange-alt"></i> حركة المخزن
                </button>
                <button onClick={() => setActiveTab('suppliers')} className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'suppliers' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <i className="fas fa-truck-loading"></i> الموردين
                </button>
            </div>
            
            {/* الحاوية المرنة */}
            <div className="flex-1 flex flex-col">
                {activeTab === 'materials' && <MaterialsTab items={items} stats={stats} showToast={showToast} />}
                {activeTab === 'transactions' && <TransactionsTab items={items} transactions={transactions} suppliers={suppliers} showToast={showToast} />}
                {activeTab === 'suppliers' && <SuppliersTab suppliers={suppliers} transactions={transactions} items={items} showToast={showToast} />}
            </div>

            {/* بنر الإعلان ثابت في أسفل الموديول بالكامل ليظهر للمستخدم دائماً */}
            <div className="shrink-0 mt-6 pt-6 border-t border-slate-200/50">
                <StoreProAd />
            </div>
        </div>
    );
};