/**
 * js/elements.js - Elements & Drag-and-Drop Module
 * دعم إنشاء كافة أنواع العناصر وإدارة السحب والإفلات
 */

const elementTemplates = {
    header: () => {
        const el = document.createElement('h1');
        el.className = 'cv-element cv-header';
        el.contentEditable = true;
        el.innerText = 'الاسم الكامل';
        return el;
    },
    section: () => {
        const el = document.createElement('h2');
        el.className = 'cv-element cv-section';
        el.contentEditable = true;
        el.innerText = 'العنوان الرئيسي / القسم';
        return el;
    },
    text: () => {
        const el = document.createElement('p');
        el.className = 'cv-element cv-text';
        el.contentEditable = true;
        el.innerText = 'اكتب نصاً وصفياً هنا حول مؤهلاتك أو خبراتك...';
        return el;
    },
    experience: () => {
        const el = document.createElement('div');
        el.className = 'cv-element cv-experience';
        el.contentEditable = true;
        el.innerHTML = '<strong>المسمّى الوظيفي</strong> - اسم الشركة<br><span style="opacity:0.8; font-size:0.9em;">2021 - الحالي</span><p>وصف مختصر للإنجازات والمسؤوليات الرئيسية...</p>';
        return el;
    },
    education: () => {
        const el = document.createElement('div');
        el.className = 'cv-element cv-education';
        el.contentEditable = true;
        el.innerHTML = '<strong>درجة البكالوريوس في التخصص</strong><br><span style="opacity:0.8; font-size:0.9em;">اسم الجامعة | 2017 - 2021</span>';
        return el;
    },
    skills: () => {
        const el = document.createElement('div');
        el.className = 'cv-element cv-skills';
        el.innerHTML = '<span class="cv-skill-tag" contenteditable="true">المهارة الأولى</span> <span class="cv-skill-tag" contenteditable="true">المهارة الثانية</span> <span class="cv-skill-tag" contenteditable="true">المهارة الثالثة</span>';
        return el;
    },
    link: () => {
        const el = document.createElement('a');
        el.className = 'cv-element cv-link';
        el.contentEditable = true;
        el.href = 'https://facebook.com';
        el.target = '_blank';
        el.innerText = 'رابط الموقع الشخصي / معرض الأعمال';
        return el;
    },
    image: () => {
        const el = document.createElement('img');
        el.className = 'cv-element cv-image';
        el.src = 'images/profile.png';
        el.alt = 'الصورة الشخصية';
        return el;
    },
    divider: () => {
        const el = document.createElement('hr');
        el.className = 'cv-element cv-divider horizontal solid';
        return el;
    }
};

function createElement(type) {
    AppState.elementUniqueId++;
    const wrapper = document.createElement('div');
    wrapper.className = 'cv-element-wrapper w-100';
    wrapper.dataset.type = type;
    wrapper.dataset.id = 'el_' + AppState.elementUniqueId;

    const element = elementTemplates[type] ? elementTemplates[type]() : elementTemplates.text();
    wrapper.appendChild(element);

    const actions = document.createElement('div');
    actions.className = 'element-actions';
    actions.innerHTML = `
        <button class="action-up" title="تحريك لأعلى">▲</button>
        <button class="action-down" title="تحريك لأسفل">▼</button>
        <button class="action-width" title="تغيير العرض مرن (Flex)">↔</button>
        <button class="action-delete" title="حذف العنصر">✕</button>
    `;
    wrapper.appendChild(actions);

    // أحداث التفاعل مع أزرار التحكم السريع
    actions.querySelector('.action-up').addEventListener('click', (e) => {
        e.stopPropagation();
        if (wrapper.previousElementSibling && !wrapper.previousElementSibling.classList.contains('empty-state')) {
            wrapper.parentNode.insertBefore(wrapper, wrapper.previousElementSibling);
        }
    });

    actions.querySelector('.action-down').addEventListener('click', (e) => {
        e.stopPropagation();
        if (wrapper.nextElementSibling) {
            wrapper.parentNode.insertBefore(wrapper.nextElementSibling, wrapper);
        }
    });

    actions.querySelector('.action-width').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleElementWidth(wrapper);
    });

    actions.querySelector('.action-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.remove();
        if (AppState.selectedWrapper === wrapper) {
            AppState.selectedWrapper = null;
            if (window.PropertiesManager) window.PropertiesManager.showEmptyProperties();
        }
        if (window.PagesManager) window.PagesManager.checkEmpty();
    });

    if (type === 'link') {
        element.addEventListener('click', (e) => {
            if (!AppState.isPreviewMode) {
                e.preventDefault();
            }
        });
    }

    wrapper.addEventListener('click', (e) => {
        if (AppState.isPreviewMode) return;
        e.stopPropagation();
        document.querySelectorAll('.cv-element-wrapper').forEach(w => w.classList.remove('selected'));
        wrapper.classList.add('selected');
        AppState.selectedWrapper = wrapper;
        if (window.PropertiesManager) window.PropertiesManager.showProperties(wrapper);
    });

    return wrapper;
}

function toggleElementWidth(wrapper) {
    if (wrapper.classList.contains('w-100')) {
        wrapper.classList.remove('w-100');
        wrapper.classList.add('w-50');
    } else if (wrapper.classList.contains('w-50')) {
        wrapper.classList.remove('w-50');
        wrapper.classList.add('w-33');
    } else if (wrapper.classList.contains('w-33')) {
        wrapper.classList.remove('w-33');
        wrapper.classList.add('w-25');
    } else {
        wrapper.classList.remove('w-25');
        wrapper.classList.add('w-100');
    }

    if (AppState.selectedWrapper === wrapper && window.PropertiesManager) {
        window.PropertiesManager.showProperties(wrapper);
    }
}

function setupDraggableSidebarItems() {
    document.querySelectorAll('.draggable-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            AppState.draggedType = item.dataset.type;
            e.dataTransfer.setData('text/plain', item.dataset.type);
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            AppState.draggedType = null;
        });

        item.addEventListener('click', () => {
            if (AppState.isPreviewMode) return;
            const type = item.dataset.type;
            if (!type) return;

            const activePage = document.querySelector('.cv-page.selected-page') || document.querySelector('.cv-page');
            if (!activePage) return;

            const pageBody = activePage.querySelector('.page-body') || activePage;
            const emptyState = pageBody.querySelector('.empty-state');
            if (emptyState) emptyState.remove();

            const newWrapper = createElement(type);
            pageBody.appendChild(newWrapper);

            document.querySelectorAll('.cv-element-wrapper').forEach(w => w.classList.remove('selected'));
            newWrapper.classList.add('selected');
            AppState.selectedWrapper = newWrapper;
            if (window.PropertiesManager) window.PropertiesManager.showProperties(newWrapper);
        });
    });
}

window.ElementsManager = {
    elementTemplates,
    createElement,
    toggleElementWidth,
    setupDraggableSidebarItems
};
