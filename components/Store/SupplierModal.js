window.SupplierModal = function({ isOpen, onClose, onSave, editingSupplier }) {
    const { useState, useEffect } = React;
    const [formData, setFormData] = useState({ name: '', phone: '' });

    useEffect(() => {
        if (editingSupplier) setFormData({ name: editingSupplier.name, phone: editingSupplier.phone || '' });
        else setFormData({ name: '', phone: '' });
    }, [editingSupplier, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-view">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                        <i className={`fas ${editingSupplier ? 'fa-pen' : 'fa-truck-loading'} text-indigo-500`}></i> 
                        {editingSupplier ? 'تعديل مورد' : 'إضافة مورد جديد'}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:bg-rose-500 hover:text-white flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">اسم المورد:</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">رقم الهاتف:</label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-indigo-500" dir="ltr" />
                    </div>
                    <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 mt-4"><i className="fas fa-save"></i> حفظ</button>
                </form>
            </div>
        </div>
    );
};