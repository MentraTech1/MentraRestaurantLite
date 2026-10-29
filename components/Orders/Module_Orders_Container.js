window.Module_Orders_Container = function(props) {
    const { useState, useEffect, useMemo } = React;
    const { showToast } = props;
    const { OrdersToolbar, OrdersList, OrderModal, OrdersProAd } = window;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); 
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3; 

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [isClosing, setIsClosing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const allOrders = window.useLiveQuery(() => window.db.orders.orderBy('created_at').reverse().toArray(), []);

    const filteredOrders = useMemo(() => {
        if (!allOrders) return [];
        let result = allOrders;

        if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(o => o.id.toString().includes(query) || (o.customer_name && o.customer_name.toLowerCase().includes(query)));
        }
        if (fromDate) result = result.filter(o => new Date(o.created_at).getTime() >= new Date(fromDate).setHours(0, 0, 0, 0));
        if (toDate) result = result.filter(o => new Date(o.created_at).getTime() <= new Date(toDate).setHours(23, 59, 59, 999));
        
        return result;
    }, [allOrders, statusFilter, searchQuery, fromDate, toDate]);

    useEffect(() => setCurrentPage(1), [statusFilter, searchQuery, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        if (selectedOrder) {
            window.db.order_items.where('order_id').equals(selectedOrder.id).toArray()
                .then(items => setOrderItems(items))
                .catch(err => console.error("Error fetching items:", err));
        } else {
            setOrderItems([]);
            setIsEditing(false); 
        }
    }, [selectedOrder]);

    const printReceipt = (order, items) => {
        const printContent = `
            <html dir="rtl" lang="ar">
            <head>
                <title>فاتورة رقم #${order.id}</title>
                <style>
                    body { font-family: 'Cairo', sans-serif; font-size: 13px; margin: 0; padding: 10px; width: 80mm; color: #000; }
                    h2 { text-align: center; margin-bottom: 5px; font-size: 18px; font-weight: bold; }
                    .info { text-align: center; margin-bottom: 15px; font-size: 12px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th { border-bottom: 1px dashed #000; padding: 5px 2px; text-align: right; font-size: 12px; }
                    td { padding: 5px 2px; text-align: right; font-size: 13px; }
                    .center { text-align: center; }
                    .totals { border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; }
                    .totals div { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
                    .final-total { font-size: 18px !important; font-weight: bold; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>نظام المطعم</h2>
                <div class="info">
                    <div>رقم الطلب: #${order.id}</div>
                    <div>التاريخ: ${new Date(order.created_at).toLocaleString('ar-EG')}</div>
                    ${order.order_type === 'dine_in' && order.table_id ? `<div>طلب صالة</div>` : ''}
                    ${order.customer_name ? `<div>العميل: ${order.customer_name}</div>` : ''}
                </div>
                <table>
                    <thead>
                        <tr><th style="width: 50%;">الصنف</th><th class="center" style="width: 20%;">الكمية</th><th style="width: 30%;">المجموع</th></tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `<tr><td>${item.item_name || item.name}</td><td class="center">${item.quantity}</td><td>${item.subtotal}</td></tr>`).join('')}
                    </tbody>
                </table>
                <div class="totals">
                    ${order.discount > 0 ? `<div><span>الإجمالي الفرعي:</span> <span>${order.total_amount} ج</span></div><div><span>الخصم:</span> <span>${order.discount} ج</span></div>` : ''}
                    <div class="final-total"><span>الصافي:</span> <span>${order.final_total} ج.م</span></div>
                </div>
                <div class="footer"><p>شكراً لزيارتكم!</p></div>
            </body>
            </html>
        `;
        const printWindow = document.createElement('iframe');
        printWindow.style.position = 'absolute'; printWindow.style.top = '-1000px';
        document.body.appendChild(printWindow);
        printWindow.contentDocument.write(printContent); printWindow.contentDocument.close();
        printWindow.contentWindow.focus(); printWindow.contentWindow.print();
        setTimeout(() => document.body.removeChild(printWindow), 1000);
    };

    const handleCloseOrder = async () => {
        if (!selectedOrder) return;
        if (!confirm("هل أنت متأكد من استلام المبلغ وإغلاق الفاتورة؟")) return;
        setIsClosing(true);
        try {
            await window.RestaurantQueries.closeOrder(selectedOrder.id);
            showToast(`تم دفع وإغلاق الفاتورة #${selectedOrder.id} بنجاح`, "success");
            setSelectedOrder(null); 
        } catch (error) { showToast("حدث خطأ أثناء إغلاق الفاتورة", "error"); } 
        finally { setIsClosing(false); }
    };

    const handleEditQuantity = (index, delta) => {
        const newItems = [...orderItems];
        newItems[index].quantity += delta;
        if (newItems[index].quantity <= 0) newItems.splice(index, 1); 
        else newItems[index].subtotal = newItems[index].quantity * newItems[index].price;
        setOrderItems(newItems);
    };

    const saveEdits = async () => {
        if (orderItems.length === 0) return showToast("لا يمكن حفظ فاتورة فارغة، قم بإلغاء الطلب", "error");
        try {
            const newSubtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
            const newFinalTotal = Math.max(0, newSubtotal - (selectedOrder.discount || 0));
            await window.db.transaction('rw', window.db.orders, window.db.order_items, async () => {
                await window.db.orders.update(selectedOrder.id, { total_amount: newSubtotal, final_total: newFinalTotal });
                await window.db.order_items.where('order_id').equals(selectedOrder.id).delete();
                await window.db.order_items.bulkAdd(orderItems.map(item => ({...item, order_id: selectedOrder.id})));
            });
            showToast("تم التعديل بنجاح", "success"); setIsEditing(false);
            setSelectedOrder({...selectedOrder, total_amount: newSubtotal, final_total: newFinalTotal});
        } catch (error) { showToast("خطأ أثناء حفظ التعديلات", "error"); }
    };

    const handleDeleteOrder = async () => {
        if (!confirm("تحذير: هل أنت متأكد من إلغاء وحذف هذا الطلب نهائياً؟")) return;
        try {
            await window.db.transaction('rw', window.db.orders, window.db.order_items, async () => {
                await window.db.order_items.where('order_id').equals(selectedOrder.id).delete();
                await window.db.orders.delete(selectedOrder.id);
            });
            showToast("تم إلغاء الطلب", "success"); setSelectedOrder(null);
        } catch (error) { showToast("خطأ أثناء الحذف", "error"); }
    };

    return (
        <div className="space-y-4 md:space-y-6 fade-up pb-[140px] md:pb-12 max-w-7xl mx-auto w-full">
            <OrdersToolbar 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                fromDate={fromDate} setFromDate={setFromDate}
                toDate={toDate} setToDate={setToDate}
            />
            
            <OrdersList 
                allOrders={allOrders} filteredOrders={filteredOrders} paginatedOrders={paginatedOrders}
                currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}
                setSelectedOrder={setSelectedOrder}
            />
            
            <OrdersProAd />

            <OrderModal 
                selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder}
                orderItems={orderItems} isEditing={isEditing} setIsEditing={setIsEditing}
                handleEditQuantity={handleEditQuantity} saveEdits={saveEdits}
                handleDeleteOrder={handleDeleteOrder} handleCloseOrder={handleCloseOrder}
                isClosing={isClosing} printReceipt={printReceipt}
            />
        </div>
    );
};