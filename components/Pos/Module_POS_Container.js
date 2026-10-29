window.Module_POS_Container = function(props) {
    const { useState, useEffect, useMemo } = React;
    const { PosOrderOptions, PosMenuGrid, PosCart } = window;
    const { showToast, setActiveModule } = props;

    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState('takeaway'); 
    const [selectedTable, setSelectedTable] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [discount, setDiscount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shouldPrint, setShouldPrint] = useState(true);
    const [autoCloseOrder, setAutoCloseOrder] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3; 

    const categories = window.useLiveQuery(() => window.db.categories.orderBy('sort_order').toArray(), []);
    const menuItems = window.useLiveQuery(() => window.db.menu_items.where('is_active').equals(1).toArray(), []);
    const availableTables = window.useLiveQuery(() => window.db.table('tables').where('status').equals('available').toArray(), []);

    useEffect(() => {
        if (categories && categories.length > 0 && !selectedCategory) setSelectedCategory(categories[0].id);
    }, [categories]);

    useEffect(() => { setCurrentPage(1); }, [selectedCategory]);

    const filteredItems = useMemo(() => {
        if (!menuItems || !selectedCategory) return [];
        return menuItems.filter(item => item.category_id === selectedCategory);
    }, [menuItems, selectedCategory]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const clearCart = () => {
        if(confirm("هل أنت متأكد من تفريغ الفاتورة الحالية؟")) {
            setCart([]); setDiscount(''); setCustomerName(''); setSelectedTable(''); setAutoCloseOrder(false);
        }
    };

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const numDiscount = parseFloat(discount) || 0;
    const finalTotal = Math.max(0, subTotal - numDiscount);

    const printReceipt = (orderId, orderCart, total, discountVal) => {
        const printContent = `
            <html dir="rtl" lang="ar">
            <head>
                <title>فاتورة رقم #${orderId}</title>
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
                    <div>رقم الطلب: #${orderId}</div>
                    <div>التاريخ: ${new Date().toLocaleString('ar-EG')}</div>
                    ${orderType === 'dine_in' && selectedTable ? `<div>طاولة رقم: ${selectedTable}</div>` : ''}
                    ${customerName ? `<div>العميل: ${customerName}</div>` : ''}
                </div>
                <table>
                    <thead><tr><th style="width: 50%;">الصنف</th><th class="center" style="width: 20%;">الكمية</th><th style="width: 30%;">السعر</th></tr></thead>
                    <tbody>${orderCart.map(item => `<tr><td>${item.name}</td><td class="center">${item.quantity}</td><td>${item.price * item.quantity}</td></tr>`).join('')}</tbody>
                </table>
                <div class="totals">
                    ${discountVal > 0 ? `<div><span>الإجمالي الفرعي:</span> <span>${total + discountVal} ج</span></div><div><span>الخصم:</span> <span>${discountVal} ج</span></div>` : ''}
                    <div class="final-total"><span>الصافي:</span> <span>${total} ج.م</span></div>
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
        setTimeout(() => { document.body.removeChild(printWindow); }, 1000);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return showToast("لا يمكن حفظ فاتورة فارغة", "error");
        if (orderType === 'dine_in' && !selectedTable) return showToast("الرجاء تحديد الطاولة لطلب الصالة", "error");

        setIsSubmitting(true);
        try {
            const orderId = await window.RestaurantQueries.createOrder(orderType, selectedTable ? parseInt(selectedTable) : null, customerName, cart, numDiscount);
            if (orderType === 'takeaway' && autoCloseOrder) {
                await window.RestaurantQueries.closeOrder(orderId);
                showToast(`تم حفظ ودفع وإغلاق الفاتورة #${orderId} بنجاح`, "success");
            } else {
                showToast(`تم حفظ الفاتورة رقم #${orderId} بنجاح`, "success");
            }
            if (shouldPrint) printReceipt(orderId, cart, finalTotal, numDiscount);
            
            setCart([]); setDiscount(''); setCustomerName(''); setSelectedTable(''); setOrderType('takeaway'); setAutoCloseOrder(false);
        } catch (error) { showToast(error.message || "حدث خطأ أثناء حفظ الفاتورة", "error"); } 
        finally { setIsSubmitting(false); }
    };

    if (!categories || categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 fade-up space-y-4 px-4 text-center">
                <i className="fas fa-box-open text-6xl text-slate-300"></i>
                <h2 className="text-xl font-bold">المنيو فارغ تماماً!</h2>
                <p className="text-sm">يجب إضافة أقسام وأصناف أولاً لتتمكن من استخدام الكاشير.</p>
                <button onClick={() => setActiveModule && setActiveModule('menu')} className="bg-[#EA580C] text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                    الذهاب لإدارة المنيو
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 pb-[120px] md:pb-8 fade-up">
            <div className="lg:col-span-8 flex flex-col space-y-4">
                <PosOrderOptions 
                    orderType={orderType} setOrderType={setOrderType} selectedTable={selectedTable} 
                    setSelectedTable={setSelectedTable} customerName={customerName} 
                    setCustomerName={setCustomerName} availableTables={availableTables} 
                />
                <PosMenuGrid 
                    categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                    filteredItems={filteredItems} paginatedItems={paginatedItems} totalPages={totalPages}
                    currentPage={currentPage} setCurrentPage={setCurrentPage} addToCart={addToCart}
                />
            </div>
            
            <PosCart 
                cart={cart} updateQuantity={updateQuantity} clearCart={clearCart} subTotal={subTotal}
                discount={discount} setDiscount={setDiscount} finalTotal={finalTotal}
                shouldPrint={shouldPrint} setShouldPrint={setShouldPrint} autoCloseOrder={autoCloseOrder}
                setAutoCloseOrder={setAutoCloseOrder} orderType={orderType} handleCheckout={handleCheckout}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};