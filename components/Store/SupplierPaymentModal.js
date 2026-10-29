window.SupplierPaymentModal = function({ isOpen, onClose, supplier, onPay }) {
    const { useState, useEffect } = React;
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if(isOpen) setAmount('');
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payVal = parseFloat(amount);
        if (payVal > 0 && payVal <= supplier.total_credit) {
            onPay(payVal);
        } else {
            alert("المبلغ غير صحيح أو أكبر من المديونية");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-view">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-lg text-slate-800"><i className="fas fa-hand-holding-usd text-emerald-500 ml-2"></i> سداد دفعة للمورد</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:bg-rose-500 hover:text-white flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-400">المديونية الحالية</p>
                        <p className="text-2xl font-black text-rose-500">{supplier.total_credit} ج.م</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">المبلغ المراد سداده:</label>
                        <div className="relative">
                            <input type="number" step="any" min="1" max={supplier.total_credit} required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-black outline-none focus:border-emerald-500 text-emerald-600" />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">ج.م</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">* سيتم خصم هذا المبلغ من الخزينة مباشرة.</p>
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-xl shadow-lg mt-2 transition-colors">
                        تأكيد السداد
                    </button>
                </form>
            </div>
        </div>
    );
};