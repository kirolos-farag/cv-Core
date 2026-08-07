/**
 * js/export.js - Export PDF & HTML Module
 * تصدير السيرة الذاتية إلى PDF أو ملفات HTML مستقلة وقابلة للتنزيل
 */

function setupExportManager() {
    // 1. تصدير PDF التلقائي عبر خيار الطباعة
    if (AppState.exportPdfBtn) {
        AppState.exportPdfBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 2. تصدير ملف HTML كامل ومستقل للتحميل المباشر
    if (AppState.exportBtn) {
        AppState.exportBtn.addEventListener('click', () => {
            const currentStyle = AppState.styleSelect.value;
            const currentLayout = AppState.layoutSelect.value;
            const styleClass = 'style-' + currentStyle;
            const layoutClass = 'layout-' + currentLayout;

            let pagesHtml = '';
            document.querySelectorAll('.cv-page').forEach((page) => {
                let elementsHtml = '';
                page.querySelectorAll('.cv-element-wrapper').forEach(wrapper => {
                    const el = wrapper.querySelector('.cv-element');
                    if (el) {
                        const cloneWrap = wrapper.cloneNode(true);
                        const cloneEl = cloneWrap.querySelector('.cv-element');
                        const actions = cloneWrap.querySelector('.element-actions');
                        if (actions) actions.remove();

                        // إزالة حدود وأدوات النقر
                        cloneWrap.classList.remove('selected');
                        cloneWrap.style.borderColor = 'transparent';
                        cloneEl.removeAttribute('contenteditable');

                        elementsHtml += cloneWrap.outerHTML + '\n';
                    }
                });

                pagesHtml += `
                <div class="cv-page">
                    <div class="page-body">
                        ${elementsHtml}
                    </div>
                </div>\n`;
            });

            // قراءة جميع التنسيقات المدمجة
            const fullCss = Array.from(document.styleSheets)
                .map(sheet => {
                    try {
                        return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                    } catch (e) {
                        return '';
                    }
                }).join('\n');

            const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>السيرة الذاتية - Cv-Core Export</title>
    <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600;700;800&family=Inter:wght@300;400;600;700&family=Montserrat:wght@400;600;700&family=Noto+Kufi+Arabic:wght@400;600;700&family=Outfit:wght@400;600;700&family=Roboto:wght@300;400;500;700&family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet">
    <style>
        ${fullCss}
        body { background: #e2e8f0; display: flex; justify-content: center; padding: 40px 0; overflow: auto; }
        .cv-page { box-shadow: 0 8px 30px rgba(0,0,0,0.12); margin-bottom: 30px; }
    </style>
</head>
<body>
    <div id="cv-canvas" class="${styleClass} ${layoutClass}">
        ${pagesHtml}
    </div>
</body>
</html>`;

            const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CV_Resume_${currentStyle}_${Date.now()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

window.ExportManager = {
    setupExportManager
};
