window.MainActiveOrders = function({ activeOrders, dateFilterKey }) {
    const { useState, useEffect } = React;
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3;

    // إعادة تصفير الصفحة عند تغيير فلتر التاريخ من المكون الأب
    useEffect(() => {
        setCurrentPage(1);
    }, [dateFilterKey]);

    const totalPages = Math.max(1, Math.ceil(activeOrders.length / ITEMS_PER_PAGE));
    const paginatedOrders = activeOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const orderTypes = {
        'dine_in': { text: 'صالة', color: 'bg-blue-100 text-blue-700' },
        'takeaway': { text: 'تيك أواي', color: 'bg-orange-100 text-orange-700' },
        'delivery': { text: 'دليفري', color: 'bg-emerald-100 text-emerald-700' }
    };

    return (
        <div className="lg:col-span-2 flex flex-col h-full">
            <h3 className="font-black text-slate-700 flex items-center gap-2 mb-4">
                <i className="fas fa-fire text-rose-500"></i> طلبات قيد التجهيز (للفترة المحددة)
            </h3>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full flex-1 flex flex-col justify-between">
                {activeOrders.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 flex-1 flex flex-col justify-center">
                        <i className="fas fa-check-circle text-4xl text-slate-200 mb-3"></i>
                        <p className="font-bold text-sm">لا توجد طلبات معلقة حالياً في هذه الفترة.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto hide-scrollbar w-full flex-1">
                            <table className="w-full text-right text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                                    <tr>
                                        <th className="p-4">رقم الطلب</th>
                                        <th className="p-4">النوع</th>
                                        <th className="p-4">العميل / الطاولة</th>
                                        <th className="p-4">الإجمالي</th>
                                        <th className="p-4">الوقت</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedOrders.map(order => {
                                        const typeInfo = orderTypes[order.order_type] || { text: 'غير معروف', color: 'bg-slate-100' };
                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-black text-slate-700">#{order.id}</td>
                                                <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-black ${typeInfo.color}`}>{typeInfo.text}</span></td>
                                                <td className="p-4 font-bold text-slate-600">
                                                    {order.customer_name} 
                                                    {order.order_type === 'dine_in' && order.table_id && <span className="text-[10px] text-slate-400 mr-2">(طاولة مقيدة)</span>}
                                                </td>
                                                <td className="p-4 font-black text-[#EA580C]">{order.final_total} ج</td>
                                                <td className="p-4 text-xs font-bold text-slate-400">{new Date(order.created_at).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center shrink-0">
                                <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 w-full md:w-80">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-[#EA580C] hover:text-white transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
                                    <div className="flex items-center gap-2 font-bold text-xs text-slate-500">
                                        <span className="bg-[#EA580C] text-white w-6 h-6 rounded-md flex items-center justify-center shadow-sm">{currentPage}</span>
                                        <span>من</span>
                                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">{totalPages}</span>
                                    </div>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-[#EA580C] hover:text-white transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};