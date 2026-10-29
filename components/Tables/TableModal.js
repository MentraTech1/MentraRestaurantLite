window.TableModal = function({ showModal, setShowModal, editingTable, tableName, setTableName, handleSaveTable, isSubmitting }) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-view">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-sm md:text-base">{editingTable ? 'تعديل الطاولة' : 'إضافة طاولة جديدة'}</h3>
                    <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"><i className="fas fa-times text-xs"></i></button>
                </div>
                <form onSubmit={handleSaveTable} className="p-4 md:p-5 space-y-4">
                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">اسم الطاولة (مثال: طاولة رقم 1)</label>
                        <input type="text" required value={tableName} onChange={e => setTableName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold text-xs md:text-sm" placeholder="أدخل اسم الطاولة..." />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 mt-4 transition-transform active:scale-95 text-sm">
                        {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : (editingTable ? 'حفظ التعديل' : 'حفظ الطاولة')}
                    </button>
                </form>
            </div>
        </div>
    );
};