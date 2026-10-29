window.AccountingTable = function({ 
    activeTab, setActiveTab, paginatedTransactions, openModal, 
    handleDeleteTx, totalPages, currentPage, setCurrentPage, inventoryItems 
}) {
    // إعادة تعيين الصفحة الأولى عند تغيير التبويب
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden shrink-0 animate-view">
            
            {/* التبويبات الأربعة */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2">
                <button onClick={() => handleTabChange('sales')} className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'sales' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <i className="fas fa-hand-holding-usd"></i> مبيعات
                </button>
                <button onClick={() => handleTabChange('expenses')} className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'expenses' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <i className="fas fa-file-invoice-dollar"></i> مصروفات
                </button>
                <button onClick={() => handleTabChange('purchases')} className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'purchases' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <i className="fas fa-shopping-cart"></i> مشتريات
                </button>
                <button onClick={() => handleTabChange('waste')} className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'waste' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <i className="fas fa-trash-alt"></i> هالك
                </button>
            </div>

            <div className="overflow-x-auto hide-scrollbar">
                {paginatedTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-16 opacity-60 text-center">
                        <i className="fas fa-folder-open text-5xl md:text-6xl mb-3 text-slate-200"></i>
                        <p className="font-bold text-xs md:text-sm">لا توجد عمليات مسجلة في هذا القسم.</p>
                    </div>
                ) : (
                    <div className="min-w-[500px]">
                        <table className="w-full text-right text-xs md:text-sm whitespace-nowrap">
                            <thead className="text-slate-400 font-bold border-b border-slate-100 bg-white">
                                <tr>
                                    {/* تغيير رؤوس الأعمدة بناءً على التبويب */}
                                    {activeTab === 'sales' || activeTab === 'expenses' ? (
                                        <>
                                            <th className="p-3 md:p-4 w-12 text-center">#</th>
                                            <th className="p-3 md:p-4">البيان / الوصف</th>
                                            <th className="p-3 md:p-4">التاريخ</th>
                                            <th className="p-3 md:p-4">المبلغ</th>
                                            {activeTab === 'expenses' && <th className="p-3 md:p-4 text-center">إجراء</th>}
                                        </>
                                    ) : (
                                        <>
                                            <th className="p-3 md:p-4 w-12 text-center">#</th>
                                            <th className="p-3 md:p-4">الخامة</th>
                                            <th className="p-3 md:p-4">الكمية</th>
                                            <th className="p-3 md:p-4">التكلفة</th>
                                            <th className="p-3 md:p-4">التاريخ</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedTransactions.map((t, index) => {
                                    // 1. عرض بيانات المبيعات والمصروفات
                                    if (activeTab === 'sales' || activeTab === 'expenses') {
                                        const isIncome = t.type === 'income';
                                        return (
                                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-2 md:p-4 text-center">
                                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto flex items-center justify-center text-[10px] md:text-xs shadow-sm ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                        <i className={`fas ${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                                                    </div>
                                                </td>
                                                <td className="p-2 md:p-4">
                                                    <span className="font-bold text-slate-700 block truncate max-w-[150px] md:max-w-xs">{t.description}</span>
                                                    {t.order_id && <span className="text-[8px] md:text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full mt-1 inline-block"><i className="fas fa-link"></i> فاتورة #{t.order_id}</span>}
                                                </td>
                                                <td className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-slate-500">
                                                    {new Date(t.date).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                                                </td>
                                                <td className="p-2 md:p-4">
                                                    <span className={`font-black text-sm md:text-lg ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {isIncome ? '+' : '-'}{t.amount} ج
                                                    </span>
                                                </td>
                                                {activeTab === 'expenses' && (
                                                    <td className="p-2 md:p-4 text-center">
                                                        {!t.order_id && !t.description.includes('سداد دفعة') && !t.description.includes('شراء كاش') ? (
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button onClick={() => openModal(t)} className="w-6 h-6 md:w-8 md:h-8 rounded bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors"><i className="fas fa-pen text-[10px] md:text-xs"></i></button>
                                                                <button onClick={() => handleDeleteTx(t.id)} className="w-6 h-6 md:w-8 md:h-8 rounded bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"><i className="fas fa-trash text-[10px] md:text-xs"></i></button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-300 font-bold bg-slate-50 px-2 py-1 rounded">قيد آلي</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    } 
                                    
                                    // 2. عرض بيانات المشتريات والهالك
                                    else {
                                        const itemName = inventoryItems.find(i => i.id === t.item_id)?.name || 'مادة محذوفة';
                                        return (
                                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-2 md:p-4 text-center">
                                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto flex items-center justify-center text-[10px] md:text-xs shadow-sm ${activeTab === 'purchases' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        <i className={`fas ${activeTab === 'purchases' ? 'fa-shopping-cart' : 'fa-trash-alt'}`}></i>
                                                    </div>
                                                </td>
                                                <td className="p-2 md:p-4 font-black text-slate-700">{itemName}</td>
                                                <td className="p-2 md:p-4 font-bold text-slate-600 dir-ltr text-right">{t.quantity}</td>
                                                <td className="p-2 md:p-4">
                                                    <span className={`font-black text-sm md:text-lg ${activeTab === 'purchases' ? 'text-indigo-600' : 'text-amber-600'}`}>
                                                        {t.cost > 0 ? `${t.cost} ج` : '-'}
                                                    </span>
                                                </td>
                                                <td className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-slate-500">
                                                    {new Date(t.date).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                                                </td>
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100 w-full max-w-sm">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-purple-500 hover:text-white transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-500">
                            <span className="bg-purple-500 text-white w-6 h-6 rounded flex items-center justify-center shadow-sm">{currentPage}</span><span>من</span><span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">{totalPages}</span>
                        </div>
                        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-purple-500 hover:text-white transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
                    </div>
                </div>
            )}
        </div>
    );
};