window.SuppliersTab = function({ suppliers, transactions, items, showToast }) {
    const { useState, useMemo } = React;
    const { SupplierModal, SupplierDetails } = window; 
    
    const ITEMS_PER_PAGE = 4;
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // فلاتر التاريخ للمدفوعات
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [activeSupplierId, setActiveSupplierId] = useState(null);
    
    // جلب بيانات الدفعات من الجدول الجديد لحساب إجمالي المدفوعات
    const payments = window.useLiveQuery(() => window.db.supplier_payments ? window.db.supplier_payments.toArray() : [], []) || [];

    const activeSupplier = activeSupplierId ? suppliers.find(s => s.id === activeSupplierId) : null;

    // 1. فلترة الموردين بناءً على البحث (Live Search)
    const filteredSuppliers = suppliers.filter(s => s.name.includes(searchTerm) || s.phone?.includes(searchTerm));
    
    // 2. حساب الإحصائيات (المديونية والمدفوعات) تتأثر بالبحث والتاريخ
    const stats = useMemo(() => {
        // إجمالي المديونية للموردين المطابقين للبحث الحالي
        const totalDebt = filteredSuppliers.reduce((sum, sup) => sum + (sup.total_credit || 0), 0);

        // إجمالي المدفوعات (نفلترها بالتواريخ وبالموردين الظاهرين في البحث)
        let filteredPayments = payments;
        
        // ربط المدفوعات بالموردين الظاهرين في البحث فقط
        const filteredSupplierIds = filteredSuppliers.map(s => s.id);
        filteredPayments = filteredPayments.filter(p => filteredSupplierIds.includes(p.supplier_id));

        // فلترة المدفوعات بالتاريخ
        if (filterStart) {
            const s = new Date(filterStart).setHours(0,0,0,0);
            filteredPayments = filteredPayments.filter(p => new Date(p.date).setHours(0,0,0,0) >= s);
        }
        if (filterEnd) {
            const e = new Date(filterEnd).setHours(0,0,0,0);
            filteredPayments = filteredPayments.filter(p => new Date(p.date).setHours(0,0,0,0) <= e);
        }

        const totalPaid = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        return { totalDebt, totalPaid };
    }, [filteredSuppliers, payments, filterStart, filterEnd]);


    const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE));
    const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleOpenModal = (supplier = null) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleSave = async (data) => {
        try {
            if (editingSupplier) {
                await window.db.suppliers.update(editingSupplier.id, { name: data.name, phone: data.phone });
                showToast("تم التعديل بنجاح", "success");
            } else {
                await window.db.suppliers.add({ name: data.name, phone: data.phone, total_credit: 0, is_active: 1 });
                showToast("تمت الإضافة بنجاح", "success");
            }
            setIsModalOpen(false);
        } catch (err) { showToast("حدث خطأ أثناء الحفظ", "error"); }
    };

    // عرض شاشة تفاصيل المورد
    if (activeSupplier) {
        return (
            <SupplierDetails 
                supplier={activeSupplier} 
                transactions={transactions} 
                items={items} 
                onBack={() => setActiveSupplierId(null)} 
                showToast={showToast} 
            />
        );
    }

    // الشاشة العادية (القائمة)
    return (
        // تم إزالة h-full لضمان التمدد الطبيعي على الموبايل
        <div className="space-y-6 animate-view flex flex-col pb-4">
            <SupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editingSupplier={editingSupplier} />
            
            {/* 1. الإحصائيات */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl shrink-0"><i className="fas fa-file-invoice-dollar"></i></div>
                    <div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400">إجمالي الآجل (علينا)</p>
                        <p className="text-lg md:text-2xl font-black text-rose-600">{stats.totalDebt} <span className="text-xs">ج</span></p>
                    </div>
                </div>
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl shrink-0"><i className="fas fa-hand-holding-usd"></i></div>
                    <div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400">المدفوعات المسددة</p>
                        <p className="text-lg md:text-2xl font-black text-emerald-600">{stats.totalPaid} <span className="text-xs">ج</span></p>
                    </div>
                </div>
            </div>

            {/* 2. شريط البحث والفلاتر */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-3 shrink-0">
                <div className="relative flex-1">
                    <input type="text" placeholder="ابحث باسم المورد أو الهاتف..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 font-bold text-sm outline-none focus:border-indigo-500 transition-colors" />
                    <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-400">من:</span>
                        <input type="date" value={filterStart} onChange={(e)=> {setFilterStart(e.target.value); setCurrentPage(1);}} className="bg-transparent text-xs font-bold outline-none cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-400">إلى:</span>
                        <input type="date" value={filterEnd} onChange={(e)=> {setFilterEnd(e.target.value); setCurrentPage(1);}} className="bg-transparent text-xs font-bold outline-none cursor-pointer" />
                    </div>
                    
                    <button onClick={() => handleOpenModal(null)} className="w-full lg:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-black px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-colors">
                        <i className="fas fa-plus"></i> مورد جديد
                    </button>
                </div>
            </div>

            {/* 3. كروت الموردين */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 content-start">
                {paginatedSuppliers.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-slate-400 font-bold">
                        <i className="fas fa-box-open text-4xl mb-3 opacity-30"></i>
                        <p>لا يوجد موردين مطابقين للبحث.</p>
                    </div>
                ) : (
                    paginatedSuppliers.map(sup => (
                        <div key={sup.id} onClick={() => setActiveSupplierId(sup.id)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-100 group-hover:bg-indigo-500 transition-colors"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{sup.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1"><i className="fas fa-phone text-[10px]"></i> {sup.phone || 'بدون رقم'}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(sup); }} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center border border-slate-200 shrink-0"><i className="fas fa-pen text-xs"></i></button>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold text-xs">الآجل (مديونية):</span>
                                <span className={`font-black ${sup.total_credit > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{sup.total_credit} ج</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 4. الترقيم (Pagination) */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-auto pt-4 shrink-0">
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-indigo-500 hover:text-white transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
                        <div className="font-bold text-xs text-slate-500">صفحة {currentPage} من {totalPages}</div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-indigo-500 hover:text-white transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
                    </div>
                </div>
            )}
        </div>
    );
};