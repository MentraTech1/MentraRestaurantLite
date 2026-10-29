window.PosCart = function({ 
    cart, updateQuantity, clearCart, subTotal, discount, setDiscount, finalTotal,
    shouldPrint, setShouldPrint, autoCloseOrder, setAutoCloseOrder, orderType,
    handleCheckout, isSubmitting
}) {
    return (
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col h-auto max-h-[80vh] lg:h-[calc(100vh-140px)] overflow-hidden lg:sticky lg:top-4 mt-2 lg:mt-0">
            
            <div className="bg-[#0F172A] p-3 sm:p-4 text-white flex justify-between items-center shrink-0">
                <div>
                    <h3 className="font-black text-base sm:text-lg">الفاتورة الحالية</h3>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5">رقم مرجعي: #{Date.now().toString().slice(-4)}</p>
                </div>
                {cart.length > 0 && (
                    <button onClick={clearCart} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center text-slate-300">
                        <i className="fas fa-trash-alt text-[10px] sm:text-xs"></i>
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto min-h-[150px] p-3 sm:p-4 bg-slate-50 space-y-2 sm:space-y-3 hide-scrollbar">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[150px]">
                        <i className="fas fa-receipt text-4xl sm:text-6xl mb-3 sm:mb-4"></i>
                        <p className="font-bold text-xs sm:text-sm">الفاتورة فارغة</p>
                    </div>
                ) : (
                    cart.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center animate-view gap-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-slate-700 text-xs sm:text-sm truncate">{item.name}</h4>
                                <p className="text-[#EA580C] font-bold text-[10px] sm:text-xs mt-0.5">{item.price} ج</p>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-slate-50 px-1.5 py-1 rounded-xl border border-slate-100 shrink-0">
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-white rounded-lg shadow-sm text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center"><i className="fas fa-plus text-[10px]"></i></button>
                                <span className="font-black text-xs sm:text-sm w-4 text-center text-slate-700">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-white rounded-lg shadow-sm text-rose-500 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center"><i className="fas fa-minus text-[10px]"></i></button>
                            </div>
                            
                            <div className="font-black text-slate-800 text-xs sm:text-sm w-10 sm:w-12 text-left shrink-0">
                                {item.price * item.quantity}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white p-3 sm:p-4 border-t border-slate-100 shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
                <div className="space-y-1.5 sm:space-y-2 mb-3">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-500">
                        <span>الإجمالي الفرعي</span>
                        <span>{subTotal} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-500">
                        <span>الخصم (إن وجد)</span>
                        <div className="relative w-20 sm:w-24">
                            <input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs sm:text-sm outline-none focus:border-[#EA580C] text-left dir-ltr" placeholder="0" />
                        </div>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-100 border-dashed flex justify-between items-center">
                        <span className="text-sm sm:text-lg font-black text-slate-800">الصافي للدفع</span>
                        <span className="text-lg sm:text-2xl font-black text-[#EA580C]">{finalTotal} ج.م</span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2.5 mb-4 border-t border-slate-100 pt-3">
                    <label className="flex items-center gap-2 cursor-pointer group w-fit">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${shouldPrint ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'bg-slate-50 border-slate-300 text-transparent group-hover:border-[#EA580C]'}`}>
                            <i className="fas fa-check text-xs"></i>
                        </div>
                        <input type="checkbox" checked={shouldPrint} onChange={(e) => setShouldPrint(e.target.checked)} className="hidden" />
                        <span className="text-xs sm:text-sm font-bold text-slate-600 select-none">طباعة الفاتورة تلقائياً</span>
                    </label>

                    {orderType === 'takeaway' && (
                        <label className="flex items-center gap-2 cursor-pointer group w-fit animate-view">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${autoCloseOrder ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-300 text-transparent group-hover:border-emerald-500'}`}>
                                <i className="fas fa-check text-xs"></i>
                            </div>
                            <input type="checkbox" checked={autoCloseOrder} onChange={(e) => setAutoCloseOrder(e.target.checked)} className="hidden" />
                            <span className="text-xs sm:text-sm font-bold text-slate-600 select-none text-emerald-700">استلام الحساب وإغلاق الطلب فوراً</span>
                        </label>
                    )}
                </div>

                <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || isSubmitting}
                    className="w-full bg-gradient-to-l from-[#EA580C] to-[#F97316] hover:to-orange-500 text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg active:scale-95"
                >
                    {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-check-circle"></i> تأكيد وحفظ الفاتورة</>}
                </button>
            </div>
        </div>
    );
};