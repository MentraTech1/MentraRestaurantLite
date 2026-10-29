window.Module_Accounting_Container = function(props) {
    const { useState, useEffect, useMemo } = React;
    const { showToast } = props;
    const { AccountingHeader, AccountingStats, AccountingTable, ExpenseModal, AccountingProAd } = window;

    const todayStr = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3;

    // حالة التبويب النشط
    const [activeTab, setActiveTab] = useState('sales'); // sales, expenses, purchases, waste

    const [showModal, setShowModal] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [txAmount, setTxAmount] = useState('');
    const [txDesc, setTxDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { setCurrentPage(1); }, [startDate, endDate]);

    const startTs = new Date(startDate).setHours(0, 0, 0, 0);
    const endTs = new Date(endDate).setHours(23, 59, 59, 999);

    // 1. جلب الخزينة
    const transactions = window.useLiveQuery(
        () => window.db.accounting.where('date').between(startTs, endTs).reverse().toArray(),
        [startDate, endDate]
    );

    // 2. جلب المخازن
    const invTransactions = window.useLiveQuery(
        () => window.db.inventory_transactions.where('date').between(startTs, endTs).reverse().toArray(),
        [startDate, endDate]
    );

    // 3. جلب أسماء الخامات لعرضها في الجدول
    const inventoryItems = window.useLiveQuery(() => window.db.inventory_items.toArray(), []) || [];

    // الإحصائيات الشاملة
    const stats = useMemo(() => {
        let totalIncome = 0; let totalExpense = 0; let totalPurchases = 0; let totalWaste = 0;
        if (transactions) {
            transactions.forEach(t => {
                if (t.type === 'income') totalIncome += t.amount;
                if (t.type === 'expense') totalExpense += t.amount;
            });
        }
        if (invTransactions) {
            invTransactions.forEach(t => {
                if (t.type === 'in') totalPurchases += (parseFloat(t.cost) || 0);
                if (t.type === 'waste' || (t.notes && t.notes.includes('هالك'))) totalWaste += (parseFloat(t.cost) || 0);
            });
        }
        const netProfit = totalIncome - totalExpense;
        const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;
        return { totalIncome, totalExpense, totalPurchases, totalWaste, netProfit, profitMargin };
    }, [transactions, invTransactions]);

    // 💡 فلترة البيانات المعروضة بناءً على التبويب النشط
    const currentTabData = useMemo(() => {
        if (activeTab === 'sales') return (transactions || []).filter(t => t.type === 'income');
        if (activeTab === 'expenses') return (transactions || []).filter(t => t.type === 'expense');
        if (activeTab === 'purchases') return (invTransactions || []).filter(t => t.type === 'in');
        if (activeTab === 'waste') return (invTransactions || []).filter(t => t.type === 'waste' || (t.notes && t.notes.includes('هالك')));
        return [];
    }, [activeTab, transactions, invTransactions]);

    const totalPages = Math.max(1, Math.ceil(currentTabData.length / ITEMS_PER_PAGE));
    const paginatedTransactions = currentTabData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const openModal = (tx = null) => {
        if (tx) { setEditingTx(tx); setTxAmount(tx.amount); setTxDesc(tx.description); } 
        else { setEditingTx(null); setTxAmount(''); setTxDesc(''); }
        setShowModal(true);
    };

    const handleSaveTx = async (e) => {
        e.preventDefault();
        if (!txAmount || txAmount <= 0) return showToast("الرجاء إدخال مبلغ صحيح", "error");
        if (!txDesc.trim()) return showToast("الرجاء إدخال البيان", "error");
        setIsSubmitting(true);
        try {
            if (editingTx) {
                await window.db.accounting.update(editingTx.id, { amount: parseFloat(txAmount), description: txDesc });
                showToast("تم التعديل بنجاح", "success");
            } else {
                await window.RestaurantQueries.addExpense(parseFloat(txAmount), txDesc);
                showToast("تم تسجيل المصروف بنجاح", "success");
                setActiveTab('expenses'); // الانتقال لتبويب المصروفات لرؤية ما تمت إضافته
            }
            setShowModal(false);
        } catch (error) { showToast("خطأ أثناء الحفظ", "error"); } 
        finally { setIsSubmitting(false); }
    };

    const handleDeleteTx = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;
        try { await window.db.accounting.delete(id); showToast("تم الحذف بنجاح", "success"); } 
        catch (error) { showToast("خطأ أثناء الحذف", "error"); }
    };

    // 💡 تصدير إكسيل ديناميكي للتبويب المفتوح فقط
    const exportExcel = () => {
        if (currentTabData.length === 0) return showToast("لا توجد بيانات للتصدير", "error");
        
        let csv = "";
        let fileName = "";

        if (activeTab === 'sales' || activeTab === 'expenses') {
            csv = "\uFEFFالنوع,البيان,التاريخ,المبلغ\n";
            fileName = activeTab === 'sales' ? "المبيعات" : "المصروفات";
            currentTabData.forEach(t => {
                const date = new Date(t.date).toLocaleString('ar-EG');
                csv += `${activeTab === 'sales' ? 'مبيعات' : 'مصروفات'},${t.description},${date},${t.amount}\n`;
            });
        } else {
            csv = "\uFEFFالخامة,الكمية,التكلفة,التاريخ\n";
            fileName = activeTab === 'purchases' ? "المشتريات" : "الهالك";
            currentTabData.forEach(t => {
                const itemName = inventoryItems.find(i => i.id === t.item_id)?.name || 'محذوف';
                const date = new Date(t.date).toLocaleString('ar-EG');
                csv += `${itemName},${t.quantity},${t.cost},${date}\n`;
            });
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `تقرير_${fileName}_${startDate}.csv`;
        link.click();
    };

    // 💡 تصدير PDF ديناميكي للتبويب المفتوح فقط
    const exportPDF = () => {
        if (currentTabData.length === 0) return showToast("لا توجد بيانات للطباعة", "error");
        
        const tabNames = { 'sales': 'سجل المبيعات', 'expenses': 'سجل المصروفات', 'purchases': 'سجل المشتريات', 'waste': 'سجل الهالك' };
        
        const printWindow = document.createElement('iframe');
        printWindow.style.position = 'absolute'; printWindow.style.top = '-1000px';
        document.body.appendChild(printWindow);
        const doc = printWindow.contentDocument;
        doc.write(`
            <html dir="rtl">
            <head>
                <title>تقرير ${tabNames[activeTab]}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
                    .stats { display: flex; justify-content: space-around; margin-bottom: 20px; font-weight: bold; background: #f9f9f9; padding: 10px; border-radius: 8px;}
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
                    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: right; }
                    th { background-color: #f4f4f4; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>${tabNames[activeTab]}</h2>
                    <p>الفترة من: ${startDate} إلى: ${endDate}</p>
                </div>
                <div class="stats">
                    <span>إجمالي المبيعات: ${stats.totalIncome} ج</span>
                    <span>المصروفات: ${stats.totalExpense} ج</span>
                    <span>المشتريات: ${stats.totalPurchases} ج</span>
                    <span>صافي الربح: ${stats.netProfit} ج</span>
                </div>
                <table>
                    ${activeTab === 'sales' || activeTab === 'expenses' ? `
                        <thead><tr><th>البيان</th><th>التاريخ والوقت</th><th>المبلغ</th></tr></thead>
                        <tbody>
                            ${currentTabData.map(t => `<tr><td>${t.description}</td><td>${new Date(t.date).toLocaleString('ar-EG')}</td><td dir="ltr">${t.amount}</td></tr>`).join('')}
                        </tbody>
                    ` : `
                        <thead><tr><th>الخامة</th><th>الكمية</th><th>التكلفة</th><th>التاريخ</th></tr></thead>
                        <tbody>
                            ${currentTabData.map(t => `<tr><td>${inventoryItems.find(i=>i.id===t.item_id)?.name || ''}</td><td dir="ltr">${t.quantity}</td><td dir="ltr">${t.cost}</td><td>${new Date(t.date).toLocaleString('ar-EG')}</td></tr>`).join('')}
                        </tbody>
                    `}
                </table>
            </body>
            </html>
        `);
        doc.close();
        printWindow.contentWindow.focus(); printWindow.contentWindow.print();
        setTimeout(() => printWindow.remove(), 1000);
    };

    return (
        <div className="space-y-4 md:space-y-6 fade-up pb-[140px] md:pb-12 max-w-7xl mx-auto w-full flex flex-col">
            <AccountingHeader 
                startDate={startDate} setStartDate={setStartDate} 
                endDate={endDate} setEndDate={setEndDate} 
                exportPDF={exportPDF} exportExcel={exportExcel} 
                openModal={openModal} 
            />
            
            <AccountingStats stats={stats} />
            
            <AccountingTable 
                activeTab={activeTab} setActiveTab={setActiveTab}
                paginatedTransactions={paginatedTransactions} openModal={openModal} 
                handleDeleteTx={handleDeleteTx} totalPages={totalPages} 
                currentPage={currentPage} setCurrentPage={setCurrentPage} 
                inventoryItems={inventoryItems}
            />
            <AccountingProAd />
            <ExpenseModal 
                showModal={showModal} setShowModal={setShowModal} 
                editingTx={editingTx} txAmount={txAmount} setTxAmount={setTxAmount} 
                txDesc={txDesc} setTxDesc={setTxDesc} handleSaveTx={handleSaveTx} 
                isSubmitting={isSubmitting} 
            />
        </div>
    );
};