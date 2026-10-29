window.UserModal = function({ showUserModal, setShowUserModal, editingUserId, newUser, setNewUser, handleSaveUser, isLoading }) {
    if (!showUserModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowUserModal(false)}></div>
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-view border border-slate-100 max-h-[90vh] flex flex-col">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-slate-800 text-sm md:text-base">{editingUserId ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h3>
                    <button onClick={() => setShowUserModal(false)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"><i className="fas fa-times text-xs"></i></button>
                </div>
                <div className="overflow-y-auto p-5 md:p-6 hide-scrollbar">
                    <form onSubmit={handleSaveUser} className="space-y-4">
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">الاسم</label>
                            <input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-sky-500 font-bold text-xs md:text-sm" placeholder="مثال: محمد أحمد" />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">رقم الهاتف (للدخول)</label>
                            <input type="tel" required value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} dir="ltr" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-sky-500 font-bold text-xs md:text-sm text-left" placeholder="01..." />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">
                                كلمة المرور 
                                {editingUserId && <span className="text-[9px] text-slate-400 font-normal mr-1">(اتركه فارغاً للاحتفاظ بالقديم)</span>}
                            </label>
                            <input type="password" required={!editingUserId} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} dir="ltr" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-sky-500 font-bold text-xs md:text-sm text-left" placeholder={editingUserId ? "*********" : ""} />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">الصلاحية</label>
                            <select required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 outline-none focus:border-sky-500 font-bold text-xs md:text-sm text-slate-700">
                                <option value="cashier">كاشير (البيع وإغلاق الفواتير)</option>
                                <option value="waiter">ويتر (طلب الأوردرات فقط)</option>
                                <option value="owner">مدير مطعم (كامل الصلاحيات)</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3 md:py-4 rounded-xl shadow-lg shadow-sky-500/30 flex justify-center items-center gap-2 mt-2 active:scale-95 transition-transform text-sm md:text-base">
                            {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : (editingUserId ? 'حفظ التعديلات' : 'حفظ بيانات الموظف')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};