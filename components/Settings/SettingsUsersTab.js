window.SettingsUsersTab = function({ 
    paginatedUsers, searchQuery, setSearchQuery, totalPages, currentPage, 
    setCurrentPage, handleOpenAddUser, handleOpenEditUser 
}) {
    const roleLabels = { 'owner': 'مدير مطعم', 'cashier': 'كاشير', 'waiter': 'كابتن / ويتر' };
    const roleColors = { 'owner': 'bg-purple-100 text-purple-700', 'cashier': 'bg-blue-100 text-blue-700', 'waiter': 'bg-emerald-100 text-emerald-700' };

    return (
        <div className="p-4 md:p-8 animate-view">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
                        <i className="fas fa-users text-[#EA580C]"></i> طاقم العمل
                    </h2>
                    <p className="text-[10px] md:text-sm font-bold text-slate-400 mt-1">إضافة وتعديل موظفين (كاشير، ويتر) وتحديد صلاحياتهم</p>
                </div>
                <button onClick={handleOpenAddUser} className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-black px-4 md:px-5 py-3 md:py-2.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 text-xs md:text-sm shrink-0 active:scale-95">
                    <i className="fas fa-user-plus"></i> إضافة موظف جديد
                </button>
            </div>

            <div className="mb-6 relative">
                <input 
                    type="text" 
                    placeholder="ابحث بالاسم أو رقم الهاتف..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 outline-none focus:border-sky-500 font-bold text-sm text-slate-800 transition-colors"
                />
                <i className="fas fa-search absolute top-1/2 right-4 -translate-y-1/2 text-slate-400"></i>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                    <div key={user.id} className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 flex items-center justify-between transition-colors hover:border-sky-300 shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 flex items-center justify-center font-black text-lg md:text-xl text-slate-400 border border-slate-200 shrink-0">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-black text-sm md:text-base text-slate-800 leading-tight mb-1.5">{user.name}</h4>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-400 dir-ltr"><i className="fas fa-phone text-[9px] mr-1"></i>{user.phone}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleOpenEditUser(user)} className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 text-sky-500 hover:bg-sky-500 hover:text-white shadow-sm border border-slate-200 flex items-center justify-center transition-colors shrink-0" title="تعديل بيانات الموظف">
                            <i className="fas fa-pen text-xs md:text-sm"></i>
                        </button>
                    </div>
                )) : (
                    <div className="col-span-1 md:col-span-2 text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                        <i className="fas fa-user-slash text-3xl text-slate-300 mb-3"></i>
                        <p className="text-slate-500 font-bold text-sm">لا يوجد موظفين يطابقون بحثك</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 transition-colors font-bold"
                    >
                        <i className="fas fa-chevron-right text-xs"></i>
                    </button>
                    
                    <div className="bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
                        <span className="text-xs font-bold text-slate-600">الصفحة {currentPage} من {totalPages}</span>
                    </div>

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 transition-colors font-bold"
                    >
                        <i className="fas fa-chevron-left text-xs"></i>
                    </button>
                </div>
            )}
        </div>
    );
};