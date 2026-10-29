window.Module_Backup_Container = function(props) {
    const { useState, useEffect, useRef } = React;
    const { showToast } = props;
    const { 
        BackupHeader, BackupStats, BackupActions, 
        BackupLoaderOverlay, BackupConfirmModal, BackupProAd 
    } = window;

    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
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

    useEffect(() => {
        const analyzeDatabase = async () => {
            try {
                const info = await window.db.restaurant_info.toCollection().first();
                const ordersCount = await window.db.orders.count();
                const itemsCount = await window.db.menu_items.count();
                const usersCount = await window.db.users.count();

                let income = 0;
                await window.db.accounting.where('type').equals('income').each(record => {
                    income += record.amount;
                });

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

    const handleExport = async () => {
        setIsLoading(true);
        setLoadingText("جاري تجميع وضغط البيانات، الرجاء الانتظار...");

        setTimeout(async () => {
            try {
                const tables = ['restaurant_info', 'users', 'categories', 'menu_items', 'tables', 'orders', 'order_items', 'accounting'];
                
                let backupData = {
                    mentra_signature: "MENTRA_RESTAURANT_LITE_V1",
                    dbName: dbName,
                    restaurant_name: dbStats.restaurantName,
                    generated_at: new Date().toISOString(),
                    data: {}
                };

                for (let table of tables) {
                    backupData.data[table] = await window.db.table(table).toArray();
                }

                const jsonString = JSON.stringify(backupData);
                const blob = new Blob([jsonString], { type: "application/json" });
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
            }
        }, 100);
    };

    // فتح نافذة التأكيد الشيك بدلاً من confirm()
    const triggerImport = () => {
        setConfirmModal({
            isOpen: true,
            title: "تنبيه خطير قبل الاستعادة",
            message: "استعادة النسخة الاحتياطية ستقوم بمسح كافة الفواتير والمنيو الموجودة حالياً وإحلال بيانات الملف بدلاً منها. هل أنت متأكد؟",
            onConfirm: () => fileInputRef.current.click()
        });
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setLoadingText("جاري قراءة واستعادة البيانات، لا تقم بإغلاق المتصفح...");

        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const importedJson = JSON.parse(e.target.result);

                if (importedJson.mentra_signature !== "MENTRA_RESTAURANT_LITE_V1") {
                    throw new Error("هذا الملف ليس نسخة احتياطية صالحة لنظام Mentra");
                }
                
                if (importedJson.dbName !== dbName) {
                    // فتح نافذة تأكيد إضافية في حال كان الملف لمطعم آخر
                    setIsLoading(false);
                    setConfirmModal({
                        isOpen: true,
                        title: "اختلاف في اسم المطعم!",
                        message: `هذا الملف يخص مطعم (${importedJson.restaurant_name}) بينما أنت حالياً في مطعم (${dbStats.restaurantName}). هل أنت متأكد من رغبتك في إحلال هذه البيانات؟`,
                        onConfirm: () => performDatabaseRestore(importedJson)
                    });
                    return;
                }

                await performDatabaseRestore(importedJson);

            } catch (error) {
                console.error("Import Error:", error);
                showToast(error.message || "حدث خطأ: الملف تالف أو غير مدعوم", "error");
                setIsLoading(false);
            }
            event.target.value = '';
        };

        reader.onerror = () => {
            showToast("فشلت قراءة الملف", "error");
            setIsLoading(false);
        };
        reader.readAsText(file);
    };

    const performDatabaseRestore = async (importedJson) => {
        setIsLoading(true);
        setLoadingText("جاري معالجة الجداول وتحديث السجلات...");
        try {
            const tablesToRestore = Object.keys(importedJson.data);
            const actualTables = window.db.tables.map(t => t.name);

            await window.db.transaction('rw', actualTables, async () => {
                for (let tableName of tablesToRestore) {
                    if (actualTables.includes(tableName)) {
                        await window.db.table(tableName).clear();
                        if (importedJson.data[tableName].length > 0) {
                            await window.db.table(tableName).bulkAdd(importedJson.data[tableName]);
                        }
                    }
                }
            });

            showToast("تمت استعادة البيانات بنجاح! سيتم إعادة تشغيل النظام.", "success");
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            showToast("فشل إحلال الجداول", "error");
            setIsLoading(false);
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
            <BackupLoaderOverlay isLoading={isLoading} loadingText={loadingText} />
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