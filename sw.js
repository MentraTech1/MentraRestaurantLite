// ===================================================================
// MentraResto Lite - Professional Service Worker (100% Offline-First)
// متوافق بالكامل مع نظام حقن المكونات الديناميكية وشاشات النظام
// ===================================================================

const CACHE_NAME = 'Mentra-RestaurantLite-v7.1'; // تم تحديث الإصدار لتطبيق التعديلات فوراً

// 1. الملفات الأساسية والمكونات المطلوب تخزينها مسبقاً
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

// 2. مرحلة التثبيت (Install) - تخزين آمن دون توقف عند خطأ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[SW] جاري تهيئة التخزين المؤقت لتطبيق المطعم...');
            
            // جلب كل الملفات مع منع الاعتماد على كاش المتصفح القديم
            const cachePromises = CORE_ASSETS.map(async (url) => {
                try {
                    const request = new Request(url, { cache: 'reload' });
                    const response = await fetch(request);
                    if (response.ok) {
                        return await cache.put(url, response);
                    }
                } catch (err) {
                    console.warn(`[SW] تخطي الملف لعدم توفره حالياً: ${url}`);
                }
            });

            await Promise.allSettled(cachePromises);
            console.log('[SW] تم تثبيت الملفات بنجاح، النظام جاهز للعمل أوفلاين 100%.');
        })
    );
    self.skipWaiting();
});

// 3. مرحلة التنشيط (Activate) - مسح الكاش القديم فوراً والسيطرة
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log(`[SW] حذف كاش قديم: ${key}`);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 4. مرحلة اعتراض الطلبات (Fetch) - أوفلاين فوري + تحديث صامت
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // تجاهل الطلبات التي ليست GET أو لا تبدأ بـ http (مثل إضافات Chrome)
    if (request.method !== 'GET' || !request.url.startsWith('http')) return;

    const requestUrl = request.url;
    const isCDN = CDN_URLS.some(cdn => requestUrl.includes(cdn));

    event.respondWith(
        // ignoreSearch: true أمر حيوي جداً لتجاوز بارامترات Babel و React الديناميكية
        caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
            
            // أ) إذا وُجد الملف بالكاش: إرجاعه فوراً وتحديثه بالخلفية
            if (cachedResponse) {
                // تحديث صامت في الخلفية إن وجد إنترنت
                fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, networkResponse.clone());
                        });
                    }
                }).catch(() => { /* المستخدم أوفلاين، لا داعي لعمل شيء */ });

                return cachedResponse;
            }

            // ب) إذا لم يوجد الملف بالكاش: جلبه من الشبكة وتخزينه
            return fetch(request).then((networkResponse) => {
                // حفظ الرد إذا كان ناجحاً (أو إذا كان من نوع opaque للـ CDNs)
                if (networkResponse && (networkResponse.status === 200 || (isCDN && networkResponse.type === 'opaque'))) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch((error) => {
                console.warn('[SW] طلب فشل وأنت أوفلاين:', requestUrl);
                throw error;
            });
        })
    );
});