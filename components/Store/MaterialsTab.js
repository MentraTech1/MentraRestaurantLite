window.MaterialsTab = function({ items, stats, showToast }) {
    const { useState } = React;
    const { MaterialModal, MaterialCard } = window;
    
    const ITEMS_PER_PAGE = 4; 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // حالة المودال
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const filteredItems = items.filter(item => item.name.includes(searchTerm));
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSave = async (data) => {
        try {
            if (editingItem) {
                // تعديل الخامة الموجودة عبر IndexedDB مباشرة
                await window.db.inventory_items.update(editingItem.id, {
                    name: data.name,
                    unit: data.unit,
                    cost_per_unit: parseFloat(data.cost_per_unit),
                    min_stock_alert: parseFloat(data.min_stock_alert)
                });
                showToast("تم تعديل الخامة بنجاح", "success");
            } else {
                // إضافة خامة جديدة
                await window.RestaurantQueries.addInventoryItem(data.name, data.unit, data.cost_per_unit, data.min_stock_alert);
                showToast("تمت إضافة الخامة بنجاح", "success");
            }
            setIsModalOpen(false);
        } catch (err) {
            showToast("حدث خطأ أثناء الحفظ", "error");
        }
    };

    return (
        <div className="space-y-6 animate-view h-full flex flex-col">
            
            <MaterialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editingItem={editingItem} />

            {/* الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl"><i className="fas fa-boxes"></i></div>
                    <div><p className="text-xs font-bold text-slate-400">إجمالي الخامات</p><p className="text-2xl font-black text-slate-800">{stats.total}</p></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl"><i className="fas fa-exclamation-triangle"></i></div>
                    <div><p className="text-xs font-bold text-slate-400">قارب على الانتهاء</p><p className="text-2xl font-black text-amber-600">{stats.lowStock}</p></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl"><i className="fas fa-times-circle"></i></div>
                    <div><p className="text-xs font-bold text-slate-400">رصيد صفر (نفذ)</p><p className="text-2xl font-black text-rose-600">{stats.outOfStock}</p></div>
                </div>
            </div>

            {/* البحث وإضافة */}
            <div className="flex flex-col md:flex-row gap-4 shrink-0">
                <div className="relative flex-1">
                    <input type="text" placeholder="ابحث عن خامة..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 font-bold text-sm outline-none focus:border-emerald-500 shadow-sm" />
                    <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
                <button onClick={() => handleOpenModal(null)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all">
                    <i className="fas fa-plus"></i> إضافة خامة
                </button>
            </div>

            {/* عرض الكروت */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 content-start">
                {paginatedItems.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-slate-400 font-bold">لا توجد خامات مطابقة للبحث.</div>
                ) : (
                    paginatedItems.map(item => (
                        <MaterialCard key={item.id} item={item} onEdit={handleOpenModal} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center shrink-0 mt-auto pt-4">
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-emerald-500 hover:text-white"><i className="fas fa-chevron-right text-xs"></i></button>
                        <div className="font-bold text-xs text-slate-500">صفحة {currentPage} من {totalPages}</div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-emerald-500 hover:text-white"><i className="fas fa-chevron-left text-xs"></i></button>
                    </div>
                </div>
            )}
        </div>
    );
};