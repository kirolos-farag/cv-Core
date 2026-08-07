/**
 * js/main.js - App Initializer & Main Module
 * نقطة الانطلاق والربط التلقائي بين كافة الوحدات والموديولات
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. تهيئة حالة التطبيق والعناصر
    AppState.init();

    // 2. تفعيل وحدات الموديولات المختلفة
    if (window.ElementsManager) window.ElementsManager.setupDraggableSidebarItems();
    if (window.PagesManager) window.PagesManager.setupPagesManager();
    if (window.EventsManager) window.EventsManager.setupEventsManager();
    if (window.ExportManager) window.ExportManager.setupExportManager();

    // 3. إدارة التبويبات في الشريط الجانبي (العناصر / التفاعلات)
    const tabElementsBtn = document.getElementById('tab-elements-btn');
    const tabEventsBtn = document.getElementById('tab-events-btn');
    
    const tabElementsContent = document.getElementById('tab-elements-content');
    const tabEventsContent = document.getElementById('tab-events-content');

    if (tabElementsBtn && tabEventsBtn) {
        tabElementsBtn.addEventListener('click', () => {
            tabElementsBtn.classList.add('active');
            tabEventsBtn.classList.remove('active');
            tabElementsContent.classList.add('active');
            tabEventsContent.classList.remove('active');
        });

        tabEventsBtn.addEventListener('click', () => {
            tabEventsBtn.classList.add('active');
            tabElementsBtn.classList.remove('active');
            tabEventsContent.classList.add('active');
            tabElementsContent.classList.remove('active');

            if (window.EventsManager) window.EventsManager.updateEventsDropdowns();
        });
    }


    // 4. وضع المعاينة (Preview Mode Toggle)
    if (AppState.previewBtn) {
        AppState.previewBtn.addEventListener('click', () => {
            AppState.isPreviewMode = !AppState.isPreviewMode;
            document.body.classList.toggle('preview-mode', AppState.isPreviewMode);
            AppState.previewBtn.innerText = AppState.isPreviewMode ? '✏️ وضع التعديل' : '👁️ وضع المعاينة';
            AppState.previewBtn.classList.toggle('btn-primary', AppState.isPreviewMode);
            AppState.previewBtn.classList.toggle('btn-secondary', !AppState.isPreviewMode);

            if (AppState.isPreviewMode) {
                document.querySelectorAll('.cv-element-wrapper').forEach(w => w.classList.remove('selected'));
                AppState.selectedWrapper = null;
                if (window.PropertiesManager) window.PropertiesManager.showEmptyProperties();
            }
        });
    }

    // 5. مسح جميع العناصر والصفحات والتفاعلات
    if (AppState.clearBtn) {
        AppState.clearBtn.addEventListener('click', () => {
            if (confirm('⚠️ هل أنت متأكد من مسح جميع العناصر والصفحات والتفاعلات؟')) {
                AppState.canvas.innerHTML = `
                    <div class="cv-page" data-page="1">
                        <div class="page-number-badge">صفحة 1</div>
                        <div class="page-body">
                            <div class="empty-state" id="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                                <h3>اسحب العناصر هنا</h3>
                                <p>ابدأ بسحب العناصر من الشريط الجانبي لبناء سيرتك الذاتية</p>
                            </div>
                        </div>
                    </div>`;

                AppState.pageCounter = 1;
                AppState.elementUniqueId = 0;
                AppState.eventsRules = [];
                AppState.selectedWrapper = null;

                const firstPage = AppState.canvas.querySelector('.cv-page');
                if (window.PagesManager) window.PagesManager.setupPageDragAndDrop(firstPage);
                if (window.PropertiesManager) window.PropertiesManager.showEmptyProperties();
                if (window.EventsManager) {
                    window.EventsManager.renderEventsRulesList();
                    window.EventsManager.updateEventsDropdowns();
                }
            }
        });
    }

    // 6. اختيار خلفية الورقة والصفحة عند النقر عليها لفتح خصائصها في لوحة الخصائص
    AppState.canvas.addEventListener('click', (e) => {
        if (AppState.isPreviewMode) return;
        const pageTarget = e.target.closest('.cv-page') || AppState.canvas.querySelector('.cv-page');
        if (e.target.classList.contains('cv-page') || e.target.classList.contains('page-body') || e.target.classList.contains('page-split-band') || e.target === AppState.canvas) {
            document.querySelectorAll('.cv-element-wrapper').forEach(w => w.classList.remove('selected'));
            AppState.selectedWrapper = null;
            if (pageTarget && window.PropertiesManager) {
                window.PropertiesManager.showPageProperties(pageTarget);
            }
        }
    });

    // 7. تهيئة لوحة الخصائص بالصفحة الأولى عند بداية التشغيل
    const firstP = AppState.canvas ? AppState.canvas.querySelector('.cv-page') : null;
    if (firstP && window.PropertiesManager) {
        window.PropertiesManager.showPageProperties(firstP);
    } else if (window.PropertiesManager) {
        window.PropertiesManager.showEmptyProperties();
    }
});
