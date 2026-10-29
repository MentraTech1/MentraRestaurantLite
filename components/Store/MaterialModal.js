window.MaterialModal = function({ isOpen, onClose, onSave, editingItem }) {
    const { useState, useEffect } = React;
    const UNITS = ['كجم', 'جرام', 'لتر', 'ملي', 'قطعة', 'كرتونة', 'شوال'];

    const [formData, setFormData] = useState({ name: '', unit: 'كجم', cost_per_unit: '', min_stock_alert: '5' });

    useEffect(() => {
        if (editingItem) {
            setFormData({ name: editingItem.name, unit: editingItem.unit, cost_per_unit: editingItem.cost_per_unit, min_stock_alert: editingItem.min_stock_alert });
        } else {
            setFormData({ name: '', unit: 'كجم', cost_per_unit: '', min_stock_alert: '5' });
        }
    }, [editingItem, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-view">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                        <i className={`fas ${editingItem ? 'fa-pen text-amber-500' : 'fa-plus-circle text-emerald-500'}`}></i> 
                        {editingItem ? 'تعديل بيانات الخامة' : 'إضافة خامة جديدة'}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">اسم الخامة (مثال: سكر، لحم، أكواب):</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-emerald-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">وحدة القياس:</label>
                            <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-emerald-500 cursor-pointer">
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">تنبيه النواقص عند:</label>
                            <input type="number" step="any" min="0" required value={formData.min_stock_alert} onChange={(e) => setFormData({...formData, min_stock_alert: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-emerald-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">سعر التكلفة (للـ {formData.unit} الواحد):</label>
                        <div className="relative">
                            <input type="number" step="any" min="0" required value={formData.cost_per_unit} onChange={(e) => setFormData({...formData, cost_per_unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold outline-none focus:border-emerald-500" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">ج.م</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                            <i className="fas fa-save"></i> حفظ البيانات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};