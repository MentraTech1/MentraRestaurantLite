window.BackupConfirmModal = function({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-view border border-slate-100 p-6 text-center">
                
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
                    <i className="fas fa-exclamation-triangle"></i>
                </div>

                <h3 className="font-black text-slate-800 text-lg md:text-xl mb-2">{title || "تنبيه هام جداً"}</h3>
                <p className="text-slate-500 font-bold text-xs md:text-sm leading-relaxed mb-6">
                    {message || "استعادة النسخة الاحتياطية ستقوم بمسح كافة الفواتير والمنيو الموجودة حالياً وإحلال بيانات الملف بدلاً منها. هل أنت متأكد من المتابعة؟"}
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl shadow-lg transition-all text-sm active:scale-95"
                    >
                        نعم، متابعة الاستعادة
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3.5 rounded-xl transition-colors text-sm"
                    >
                        إلغاء التراجع
                    </button>
                </div>

            </div>
        </div>
    );
};