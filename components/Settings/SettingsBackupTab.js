window.SettingsBackupTab = function({ 
    restaurantData, handleExportBackup, handleTriggerImport, 
    handleTriggerDeleteRestaurant, fileInputRef, handleImportBackup, isLoading 
}) {
    return (
        <div className="p-4 md:p-8 animate-view">
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
                    <i className="fas fa-shield-alt text-slate-700"></i> النسخ الاحتياطي والأمان
                </h2>
                <p className="text-[10px] md:text-sm font-bold text-slate-400 mt-1">حماية بيانات المطعم واستعادتها في أي وقت</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
                {/* كارت استخراج نسخة */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-4 shadow-sm"><i className="fas fa-download"></i></div>
                    <h3 className="font-black text-slate-800 text-base md:text-lg mb-1 md:mb-2">استخراج نسخة احتياطية</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-4 md:mb-6 leading-relaxed">يقوم بتحميل ملف (JSON) يحتوي على المنيو، الفواتير، الحسابات والموظفين. احتفظ به في مكان آمن.</p>
                    <button onClick={handleExportBackup} disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 md:py-3.5 rounded-xl shadow-md transition-all mt-auto flex items-center justify-center gap-2 text-sm active:scale-95">
                        {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-save"></i> تحميل النسخة لجهازي</>}
                    </button>
                </div>

                {/* كارت استعادة نسخة */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col items-center text-center relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-4 shadow-sm"><i className="fas fa-upload"></i></div>
                    <h3 className="font-black text-slate-800 text-base md:text-lg mb-1 md:mb-2">استعادة بيانات سابقة</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-4 md:mb-6 leading-relaxed">اختر ملف (JSON) تم استخراجه مسبقاً. <br/><span className="text-rose-500">تحذير: سيتم مسح البيانات الحالية وإحلالها!</span></p>
                    
                    <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportBackup} className="hidden" />
                    <button onClick={handleTriggerImport} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 md:py-3.5 rounded-xl shadow-md transition-all mt-auto flex items-center justify-center gap-2 text-sm active:scale-95">
                        {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-folder-open"></i> اختيار ملف النسخة</>}
                    </button>
                </div>
            </div>

            {/* منطقة الخطر (Danger Zone) */}
            <div className="mt-8 md:mt-10 border-t border-slate-100 pt-6 md:pt-8 max-w-4xl">
                <h3 className="font-black text-rose-600 text-sm md:text-base flex items-center gap-2 mb-3 md:mb-4"><i className="fas fa-exclamation-triangle"></i> منطقة الخطر (Danger Zone)</h3>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-black text-slate-800 text-sm md:text-base">حذف قاعدة بيانات المطعم الحالية</h4>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1">سيتم مسح الفواتير والمنيو نهائياً من هذا الجهاز ولن يمكن التراجع.</p>
                    </div>
                    <button onClick={handleTriggerDeleteRestaurant} className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 md:py-2.5 rounded-xl font-black text-xs md:text-sm shrink-0 shadow-md active:scale-95 transition-transform">
                        تأكيد وحذف المطعم
                    </button>
                </div>
            </div>
        </div>
    );
};