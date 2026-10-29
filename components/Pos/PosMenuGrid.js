window.PosMenuGrid = function({ 
    categories, selectedCategory, setSelectedCategory, 
    filteredItems, paginatedItems, totalPages, currentPage, setCurrentPage, addToCart 
}) {
    return (
        <div className="flex flex-col gap-4 flex-1">
            {/* الأقسام (Categories) */}
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-1 shrink-0 snap-x touch-pan-x">
                {categories.map(cat => (
                    <button 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`snap-start whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 ${selectedCategory === cat.id ? 'border-[#EA580C] bg-orange-50 text-[#EA580C]' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                    >
                        <i className={`fas ${cat.icon}`}></i> {cat.name}
                    </button>
                ))}
            </div>

            {/* الأصناف (Items) */}
            <div className="bg-slate-100/50 rounded-2xl p-3 sm:p-4 border border-slate-100 border-dashed flex flex-col justify-between flex-1 min-h-[300px]">
                
                {filteredItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 font-bold text-sm">
                        لا توجد أصناف في هذا القسم.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 auto-rows-max">
                        {paginatedItems.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => addToCart(item)}
                                className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#EA580C] transition-all group flex flex-col justify-between active:scale-95"
                            >
                                <h4 className="font-black text-slate-700 text-base sm:text-lg group-hover:text-[#EA580C] transition-colors">{item.name}</h4>
                                <div className="mt-3 sm:mt-4 flex justify-between items-end">
                                    <span className="bg-orange-100 text-[#EA580C] px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-black">{item.price} ج.م</span>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                                        <i className="fas fa-plus text-xs sm:text-sm"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 sm:mt-6 flex items-center justify-between bg-white px-3 sm:px-4 py-2 rounded-2xl shadow-sm border border-slate-100 shrink-0">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-slate-200 transition-colors">
                            <i className="fas fa-chevron-right text-sm"></i>
                        </button>
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-500">
                            <span className="bg-[#EA580C] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-md">{currentPage}</span>
                            <span>من</span>
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 flex items-center justify-center">{totalPages}</span>
                        </div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-slate-200 transition-colors">
                            <i className="fas fa-chevron-left text-sm"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};