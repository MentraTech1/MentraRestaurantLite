window.MenuItemModal = function({
    showItemModal, setShowItemModal, editingItem,
    itemName, setItemName, itemPrice, setItemPrice, itemCost, setItemCost,
    itemCategory, setItemCategory, categories, handleSaveItem, isSubmitting
}) {
    if (!showItemModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowItemModal(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-view">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-sm md:text-base">{editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}</h3>
                    <button onClick={() => setShowItemModal(false)} className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-colors"><i className="fas fa-times text-xs"></i></button>
                </div>
                <form onSubmit={handleSaveItem} className="p-4 md:p-5 space-y-4">
                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">اسم الصنف / الوجبة</label>
                        <input type="text" required value={itemName} onChange={e => setItemName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-[#EA580C] font-bold text-xs md:text-sm" placeholder="مثال: شاورما دجاج كبير" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">سعر البيع (ج.م)</label>
                            <input type="number" step="0.01" min="0" required value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-[#EA580C] font-black text-xs md:text-sm dir-ltr text-left" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">تكلفة الصنف (اختياري)</label>
                            <input type="number" step="0.01" min="0" value={itemCost} onChange={e => setItemCost(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-slate-300 font-bold text-xs md:text-sm dir-ltr text-left" placeholder="0.00" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">القسم</label>
                        <select required value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-[#EA580C] font-bold text-xs md:text-sm text-slate-700">
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#EA580C] hover:bg-orange-600 text-white font-black py-3 md:py-3.5 rounded-xl shadow-lg shadow-orange-500/30 flex justify-center items-center gap-2 mt-4 text-sm">
                        {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : (editingItem ? 'حفظ التعديلات' : 'إضافة للمنيو')}
                    </button>
                </form>
            </div>
        </div>
    );
};