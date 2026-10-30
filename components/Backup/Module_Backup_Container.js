window.Module_Backup_Container = function(props) {
    const { useState, useEffect, useRef } = React;
    const { showToast } = props;
    const { 
        BackupHeader, BackupStats, BackupActions, 
        BackupLoaderOverlay, BackupConfirmModal, BackupProAd 
    } = window;

    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [progress, setProgress] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const [dbStats, setDbStats] = useState({
        totalIncome: 0,
        totalOrders: 0,
        menuItemsCount: 0,
        usersCount: 0,
        restaurantName: "جاري التحميل...",
        lastBackup: localStorage.getItem(`Mentra_${window.db.name}_LastBackup`) || "لم يتم عمل نسخة بعد"
    });

    const fileInputRef = useRef(null);
    const dbName = window.db.name;

    // جلب الإحصائيات بسلاسة
    useEffect(() => {
        const analyzeDatabase = async () => {
            try {
                const info = await window.db.restaurant_info.toCollection().first();
                const ordersCount = await window.db.orders.count();
                const itemsCount = await window.db.menu_items.count();
                const usersCount = await window.db.users.count();

                // جمع الإيرادات
                let income = 0;
                const incomeRecords = await window.db.accounting.where('type').equals('income').toArray();
                income = incomeRecords.reduce((sum, record) => sum + (record.amount || 0), 0);

                setDbStats(prev => ({
                    ...prev,
                    restaurantName: info?.restaurant_name || "مطعم غير معروف",
                    totalOrders: ordersCount,
                    menuItemsCount: itemsCount,
                    usersCount: usersCount,
                    totalIncome: income
                }));
            } catch (error) {
                console.error("خطأ في تحليل البيانات:", error);
            }
        };
        analyzeDatabase();
    }, []);

    // 🚀 خوارزمية التصدير الانسيابية (Lazy Chunked Export)
    const handleExport = async () => {
        setIsLoading(true);
        setProgress(0);
        setLoadingText("جاري التهيئة لتجميع البيانات...");

        try {
            // جلب كافة أسماء الجداول ديناميكياً لضمان عدم نسيان أي جدول (شامل المخازن الجديدة)
            const actualTables = window.db.tables.map(t => t.name);
            const chunks = [];
            
            // رأس الملف
            chunks.push(`{"mentra_signature":"MENTRA_RESTAURANT_LITE_V1","dbName":"${dbName}","restaurant_name":"${dbStats.restaurantName}","generated_at":"${new Date().toISOString()}","data":{`);

            for (let i = 0; i < actualTables.length; i++) {
                const tableName = actualTables[i];
                setLoadingText(`جاري سحب بيانات: ${tableName}`);
                setProgress(0);
                
                chunks.push(`"${tableName}":[`);
                const table = window.db.table(tableName);
                const totalRecords = await table.count();
                let processed = 0;
                const BATCH_SIZE = 1500; // حجم الدفعة لعدم استهلاك الرام

                for (let offset = 0; offset < totalRecords; offset += BATCH_SIZE) {
                    const batch = await table.offset(offset).limit(BATCH_SIZE).toArray();
                    const batchStrings = batch.map(record => JSON.stringify(record));
                    chunks.push(batchStrings.join(","));

                    processed += batch.length;
                    if (processed < totalRecords) chunks.push(",");

                    // إعطاء المتصفح فرصة لتحديث واجهة المستخدم (Yielding)
                    setProgress(Math.round((processed / totalRecords) * 100));
                    await new Promise(resolve => setTimeout(resolve, 10));
                }

                chunks.push(`]`);
                if (i < actualTables.length - 1) chunks.push(`,`);
            }
            chunks.push(`}}`);

            setLoadingText("جاري ضغط وبناء الملف النهائي...");
            setProgress(100);
            await new Promise(resolve => setTimeout(resolve, 50));

            // تكوين الملف وتحميله
            const blob = new Blob(chunks, { type: "application/json" });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Mentra_Backup_${dbStats.restaurantName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl); 

            const nowStr = new Date().toLocaleString('ar-EG');
            localStorage.setItem(`Mentra_${dbName}_LastBackup`, nowStr);
            setDbStats(prev => ({ ...prev, lastBackup: nowStr }));

            showToast("تم استخراج النسخة الاحتياطية بنجاح!", "success");
        } catch (error) {
            console.error("Export Error:", error);
            showToast("حدث خطأ أثناء استخراج البيانات", "error");
        } finally {
            setIsLoading(false);
            setProgress(null);
        }
    };

    const triggerImport = () => {
        setConfirmModal({
            isOpen: true,
            title: "تحذير أمني هام!",
            message: "استعادة النسخة الاحتياطية ستقوم بمسح كافة البيانات (الفواتير، المنيو، المخازن) وإحلال بيانات الملف بدلاً منها. هل أنت متأكد؟",
            onConfirm: () => fileInputRef.current.click()
        });
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setProgress(null);
        setLoadingText("جاري قراءة الملف وتحليل السجلات...");

        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const importedJson = JSON.parse(e.target.result);

                if (importedJson.mentra_signature !== "MENTRA_RESTAURANT_LITE_V1") {
                    throw new Error("هذا الملف ليس نسخة احتياطية صالحة لنظام Mentra");
                }
                
                if (importedJson.dbName !== dbName) {
                    setIsLoading(false);
                    setConfirmModal({
                        isOpen: true,
                        title: "اختلاف في اسم المطعم!",
                        message: `هذا الملف يخص مطعم (${importedJson.restaurant_name}) وأنت حالياً في مطعم (${dbStats.restaurantName}). المتابعة ستؤدي لتبديل المطعم! هل توافق؟`,
                        onConfirm: () => performDatabaseRestore(importedJson)
                    });
                    return;
                }

                await performDatabaseRestore(importedJson);

            } catch (error) {
                console.error("Import Error:", error);
                showToast(error.message || "حدث خطأ: الملف تالف أو حجمه ضخم جداً", "error");
                setIsLoading(false);
                setProgress(null);
            }
            event.target.value = '';
        };

        reader.onerror = () => {
            showToast("فشلت قراءة الملف", "error");
            setIsLoading(false);
        };
        reader.readAsText(file);
    };

    // 🚀 خوارزمية الاستيراد الانسيابية (Lazy Chunked Import)
    const performDatabaseRestore = async (importedJson) => {
        setIsLoading(true);
        try {
            const tablesToRestore = Object.keys(importedJson.data);
            const actualTables = window.db.tables.map(t => t.name);

            // نقوم بالعملية خارج transaction واحد كبير لتجنب تجميد الذاكرة (Memory Lock)
            for (let tableName of tablesToRestore) {
                if (actualTables.includes(tableName)) {
                    const records = importedJson.data[tableName];
                    if (!records || records.length === 0) continue;

                    setLoadingText(`جاري استعادة: ${tableName}`);
                    setProgress(0);

                    const table = window.db.table(tableName);
                    await table.clear(); // تفريغ الجدول القديم

                    const BATCH_SIZE = 1500;
                    for (let i = 0; i < records.length; i += BATCH_SIZE) {
                        const batch = records.slice(i, i + BATCH_SIZE);
                        await table.bulkAdd(batch); // إدراج دفعة

                        setProgress(Math.round(((i + batch.length) / records.length) * 100));
                        await new Promise(resolve => setTimeout(resolve, 10)); // Yielding
                    }
                }
            }

            setProgress(100);
            setLoadingText("تمت الاستعادة بنجاح! جاري إعادة تهيئة النظام...");
            
            showToast("تمت استعادة البيانات بنجاح!", "success");
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Restore Error", error);
            showToast("فشل إحلال الجداول، تأكد من سلامة الملف", "error");
            setIsLoading(false);
            setProgress(null);
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 fade-up pb-[140px] md:pb-12 max-w-7xl mx-auto w-full flex flex-col">
            <BackupHeader restaurantName={dbStats.restaurantName} lastBackup={dbStats.lastBackup} />
            <BackupStats dbStats={dbStats} />
            <BackupActions 
                handleExport={handleExport} 
                triggerImport={triggerImport} 
                fileInputRef={fileInputRef} 
                handleImport={handleImport} 
            />
            <BackupProAd />

            {/* النوافذ المساعدة */}
            <BackupLoaderOverlay isLoading={isLoading} loadingText={loadingText} progress={progress} />
            
            <BackupConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                onConfirm={confirmModal.onConfirm} 
                title={confirmModal.title} 
                message={confirmModal.message} 
            />
        </div>
    );
};