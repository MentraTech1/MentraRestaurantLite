window.Module_Settings_Container = function(props) {
    const { useState, useEffect, useRef } = React;
    const { userId, showToast } = props; // استخراج userId
    const { 
        SettingsNav, SettingsGeneralTab, SettingsUsersTab, 
        SettingsBackupTab, UserModal, SettingsConfirmModal, SettingsProAd,
        TabSecurity // استدعاء المكون الجديد
    } = window;

    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [restaurantData, setRestaurantData] = useState({ id: '', restaurant_name: '', owner_name: '', phone: '' });
    
    // حالة مفتاح الأمان الجديدة
    const [securityKey, setSecurityKey] = useState('');
    
    const dbName = window.db.name;

    const usersList = window.useLiveQuery(() => window.db.users.toArray(), []);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', phone: '', password: '', role: 'cashier' });

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 4;

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false, title: '', message: '', confirmText: '', confirmColor: '', 
        requiresInput: false, expectedInput: '', onConfirm: () => {}
    });

    useEffect(() => {
        const fetchInfo = async () => {
            const info = await window.db.restaurant_info.toCollection().first();
            if (info) setRestaurantData(info);

            // جلب مفتاح الأمان الخاص بالمستخدم الحالي
            if (userId) {
                const currentUser = await window.db.users.get(userId);
                if (currentUser && currentUser.security_key) {
                    setSecurityKey(currentUser.security_key);
                }
            }
        };
        fetchInfo();
    }, [userId]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const handleSaveGeneral = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await window.db.restaurant_info.update(restaurantData.id, {
                restaurant_name: restaurantData.restaurant_name,
                owner_name: restaurantData.owner_name,
                phone: restaurantData.phone
            });

            await window.masterDb.restaurants.where('dbName').equals(dbName).modify({
                restaurantName: restaurantData.restaurant_name,
                ownerName: restaurantData.owner_name,
                phone: restaurantData.phone
            });

            const session = JSON.parse(localStorage.getItem('MentraRestaurant_Session'));
            session.restaurant_name = restaurantData.restaurant_name;
            localStorage.setItem('MentraRestaurant_Session', JSON.stringify(session));

            showToast("تم تحديث بيانات المطعم بنجاح", "success");
        } catch (error) { showToast("حدث خطأ أثناء الحفظ", "error"); } 
        finally { setIsLoading(false); }
    };

    // دالة حفظ مفتاح الأمان الجديدة
    const handleUpdateSecurityKey = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if(!securityKey.trim()) throw new Error("لا يمكن ترك مفتاح الأمان فارغاً");
            await window.db.users.update(userId, { security_key: securityKey.trim() });
            showToast("تم حفظ مفتاح الأمان بنجاح", "success");
        } catch (error) { 
            showToast(error.message || "فشل حفظ المفتاح", "error"); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleOpenAddUser = () => {
        setEditingUserId(null); setNewUser({ name: '', phone: '', password: '', role: 'cashier' });
        setShowUserModal(true);
    };

    const handleOpenEditUser = (user) => {
        setEditingUserId(user.id); setNewUser({ name: user.name, phone: user.phone, password: '', role: user.role });
        setShowUserModal(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.phone) return showToast("الرجاء إكمال البيانات الأساسية", "error");

        setIsLoading(true);
        try {
            const exists = await window.db.users.where('phone').equals(newUser.phone).first();
            if (exists && exists.id !== editingUserId) throw new Error("رقم الهاتف مسجل مسبقاً لموظف آخر");

            if (editingUserId) {
                if (newUser.role !== 'owner') {
                    const oldUser = await window.db.users.get(editingUserId);
                    if (oldUser.role === 'owner') {
                        const ownersCount = usersList.filter(u => u.role === 'owner').length;
                        if (ownersCount <= 1) throw new Error("لا يمكن إزالة صلاحية المدير الوحيد للمطعم");
                    }
                }

                let updateData = { name: newUser.name, phone: newUser.phone, role: newUser.role };
                if (newUser.password) updateData.password = btoa(newUser.password);

                await window.db.users.update(editingUserId, updateData);
                showToast("تم تعديل بيانات الموظف بنجاح", "success");
            } else {
                if (!newUser.password) throw new Error("الرجاء إدخال كلمة المرور للموظف الجديد");
                await window.db.users.add({
                    name: newUser.name, phone: newUser.phone, password: btoa(newUser.password), role: newUser.role, created_at: Date.now()
                });
                showToast("تم إضافة الموظف بنجاح", "success");
            }
            setShowUserModal(false);
        } catch (error) { showToast(error.message, "error"); } 
        finally { setIsLoading(false); }
    };

    const handleExportBackup = async () => {
        try {
            setIsLoading(true);
            const tables = ['restaurant_info', 'users', 'categories', 'menu_items', 'tables', 'orders', 'order_items', 'accounting', 'inventory_items', 'inventory_transactions', 'suppliers', 'supplier_payments'];
            let backupData = { generated_at: new Date().toISOString(), dbName: dbName };

            for (let table of tables) { 
                if (window.db[table]) backupData[table] = await window.db.table(table).toArray(); 
            }

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", `Mentra_Backup_${restaurantData.restaurant_name}_${new Date().toISOString().split('T')[0]}.json`);
            dlAnchorElem.click();
            showToast("تم استخراج النسخة الاحتياطية بنجاح", "success");
        } catch (error) { showToast("فشل استخراج النسخة", "error"); } 
        finally { setIsLoading(false); }
    };

    const fileInputRef = useRef(null);

    const handleTriggerImport = () => {
        setConfirmModal({
            isOpen: true,
            title: "تأكيد استعادة النسخة الاحتياطية",
            message: "تحذير شديد الأهمية: استعادة نسخة احتياطية ستقوم بمسح جميع الفواتير والبيانات الحالية وإحلال بيانات الملف بدلاً منها. هل أنت متأكد تماماً من المتابعة؟",
            confirmText: "نعم، استعادة البيانات",
            confirmColor: "bg-blue-600 hover:bg-blue-700",
            requiresInput: false,
            onConfirm: () => fileInputRef.current.click()
        });
    };

    const handleImportBackup = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                setIsLoading(true);
                const data = JSON.parse(e.target.result);
                const tables = ['restaurant_info', 'users', 'categories', 'menu_items', 'tables', 'orders', 'order_items', 'accounting', 'inventory_items', 'inventory_transactions', 'suppliers', 'supplier_payments'];
                
                await window.db.transaction('rw', tables.filter(t => window.db[t]).map(t => window.db.table(t)), async () => {
                    for (let table of tables) {
                        if (data[table] && window.db[table]) {
                            await window.db.table(table).clear();
                            await window.db.table(table).bulkAdd(data[table]);
                        }
                    }
                });
                
                showToast("تم استعادة البيانات بنجاح، سيتم إعادة تحميل النظام", "success");
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) { showToast("ملف النسخة الاحتياطية غير صالح", "error"); } 
            finally { setIsLoading(false); }
        };
        reader.readAsText(file);
    };

    const handleTriggerDeleteRestaurant = () => {
        setConfirmModal({
            isOpen: true,
            title: "حذف قاعدة بيانات المطعم نهائياً",
            message: `أنت على وشك حذف المطعم (${restaurantData.restaurant_name}) وكل ما يحتويه من فواتير ومنيو نهائياً من هذا الجهاز. لتفادي الحذف بالخطأ، يرجى كتابة اسم المطعم بالضبط في الحقل أدناه:`,
            confirmText: "تأكيد الحذف النهائي",
            confirmColor: "bg-rose-600 hover:bg-rose-700",
            requiresInput: true,
            expectedInput: restaurantData.restaurant_name,
            onConfirm: async () => {
                try {
                    await window.db.delete();
                    localStorage.removeItem('MentraRestaurant_Session');
                    window.location.replace('subscriptions.html');
                } catch (err) {
                    showToast("فشل حذف قاعدة البيانات", "error");
                }
            }
        });
    };

    const filteredUsers = (usersList || []).filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.phone.includes(searchQuery)
    );
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <div className="flex flex-col gap-6 pb-[140px] md:pb-12 fade-up max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
                
                <div className="flex-1 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-fit">
                    {activeTab === 'general' && (
                        <SettingsGeneralTab 
                            restaurantData={restaurantData} setRestaurantData={setRestaurantData} 
                            handleSaveGeneral={handleSaveGeneral} isLoading={isLoading} 
                        />
                    )}
                    {activeTab === 'users' && (
                        <SettingsUsersTab 
                            paginatedUsers={paginatedUsers} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                            totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}
                            handleOpenAddUser={handleOpenAddUser} handleOpenEditUser={handleOpenEditUser}
                        />
                    )}
                    
                    {/* التبويب الجديد */}
                    {activeTab === 'security' && (
                        <TabSecurity 
                            securityKey={securityKey} setSecurityKey={setSecurityKey}
                            handleUpdateSecurityKey={handleUpdateSecurityKey} isLoading={isLoading}
                        />
                    )}

                    {activeTab === 'backup' && (
                        <SettingsBackupTab 
                            restaurantData={restaurantData} handleExportBackup={handleExportBackup} 
                            handleTriggerImport={handleTriggerImport} 
                            handleTriggerDeleteRestaurant={handleTriggerDeleteRestaurant}
                            fileInputRef={fileInputRef} handleImportBackup={handleImportBackup} 
                            isLoading={isLoading} 
                        />
                    )}
                </div>
            </div>

            <SettingsProAd />

            <UserModal 
                showUserModal={showUserModal} setShowUserModal={setShowUserModal} 
                editingUserId={editingUserId} newUser={newUser} setNewUser={setNewUser} 
                handleSaveUser={handleSaveUser} isLoading={isLoading} 
            />

            <SettingsConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                onConfirm={confirmModal.onConfirm} 
                title={confirmModal.title} 
                message={confirmModal.message} 
                confirmText={confirmModal.confirmText} 
                confirmColor={confirmModal.confirmColor} 
                requiresInput={confirmModal.requiresInput} 
                expectedInput={confirmModal.expectedInput} 
            />
        </div>
    );
};