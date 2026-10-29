window.AccountingStats = function({ stats }) {
    // تجهيز حسابات الرسم البياني (لكي لا يحدث كراش إذا كانت القيم صفر، نجعل المجموع 1 كحد أدنى)
    const chartTotal = stats.totalIncome + stats.totalExpense + stats.totalPurchases + stats.totalWaste || 1;
    
    // حساب النسب المئوية لكل قسم لتلوين الدائرة
    const pInc = (stats.totalIncome / chartTotal) * 100;
    const pExp = (stats.totalExpense / chartTotal) * 100;
    const pPur = (stats.totalPurchases / chartTotal) * 100;
    const pWas = (stats.totalWaste / chartTotal) * 100;

    // توليد الـ Conic Gradient باستخدام CSS لعمل Pie Chart فوري واحترافي
    const donutStyle = {
        background: `conic-gradient(
            #10b981 0% ${pInc}%, 
            #f43f5e ${pInc}% ${pInc + pExp}%, 
            #6366f1 ${pInc + pExp}% ${pInc + pExp + pPur}%, 
            #f59e0b ${pInc + pExp + pPur}% 100%
        )`
    };

    return (
        <div className="flex flex-col space-y-4 shrink-0">
            
            {/* 1. الكروت الأربعة (مبيعات، مصروفات، مشتريات، هالك) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-lg shrink-0"><i className="fas fa-hand-holding-usd"></i></div>
                    <div><p className="text-[10px] md:text-xs font-bold text-slate-400 mb-0.5">إجمالي المبيعات</p><h4 className="font-black text-sm md:text-lg text-emerald-600">{stats.totalIncome.toLocaleString()} <span className="text-[10px]">ج</span></h4></div>
                </div>
                
                <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-lg shrink-0"><i className="fas fa-file-invoice-dollar"></i></div>
                    <div><p className="text-[10px] md:text-xs font-bold text-slate-400 mb-0.5">المصروفات والسحب</p><h4 className="font-black text-sm md:text-lg text-rose-600">{stats.totalExpense.toLocaleString()} <span className="text-[10px]">ج</span></h4></div>
                </div>

                <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-lg shrink-0"><i className="fas fa-shopping-cart"></i></div>
                    <div><p className="text-[10px] md:text-xs font-bold text-slate-400 mb-0.5">إجمالي المشتريات</p><h4 className="font-black text-sm md:text-lg text-indigo-600">{stats.totalPurchases.toLocaleString()} <span className="text-[10px]">ج</span></h4></div>
                </div>

                <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg shrink-0"><i className="fas fa-trash-alt"></i></div>
                    <div><p className="text-[10px] md:text-xs font-bold text-slate-400 mb-0.5">قيمة الهالك</p><h4 className="font-black text-sm md:text-lg text-amber-600">{stats.totalWaste.toLocaleString()} <span className="text-[10px]">ج</span></h4></div>
                </div>
            </div>

            {/* 2. التحليل المالي والرسم البياني وصافي الربح */}
            <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-10 overflow-hidden relative">
                
                {/* خلفية جمالية */}
                <div className="absolute left-0 top-0 w-32 h-32 bg-slate-50 rounded-br-full -z-10"></div>

                {/* الرسم البياني الدائري (Donut Chart) */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full shrink-0 flex items-center justify-center shadow-inner" style={donutStyle}>
                    {/* الدائرة الداخلية لتشكيل الـ Donut (الفتحة في المنتصف) */}
                    <div className="absolute w-28 h-28 md:w-32 md:h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
                        <span className="text-[10px] font-bold text-slate-400">هامش الربح</span>
                        <span className={`font-black text-xl md:text-2xl ${stats.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {stats.profitMargin}%
                        </span>
                    </div>
                </div>

                {/* تفاصيل الربح وأسطورة الرسم البياني (Legend) */}
                <div className="flex-1 w-full space-y-4">
                    <div className={`p-4 rounded-2xl shadow-sm flex justify-between items-center ${stats.netProfit >= 0 ? 'bg-gradient-to-l from-emerald-500 to-teal-500 text-white' : 'bg-gradient-to-l from-rose-500 to-red-500 text-white'}`}>
                        <div>
                            <p className="text-xs font-bold opacity-80 mb-1">صافي الخزينة (الربح)</p>
                            <h3 className="text-2xl md:text-3xl font-black">{stats.netProfit.toLocaleString()} <span className="text-sm font-bold">ج.م</span></h3>
                        </div>
                        <i className={`fas ${stats.netProfit >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-4xl opacity-30`}></i>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs md:text-sm font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shrink-0"></span>
                            <span className="text-slate-600">المبيعات</span>
                            <span className="mr-auto text-slate-400 text-[10px]">{pInc.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shrink-0"></span>
                            <span className="text-slate-600">المصروفات</span>
                            <span className="mr-auto text-slate-400 text-[10px]">{pExp.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shrink-0"></span>
                            <span className="text-slate-600">المشتريات</span>
                            <span className="mr-auto text-slate-400 text-[10px]">{pPur.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shrink-0"></span>
                            <span className="text-slate-600">الهالك</span>
                            <span className="mr-auto text-slate-400 text-[10px]">{pWas.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};