window.MainQuickAccess = function({ setActiveModule }) {
    const handleNavigation = (moduleName) => {
        if (setActiveModule) setActiveModule(moduleName);
    };

    return (
        <div className="lg:col-span-1 space-y-4">
            <h3 className="font-black text-slate-700 flex items-center gap-2">
                <i className="fas fa-bolt text-[#EA580C]"></i> الوصول السريع
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <div onClick={() => handleNavigation('pos')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center hover:border-[#EA580C] hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-10 h-10 mx-auto bg-orange-50 text-[#EA580C] rounded-full flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform"><i className="fas fa-cash-register"></i></div>
                    <span className="text-xs font-bold text-slate-600">الكاشير (POS)</span>
                </div>
                <div onClick={() => handleNavigation('menu')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-10 h-10 mx-auto bg-sky-50 text-sky-500 rounded-full flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform"><i className="fas fa-hamburger"></i></div>
                    <span className="text-xs font-bold text-slate-600">إدارة المنيو</span>
                </div>
                <div onClick={() => handleNavigation('orders')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-10 h-10 mx-auto bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform"><i className="fas fa-concierge-bell"></i></div>
                    <span className="text-xs font-bold text-slate-600">سجل الطلبات</span>
                </div>
                <div onClick={() => handleNavigation('accounting')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-10 h-10 mx-auto bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform"><i className="fas fa-wallet"></i></div>
                    <span className="text-xs font-bold text-slate-600">الخزينة</span>
                </div>
            </div>
        </div>
    );
};