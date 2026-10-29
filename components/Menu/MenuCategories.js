window.MenuCategories = function({ categories, selectedFilterCategory, setSelectedFilterCategory, openCategoryModal }) {
    return (
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0">
            <h4 className="text-xs md:text-sm font-black text-slate-700 mb-3 flex items-center gap-2">
                <i className="fas fa-filter text-slate-400"></i> الأقسام (اضغط على القلم للتعديل)
            </h4>
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1 snap-x touch-pan-x">
                <button 
                    onClick={() => setSelectedFilterCategory('all')} 
                    className={`snap-start whitespace-nowrap px-4 py-2 rounded-xl font-bold text-xs transition-all border shrink-0 ${selectedFilterCategory === 'all' ? 'border-[#EA580C] bg-[#EA580C] text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                    الكل
                </button>
                {!categories || categories.length === 0 ? null : (
                    categories.map(cat => (
                        <div key={cat.id} className="relative group shrink-0 flex items-center">
                            <button 
                                onClick={() => setSelectedFilterCategory(cat.id)}
                                className={`snap-start whitespace-nowrap pl-8 pr-4 py-2 rounded-xl font-bold text-xs transition-all border flex items-center gap-2 w-full ${selectedFilterCategory === cat.id ? 'border-[#EA580C] bg-[#EA580C] text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            >
                                <i className={`fas ${cat.icon}`}></i> {cat.name}
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); openCategoryModal(cat); }}
                                className={`absolute left-1 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${selectedFilterCategory === cat.id ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-slate-400 hover:text-[#EA580C] hover:bg-orange-50'}`}
                            >
                                <i className="fas fa-pen text-[10px]"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};