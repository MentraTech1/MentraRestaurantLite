window.MenuCategoryModal = function({ 
    showCategoryModal, setShowCategoryModal, editingCategory, 
    catName, setCatName, catIcon, setCatIcon, iconOptions, 
    handleSaveCategory, handleDeleteCategory, isSubmitting 
}) {
    if (!showCategoryModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)}></div>
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-view">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-sm md:text-base">{editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}</h3>
                    <button onClick={() => setShowCategoryModal(false)} className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-colors"><i className="fas fa-times text-xs"></i></button>
                </div>
                <form onSubmit={handleSaveCategory} className="p-4 md:p-5 space-y-4">
                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">اسم القسم (مثال: مشويات، بيتزا)</label>
                        <input type="text" required value={catName} onChange={e => setCatName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-[#EA580C] font-bold text-xs md:text-sm" placeholder="أدخل اسم القسم..." />
                    </div>
                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-2">اختر أيقونة للقسم</label>
                        <div className="flex flex-wrap gap-2">
                            {iconOptions.map(icon => (
                                <button key={icon} type="button" onClick={() => setCatIcon(icon)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 ${catIcon === icon ? 'border-[#EA580C] bg-orange-50 text-[#EA580C] shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-300 bg-slate-50'}`}>
                                    <i className={`fas ${icon}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pt-2 flex flex-col gap-2">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#EA580C] hover:bg-orange-600 text-white font-black py-3 rounded-xl shadow-lg shadow-orange-500/30 flex justify-center items-center gap-2 text-sm">
                            {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : (editingCategory ? 'حفظ التعديلات' : 'حفظ القسم')}
                        </button>
                        
                        {editingCategory && (
                            <button type="button" onClick={handleDeleteCategory} disabled={isSubmitting} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-3 rounded-xl flex justify-center items-center gap-2 text-sm transition-colors mt-2">
                                <i className="fas fa-trash"></i> حذف هذا القسم
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};