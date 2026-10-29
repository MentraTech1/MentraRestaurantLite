window.SettingsNav = function({ activeTab, setActiveTab }) {
    return (
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar snap-x touch-pan-x pb-2 lg:pb-0">
            <button onClick={() => setActiveTab('general')} className={`snap-start flex items-center gap-2 md:gap-3 px-4 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all whitespace-nowrap text-right shrink-0 ${activeTab === 'general' ? 'bg-[#EA580C] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100 hover:border-orange-300'}`}>
                <i className="fas fa-store w-5 text-center text-base md:text-lg"></i> <span className="text-xs md:text-sm">بيانات المطعم</span>
            </button>
            <button onClick={() => setActiveTab('users')} className={`snap-start flex items-center gap-2 md:gap-3 px-4 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all whitespace-nowrap text-right shrink-0 ${activeTab === 'users' ? 'bg-[#EA580C] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100 hover:border-orange-300'}`}>
                <i className="fas fa-users w-5 text-center text-base md:text-lg"></i> <span className="text-xs md:text-sm">طاقم العمل</span>
            </button>
            
            {/* التبويب الجديد */}
            <button onClick={() => setActiveTab('security')} className={`snap-start flex items-center gap-2 md:gap-3 px-4 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all whitespace-nowrap text-right shrink-0 ${activeTab === 'security' ? 'bg-[#EA580C] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100 hover:border-orange-300'}`}>
                <i className="fas fa-key w-5 text-center text-base md:text-lg"></i> <span className="text-xs md:text-sm">مفتاح الأمان</span>
            </button>

            <button onClick={() => setActiveTab('backup')} className={`snap-start flex items-center gap-2 md:gap-3 px-4 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all whitespace-nowrap text-right shrink-0 mt-0 lg:mt-4 ${activeTab === 'backup' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-300'}`}>
                <i className="fas fa-shield-alt w-5 text-center text-base md:text-lg"></i> <span className="text-xs md:text-sm">النسخ الاحتياطي</span>
            </button>
        </div>
    );
};