// ==========================================
// MentraResto Lite - Service Worker (Offline First)
// ==========================================

const CACHE_NAME = 'Mentra-RestaurantLite-v5.0'; // تم التحديث لـ v5.0 لفرض التحديث

// الملفات الأساسية التي يجب تحميلها فور تشغيل البرنامج لأول مرة
const CORE_ASSETS = [
    './',
    './index.html',
    './subscriptions.html',
    './dashboard.html',
    './Tutorial.html',
    './database.js',
    './manifest.json',
    
    // --- الصور وملحقات الشرح ---
    './assets/logo.png',
	'./assets/logo-512.png',
    './assets/step1.PNG',
    './assets/step2.PNG',
    './assets/step3.PNG',
    './assets/step4.PNG',
    './assets/step5.PNG',
    './assets/step6.PNG',
    './assets/step7.PNG',

    // --- المكتبات المحلية ---
    './assets/Tailwind.js',
    './assets/react.production.min.js',
    './assets/react-dom.production.min.js',
    './assets/babel.min.js',
    './assets/dexie.min.js',
    
    // --- شاشات النظام الأساسية (Loaders) ---
    './pages/main.js',
    './pages/orders.js',
    './pages/menu.js',
    './pages/tables.js',
    './pages/pos.js',
    './pages/accounting.js',
    './pages/settings.js',
    './pages/backup.js',
    './pages/store_materials.js',

    // ==========================================
    // --- المكونات المصغرة (Components) ---
    // ==========================================
    
    // Main Components
    './components/Main/StatsCards.js',
    './components/Main/QuickAccess.js',
    './components/Main/ActiveOrders.js',
    './components/Main/ProAd.js',
    './components/Main/Module_Main_Container.js',

    // POS Components
    './components/Pos/PosOrderOptions.js',
    './components/Pos/PosMenuGrid.js',
    './components/Pos/PosCart.js',
    './components/Pos/Module_POS_Container.js',

    // Menu Components
    './components/Menu/MenuHeader.js',
    './components/Menu/MenuCategories.js',
    './components/Menu/MenuItemsGrid.js',
    './components/Menu/MenuCategoryModal.js',
    './components/Menu/MenuItemModal.js',
    './components/Menu/MenuProAd.js',
    './components/Menu/Module_Menu_Container.js',

    // Orders Components
    './components/Orders/OrdersToolbar.js',
    './components/Orders/OrdersList.js',
    './components/Orders/OrderModal.js',
    './components/Orders/OrdersProAd.js',
    './components/Orders/Module_Orders_Container.js',

    // Tables Components
    './components/Tables/TablesHeader.js',
    './components/Tables/TablesStats.js',
    './components/Tables/TablesGrid.js',
    './components/Tables/TableModal.js',
    './components/Tables/TablesProAd.js',
    './components/Tables/Module_Tables_Container.js',

    // Accounting Components
    './components/Accounting/AccountingHeader.js',
    './components/Accounting/AccountingStats.js',
    './components/Accounting/AccountingTable.js',
    './components/Accounting/ExpenseModal.js',
    './components/Accounting/AccountingProAd.js',
    './components/Accounting/Module_Accounting_Container.js',

    // Store Materials Components
    './components/Store/StoreProAd.js',
    './components/Store/MaterialModal.js',
    './components/Store/MaterialCard.js',
    './components/Store/SupplierModal.js',
    './components/Store/SupplierPaymentModal.js',
    './components/Store/SupplierDetails.js',
    './components/Store/SuppliersTab.js',
    './components/Store/MaterialsTab.js',
    './components/Store/TransactionsTab.js',
    './components/Store/Module_StoreMaterials_Container.js',

    // Settings Components
    './components/Settings/SettingsConfirmModal.js',
    './components/Settings/SettingsNav.js',
    './components/Settings/SettingsGeneralTab.js',
    './components/Settings/SettingsUsersTab.js',
    './components/Settings/TabSecurity.js',
    './components/Settings/SettingsBackupTab.js',
    './components/Settings/UserModal.js',
    './components/Settings/SettingsProAd.js',
    './components/Settings/Module_Settings_Container.js',

    // Backup Components
    './components/Backup/BackupLoaderOverlay.js',
    './components/Backup/BackupConfirmModal.js',
    './components/Backup/BackupHeader.js',
    './components/Backup/BackupStats.js',
    './components/Backup/BackupActions.js',
    './components/Backup/BackupProAd.js',
    './components/Backup/Module_Backup_Container.js'
];

// الروابط الخارجية (CDNs) مثل الخطوط والأيقونات
const CDN_URLS = [
    'https://cdnjs.cloudflare.com', // FontAwesome
    'https://fonts.googleapis.com', // Google Fonts CSS
    'https://fonts.gstatic.com'     // Google Fonts Files
];

// 1. حدث التثبيت (Install Event) - حفظ الملفات الأساسية
self.addEventListener('install', (event) => {
    self.skipWaiting(); // تفعيل النسخة الجديدة فوراً لعدم تعليق المستخدم على النسخة القديمة
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 [Service Worker] Caching Core Assets (App Shell)...');
            // نستخدم allSettled لتجنب توقف التثبيت بالكامل إذا كان هناك ملف واحد مفقود
            return Promise.allSettled(
                CORE_ASSETS.map(url => 
                    cache.add(url).catch(err => console.warn(`⚠️ لم يتم العثور على (قد لا يؤثر على العمل): ${url}`))
                )
            );
        })
    );
});

// 2. حدث التفعيل (Activate Event) - مسح الكاش القديم
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ [Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // للسيطرة على كل الصفحات المفتوحة فوراً
    );
});

// 3. حدث جلب البيانات (Fetch Event) - المنطق الذكي للعمل Offline
self.addEventListener('fetch', (event) => {
    // أ) تخطي الطلبات غير المدعومة مثل إضافات المتصفح أو روابط الـ blob التي ينشئها Babel
    if (!event.request.url.startsWith('http')) {
        return;
    }

    const requestUrl = event.request.url;

    // ب) إذا كان الطلب من مكتبة خارجية (CDN) - FontAwesome, Google Fonts
    if (CDN_URLS.some(cdn => requestUrl.includes(cdn))) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse; // إرجاعها من الكاش إذا وجدت
                
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    console.warn('❌ [Service Worker] Network failed for CDN:', requestUrl);
                });
            })
        );
        return;
    }

    // ج) إذا كان الطلب لملفات النظام المحلية (HTML, JS React, CSS, PNG)
    // استراتيجية: Stale-While-Revalidate (عرض الكاش الفوري، مع تحديثه في الخلفية إذا وجد إنترنت)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // التأكد من أن الاستجابة صالحة قبل تخزينها
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => {
                // إذا لم يوجد إنترنت، لا تفعل شيئاً (يتم الاعتماد على الكاش)
                console.log('📶 [Service Worker] You are Offline. Serving from cache:', requestUrl);
            });

            // إرجاع الملف من الكاش (السرعة الفائقة) أو انتظار تحميله من الشبكة
            return cachedResponse || fetchPromise;
        })
    );
});