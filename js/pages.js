/**
 * js/pages.js - Page & Layout Management Module
 * إدارة الصفحات المتعددة، السحب والإفلات، والتنسيقات الهيكلية
 */

function setupPageDragAndDrop(pageElement) {
    const body = pageElement.querySelector('.page-body') || pageElement;

    // حدث اختيار خلفية الصفحة عند النقر عليها
    pageElement.addEventListener('click', (e) => {
        if (AppState.isPreviewMode) return;
        // إذا كان النقر على الورقة نفسها وليس على عنصر داخلها
        if (e.target === pageElement || e.target === body || e.target.classList.contains('page-split-band') || e.target.classList.contains('page-number-badge')) {
            document.querySelectorAll('.cv-element-wrapper').forEach(w => w.classList.remove('selected'));
            AppState.selectedWrapper = null;
            if (window.PropertiesManager) window.PropertiesManager.showPageProperties(pageElement);
        }
    });

    body.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        pageElement.classList.add('drag-over');
    });

    body.addEventListener('dragleave', () => {
        pageElement.classList.remove('drag-over');
    });

    body.addEventListener('drop', (e) => {
        e.preventDefault();
        pageElement.classList.remove('drag-over');

        const type = e.dataTransfer.getData('text/plain') || AppState.draggedType;
        if (type && window.ElementsManager) {
            const newEl = window.ElementsManager.createElement(type);
            body.appendChild(newEl);

            checkEmpty();
            if (window.EventsManager) window.EventsManager.updateEventsDropdowns();

            // اختيار العنصر فور إفلاطه
            document.querySelectorAll('.cv-element-wrapper').forEach(w => w.classList.remove('selected'));
            newEl.classList.add('selected');
            AppState.selectedWrapper = newEl;
            if (window.PropertiesManager) window.PropertiesManager.showProperties(newEl);
        }
    });
}

function checkEmpty() {
    const totalElements = AppState.canvas.querySelectorAll('.cv-element-wrapper').length;
    const emptySt = AppState.canvas.querySelector('#empty-state');
    if (emptySt) {
        emptySt.style.display = totalElements > 0 ? 'none' : 'block';
    }
}

function setupPagesManager() {
    // 1. إضافة صفحة جديدة
    if (AppState.addPageBtn) {
        AppState.addPageBtn.addEventListener('click', () => {
            AppState.pageCounter++;
            const newPage = document.createElement('div');
            newPage.className = 'cv-page';
            newPage.dataset.page = AppState.pageCounter;

            newPage.innerHTML = `
                <div class="page-number-badge">صفحة ${AppState.pageCounter}</div>
                <button class="page-remove-btn" title="حذف الصفحة">حذف الصفحة</button>
                <div class="page-body"></div>
            `;

            AppState.canvas.appendChild(newPage);
            setupPageDragAndDrop(newPage);

            // حدث حذف الصفحة
            newPage.querySelector('.page-remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (AppState.canvas.querySelectorAll('.cv-page').length > 1) {
                    newPage.remove();
                    checkEmpty();
                    if (window.EventsManager) window.EventsManager.updateEventsDropdowns();
                } else {
                    alert('⚠️ لا يمكن حذف الصفحة الأخيرة في السيرة الذاتية!');
                }
            });
        });
    }

    // 2. إعداد الصفحة الأولى التلقائية
    const firstPage = AppState.canvas.querySelector('.cv-page');
    if (firstPage) {
        setupPageDragAndDrop(firstPage);
    }

    // 3. زر فتح خصائص الصفحة من التبويب الجانبي
    const openPagePropsBtn = document.getElementById('open-page-props-btn');
    if (openPagePropsBtn) {
        openPagePropsBtn.addEventListener('click', () => {
            const activePage = AppState.canvas.querySelector('.cv-page');
            if (activePage && window.PropertiesManager) {
                window.PropertiesManager.showPageProperties(activePage);
            }
        });
    }

    // 4. التنسيق والهيكل (Single / Two Columns / Header Banner)
    if (AppState.layoutSelect) {
        AppState.layoutSelect.addEventListener('change', () => {
            const currentLayout = AppState.layoutSelect.value;
            AppState.canvas.classList.remove('layout-single', 'layout-two-column', 'layout-header-banner');
            AppState.canvas.classList.add('layout-' + currentLayout);
        });
    }

    // 5. ثيمات التصميم (Modern, Classic, Minimalist, Creative, Executive...)
    if (AppState.styleSelect) {
        AppState.styleSelect.addEventListener('change', () => {
            const currentStyle = AppState.styleSelect.value;
            AppState.canvas.classList.remove(
                'style-modern', 'style-classic', 'style-minimal',
                'style-creative', 'style-executive', 'style-emerald',
                'style-darktech', 'style-warm'
            );
            AppState.canvas.classList.add('style-' + currentStyle);
        });
    }
}

window.PagesManager = {
    setupPageDragAndDrop,
    checkEmpty,
    setupPagesManager
};
