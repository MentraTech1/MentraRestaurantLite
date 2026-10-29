window.TransactionsTab = function({ items, transactions, suppliers, showToast }) {
    // ... (احتفظ بنفس أكواد المتغيرات والـ UseEffect والـ HandleSubmit كما هي بدون أي تغيير) ...
    const { useState, useRef, useEffect, useMemo } = React;
    const ITEMS_PER_PAGE = 4;

    const [currentPage, setCurrentPage] = useState(1);
    const [transType, setTransType] = useState('in'); 
    const [quantity, setQuantity] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentType, setPaymentType] = useState('cash'); 
    
    const [itemSearch, setItemSearch] = useState('');
    const [isItemDropOpen, setIsItemDropOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const itemDropRef = useRef(null);

    const [supSearch, setSupSearch] = useState('');
    const [isSupDropOpen, setIsSupDropOpen] = useState(false);
    const [selectedSup, setSelectedSup] = useState(null);
    const supDropRef = useRef(null);

    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    
    const [filterSupplierId, setFilterSupplierId] = useState('');
    const [filterSupSearch, setFilterSupSearch] = useState('');
    const [isFilterSupDropOpen, setIsFilterSupDropOpen] = useState(false);
    const filterSupDropRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (itemDropRef.current && !itemDropRef.current.contains(e.target)) setIsItemDropOpen(false);
            if (supDropRef.current && !supDropRef.current.contains(e.target)) setIsSupDropOpen(false);
            if (filterSupDropRef.current && !filterSupDropRef.current.contains(e.target)) setIsFilterSupDropOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (transType === 'in' && selectedItem && quantity) {
            const qty = parseFloat(quantity);
            if (!isNaN(qty)) {
                const calculatedCost = (qty * selectedItem.cost_per_unit).toFixed(2);
                setTotalCost(calculatedCost);
            }
        } else if (transType !== 'in') {
            setTotalCost(''); 
        }
    }, [selectedItem, quantity, transType]);

    const filteredTrans = useMemo(() => {
        return transactions.filter(t => {
            const tDate = new Date(t.date).setHours(0,0,0,0);
            const start = filterStartDate ? new Date(filterStartDate).setHours(0,0,0,0) : null;
            const end = filterEndDate ? new Date(filterEndDate).setHours(0,0,0,0) : null;
            let dateMatch = true;
            if (start && tDate < start) dateMatch = false;
            if (end && tDate > end) dateMatch = false;
            let supMatch = true;
            if (filterSupplierId && t.supplier_id !== parseInt(filterSupplierId)) supMatch = false;
            return dateMatch && supMatch;
        });
    }, [transactions, filterStartDate, filterEndDate, filterSupplierId]);

    const stats = useMemo(() => {
        let purchases = 0, cash = 0, credit = 0, waste = 0;
        filteredTrans.forEach(t => {
            if (t.type === 'in') {
                purchases += (t.cost || 0);
                if (t.payment_type === 'cash') cash += (t.cost || 0);
                if (t.payment_type === 'credit') credit += (t.cost || 0);
            } else if (t.notes?.includes('هالك')) {
                waste++;
            }
        });
        return { purchases, cash, credit, waste };
    }, [filteredTrans]);

    const totalPages = Math.max(1, Math.ceil(filteredTrans.length / ITEMS_PER_PAGE));
    const paginatedTrans = filteredTrans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!selectedItem || !quantity) return showToast("برجاء إكمال البيانات", "error");
        if(transType === 'in' && paymentType === 'credit' && !selectedSup) return showToast("يجب اختيار المورد في حالة الآجل", "error");

        try {
            await window.db.transaction('rw', window.db.inventory_items, window.db.inventory_transactions, window.db.suppliers, window.db.accounting, async () => {
                const item = await window.db.inventory_items.get(selectedItem.id);
                const qty = parseFloat(quantity);
                const cost = parseFloat(totalCost) || 0;
                let newStock = item.stock_quantity;
                let newCostPerUnit = item.cost_per_unit;

                if (transType === 'in') {
                    newStock += qty;
                    if (cost > 0) newCostPerUnit = (cost / qty).toFixed(2);
                } else {
                    if (newStock < qty) throw new Error("الرصيد غير كافٍ");
                    newStock -= qty;
                }

                await window.db.inventory_items.update(item.id, { stock_quantity: newStock, cost_per_unit: newCostPerUnit });

                await window.db.inventory_transactions.add({
                    item_id: item.id,
                    type: transType === 'in' ? 'in' : 'out',
                    quantity: qty,
                    cost: cost,
                    balance_after: newStock,
                    notes: transType === 'waste' ? 'هالك: ' + notes : notes,
                    date: Date.now(),
                    supplier_id: transType === 'in' && selectedSup ? selectedSup.id : null,
                    payment_type: transType === 'in' ? paymentType : null
                });

                if (transType === 'in' && paymentType === 'cash' && cost > 0) {
                    await window.db.accounting.add({ type: 'expense', amount: cost, description: `شراء كاش: ${item.name} من ${selectedSup?.name || 'مورد عام'}`, date: Date.now() });
                }

                if (transType === 'in' && paymentType === 'credit' && selectedSup && cost > 0) {
                    const sup = await window.db.suppliers.get(selectedSup.id);
                    await window.db.suppliers.update(sup.id, { total_credit: (sup.total_credit || 0) + cost });
                }
            });

            showToast("تم التسجيل بنجاح", "success");
            setSelectedItem(null); setItemSearch(''); setQuantity(''); setTotalCost(''); setNotes(''); setSelectedSup(null); setSupSearch('');
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    return (
        // إزالة h-full للسماح بالتمدد الطبيعي للصفحة للموبايل
        <div className="flex flex-col lg:flex-row gap-6 animate-view">
            
            {/* يمين: فورم الإدخال */}
            <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 shrink-0 h-fit">
                <h3 className="font-black text-slate-800 mb-5"><i className="fas fa-edit text-teal-500"></i> حركة جديدة</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     {/* ... (نفس أكواد الفورم وحقول الإدخال كما هي) ... */}
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button type="button" onClick={() => setTransType('in')} className={`flex-1 py-2 text-xs font-black rounded-lg ${transType === 'in' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500'}`}>وارد</button>
                        <button type="button" onClick={() => setTransType('out')} className={`flex-1 py-2 text-xs font-black rounded-lg ${transType === 'out' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500'}`}>منصرف</button>
                        <button type="button" onClick={() => setTransType('waste')} className={`flex-1 py-2 text-xs font-black rounded-lg ${transType === 'waste' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500'}`}>هالك</button>
                    </div>

                    <div className="relative" ref={itemDropRef}>
                        <label className="block text-xs font-bold text-slate-500 mb-1">الخامة:</label>
                        <input type="text" placeholder={selectedItem ? selectedItem.name : "ابحث عن خامة..."} value={itemSearch} onChange={(e) => { setItemSearch(e.target.value); setIsItemDropOpen(true); setSelectedItem(null); setTotalCost(''); }} onClick={() => setIsItemDropOpen(true)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:border-teal-500" />
                        {isItemDropOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                {items.filter(i=>i.name.includes(itemSearch)).map(item => (
                                    <div key={item.id} onClick={() => { setSelectedItem(item); setItemSearch(item.name); setIsItemDropOpen(false); }} className="px-4 py-2 hover:bg-teal-50 border-b border-slate-50 cursor-pointer text-sm font-bold flex justify-between">
                                        <span>{item.name}</span>
                                        <span className="text-[10px] text-slate-400">{item.stock_quantity} {item.unit}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 mb-1">الكمية:</label>
                            <input type="number" step="any" required value={quantity} onChange={(e)=>setQuantity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:border-teal-500" />
                        </div>
                        {transType === 'in' && (
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">إجمالي التكلفة (ج):</label>
                                <input type="number" step="any" value={totalCost} onChange={(e)=>setTotalCost(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:border-teal-500 text-[#EA580C]" placeholder="تلقائي..." />
                            </div>
                        )}
                    </div>

                    {transType === 'in' && (
                        <>
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 mt-2">
                                <button type="button" onClick={() => setPaymentType('cash')} className={`flex-1 py-1.5 text-xs font-black rounded-lg ${paymentType === 'cash' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>دفع كاش</button>
                                <button type="button" onClick={() => setPaymentType('credit')} className={`flex-1 py-1.5 text-xs font-black rounded-lg ${paymentType === 'credit' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>آجل (على الحساب)</button>
                            </div>

                            <div className="relative mt-2" ref={supDropRef}>
                                <label className="block text-xs font-bold text-slate-500 mb-1">المورد {paymentType === 'credit' && <span className="text-rose-500">* (إلزامي)</span>}:</label>
                                <input type="text" placeholder={selectedSup ? selectedSup.name : "ابحث عن مورد..."} value={supSearch} onChange={(e) => { setSupSearch(e.target.value); setIsSupDropOpen(true); setSelectedSup(null); }} onClick={() => setIsSupDropOpen(true)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:border-teal-500" />
                                {isSupDropOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                        {suppliers.filter(s=>s.name.includes(supSearch)).map(sup => (
                                            <div key={sup.id} onClick={() => { setSelectedSup(sup); setSupSearch(sup.name); setIsSupDropOpen(false); }} className="px-4 py-2 hover:bg-teal-50 border-b border-slate-50 cursor-pointer text-sm font-bold">{sup.name}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">ملاحظات (اختياري):</label>
                        <input type="text" value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:border-teal-500" />
                    </div>

                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-3 rounded-xl shadow-lg mt-2 transition-colors">
                        <i className="fas fa-save ml-1"></i> حفظ الحركة
                    </button>
                </form>
            </div>

            {/* يسار: الفلاتر، الإحصائيات، والسجل */}
            {/* تم إزالة h-full و overflow-hidden ليأخذ الجدول مساحته بحرية */}
            <div className="w-full lg:w-2/3 flex flex-col space-y-4">
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-400">إجمالي المشتريات</p>
                        <p className="font-black text-lg text-slate-700">{stats.purchases} <span className="text-[10px]">ج</span></p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-emerald-600">المدفوع كاش</p>
                        <p className="font-black text-lg text-emerald-700">{stats.cash} <span className="text-[10px]">ج</span></p>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-rose-600">مشتريات آجل</p>
                        <p className="font-black text-lg text-rose-700">{stats.credit} <span className="text-[10px]">ج</span></p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-amber-600">عمليات إهلاك</p>
                        <p className="font-black text-lg text-amber-700">{stats.waste} <span className="text-[10px]">حركة</span></p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400">من:</span>
                        <input type="date" value={filterStartDate} onChange={(e)=>setFilterStartDate(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400">إلى:</span>
                        <input type="date" value={filterEndDate} onChange={(e)=>setFilterEndDate(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer" />
                    </div>
                    
                    <div className="relative flex-1 min-w-[150px]" ref={filterSupDropRef}>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <i className="fas fa-truck text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                placeholder="فلتر بالمورد..."
                                value={filterSupSearch}
                                onChange={(e) => {
                                    setFilterSupSearch(e.target.value);
                                    setIsFilterSupDropOpen(true);
                                    if(e.target.value === '') setFilterSupplierId(''); 
                                }}
                                onClick={() => setIsFilterSupDropOpen(true)}
                                className="bg-transparent text-xs font-bold outline-none w-full"
                            />
                            {filterSupplierId && (
                                <button onClick={() => {setFilterSupplierId(''); setFilterSupSearch('');}} className="text-rose-400 hover:text-rose-600 ml-auto"><i className="fas fa-times"></i></button>
                            )}
                        </div>
                        {isFilterSupDropOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto hide-scrollbar">
                                <div onClick={() => { setFilterSupplierId(''); setFilterSupSearch(''); setIsFilterSupDropOpen(false); }} className="px-4 py-2 hover:bg-rose-50 text-rose-500 border-b border-slate-50 cursor-pointer text-xs font-bold">
                                    <i className="fas fa-times-circle ml-1"></i> إلغاء الفلتر (عرض الكل)
                                </div>
                                {suppliers.filter(s => s.name.includes(filterSupSearch)).map(sup => (
                                    <div
                                        key={sup.id}
                                        onClick={() => { setFilterSupplierId(sup.id); setFilterSupSearch(sup.name); setIsFilterSupDropOpen(false); }}
                                        className="px-4 py-2 hover:bg-teal-50 border-b border-slate-50 cursor-pointer text-xs font-bold"
                                    >
                                        {sup.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* تم تعديل الجدول ليسمح بالسكرول الأفقي داخله دون إخفائه عامودياً */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col">
                    <div className="w-full overflow-x-auto hide-scrollbar">
                        <table className="w-full text-right text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase">
                                <tr>
                                    <th className="p-4">الحركة / الدفع</th>
                                    <th className="p-4">الخامة (المورد)</th>
                                    <th className="p-4">الكمية</th>
                                    <th className="p-4">التكلفة</th>
                                    <th className="p-4">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedTrans.map(trx => {
                                    const itemName = items.find(i => i.id === trx.item_id)?.name || 'محذوفة';
                                    const supName = trx.supplier_id ? suppliers.find(s=>s.id === trx.supplier_id)?.name : null;
                                    
                                    let typeIcon = trx.type === 'in' ? 'fa-arrow-down text-emerald-500' : 'fa-arrow-up text-rose-500';
                                    let payBadge = '';
                                    if(trx.type === 'in') {
                                        payBadge = trx.payment_type === 'cash' ? <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 rounded ml-2">كاش</span> : 
                                                   trx.payment_type === 'credit' ? <span className="bg-rose-100 text-rose-700 text-[9px] px-1.5 rounded ml-2">آجل</span> : '';
                                    } else if(trx.notes?.includes('هالك')) {
                                        typeIcon = 'fa-trash text-amber-500';
                                    }

                                    return (
                                        <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-black text-slate-600"><i className={`fas ${typeIcon} ml-2`}></i>{trx.type==='in'?'وارد':'منصرف'} {payBadge}</td>
                                            <td className="p-4">
                                                <div className="font-black text-slate-700">{itemName}</div>
                                                {supName && <div className="text-[10px] text-slate-400 font-bold"><i className="fas fa-truck text-[9px] ml-1"></i>{supName}</div>}
                                            </td>
                                            <td className="p-4 font-bold text-slate-600 dir-ltr text-right">{trx.quantity}</td>
                                            <td className="p-4 font-bold text-slate-600">{trx.cost > 0 ? `${trx.cost} ج` : '-'}</td>
                                            <td className="p-4 text-[11px] font-bold text-slate-400">{new Date(trx.date).toLocaleDateString('ar-EG')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0 rounded-b-2xl">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 bg-white rounded shadow-sm flex items-center justify-center disabled:opacity-30 hover:text-teal-600"><i className="fas fa-chevron-right text-xs"></i></button>
                                <span className="text-xs font-bold text-slate-500">ص {currentPage} من {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 bg-white rounded shadow-sm flex items-center justify-center disabled:opacity-30 hover:text-teal-600"><i className="fas fa-chevron-left text-xs"></i></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};