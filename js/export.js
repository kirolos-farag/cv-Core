/**
 * js/export.js - Export PDF Module
 * تصدير السيرة الذاتية إلى PDF بطباعة احترافية ومطابقة للتنسيق والألوان
 */

function setupExportManager() {
    // تصدير PDF التلقائي عبر خيار الطباعة
    if (AppState.exportPdfBtn) {
        AppState.exportPdfBtn.addEventListener('click', () => {
            // إزالة أي تحديد نشط للعناصر قبل فتح نافذة الطباعة
            document.querySelectorAll('.cv-element-wrapper').forEach(w => w.classList.remove('selected'));
            document.querySelectorAll('.cv-page').forEach(p => p.classList.remove('selected-page'));
            AppState.selectedWrapper = null;
            if (window.PropertiesManager) window.PropertiesManager.showEmptyProperties();

            window.print();
        });
    }
}

window.ExportManager = {
    setupExportManager
};
