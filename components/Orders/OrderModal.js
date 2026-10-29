window.OrderModal = function({ 
    selectedOrder, setSelectedOrder, orderItems, isEditing, setIsEditing, 
    handleEditQuantity, saveEdits, handleDeleteOrder, handleCloseOrder, isClosing, printReceipt 
}) {
    if (!selectedOrder) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl flex flex-col h-auto max-h-[90vh] animate-view overflow-hidden border border-slate-100">
                
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-base md:text-xl font-black text-slate-800">فاتورة #{selectedOrder.id}</h2>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-0.5">{new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => printReceipt(selectedOrder, orderItems)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="طباعة الفاتورة">
                            <i className="fas fa-print text-xs"></i>
                        </button>
                        
                        {selectedOrder.status === 'open' && !isEditing && (
                            <button onClick={() => setIsEditing(true)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="تعديل الطلب">
                                <i className="fas fa-pen text-xs"></i>
                            </button>
                        )}
                        <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                            <i className="fas fa-times text-xs"></i>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-white hide-scrollbar min-h-[200px]">
                    {isEditing && (
                        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl text-[10px] md:text-xs font-bold mb-3 flex items-center gap-2 border border-blue-100">
                            <i className="fas fa-info-circle text-base"></i> يمكنك تعديل الكميات أو حذف الصنف بتصفير الكمية.
                        </div>
                    )}
                    <table className="w-full text-right text-xs md:text-sm">
                        <thead className="border-b border-slate-100 text-slate-400 font-bold">
                            <tr>
                                <th className="pb-2">الصنف</th>
                                <th className="pb-2 text-center">الكمية</th>
                                <th className="pb-2">المجموع</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orderItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-3 font-bold text-slate-700">{item.item_name || item.name}</td>
                                    <td className="py-3 text-center">
                                        {isEditing ? (
                                            <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200 w-max mx-auto">
                                                <button onClick={() => handleEditQuantity(idx, 1)} className="w-6 h-6 bg-white shadow-sm rounded text-emerald-500"><i className="fas fa-plus text-[10px]"></i></button>
                                                <span className="font-black text-slate-700 w-4">{item.quantity}</span>
                                                <button onClick={() => handleEditQuantity(idx, -1)} className="w-6 h-6 bg-white shadow-sm rounded text-rose-500"><i className="fas fa-minus text-[10px]"></i></button>
                                            </div>
                                        ) : (
                                            <span className="font-black text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">x{item.quantity}</span>
                                        )}
                                    </td>
                                    <td className="py-3 font-black text-slate-800">{item.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 pt-3 border-t border-slate-200 border-dashed space-y-1.5">
                        <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500">
                            <span>الإجمالي الفرعي:</span>
                            <span>{isEditing ? orderItems.reduce((s, i) => s + i.subtotal, 0) : selectedOrder.total_amount} ج.م</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500">
                            <span>الخصم المطبق:</span>
                            <span>{selectedOrder.discount || 0} ج.م</span>
                        </div>
                        <div className="flex justify-between text-base md:text-xl font-black text-slate-800 pt-2">
                            <span>الصافي النهائي:</span>
                            <span className="text-[#EA580C]">{isEditing ? Math.max(0, orderItems.reduce((s, i) => s + i.subtotal, 0) - (selectedOrder.discount || 0)) : selectedOrder.final_total} ج.م</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 md:p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs md:text-sm">إلغاء التعديل</button>
                            <button onClick={saveEdits} className="flex-2 bg-blue-500 hover:bg-blue-600 text-white font-black py-3 px-4 rounded-xl shadow-md text-xs md:text-sm flex items-center justify-center gap-2 w-2/3">
                                <i className="fas fa-save"></i> حفظ التعديلات
                            </button>
                        </div>
                    ) : selectedOrder.status === 'open' ? (
                        <div className="flex gap-2">
                            <button onClick={handleDeleteOrder} className="w-12 md:w-14 bg-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm" title="إلغاء الطلب">
                                <i className="fas fa-trash-alt"></i>
                            </button>
                            <button onClick={handleCloseOrder} disabled={isClosing} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 md:py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex justify-center items-center gap-2 active:scale-95 text-sm md:text-base">
                                {isClosing ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-hand-holding-usd text-lg"></i> استلام الدفع وإغلاق</>}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-black py-3 md:py-4 rounded-xl flex justify-center items-center gap-2 text-sm md:text-base">
                            <i className="fas fa-check-circle text-lg"></i> الفاتورة مدفوعة ومغلقة
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};