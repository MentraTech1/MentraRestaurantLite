window.SettingsConfirmModal = function({ 
    isOpen, onClose, onConfirm, title, message, 
    confirmText = "تأكيد", confirmColor = "bg-rose-600 hover:bg-rose-700",
    requiresInput = false, expectedInput = "", inputPlaceholder = "" 
}) {
    if (!isOpen) return null;
    const { useState } = React;
    const [inputValue, setInputValue] = useState('');

    const isMatch = !requiresInput || (inputValue.trim() === expectedInput.trim());

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-view border border-slate-100 p-6 text-center">
                
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
                    <i className="fas fa-exclamation-triangle"></i>
                </div>

                <h3 className="font-black text-slate-800 text-lg md:text-xl mb-2">{title}</h3>
                <p className="text-slate-500 font-bold text-xs md:text-sm leading-relaxed mb-6">{message}</p>

                {requiresInput && (
                    <div className="mb-6 text-right">
                        <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                            اكتب: <span className="text-slate-800 font-black select-all bg-slate-100 px-2 py-0.5 rounded">{expectedInput}</span> للتأكيد:
                        </label>
                        <input 
                            type="text" 
                            autoFocus
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={inputPlaceholder || expectedInput}
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 font-bold text-sm text-slate-800 text-center transition-colors"
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        disabled={!isMatch}
                        className={`flex-1 text-white font-black py-3.5 rounded-xl shadow-lg transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed ${confirmColor}`}
                    >
                        {confirmText}
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