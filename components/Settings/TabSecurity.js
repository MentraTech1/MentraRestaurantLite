window.TabSecurity = function({ securityKey, setSecurityKey, handleUpdateSecurityKey, isLoading }) {
    
    const generateRandomKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) key += '-';
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setSecurityKey(key);
    };

    return (
        <div className="p-4 md:p-8 animate-view">
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
                    <i className="fas fa-key text-[#EA580C]"></i> مفتاح الاستعادة والأمان
                </h2>
                <p className="text-[10px] md:text-sm font-bold text-slate-400 mt-1">يستخدم لفتح الكاشير في حال نسيان كلمة المرور</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex items-start gap-3 max-w-xl mb-6">
                <i className="fas fa-info-circle text-amber-500 text-xl mt-1 shrink-0"></i>
                <p className="text-xs md:text-sm font-bold text-amber-700 leading-relaxed">
                    نظراً لأن النظام يعمل (Offline) بدون إنترنت، لا توجد إمكانية لاستعادة الباسورد عبر الإيميل. 
                    لذلك، <strong className="text-amber-900">يجب عليك إنشاء مفتاح أمان والاحتفاظ به في مكان آمن (في ورقة خارجية)</strong>. في حال نسيان الباسورد، سيطلب منك النظام إدخال هذا المفتاح.
                </p>
            </div>

            <form onSubmit={handleUpdateSecurityKey} className="space-y-5 max-w-xl">
                <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">مفتاح الأمان الخاص بك</label>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input 
                            type="text" 
                            dir="ltr"
                            placeholder="مثال: A1B2-C3D4-E5F6"
                            value={securityKey} 
                            onChange={e => setSecurityKey(e.target.value.toUpperCase())} 
                            className="flex-1 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black tracking-widest text-center text-[#EA580C] focus:border-[#EA580C] outline-none uppercase placeholder:text-sm placeholder:tracking-normal" 
                        />
                        <button 
                            type="button" 
                            onClick={generateRandomKey}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-4 rounded-xl transition-colors shrink-0 text-sm md:text-base flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-random"></i> توليد تلقائي
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-black px-8 py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30 active:scale-95 text-sm md:text-base flex items-center justify-center gap-2">
                    {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-lock"></i> اعتماد وحفظ مفتاح الأمان</>}
                </button>
            </form>
        </div>
    );
};