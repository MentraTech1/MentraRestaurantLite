window.OrdersList = function({ 
    allOrders, filteredOrders, paginatedOrders, currentPage, setCurrentPage, totalPages, setSelectedOrder 
}) {
    const orderTypes = {
        'dine_in': { text: 'صالة', icon: 'fa-chair', color: 'text-blue-600 bg-blue-50 border-blue-200' },
        'takeaway': { text: 'تيك أواي', icon: 'fa-shopping-bag', color: 'text-orange-600 bg-orange-50 border-orange-200' },
        'delivery': { text: 'دليفري', icon: 'fa-motorcycle', color: 'text-purple-600 bg-purple-50 border-purple-200' }
    };
    
    const statusConfig = {
        'open': { text: 'قيد التجهيز', badge: 'bg-rose-100 text-rose-600' },
        'closed': { text: 'مدفوعة', badge: 'bg-emerald-100 text-emerald-600' }
    };

    if (!allOrders) {
        return <div className="flex justify-center items-center py-20"><i className="fas fa-circle-notch fa-spin text-4xl text-[#EA580C]"></i></div>;
    }

    if (filteredOrders.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-400 py-16 shadow-sm text-center">
                <i className="fas fa-receipt text-6xl mb-4 text-slate-200"></i>
                <h3 className="text-lg font-bold">لا توجد طلبات مطابقة</h3>
                <p className="text-sm mt-1">جرب تغيير فلاتر البحث أو التواريخ.</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedOrders.map(order => {
                    // تم حل المشكلة بإضافة (Fallback) هنا 👇
                    const typeData = orderTypes[order.order_type] || orderTypes['takeaway'];
                    const statusData = statusConfig[order.status] || { text: 'غير محدد', badge: 'bg-slate-100 text-slate-500' };

                    return (
                        <div key={order.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${order.status === 'closed' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">رقم الطلب</span>
                                    <h4 className="text-xl md:text-2xl font-black text-slate-800">#{order.id}</h4>
                                </div>
                                <span className={`px-2.5 py-1 rounded-md text-xs font-black ${statusData.badge}`}>{statusData.text}</span>
                            </div>

                            <div className="space-y-2 mb-5">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <i className="fas fa-user text-slate-400 w-4 text-center"></i> 
                                    <span className="truncate">{order.customer_name || 'بدون اسم'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <i className={`fas ${typeData.icon} text-slate-400 w-4 text-center`}></i> 
                                    <span className={`px-2 py-0.5 rounded text-[10px] border ${typeData.color}`}>{typeData.text}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <i className="fas fa-clock text-slate-400 w-4 text-center"></i> 
                                    <span className="dir-ltr">{new Date(order.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-3 border-t border-slate-100 border-dashed">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 mb-0.5">الإجمالي</span>
                                    <span className="text-xl font-black text-[#EA580C]">{order.final_total} ج</span>
                                </div>
                                <button onClick={() => setSelectedOrder(order)} className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-slate-200">
                                    التفاصيل <i className="fas fa-arrow-left text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 mx-auto max-w-sm w-full">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-[#EA580C] hover:text-white transition-colors">
                        <i className="fas fa-chevron-right text-sm"></i>
                    </button>
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-500">
                        <span className="bg-[#EA580C] text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md">{currentPage}</span>
                        <span>من</span>
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">{totalPages}</span>
                    </div>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-[#EA580C] hover:text-white transition-colors">
                        <i className="fas fa-chevron-left text-sm"></i>
                    </button>
                </div>
            )}
        </div>
    );
};