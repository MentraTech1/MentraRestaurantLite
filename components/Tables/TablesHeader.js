window.TablesHeader = function({ searchQuery, setSearchQuery, handleOpenModal }) {
    return (
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-center shrink-0">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg shrink-0">
                    <i className="fas fa-chair"></i>
                </div>
                <div>
                    <h3 className="font-black text-base md:text-lg text-slate-800">إدارة الطاولات للصالة</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400">تأسيس الطاولات ومراقبة حالتها</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                    <input type="text" placeholder="ابحث عن طاولة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 outline-none focus:border-blue-500 text-xs md:text-sm font-bold text-slate-700" />
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 shrink-0">
                    <i className="fas fa-plus"></i> إضافة طاولة
                </button>
            </div>
        </div>
    );
};