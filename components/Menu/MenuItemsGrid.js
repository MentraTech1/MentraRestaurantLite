window.MenuItemsGrid = function({ 
    menuItems, filteredItems, paginatedItems, categories, searchQuery, setSearchQuery, 
    openItemModal, handleDeleteItem, totalPages, currentPage, setCurrentPage 
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col shrink-0">
            <div className="p-3 md:p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h4 className="text-xs md:text-sm font-black text-slate-700 hidden sm:block">قائمة الأصناف</h4>
                <div className="relative w-full sm:w-72">
                    <input type="text" placeholder="ابحث باسم الصنف..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 md:py-2 outline-none focus:border-[#EA580C] text-xs md:text-sm font-bold text-slate-700" />
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
            </div>

            <div className="p-3 md:p-4 min-h-[300px]">
                {!menuItems ? (
                    <div className="flex justify-center items-center py-20"><i className="fas fa-circle-notch fa-spin text-3xl text-[#EA580C]"></i></div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 opacity-60 py-16 text-center">
                        <i className="fas fa-box-open text-5xl md:text-6xl mb-3"></i>
                        <p className="font-bold text-xs md:text-sm">لا توجد أصناف تطابق فلاتر البحث</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {paginatedItems.map(item => {
                            const cat = categories?.find(c => c.id === item.category_id);
                            return (
                                <div key={item.id} className="border border-slate-100 rounded-2xl p-4 hover:border-[#EA580C] hover:shadow-md transition-all flex flex-col justify-between bg-white relative group">
                                    <div className="absolute top-3 left-3 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openItemModal(item)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors border border-blue-100"><i className="fas fa-pen text-[10px]"></i></button>
                                        <button onClick={() => handleDeleteItem(item.id, item.name)} className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors border border-rose-100"><i className="fas fa-trash text-[10px]"></i></button>
                                    </div>
                                    <div className="mb-4 pr-16">
                                        <h4 className="font-black text-slate-800 text-sm md:text-base leading-tight">{item.name}</h4>
                                        <span className="text-[9px] md:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1.5 inline-flex items-center gap-1 border border-slate-200">
                                            <i className={`fas ${cat?.icon || 'fa-tag'}`}></i> {cat?.name || 'بدون قسم'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 border-dashed">
                                        <div>
                                            <span className="block text-[9px] md:text-[10px] font-bold text-slate-400">سعر البيع</span>
                                            <span className="font-black text-[#EA580C] text-sm md:text-base">{item.price} ج</span>
                                        </div>
                                        {item.cost > 0 && (
                                            <div className="text-left">
                                                <span className="block text-[9px] md:text-[10px] font-bold text-slate-400">التكلفة</span>
                                                <span className="font-bold text-slate-500 text-xs md:text-sm">{item.cost} ج</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100 w-full max-w-sm">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-[#EA580C] hover:text-white transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-500">
                            <span className="bg-[#EA580C] text-white w-6 h-6 rounded flex items-center justify-center shadow-sm">{currentPage}</span>
                            <span>من</span>
                            <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">{totalPages}</span>
                        </div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-[#EA580C] hover:text-white transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
                    </div>
                </div>
            )}
        </div>
    );
};