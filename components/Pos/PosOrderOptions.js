window.PosOrderOptions = function({ 
    orderType, setOrderType, selectedTable, setSelectedTable, 
    customerName, setCustomerName, availableTables = [] 
}) {
    const { useState, useEffect, useRef } = React;

    const [tableSearch, setTableSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // إغلاق القائمة المنسدلة عند النقر بالخارج
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // مزامنة نص البحث عند تحديد أو تفريغ الطاولة من الفاتورة
    useEffect(() => {
        if (selectedTable && availableTables.length > 0) {
            const current = availableTables.find(t => String(t.id) === String(selectedTable));
            if (current) setTableSearch(current.name);
        } else {
            setTableSearch('');
        }
    }, [selectedTable, availableTables]);

    // فلترة الطاولات المتاحة بناءً على ما يكتبه الكاشير
    const filteredTables = (availableTables || []).filter(t => 
        t.name.toLowerCase().includes((tableSearch || '').toLowerCase())
    );

    const handleSelect = (table) => {
        setSelectedTable(table.id);
        setTableSearch(table.name);
        setIsDropdownOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setSelectedTable('');
        setTableSearch('');
        setIsDropdownOpen(false);
    };

    return (
        <div className="flex flex-col gap-4 shrink-0">
            {/* شريط نوع الطلب */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2 overflow-x-auto hide-scrollbar snap-x">
                <button 
                    onClick={() => { setOrderType('takeaway'); setSelectedTable(''); }} 
                    className={`snap-center flex-1 min-w-[90px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${orderType === 'takeaway' ? 'bg-[#EA580C] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                    <i className="fas fa-shopping-bag text-base sm:text-lg"></i> تيك أواي
                </button>
                <button 
                    onClick={() => setOrderType('dine_in')} 
                    className={`snap-center flex-1 min-w-[90px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${orderType === 'dine_in' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                    <i className="fas fa-chair text-base sm:text-lg"></i> صالة
                </button>
                <button 
                    onClick={() => { setOrderType('delivery'); setSelectedTable(''); }} 
                    className={`snap-center flex-1 min-w-[90px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${orderType === 'delivery' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                    <i className="fas fa-motorcycle text-base sm:text-lg"></i> دليفري
                </button>
            </div>

            {/* خيارات الطلب الإضافية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 🔍 حقل اختيار الطاولة بتقنية Live Search */}
                {orderType === 'dine_in' && (
                    <div className="relative" ref={dropdownRef}>
                        <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200 focus-within:border-blue-500 transition-colors">
                            <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                ابحث عن الطاولة <span className="text-rose-500">*</span>
                            </label>
                            
                            <div className="flex items-center gap-2">
                                <i className="fas fa-search text-xs text-slate-400"></i>
                                <input 
                                    type="text"
                                    placeholder={selectedTable ? "" : "اكتب رقم أو اسم الطاولة..."}
                                    value={tableSearch}
                                    onChange={(e) => {
                                        setTableSearch(e.target.value);
                                        setIsDropdownOpen(true);
                                        if (e.target.value === '') setSelectedTable('');
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    className="w-full bg-transparent font-bold text-slate-700 outline-none text-sm placeholder:text-slate-300"
                                />
                                {selectedTable && (
                                    <button 
                                        type="button" 
                                        onClick={handleClear}
                                        className="w-5 h-5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors shrink-0"
                                        title="إلغاء التحديد"
                                    >
                                        <i className="fas fa-times text-[10px]"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* القائمة المنسدلة للنتائج */}
                        {isDropdownOpen && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto hide-scrollbar animate-view">
                                {filteredTables.length === 0 ? (
                                    <div className="p-3 text-center text-xs font-bold text-slate-400">
                                        لا توجد طاولات متاحة بهذا الاسم
                                    </div>
                                ) : (
                                    filteredTables.map(t => (
                                        <div 
                                            key={t.id}
                                            onClick={() => handleSelect(t)}
                                            className={`px-4 py-2.5 flex items-center justify-between cursor-pointer text-sm font-bold transition-colors border-b border-slate-50 last:border-b-0 ${selectedTable === t.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-chair text-xs text-blue-400"></i>
                                                <span>{t.name}</span>
                                            </div>
                                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">متاحة</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* حقل اسم العميل / رقم الهاتف */}
                <div className={`bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200 focus-within:border-[#EA580C] transition-colors ${orderType !== 'dine_in' ? 'sm:col-span-2' : ''}`}>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">اسم العميل / الهاتف (اختياري)</label>
                    <div className="flex items-center gap-2">
                        <i className="fas fa-user text-xs text-slate-400"></i>
                        <input 
                            type="text" 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} 
                            placeholder="مثال: أحمد 010..." 
                            className="w-full bg-transparent font-bold text-slate-700 outline-none text-sm placeholder:text-slate-300" 
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};