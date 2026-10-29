window.BackupActions = function({ handleExport, triggerImport, fileInputRef, handleImport }) {
    return (
        <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* كارت التصدير */}
                <div className="bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col items-center justify-center text-center transition-all group shadow-sm hover:shadow-xl">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl md:text-4xl mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-inner">
                        <i className="fas fa-cloud-download-alt"></i>
                    </div>
                    <h3 className="font-black text-slate-800 text-lg md:text-2xl mb-2 md:mb-3">تصدير وحفظ البيانات</h3>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-5 md:mb-8 max-w-xs leading-relaxed">
                        احفظ نسخة كاملة من النظام على جهازك بصيغة ملف مشفر (JSON) لحمايتها من الضياع.
                    </p>
                    <button onClick={handleExport} className="w-full max-w-xs bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 text-sm md:text-lg flex items-center justify-center gap-2">
                        <i className="fas fa-save"></i> استخراج النسخة الآن
                    </button>
                </div>

                {/* كارت الاستيراد */}
                <div className="bg-white border-2 border-slate-100 hover:border-blue-500 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col items-center justify-center text-center transition-all group shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl md:text-4xl mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-inner">
                        <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3 className="font-black text-slate-800 text-lg md:text-2xl mb-2 md:mb-3">استعادة البيانات</h3>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-5 md:mb-8 max-w-xs leading-relaxed">
                        قم برفع ملف نسخة احتياطية تم استخراجه مسبقاً لاستعادة المطعم. <br/>
                        <span className="text-rose-500 mt-1 md:mt-2 block">سيتم مسح البيانات الحالية.</span>
                    </p>
                    
                    <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
                    
                    <button onClick={triggerImport} className="w-full max-w-xs bg-slate-800 hover:bg-slate-900 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-lg transition-all active:scale-95 text-sm md:text-lg flex items-center justify-center gap-2">
                        <i className="fas fa-upload"></i> اختيار ملف النسخة
                    </button>
                </div>

            </div>

            {/* الملاحظة الأمنية */}
            <div className="text-center shrink-0">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5 md:gap-2">
                    <i className="fas fa-lock text-emerald-500"></i> يتم معالجة البيانات محلياً على جهازك دون الحاجة لإنترنت حفاظاً على السرية.
                </p>
            </div>
        </div>
    );
};