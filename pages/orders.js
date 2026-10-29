window.Module_Orders = function(props) {
    const { useState, useEffect } = React;
    const [componentsLoaded, setComponentsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        const loadComponents = async () => {
            const filesToLoad = [
                'components/Orders/OrdersToolbar.js',
                'components/Orders/OrdersList.js',
                'components/Orders/OrderModal.js',
                'components/Orders/OrdersProAd.js',
                'components/Orders/Module_Orders_Container.js' // الحاوية الرئيسية
            ];

            try {
                let loadedCount = 0;

                for (const file of filesToLoad) {
                    if (!window[file.split('/').pop().split('.')[0]]) {
                        const res = await fetch(`${file}?v=${Date.now()}`);
                        if (!res.ok) throw new Error(`تعذر تحميل: ${file}`);
                        
                        const rawScript = await res.text();
                        const compiled = window.Babel.transform(rawScript, { presets: ['react'] }).code;
                        
                        const scriptEl = document.createElement('script');
                        scriptEl.text = compiled;
                        document.body.appendChild(scriptEl);
                    }
                    
                    loadedCount++;
                    const percentage = Math.round((loadedCount / filesToLoad.length) * 100);
                    setLoadProgress(percentage);

                    await new Promise(resolve => setTimeout(resolve, 100)); // حركة ناعمة للشريط
                }
                
                setTimeout(() => setComponentsLoaded(true), 200);

            } catch (err) {
                setError(err.message);
            }
        };

        loadComponents();
    }, []);

    // 1. شاشة الخطأ
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-rose-50 rounded-3xl border border-rose-200 animate-view">
                <i className="fas fa-exclamation-triangle text-4xl text-rose-500 mb-4 animate-bounce"></i>
                <span className="text-rose-700 font-black text-lg">خطأ في تحميل سجل الطلبات:</span>
                <span className="text-rose-500 mt-2 text-sm font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-rose-100">{error}</span>
            </div>
        );
    }

    // 2. شاشة التحميل (Progress Bar)
    if (!componentsLoaded || !window.Module_Orders_Container) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] max-w-sm mx-auto px-4 animate-view">
                <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-emerald-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[0_10px_20px_rgba(16,185,129,0.3)] border border-emerald-400 relative">
                    <i className="fas fa-receipt animate-pulse"></i>
                    <div className="absolute inset-0 border-4 border-white/20 border-t-white rounded-2xl animate-spin"></div>
                </div>
                
                <h3 className="text-slate-800 font-black text-xl mb-1">تجهيز سجل الطلبات</h3>
                <p className="text-slate-400 font-bold text-xs mb-8">يرجى الانتظار، جاري تحميل البيانات والمكونات...</p>

                <div className="w-full relative">
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner border border-slate-200/50">
                        <div 
                            className="bg-gradient-to-r from-[#10B981] to-emerald-400 h-full rounded-full transition-all duration-300 ease-out relative"
                            style={{ width: `${loadProgress}%` }}
                        >
                            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20" style={{ animation: 'shimmer 1s infinite linear' }}></div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full text-[10px] font-black text-slate-500">
                        <span>{loadProgress === 100 ? 'اكتمل التحميل!' : 'جاري التحميل...'}</span>
                        <span className="text-emerald-500">{loadProgress}%</span>
                    </div>
                </div>

                <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
            </div>
        );
    }

    // 3. عرض الشاشة بعد اكتمال التحميل
    return React.createElement(window.Module_Orders_Container, props);
};