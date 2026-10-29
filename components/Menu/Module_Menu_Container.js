window.Module_Menu_Container = function(props) {
    const { useState, useEffect, useMemo } = React;
    const { showToast } = props;
    const { MenuHeader, MenuCategories, MenuItemsGrid, MenuCategoryModal, MenuItemModal, MenuProAd } = window;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilterCategory, setSelectedFilterCategory] = useState('all'); 
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3; 

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [editingItem, setEditingItem] = useState(null); 
    const [editingCategory, setEditingCategory] = useState(null); 

    const [catName, setCatName] = useState('');
    const [catIcon, setCatIcon] = useState('fa-utensils');

    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemCost, setItemCost] = useState('');
    const [itemCategory, setItemCategory] = useState('');

    const iconOptions = ['fa-utensils', 'fa-hamburger', 'fa-pizza-slice', 'fa-coffee', 'fa-ice-cream', 'fa-drumstick-bite', 'fa-fish', 'fa-glass-cheers'];

    const categories = window.useLiveQuery(() => window.db.categories.orderBy('sort_order').toArray(), []);
    const menuItems = window.useLiveQuery(() => window.db.menu_items.orderBy('id').reverse().toArray(), []);

    useEffect(() => {
        if (categories && categories.length > 0 && !itemCategory) setItemCategory(categories[0].id);
    }, [categories]);

    const filteredItems = useMemo(() => {
        if (!menuItems) return [];
        let result = menuItems;
        if (selectedFilterCategory !== 'all') result = result.filter(item => item.category_id === parseInt(selectedFilterCategory));
        if (searchQuery.trim() !== '') result = result.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return result;
    }, [menuItems, searchQuery, selectedFilterCategory]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedFilterCategory]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const openCategoryModal = (cat = null) => {
        if (cat) { setEditingCategory(cat); setCatName(cat.name); setCatIcon(cat.icon); } 
        else { setEditingCategory(null); setCatName(''); setCatIcon('fa-utensils'); }
        setShowCategoryModal(true);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const trimmedName = catName.trim();
        if (!trimmedName) return showToast("الرجاء إدخال اسم القسم", "error");
        
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await window.db.categories.update(editingCategory.id, { name: trimmedName, icon: catIcon });
                showToast("تم تعديل القسم بنجاح", "success");
            } else {
                await window.RestaurantQueries.addCategory(trimmedName, catIcon);
                showToast("تم إضافة القسم بنجاح", "success");
            }
            setShowCategoryModal(false);
        } catch (error) { showToast("حدث خطأ أثناء الحفظ", "error"); } 
        finally { setIsSubmitting(false); }
    };

    const handleDeleteCategory = async () => {
        if (!editingCategory) return;
        const itemsInCat = await window.db.menu_items.where('category_id').equals(editingCategory.id).count();
        if (itemsInCat > 0) return showToast("لا يمكن حذف القسم لوجود أصناف بداخله. احذف الأصناف أولاً.", "error");
        if(!confirm(`هل أنت متأكد من حذف قسم (${editingCategory.name}) نهائياً؟`)) return;

        setIsSubmitting(true);
        try {
            await window.db.categories.delete(editingCategory.id);
            if (selectedFilterCategory === editingCategory.id) setSelectedFilterCategory('all');
            showToast("تم حذف القسم بنجاح", "success");
            setShowCategoryModal(false);
        } catch (error) { showToast("حدث خطأ أثناء الحذف", "error"); } 
        finally { setIsSubmitting(false); }
    };

    const openItemModal = (item = null) => {
        if (item) { setEditingItem(item); setItemName(item.name); setItemPrice(item.price); setItemCost(item.cost || ''); setItemCategory(item.category_id); } 
        else { setEditingItem(null); setItemName(''); setItemPrice(''); setItemCost(''); setItemCategory(categories?.[0]?.id || ''); }
        setShowItemModal(true);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        const trimmedName = itemName.trim();
        if (!trimmedName || !itemPrice || !itemCategory) return showToast("الرجاء إكمال البيانات الأساسية", "error");
        const isDuplicate = menuItems.some(i => i.name.toLowerCase() === trimmedName.toLowerCase() && i.id !== editingItem?.id);
        if (isDuplicate) return showToast("هذا الصنف مسجل بالفعل في المنيو!", "error");

        setIsSubmitting(true);
        try {
            if (editingItem) {
                await window.db.menu_items.update(editingItem.id, { name: trimmedName, price: parseFloat(itemPrice), cost: parseFloat(itemCost || 0), category_id: parseInt(itemCategory) });
                showToast("تم تعديل الصنف بنجاح", "success");
            } else {
                await window.RestaurantQueries.addMenuItem(parseInt(itemCategory), trimmedName, parseFloat(itemPrice), parseFloat(itemCost || 0));
                showToast("تم الإضافة للمنيو بنجاح", "success");
            }
            setShowItemModal(false);
        } catch (error) { showToast("حدث خطأ أثناء الحفظ", "error"); } 
        finally { setIsSubmitting(false); }
    };

    const handleDeleteItem = async (id, name) => {
        if (!confirm(`تحذير: هل أنت متأكد من حذف الصنف (${name}) من المنيو؟`)) return;
        try { await window.db.menu_items.delete(id); showToast("تم حذف الصنف بنجاح", "success"); } 
        catch (error) { showToast("حدث خطأ أثناء الحذف", "error"); }
    };

    return (
        <div className="space-y-5 md:space-y-6 fade-up pb-[140px] md:pb-12 max-w-7xl mx-auto w-full">
            <MenuHeader openCategoryModal={openCategoryModal} openItemModal={openItemModal} categories={categories} showToast={showToast} />
            <MenuCategories categories={categories} selectedFilterCategory={selectedFilterCategory} setSelectedFilterCategory={setSelectedFilterCategory} openCategoryModal={openCategoryModal} />
            <MenuItemsGrid menuItems={menuItems} filteredItems={filteredItems} paginatedItems={paginatedItems} categories={categories} searchQuery={searchQuery} setSearchQuery={setSearchQuery} openItemModal={openItemModal} handleDeleteItem={handleDeleteItem} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <MenuProAd />
            <MenuCategoryModal showCategoryModal={showCategoryModal} setShowCategoryModal={setShowCategoryModal} editingCategory={editingCategory} catName={catName} setCatName={setCatName} catIcon={catIcon} setCatIcon={setCatIcon} iconOptions={iconOptions} handleSaveCategory={handleSaveCategory} handleDeleteCategory={handleDeleteCategory} isSubmitting={isSubmitting} />
            <MenuItemModal showItemModal={showItemModal} setShowItemModal={setShowItemModal} editingItem={editingItem} itemName={itemName} setItemName={setItemName} itemPrice={itemPrice} setItemPrice={setItemPrice} itemCost={itemCost} setItemCost={setItemCost} itemCategory={itemCategory} setItemCategory={setItemCategory} categories={categories} handleSaveItem={handleSaveItem} isSubmitting={isSubmitting} />
        </div>
    );
};