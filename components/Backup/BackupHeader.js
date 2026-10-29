window.BackupHeader = function({ restaurantName, lastBackup }) {
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 relative overflow-hidden">
            <i className="fas fa-server absolute left-0 top-1/2 -translate-y-1/2 text-7xl md:text-8xl opacity-5 transform -translate-x-2 md:-translate-x-4 pointer-events-none"></i>
            <div className="flex items-center gap-3 md:gap-4 z-10 w-full md:w-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-800 flex items-center justify-center text-white text-xl md:text-2xl shadow-lg shrink-0">
                    <i className="fas fa-database"></i>
                </div>
                <div className="flex-1">
                    <h2 className="font-black text-lg md:text-xl text-slate-800">قواعد البيانات والنسخ</h2>
                    <p className="text-[10px] md:text-sm font-bold text-slate-400 mt-0.5 md:mt-1 truncate">حماية بيانات {restaurantName}</p>
                </div>
            </div>
            <div className="bg-orange-50 border border-orange-100 px-3 md:px-4 py-2 rounded-xl text-right md:text-left z-10 w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start">
                <span className="text-[9px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mb-0 md:mb-0.5">آخر نسخة</span>
                <span className="font-bold text-xs md:text-sm text-orange-700">{lastBackup}</span>
            </div>
        </div>
    );
};