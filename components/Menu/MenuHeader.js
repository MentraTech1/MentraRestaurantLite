window.MenuHeader = function({ openCategoryModal, openItemModal, categories, showToast }) {
    return (
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#EA580C] text-lg shrink-0">
                    <i className="fas fa-book-open"></i>
                </div>
                <div>
                    <h3 className="font-black text-base md:text-lg text-slate-800">إدارة المنيو</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400">تأسيس وتعديل الأقسام والأصناف</p>
                </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => openCategoryModal()} className="flex-1 md:flex-none bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-2.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <i className="fas fa-folder-plus text-[#EA580C]"></i> قسم جديد
                </button>
                <button onClick={() => { if(!categories || categories.length === 0) return showToast("أضف قسم أولاً", "error"); openItemModal(); }} className="flex-1 md:flex-none bg-[#EA580C] hover:bg-orange-700 text-white px-3 py-2.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2">
                    <i className="fas fa-plus"></i> صنف جديد
                </button>
            </div>
        </div>
    );
};