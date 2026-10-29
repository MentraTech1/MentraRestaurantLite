window.Module_Tables_Container = function(props) {
    const { useState, useEffect, useMemo } = React;
    const { showToast } = props;
    const { TablesHeader, TablesStats, TablesGrid, TableModal, TablesProAd } = window;

    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tableName, setTableName] = useState('');
    const [editingTable, setEditingTable] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tablesPerPage = 10;

    const tables = window.useLiveQuery(() => window.db.table('tables').orderBy('id').toArray(), []);

    const filteredTables = useMemo(() => {
        if (!tables) return [];
        if (searchQuery.trim() === '') return tables;
        return tables.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [tables, searchQuery]);

    const stats = useMemo(() => {
        if (!tables) return { total: 0, available: 0, occupied: 0 };
        return {
            total: tables.length,
            available: tables.filter(t => t.status === 'available').length,
            occupied: tables.filter(t => t.status === 'occupied').length,
        };
    }, [tables]);

    const totalPages = Math.ceil(filteredTables.length / tablesPerPage);
    const paginatedTables = filteredTables.slice((currentPage - 1) * tablesPerPage, currentPage * tablesPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery]);
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const handleOpenModal = (table = null) => {
        if (table) { setEditingTable(table); setTableName(table.name); } 
        else { setEditingTable(null); setTableName(''); }
        setShowModal(true);
    };

    const handleSaveTable = async (e) => {
        e.preventDefault();
        const trimmedName = tableName.trim();
        if (!trimmedName) return showToast("الرجاء إدخال اسم الطاولة", "error");
        
        const isDuplicate = tables.some(t => t.name.toLowerCase() === trimmedName.toLowerCase() && t.id !== editingTable?.id);
        if (isDuplicate) return showToast("اسم الطاولة مسجل بالفعل! الرجاء اختيار اسم آخر.", "error");

        setIsSubmitting(true);
        try {
            if (editingTable) {
                await window.db.table('tables').update(editingTable.id, { name: trimmedName });
                showToast("تم تعديل اسم الطاولة بنجاح", "success");
            } else {
                await window.db.table('tables').add({ name: trimmedName, status: 'available' });
                showToast("تمت إضافة الطاولة بنجاح", "success");
            }
            setShowModal(false); setTableName('');
        } catch (error) { showToast("حدث خطأ أثناء الحفظ", "error"); } 
        finally { setIsSubmitting(false); }
    };

    const handleDeleteTable = async (table) => {
        if (table.status === 'occupied') return showToast("لا يمكن حذف طاولة مشغولة بطلب مفتوح!", "error");
        if (confirm(`هل أنت متأكد من حذف (${table.name}) بشكل نهائي؟`)) {
            try { await window.db.table('tables').delete(table.id); showToast("تم الحذف بنجاح", "success"); } 
            catch (err) { showToast("حدث خطأ أثناء الحذف", "error"); }
        }
    };

    // ==========================================
    // 🌟 الدالة الجديدة: تغيير حالة الطاولة يدوياً
    // ==========================================
    const handleToggleTableStatus = async (table) => {
        const isOccupied = table.status === 'occupied';
        const newStatus = isOccupied ? 'available' : 'occupied';
        const confirmMsg = isOccupied 
            ? `هل أنت متأكد من إخلاء (${table.name}) وجعلها متاحة؟ (تأكد أنه لا يوجد طلب قائم عليها)` 
            : `هل تريد حجز (${table.name}) وجعلها مشغولة الآن؟`;

        if (confirm(confirmMsg)) {
            try {
                await window.db.table('tables').update(table.id, { status: newStatus });
                showToast("تم تحديث حالة الطاولة بنجاح", "success");
            } catch (err) {
                showToast("حدث خطأ أثناء تحديث الحالة", "error");
            }
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 fade-up pb-[140px] md:pb-12 max-w-7xl mx-auto w-full flex flex-col">
            <TablesHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleOpenModal={handleOpenModal} />
            <TablesStats stats={stats} />
            
            <TablesGrid 
                tables={tables} 
                filteredTables={filteredTables} 
                paginatedTables={paginatedTables} 
                searchQuery={searchQuery} 
                handleOpenModal={handleOpenModal} 
                handleDeleteTable={handleDeleteTable} 
                handleToggleTableStatus={handleToggleTableStatus} // تمرير الدالة الجديدة
                totalPages={totalPages} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
            />
            
            <TablesProAd />
            <TableModal showModal={showModal} setShowModal={setShowModal} editingTable={editingTable} tableName={tableName} setTableName={setTableName} handleSaveTable={handleSaveTable} isSubmitting={isSubmitting} />
        </div>
    );
};