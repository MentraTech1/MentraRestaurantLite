window.ExpenseModal = function({ 
    showModal, setShowModal, editingTx, txAmount, setTxAmount, 
    txDesc, setTxDesc, handleSaveTx, isSubmitting 
}) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-view border border-slate-100">
                <div className="bg-rose-50 p-4 md:p-5 border-b border-rose-100 flex justify-between items-center">
                    <h3 className="font-black text-rose-700 flex items-center gap-2 text-sm md:text-base">
                        <i className="fas fa-money-bill-wave"></i> {editingTx ? 'تعديل المصروف' : 'سحب مصروف جديد'}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-rose-200 text-rose-500 hover:text-white hover:bg-rose-500 flex items-center justify-center transition-colors"><i className="fas fa-times text-xs"></i></button>
                </div>
                <form onSubmit={handleSaveTx} className="p-5 md:p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">المبلغ (ج.م)</label>
                        <input type="number" step="0.01" min="1" required value={txAmount} onChange={e => setTxAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 font-black text-base md:text-lg text-rose-600 dir-ltr text-left" placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">البيان / الوصف</label>
                        <input type="text" required value={txDesc} onChange={e => setTxDesc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 font-bold text-xs md:text-sm text-slate-700" placeholder="مثال: فاتورة كهرباء..." />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3 md:py-4 rounded-xl shadow-lg shadow-rose-500/30 flex justify-center items-center gap-2 mt-2 transition-transform active:scale-95 text-sm md:text-base">
                        {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : (editingTx ? 'حفظ التعديل' : 'تأكيد السحب من الخزينة')}
                    </button>
                </form>
            </div>
        </div>
    );
};