window.AccountingHeader = function({ 
    startDate, setStartDate, endDate, setEndDate, exportPDF, exportExcel, openModal 
}) {
    return (
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-3 md:gap-4 justify-between items-center shrink-0">
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 text-lg shrink-0">
                    <i className="fas fa-wallet"></i>
                </div>
                <div>
                    <h3 className="font-black text-base md:text-lg text-slate-800">الخزينة والحسابات</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400">مراقبة الإيرادات والمصروفات والأرباح</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 w-full lg:w-auto">
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={exportPDF} className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 flex justify-center items-center gap-1 transition-colors">
                        <i className="fas fa-print text-rose-500"></i> PDF
                    </button>
                    <button onClick={exportExcel} className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 flex justify-center items-center gap-1 transition-colors">
                        <i className="fas fa-file-excel text-emerald-500"></i> Excel
                    </button>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 md:py-2">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400">من:</span>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-xs md:text-sm font-bold text-slate-700 outline-none w-full dir-ltr cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 md:py-2">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400">إلى:</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-xs md:text-sm font-bold text-slate-700 outline-none w-full dir-ltr cursor-pointer" />
                </div>
                <button onClick={() => openModal()} className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2">
                    <i className="fas fa-minus-circle"></i> سحب مصروف
                </button>
            </div>
        </div>
    );
};