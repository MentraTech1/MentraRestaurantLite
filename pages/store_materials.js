window.Module_StoreMaterials = function(props) {
    const { useState, useEffect } = React;
    const [componentsLoaded, setComponentsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        const loadComponents = async () => {
            const filesToLoad = [
                'components/Store/StoreProAd.js',           // البنر الإعلاني (جديد)
                'components/Store/MaterialModal.js', 
                'components/Store/MaterialCard.js',  
                'components/Store/SupplierModal.js', 
                'components/Store/SupplierPaymentModal.js', // مودال السداد (جديد)
                'components/Store/SupplierDetails.js',      // تفاصيل المورد (جديد)
                'components/Store/SuppliersTab.js',  
                'components/Store/MaterialsTab.js',
                'components/Store/TransactionsTab.js',
                'components/Store/Module_StoreMaterials_Container.js'
            ];

            try {
                let loadedCount = 0;
                for (const file of filesToLoad) {
                    const fileName = file.split('/').pop().split('.')[0];
                    if (!window[fileName]) {
                        const res = await fetch(`${file}?v=${Date.now()}`);
                        if (!res.ok) throw new Error(`تعذر تحميل: ${file}`);
                        const rawScript = await res.text();
                        const compiled = window.Babel.transform(rawScript, { presets: ['react'] }).code;
                        const scriptEl = document.createElement('script');
                        scriptEl.text = compiled;
                        document.body.appendChild(scriptEl);
                    }
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / filesToLoad.length) * 100));
                    await new Promise(resolve => setTimeout(resolve, 50)); 
                }
                setTimeout(() => setComponentsLoaded(true), 200);
            } catch (err) { setError(err.message); }
        };
        loadComponents();
    }, []);

    if (error) return <div className="p-10 text-center text-rose-500 font-bold bg-rose-50 rounded-2xl">{error}</div>;

    if (!componentsLoaded || !window.StoreMaterialsContainer) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] max-w-sm mx-auto px-4 animate-view">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg relative">
                    <i className="fas fa-boxes-packing animate-pulse"></i>
                    <div className="absolute inset-0 border-4 border-white/20 border-t-white rounded-2xl animate-spin"></div>
                </div>
                <h3 className="text-slate-800 font-black text-xl mb-1">تجهيز المخزن</h3>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden border border-slate-200 mt-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" style={{ width: `${loadProgress}%` }}></div>
                </div>
                <div className="text-[10px] font-black text-slate-500">{loadProgress}%</div>
            </div>
        );
    }
    return React.createElement(window.StoreMaterialsContainer, props);
};