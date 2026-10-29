window.MaterialCard = function({ item, onEdit }) {
    let statusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    let statusText = 'رصيد آمن';
    let icon = 'fa-check-circle';

    if (item.stock_quantity <= 0) { 
        statusColor = 'bg-rose-100 text-rose-700 border-rose-200'; 
        statusText = 'نفذت الكمية'; 
        icon = 'fa-times-circle';
    } else if (item.stock_quantity <= item.min_stock_alert) { 
        statusColor = 'bg-amber-100 text-amber-700 border-amber-200'; 
        statusText = 'قارب على الانتهاء'; 
        icon = 'fa-exclamation-triangle';
    }

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            {/* مؤشر الحالة الجانبي */}
            <div className={`absolute top-0 right-0 w-1.5 h-full ${statusColor.split(' ')[0]}`}></div>
            
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-slate-800 text-lg truncate w-3/4">{item.name}</h3>
                {/* زر التعديل (يظهر عند تمرير الماوس للشاشات الكبيرة، ودائما للموبايل) */}
                <button onClick={() => onEdit(item)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center shrink-0 border border-slate-200 hover:border-amber-500">
                    <i className="fas fa-pen text-xs"></i>
                </button>
            </div>

            <div className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md border mb-4 ${statusColor}`}>
                <i className={`fas ${icon}`}></i> {statusText}
            </div>

            <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-bold text-xs"><i className="fas fa-cubes text-slate-300 mr-1"></i> الرصيد:</span>
                    <span className="font-black text-slate-800">{item.stock_quantity} <span className="text-[10px] text-slate-500">{item.unit}</span></span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold text-xs"><i className="fas fa-coins text-slate-300 mr-1"></i> السعر:</span>
                    <span className="font-black text-emerald-600">{item.cost_per_unit} ج <span className="text-[10px] text-slate-400">/ {item.unit}</span></span>
                </div>
            </div>
        </div>
    );
};