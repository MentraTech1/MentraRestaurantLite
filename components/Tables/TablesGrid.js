window.TablesGrid = function({ 
    tables, filteredTables, paginatedTables, searchQuery, 
    handleOpenModal, handleDeleteTable, handleToggleTableStatus,
    totalPages, currentPage, setCurrentPage 
}) {
    return (
        <div className="bg-transparent md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-slate-100 md:p-6 w-full shrink-0">
            {!tables ? (
                <div className="flex justify-center items-center py-20"><i className="fas fa-circle-notch fa-spin text-3xl text-blue-500"></i></div>
            ) : filteredTables.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-400 opacity-60 py-16 text-center bg-white rounded-2xl md:bg-transparent">
                    <i className="fas fa-chair text-5xl md:text-6xl mb-3 md:mb-4"></i>
                    <p className="font-bold text-sm">{searchQuery ? 'لا توجد طاولات تطابق بحثك.' : 'لا توجد طاولات مسجلة.'}</p>
                    {!searchQuery && <p className="text-[10px] md:text-xs mt-1">أضف الطاولات لتتمكن من استخدام خيار "صالة" في الكاشير.</p>}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 auto-rows-max">
                        {paginatedTables.map(table => {
                            const isOccupied = table.status === 'occupied';
                            const colors = isOccupied ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-emerald-200 text-emerald-700 shadow-sm hover:shadow-md';
                            const iconColors = isOccupied ? 'bg-rose-100 text-rose-500' : 'bg-emerald-50 text-emerald-500';

                            return (
                                <div key={table.id} className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center group ${colors}`}>
                                    
                                    {/* مجموعة أزرار التحكم المخفية */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        
                                        {/* زر التعديل */}
                                        <button onClick={() => handleOpenModal(table)} className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="تعديل اسم الطاولة">
                                            <i className="fas fa-pen text-[10px]"></i>
                                        </button>
                                        
                                        {/* الزر الجديد: تغيير الحالة */}
                                        <button 
                                            onClick={() => handleToggleTableStatus(table)} 
                                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-sm ${isOccupied ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white'}`} 
                                            title={isOccupied ? 'إخلاء الطاولة (تحديد كمتاحة)' : 'حجز الطاولة (تحديد كمشغولة)'}
                                        >
                                            <i className={`fas ${isOccupied ? 'fa-unlock' : 'fa-lock'} text-[10px]`}></i>
                                        </button>

                                        {/* زر الحذف */}
                                        {!isOccupied && (
                                            <button onClick={() => handleDeleteTable(table)} className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="حذف الطاولة">
                                                <i className="fas fa-trash-alt text-[10px]"></i>
                                            </button>
                                        )}
                                    </div>

                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-2xl mb-2 md:mb-3 shadow-inner ${iconColors}`}>
                                        <i className="fas fa-chair"></i>
                                    </div>
                                    <h4 className="font-black text-sm md:text-lg mb-1.5 truncate w-full px-2">{table.name}</h4>
                                    <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full ${isOccupied ? 'bg-white text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {isOccupied ? 'مشغولة بالزبائن' : 'متاحة'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6 md:mt-8 pt-4 border-t border-slate-100">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1} 
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors font-bold shadow-sm"
                            >
                                <i className="fas fa-chevron-right text-xs"></i>
                            </button>
                            
                            <div className="bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
                                <span className="text-xs font-bold text-slate-600">الصفحة {currentPage} من {totalPages}</span>
                            </div>
                            
                            <button 
                                /* تم تصحيح p + 1 إلى prev + 1 هنا 👇 */
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                                disabled={currentPage === totalPages} 
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors font-bold shadow-sm"
                            >
                                <i className="fas fa-chevron-left text-xs"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};