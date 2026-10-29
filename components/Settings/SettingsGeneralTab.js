window.SettingsGeneralTab = function({ restaurantData, setRestaurantData, handleSaveGeneral, isLoading }) {
    return (
        <div className="p-4 md:p-8 animate-view">
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
                    <i className="fas fa-store text-[#EA580C]"></i> البيانات الأساسية
                </h2>
                <p className="text-[10px] md:text-sm font-bold text-slate-400 mt-1">تعديل اسم المطعم وبيانات التواصل الخاصة به</p>
            </div>

            <form onSubmit={handleSaveGeneral} className="max-w-xl space-y-4 md:space-y-5">
                <div>
                    <label className="block text-xs md:text-sm font-black text-slate-700 mb-1.5 md:mb-2">اسم المطعم / الكافيه</label>
                    <input type="text" value={restaurantData.restaurant_name} onChange={e => setRestaurantData({...restaurantData, restaurant_name: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#EA580C] font-bold text-sm text-slate-800" />
                </div>
                <div>
                    <label className="block text-xs md:text-sm font-black text-slate-700 mb-1.5 md:mb-2">اسم المدير المسئول</label>
                    <input type="text" value={restaurantData.owner_name} onChange={e => setRestaurantData({...restaurantData, owner_name: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#EA580C] font-bold text-sm text-slate-800" />
                </div>
                <div>
                    <label className="block text-xs md:text-sm font-black text-slate-700 mb-1.5 md:mb-2">رقم الهاتف للتواصل</label>
                    <input type="tel" value={restaurantData.phone} onChange={e => setRestaurantData({...restaurantData, phone: e.target.value})} required dir="ltr" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#EA580C] font-bold text-sm text-slate-800 text-left" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-[#EA580C] hover:bg-orange-700 text-white font-black px-8 py-3.5 md:py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex justify-center items-center gap-2 mt-4 active:scale-95 text-sm md:text-base">
                    {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : 'حفظ التعديلات'}
                </button>
            </form>
        </div>
    );
};