window.SupplierDetails = function({ supplier, onBack, transactions, items, showToast }) {
    const { useState, useMemo } = React;
    const { SupplierPaymentModal } = window;
    const ITEMS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    // الفلاتر
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');
    const [filterType, setFilterType] = useState('all'); 

    // 💡 جلب بيانات السداد من الجدول المستقل الجديد
    const payments = window.useLiveQuery(
        () => window.db.supplier_payments ? window.db.supplier_payments.where({ supplier_id: supplier.id }).toArray() : [],
        [supplier.id]
    ) || [];

    // 💡 دمج وترتيب حركات المخزن + حركات السداد في سجل واحد للعرض فقط
    const unifiedHistory = useMemo(() => {
        // 1. حركات المخازن الخاصة بهذا المورد
        let invTrans = transactions
            .filter(t => t.supplier_id === supplier.id)
            .map(t => ({ ...t, record_type: 'inventory' })); // تمييز أنها حركة مخزن

        // 2. حركات السداد من الجدول الجديد
        let payTrans = payments.map(p => ({
            id: p.id,
            record_type: 'payment', // تمييز أنها دفعة مالية
            type: 'payment',
            cost: p.amount,
            date: p.date,
            notes: p.notes,
            accounting_ref: p.accounting_ref
        }));

        // 3. دمجهم وترتيبهم من الأحدث للأقدم
        let combined = [...invTrans, ...payTrans].sort((a, b) => b.date - a.date);

        // 4. تطبيق الفلاتر
        if (filterType !== 'all') combined = combined.filter(t => t.type === filterType);
        if (filterStart) {
            const s = new Date(filterStart).setHours(0,0,0,0);
            combined = combined.filter(t => new Date(t.date).setHours(0,0,0,0) >= s);
        }
        if (filterEnd) {
            const e = new Date(filterEnd).setHours(0,0,0,0);
            combined = combined.filter(t => new Date(t.date).setHours(0,0,0,0) <= e);
        }

        return combined;
    }, [transactions, payments, supplier.id, filterStart, filterEnd, filterType]);

    const totalPages = Math.max(1, Math.ceil(unifiedHistory.length / ITEMS_PER_PAGE));
    const paginatedTrans = unifiedHistory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // دالة إضافة سداد (تتعامل مع الجدول الجديد)
    const handlePayment = async (amount) => {
        try {
            await window.db.transaction('rw', window.db.suppliers, window.db.accounting, window.db.supplier_payments, async () => {
                const sup = await window.db.suppliers.get(supplier.id);
                const newCredit = (sup.total_credit || 0) - amount;
                
                await window.db.suppliers.update(sup.id, { total_credit: newCredit });
                
                const accId = await window.db.accounting.add({
                    type: 'expense', 
                    amount: amount, 
                    description: `سداد دفعة من حساب المورد: ${sup.name}`, 
                    date: Date.now()
                });

                // 💡 إضافة الدفعة في الجدول المستقل الجديد
                await window.db.supplier_payments.add({
                    supplier_id: supplier.id,
                    amount: amount,
                    notes: 'سداد نقدي من المديونية',
                    date: Date.now(),
                    accounting_ref: accId 
                });
            });
            showToast("تم تسجيل السداد بنجاح", "success");
            setIsPaymentModalOpen(false);
        } catch (err) {
            showToast("حدث خطأ أثناء السداد", "error");
        }
    };

    // دالة حذف سداد (تحذف من الجدول الجديد وتعكس القيود)
    const handleDeletePayment = async (trx) => {
        if (!confirm("هل أنت متأكد من حذف عملية السداد؟ سيتم إعادة المبلغ لمديونية المورد وحذفه من الخزينة.")) return;

        try {
            await window.db.transaction('rw', window.db.suppliers, window.db.accounting, window.db.supplier_payments, async () => {
                const sup = await window.db.suppliers.get(supplier.id);
                if(sup) {
                    await window.db.suppliers.update(sup.id, { total_credit: (sup.total_credit || 0) + trx.cost });
                }

                // 💡 الحذف من الجدول المستقل الجديد
                await window.db.supplier_payments.delete(trx.id);

                if (trx.accounting_ref) {
                    await window.db.accounting.delete(trx.accounting_ref);
                }
            });
            showToast("تم حذف عملية السداد بنجاح", "success");
        } catch (err) {
            showToast("حدث خطأ أثناء الحذف", "error");
        }
    };

    return (
        <div className="flex flex-col space-y-6 animate-view pb-6">
            <SupplierPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} supplier={supplier} onPay={handlePayment} />

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={onBack} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-colors"><i className="fas fa-arrow-right"></i></button>
                    <div>
                        <h2 className="text-xl font-black text-slate-800">{supplier.name} <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold ml-1">ملف المورد</span></h2>
                        <p className="text-xs font-bold text-slate-400 mt-1"><i className="fas fa-phone"></i> {supplier.phone || 'لا يوجد رقم'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto bg-slate-50 p-2 pr-4 rounded-xl border border-slate-200">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500">إجمالي المديونية</p>
                        <p className={`text-lg font-black ${supplier.total_credit > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{supplier.total_credit} ج</p>
                    </div>
                    <button onClick={() => setIsPaymentModalOpen(true)} disabled={supplier.total_credit <= 0} className="bg-slate-800 hover:bg-slate-900 text-white font-black px-4 py-2 rounded-lg text-sm shadow-md disabled:opacity-50 transition-colors">
                        <i className="fas fa-hand-holding-usd"></i> سداد دفعة
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col flex-1">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-3 rounded-t-2xl shrink-0">
                    <div className="font-black text-slate-700 ml-4"><i className="fas fa-list-alt text-indigo-500"></i> كشف الحساب</div>
                    
                    <select value={filterType} onChange={(e) => {setFilterType(e.target.value); setCurrentPage(1);}} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer">
                        <option value="all">كل العمليات</option>
                        <option value="in">وارد / مشتريات</option>
                        <option value="out">مرتجع / منصرف</option>
                        <option value="payment">دفعات السداد النقدية</option>
                    </select>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400">من:</span>
                        <input type="date" value={filterStart} onChange={(e)=> {setFilterStart(e.target.value); setCurrentPage(1);}} className="bg-transparent text-xs font-bold outline-none cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400">إلى:</span>
                        <input type="date" value={filterEnd} onChange={(e)=> {setFilterEnd(e.target.value); setCurrentPage(1);}} className="bg-transparent text-xs font-bold outline-none cursor-pointer" />
                    </div>
                </div>

                <div className="w-full flex-1 overflow-x-auto hide-scrollbar">
                    {paginatedTrans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                            <i className="fas fa-file-invoice text-4xl mb-3 opacity-30"></i>
                            <p className="font-bold text-sm">لا توجد عمليات مطابقة للبحث.</p>
                        </div>
                    ) : (
                        <table className="w-full text-right text-sm whitespace-nowrap min-w-max">
                            <thead className="bg-white border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase sticky top-0 z-10">
                                <tr>
                                    <th className="p-4">نوع العملية</th>
                                    <th className="p-4">البيان / الخامة</th>
                                    <th className="p-4">الكمية</th>
                                    <th className="p-4">المبلغ</th>
                                    <th className="p-4">التاريخ</th>
                                    <th className="p-4 text-center">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedTrans.map(trx => {
                                    const isPayment = trx.record_type === 'payment';
                                    const itemName = isPayment ? 'دفعة نقدية مسددة من المديونية' : (items.find(i => i.id === trx.item_id)?.name || 'محذوفة');
                                    
                                    let typeIcon = '';
                                    let typeText = '';
                                    let payBadge = '';

                                    if (isPayment) {
                                        typeIcon = 'fa-money-bill-wave text-emerald-500';
                                        typeText = 'سداد نقدي';
                                    } else {
                                        typeIcon = trx.type === 'in' ? 'fa-arrow-down text-teal-500' : 'fa-arrow-up text-amber-500';
                                        typeText = trx.type === 'in' ? 'فاتورة مشتريات' : 'مرتجع خامات';
                                        
                                        if(trx.type === 'in') {
                                            payBadge = trx.payment_type === 'cash' ? <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 rounded mr-2">كاش</span> : 
                                                       trx.payment_type === 'credit' ? <span className="bg-rose-100 text-rose-700 text-[9px] px-1.5 rounded mr-2">آجل</span> : '';
                                        }
                                    }

                                    return (
                                        <tr key={`${trx.record_type}_${trx.id}`} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-black text-slate-600"><i className={`fas ${typeIcon} ml-2`}></i>{typeText}</td>
                                            <td className="p-4 font-black text-slate-700">{itemName}</td>
                                            <td className="p-4 font-bold text-slate-600 dir-ltr text-right">{isPayment ? '-' : trx.quantity}</td>
                                            <td className="p-4">
                                                <span className={`font-black ${isPayment ? 'text-emerald-600' : 'text-slate-700'}`}>{trx.cost > 0 ? `${trx.cost} ج` : '-'}</span>
                                                {payBadge}
                                            </td>
                                            <td className="p-4 text-[11px] font-bold text-slate-400">{new Date(trx.date).toLocaleString('ar-EG', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                                            <td className="p-4 text-center">
                                                {isPayment ? (
                                                    <button onClick={() => handleDeletePayment(trx)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center border border-rose-100 mx-auto" title="حذف وعكس السداد">
                                                        <i className="fas fa-trash-alt text-xs"></i>
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="p-3 bg-white border-t border-slate-100 flex justify-center shrink-0 rounded-b-2xl">
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-6 h-6 text-slate-500 disabled:opacity-30 hover:text-indigo-600 transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
                            <span className="text-xs font-bold text-slate-500">ص {currentPage} من {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-6 h-6 text-slate-500 disabled:opacity-30 hover:text-indigo-600 transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};