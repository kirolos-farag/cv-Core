/**
 * js/properties.js - Properties Inspector Module
 * لوحة الخصائص البصرية الشاملة ومكتبة الخطوط والألوان
 */

const GoogleFontsLibrary = [
    { name: 'افتراضي (Segoe UI)', val: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    { name: 'Cairo (عربي ممتاز)', val: "'Cairo', sans-serif" },
    { name: 'Tajawal (عربي عصري)', val: "'Tajawal', sans-serif" },
    { name: 'Alexandria (عربي تقني)', val: "'Alexandria', sans-serif" },
    { name: 'Amiri (عربي كلاسيكي)', val: "'Amiri', serif" },
    { name: 'Aref Ruqaa (عربي رقعة)', val: "'Aref Ruqaa', serif" },
    { name: 'Noto Kufi Arabic (كوفي)', val: "'Noto Kufi Arabic', sans-serif" },
    { name: 'Inter (English Modern)', val: "'Inter', sans-serif" },
    { name: 'Roboto (English Clean)', val: "'Roboto', sans-serif" },
    { name: 'Montserrat (English Header)', val: "'Montserrat', sans-serif" },
    { name: 'Outfit (English Trendy)', val: "'Outfit', sans-serif" }
];

const ColorPaletteSwatches = [
    '#000000', '#1e293b', '#64748b', '#e94560', '#3b82f6', 
    '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'
];

const PageGradientsPresets = [
    { name: 'عصري ناعم', val: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' },
    { name: 'إبداعي بنفسجي', val: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
    { name: 'تقني مظلم', val: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
    { name: 'زمردي أنيق', val: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' },
    { name: 'دافئ وذهبي', val: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }
];

function showProperties(wrapper) {
    const el = wrapper.querySelector('.cv-element');
    if (!el) return;

    const type = wrapper.dataset.type;
    const computed = window.getComputedStyle(el);
    const wrapComputed = window.getComputedStyle(wrapper);

    let html = `<h4>خصائص: <span style="color:#e94560;">${getElementLabel(type)}</span></h4>`;

    // ===== 1. خصائص خاصة بالخط الفاصل Divider =====
    if (type === 'divider') {
        const isVertical = el.classList.contains('vertical');
        const isDashed = el.classList.contains('dashed');
        const isDotted = el.classList.contains('dotted');
        const isDouble = el.classList.contains('double');
        const isGradient = el.classList.contains('gradient-line');
        const currentLength = parseInt(isVertical ? (el.style.height || computed.height) : (el.style.width || computed.width)) || 100;
        const currentThick = parseInt(isVertical ? (el.style.width || computed.width) : (el.style.height || computed.height)) || 2;
        const currentColorHex = rgbToHex(el.style.backgroundColor || el.style.borderColor || computed.backgroundColor || computed.borderColor);

        html += `
        <div class="prop-group">
            <label>اتجاه الخط الفاصل:</label>
            <div class="toggle-group">
                <button type="button" class="toggle-btn ${!isVertical ? 'active' : ''}" id="btn-div-horiz">أفقي (Horizontal)</button>
                <button type="button" class="toggle-btn ${isVertical ? 'active' : ''}" id="btn-div-vert">عمودي (Vertical)</button>
            </div>
        </div>

        <div class="prop-group">
            <label>نمط الخط (Line Style):</label>
            <select id="prop-div-style">
                <option value="solid" ${(!isDashed && !isDotted && !isDouble && !isGradient) ? 'selected' : ''}>صلب ومتصل (Solid)</option>
                <option value="dashed" ${isDashed ? 'selected' : ''}>متقطع (Dashed)</option>
                <option value="dotted" ${isDotted ? 'selected' : ''}>منقط (Dotted)</option>
                <option value="double" ${isDouble ? 'selected' : ''}>مزدوج (Double)</option>
                <option value="gradient-line" ${isGradient ? 'selected' : ''}>تدرج ملون أنيق (Gradient)</option>
            </select>
        </div>

        <div class="prop-group">
            <label>طول الخط (${isVertical ? 'الارتفاع Height' : 'العرض Width'}): <span class="prop-val-badge" id="val-div-length">${currentLength}px</span></label>
            <div class="prop-slider-wrapper">
                <input type="range" id="prop-div-length" min="20" max="800" value="${currentLength}">
            </div>
        </div>

        <div class="prop-group">
            <label>سماكة الخط (${isVertical ? 'العرض Width' : 'الارتفاع Height'}): <span class="prop-val-badge" id="val-div-thick">${currentThick}px</span></label>
            <div class="prop-slider-wrapper">
                <input type="range" id="prop-div-thick" min="1" max="30" value="${currentThick}">
            </div>
        </div>

        <div class="prop-group">
            <label>لون الخط (Line Color):</label>
            <div class="color-picker-row">
                <input type="color" id="prop-div-color" value="${currentColorHex}">
                <div class="color-swatches-grid" data-target="div-color">
                    ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
                </div>
            </div>
        </div>`;

        AppState.propContent.innerHTML = html;
        bindDividerPropertiesEvents(wrapper, el);
        return;
    }

    // ===== 2. خصائص خاصة بالصورة الشخصية Image =====
    if (type === 'image') {
        const imgWidth = parseInt(el.style.width || computed.width) || 120;
        const imgHeight = parseInt(el.style.height || computed.height) || 120;
        const imgRadius = parseInt(el.style.borderRadius || computed.borderRadius) || 50;
        const currentAlign = wrapComputed.textAlign || 'right';

        html += `
        <div class="prop-group">
            <label>رفع صورة من جهازك:</label>
            <label class="prop-file-upload-btn">
                📁 اختر ملف صورة من جهازك
                <input type="file" id="prop-image-file" accept="image/*" style="display:none;">
            </label>
            <label>أو رابط الصورة (URL):</label>
            <input type="text" id="prop-image-url" value="${el.src}">
        </div>

        <div class="prop-group">
            <label>محاذاة الصورة:</label>
            <div class="toggle-group">
                <button type="button" class="toggle-btn ${currentAlign === 'right' ? 'active' : ''}" data-img-align="right">يمين</button>
                <button type="button" class="toggle-btn ${currentAlign === 'center' ? 'active' : ''}" data-img-align="center">وسط</button>
                <button type="button" class="toggle-btn ${currentAlign === 'left' ? 'active' : ''}" data-img-align="left">يسار</button>
            </div>
        </div>

        <div class="prop-row">
            <div class="prop-group">
                <label>العرض: <span class="prop-val-badge" id="val-img-width">${imgWidth}px</span></label>
                <div class="prop-slider-wrapper">
                    <input type="range" id="prop-img-width" min="30" max="500" value="${imgWidth}">
                </div>
            </div>
            <div class="prop-group">
                <label>الارتفاع: <span class="prop-val-badge" id="val-img-height">${imgHeight}px</span></label>
                <div class="prop-slider-wrapper">
                    <input type="range" id="prop-img-height" min="30" max="500" value="${imgHeight}">
                </div>
            </div>
        </div>

        <div class="prop-group">
            <label>انحناء وشكل الصورة: <span class="prop-val-badge" id="val-img-radius">${imgRadius}px</span></label>
            <div class="prop-slider-wrapper">
                <input type="range" id="prop-img-radius" min="0" max="250" value="${imgRadius}">
            </div>
        </div>

        <div class="prop-group">
            <label>لون إطار الصورة (Border Color):</label>
            <div class="color-picker-row">
                <input type="color" id="prop-img-border-color" value="${rgbToHex(computed.borderColor)}">
                <div class="color-swatches-grid" data-target="img-border">
                    ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
                </div>
            </div>
        </div>

        <div class="prop-group">
            <label>سماكة الإطار (Border Width): <span class="prop-val-badge" id="val-img-border-width">${parseInt(computed.borderWidth) || 0}px</span></label>
            <div class="prop-slider-wrapper">
                <input type="range" id="prop-img-border-width" min="0" max="20" value="${parseInt(computed.borderWidth) || 0}">
            </div>
        </div>`;

        AppState.propContent.innerHTML = html;
        bindImagePropertiesEvents(wrapper, el);
        return;
    }

    // ===== 3. خصائص المحتوى النصي حسب نوع العنصر =====
    if (type === 'experience') {
        const strongEl = el.querySelector('strong');
        const spanEl = el.querySelector('span');
        const pEl = el.querySelector('p');

        const headerText = strongEl ? el.innerHTML.split('<br>')[0].replace(/<[^>]*>/g, '').trim() : 'المسمّى الوظيفي - اسم الشركة';
        const dateText = spanEl ? spanEl.innerText : '2021 - الحالي';
        const descText = pEl ? pEl.innerText : 'وصف مختصر للإنجازات والمسؤوليات الرئيسية...';

        html += `
        <div class="prop-group">
            <label>المسمّى الوظيفي والشركة:</label>
            <input type="text" id="prop-exp-header" value="${headerText.replace(/"/g, '&quot;')}">
        </div>
        <div class="prop-group">
            <label>الفترة الزمنية والتاريخ:</label>
            <input type="text" id="prop-exp-date" value="${dateText.replace(/"/g, '&quot;')}">
        </div>
        <div class="prop-group">
            <label>وصف المهام والإنجازات:</label>
            <textarea id="prop-exp-desc" rows="3">${descText}</textarea>
        </div>`;
    } else if (type === 'education') {
        const strongEl = el.querySelector('strong');
        const spanEl = el.querySelector('span');

        const degreeText = strongEl ? strongEl.innerText : 'درجة البكالوريوس في التخصص';
        const subText = spanEl ? spanEl.innerText : 'اسم الجامعة | 2017 - 2021';

        html += `
        <div class="prop-group">
            <label>المؤهل العلمي / الشهادة:</label>
            <input type="text" id="prop-edu-degree" value="${degreeText.replace(/"/g, '&quot;')}">
        </div>
        <div class="prop-group">
            <label>اسم الجامعة والتاريخ:</label>
            <input type="text" id="prop-edu-subtitle" value="${subText.replace(/"/g, '&quot;')}">
        </div>`;
    } else if (type === 'skills') {
        const tags = Array.from(el.querySelectorAll('.cv-skill-tag')).map(t => t.innerText).join(', ');
        const firstTag = el.querySelector('.cv-skill-tag');
        const tagComputed = firstTag ? window.getComputedStyle(firstTag) : null;
        const tagTextColor = tagComputed ? rgbToHex(tagComputed.color) : '#ffffff';
        const tagBgColor = tagComputed ? rgbToHex(tagComputed.backgroundColor) : '#1a1a2e';

        html += `
        <div class="prop-group">
            <label>قائمة المهارات (مفصولة بفواصل):</label>
            <input type="text" id="prop-skills-list" value="${tags.replace(/"/g, '&quot;')}">
        </div>
        <div class="prop-group">
            <label>لون نص بطاقات المهارات:</label>
            <div class="color-picker-row">
                <input type="color" id="prop-tag-color" value="${tagTextColor}">
                <div class="color-swatches-grid" data-target="tag-color">
                    ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
                </div>
            </div>
        </div>
        <div class="prop-group">
            <label>لون خلفية بطاقات المهارات:</label>
            <div class="color-picker-row">
                <input type="color" id="prop-tag-bg" value="${tagBgColor}">
                <div class="color-swatches-grid" data-target="tag-bg">
                    ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
                </div>
            </div>
        </div>`;
    } else if (type === 'link') {
        const hrefVal = el.getAttribute('href') || '#';
        const linkText = el.innerText || '🔗 رابط تفاعلي';
        const isBlank = el.getAttribute('target') === '_blank';

        html += `
        <div class="prop-group">
            <label>نص الرابط الظاهر:</label>
            <input type="text" id="prop-link-text" value="${linkText.replace(/"/g, '&quot;')}">
        </div>
        <div class="prop-group">
            <label>رابط الموقع (URL):</label>
            <input type="text" id="prop-link-url" value="${hrefVal.replace(/"/g, '&quot;')}">
        </div>
        <div class="prop-group">
            <label>فتح الرابط:</label>
            <div class="toggle-group">
                <button type="button" class="toggle-btn ${isBlank ? 'active' : ''}" id="prop-link-target">
                    ${isBlank ? 'نافذة جديدة (_blank)' : 'نفس النافذة (_self)'}
                </button>
            </div>
        </div>`;
    } else {
        // عناصر النص الأخرى (Header H1, Section H2, Text Paragraph)
        html += `
        <div class="prop-group">
            <label>المحتوى النصي:</label>
            <textarea id="prop-text-content" rows="3">${el.innerText}</textarea>
        </div>`;
    }

    // ===== 4. عروض الأبعاد المرنة Flex Width =====
    html += `
    <div class="prop-group">
        <label>عرض العنصر (Flex Width):</label>
        <div class="toggle-group">
            <button type="button" class="toggle-btn ${wrapper.classList.contains('w-100') ? 'active' : ''}" data-w="w-100">100%</button>
            <button type="button" class="toggle-btn ${wrapper.classList.contains('w-50') ? 'active' : ''}" data-w="w-50">50%</button>
            <button type="button" class="toggle-btn ${wrapper.classList.contains('w-33') ? 'active' : ''}" data-w="w-33">33%</button>
            <button type="button" class="toggle-btn ${wrapper.classList.contains('w-25') ? 'active' : ''}" data-w="w-25">25%</button>
        </div>
    </div>`;

    // ===== 5. نوع الخط (Font Family) =====
    html += `
    <div class="prop-group">
        <label>نوع الخط (Font Family):</label>
        <select id="prop-font-family">
            ${GoogleFontsLibrary.map(f => `<option value="${f.val}" ${computed.fontFamily.includes(f.name.split(' ')[0]) ? 'selected' : ''}>${f.name}</option>`).join('')}
        </select>
    </div>`;

    // ===== 6. حجم الخط (Font Size Slider) =====
    const currentFontSize = parseInt(computed.fontSize) || 16;
    html += `
    <div class="prop-group">
        <label>حجم الخط: <span class="prop-val-badge" id="val-font-size">${currentFontSize}px</span></label>
        <div class="prop-slider-wrapper">
            <input type="range" id="prop-font-size" min="10" max="72" value="${currentFontSize}">
        </div>
    </div>`;

    // ===== 7. الألوان (Text Color & Background Color) - مستبعد لقائمة المهارات =====
    if (type !== 'skills') {
        const textColorHex = rgbToHex(computed.color);
        const rawBg = computed.backgroundColor;
        const isBgTransparent = !rawBg || rawBg === 'transparent' || rawBg === 'rgba(0, 0, 0, 0)';
        const bgColorHex = isBgTransparent ? '#ffffff' : rgbToHex(rawBg);

        html += `
        <div class="prop-group">
            <label>لون النص (Text Color):</label>
            <div class="color-picker-row">
                <input type="color" id="prop-color" value="${textColorHex}">
                <div class="color-swatches-grid" data-target="color">
                    ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
                </div>
            </div>
        </div>`;

        html += `
        <div class="prop-group">
            <label>لون خلفية العنصر (Background):</label>
            <div class="color-picker-row">
                <input type="color" id="prop-bg-color" value="${bgColorHex}">
                <button type="button" class="transparent-btn" id="prop-bg-transparent">شفاف</button>
                <div class="color-swatches-grid" data-target="bg">
                    ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
                </div>
            </div>
        </div>`;

        // ===== 8. محاذاة النص Text Align =====
        html += `
        <div class="prop-group">
            <label>محاذاة النص:</label>
            <div class="toggle-group">
                <button type="button" class="toggle-btn ${computed.textAlign === 'right' ? 'active' : ''}" data-align="right">يمين</button>
                <button type="button" class="toggle-btn ${computed.textAlign === 'center' ? 'active' : ''}" data-align="center">وسط</button>
                <button type="button" class="toggle-btn ${computed.textAlign === 'left' ? 'active' : ''}" data-align="left">يسار</button>
                <button type="button" class="toggle-btn ${computed.textAlign === 'justify' ? 'active' : ''}" data-align="justify">ضبط</button>
            </div>
        </div>`;
    }

    // ===== 9. الهوامش Padding & Margin =====
    const currentPadding = parseInt(computed.paddingTop) || 6;
    const currentMargin = parseInt(wrapComputed.marginBottom) || 8;

    html += `
    <div class="prop-row">
        <div class="prop-group">
            <label>الهامش الداخلي: <span class="prop-val-badge" id="val-padding">${currentPadding}px</span></label>
            <div class="prop-slider-wrapper">
                <input type="range" id="prop-padding" min="0" max="50" value="${currentPadding}">
            </div>
        </div>
        <div class="prop-group">
            <label>الهامش الخارجي: <span class="prop-val-badge" id="val-margin">${currentMargin}px</span></label>
            <div class="prop-slider-wrapper">
                <input type="range" id="prop-margin" min="0" max="50" value="${currentMargin}">
            </div>
        </div>
    </div>`;

    AppState.propContent.innerHTML = html;
    bindPropertiesEvents(wrapper, el);
}

function bindDividerPropertiesEvents(wrapper, el) {
    const btnHoriz = document.getElementById('btn-div-horiz');
    const btnVert = document.getElementById('btn-div-vert');
    const styleSelect = document.getElementById('prop-div-style');
    const lengthSlider = document.getElementById('prop-div-length');
    const valLength = document.getElementById('val-div-length');
    const thickSlider = document.getElementById('prop-div-thick');
    const valThick = document.getElementById('val-div-thick');
    const colorInput = document.getElementById('prop-div-color');

    if (btnHoriz && btnVert) {
        btnHoriz.addEventListener('click', () => {
            el.classList.remove('vertical');
            el.classList.add('horizontal');
            wrapper.style.width = '100%';
            el.style.height = (thickSlider ? thickSlider.value : 2) + 'px';
            el.style.width = (lengthSlider ? lengthSlider.value : 100) + 'px';
            btnHoriz.classList.add('active');
            btnVert.classList.remove('active');
            showProperties(wrapper);
        });

        btnVert.addEventListener('click', () => {
            el.classList.remove('horizontal');
            el.classList.add('vertical');
            wrapper.style.width = 'auto';
            wrapper.style.display = 'inline-block';
            el.style.width = (thickSlider ? thickSlider.value : 2) + 'px';
            el.style.height = (lengthSlider ? lengthSlider.value : 100) + 'px';
            btnVert.classList.add('active');
            btnHoriz.classList.remove('active');
            showProperties(wrapper);
        });
    }

    if (styleSelect) {
        styleSelect.addEventListener('change', () => {
            el.classList.remove('solid', 'dashed', 'dotted', 'double', 'gradient-line');
            el.classList.add(styleSelect.value);
            const currentColor = colorInput ? colorInput.value : '#cbd5e1';
            el.style.backgroundColor = currentColor;
            el.style.borderColor = currentColor;
        });
    }

    if (lengthSlider) {
        lengthSlider.addEventListener('input', () => {
            valLength.innerText = lengthSlider.value + 'px';
            if (el.classList.contains('vertical')) {
                el.style.height = lengthSlider.value + 'px';
            } else {
                el.style.width = lengthSlider.value + 'px';
            }
        });
    }

    if (thickSlider) {
        thickSlider.addEventListener('input', () => {
            valThick.innerText = thickSlider.value + 'px';
            if (el.classList.contains('vertical')) {
                el.style.width = thickSlider.value + 'px';
            } else {
                el.style.height = thickSlider.value + 'px';
            }
        });
    }

    if (colorInput) {
        colorInput.addEventListener('input', () => {
            el.style.backgroundColor = colorInput.value;
            el.style.borderColor = colorInput.value;
        });
    }

    document.querySelectorAll('.color-swatches-grid[data-target="div-color"] button[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.dataset.color;
            el.style.backgroundColor = chosen;
            el.style.borderColor = chosen;
            if (colorInput) colorInput.value = chosen;
        });
    });
}

function bindImagePropertiesEvents(wrapper, el) {
    const imgFile = document.getElementById('prop-image-file');
    const imgUrl = document.getElementById('prop-image-url');
    const widthSlider = document.getElementById('prop-img-width');
    const valWidth = document.getElementById('val-img-width');
    const heightSlider = document.getElementById('prop-img-height');
    const valHeight = document.getElementById('val-img-height');
    const radiusSlider = document.getElementById('prop-img-radius');
    const valRadius = document.getElementById('val-img-radius');
    const borderColorInput = document.getElementById('prop-img-border-color');
    const borderWidthSlider = document.getElementById('prop-img-border-width');
    const valBorderWidth = document.getElementById('val-img-border-width');

    if (imgFile) {
        imgFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    el.src = event.target.result;
                    if (imgUrl) imgUrl.value = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (imgUrl) {
        imgUrl.addEventListener('input', () => {
            el.src = imgUrl.value;
        });
    }

    document.querySelectorAll('.toggle-group button[data-img-align]').forEach(btn => {
        btn.addEventListener('click', () => {
            const align = btn.dataset.imgAlign;
            wrapper.style.textAlign = align;
            if (align === 'center') {
                el.style.display = 'inline-block';
                el.style.margin = '0 auto';
            } else if (align === 'left') {
                el.style.display = 'inline-block';
                el.style.margin = '0 0 0 auto';
            } else {
                el.style.display = 'inline-block';
                el.style.margin = '0';
            }
            showProperties(wrapper);
        });
    });

    if (widthSlider) {
        widthSlider.addEventListener('input', () => {
            el.style.width = widthSlider.value + 'px';
            if (valWidth) valWidth.innerText = widthSlider.value + 'px';
        });
    }

    if (heightSlider) {
        heightSlider.addEventListener('input', () => {
            el.style.height = heightSlider.value + 'px';
            if (valHeight) valHeight.innerText = heightSlider.value + 'px';
        });
    }

    if (radiusSlider) {
        radiusSlider.addEventListener('input', () => {
            el.style.borderRadius = radiusSlider.value + 'px';
            if (valRadius) valRadius.innerText = radiusSlider.value + 'px';
        });
    }

    if (borderColorInput) {
        borderColorInput.addEventListener('input', () => {
            el.style.borderColor = borderColorInput.value;
            el.style.borderStyle = 'solid';
        });
    }

    document.querySelectorAll('.color-swatches-grid[data-target="img-border"] button[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.dataset.color;
            el.style.borderColor = chosen;
            el.style.borderStyle = 'solid';
            if (borderColorInput) borderColorInput.value = chosen;
        });
    });

    if (borderWidthSlider) {
        borderWidthSlider.addEventListener('input', () => {
            el.style.borderWidth = borderWidthSlider.value + 'px';
            el.style.borderStyle = 'solid';
            if (valBorderWidth) valBorderWidth.innerText = borderWidthSlider.value + 'px';
        });
    }
}

function showPageProperties(pageElement) {
    if (!pageElement) return;

    document.querySelectorAll('.cv-page').forEach(p => p.classList.remove('selected-page'));
    pageElement.classList.add('selected-page');

    const computed = window.getComputedStyle(pageElement);
    let splitBand = pageElement.querySelector('.page-split-band');

    let html = `<h4>خصائص الورقة والصفحة: <span style="color:#e94560;">(صفحة ${pageElement.dataset.page || '1'})</span></h4>`;

    // 1. نمط الهيكل والتصميم العام للورقة
    html += `
    <div class="prop-group">
        <label>تخطيط هيكل الصفحة (Layout):</label>
        <select id="prop-page-layout">
            <option value="single" ${AppState.canvas.classList.contains('layout-single') ? 'selected' : ''}>عمود واحد (Standard)</option>
            <option value="two-column" ${AppState.canvas.classList.contains('layout-two-column') ? 'selected' : ''}>عمودان شريط جانبي (Two Columns)</option>
            <option value="header-banner" ${AppState.canvas.classList.contains('layout-header-banner') ? 'selected' : ''}>ترويسة + عمودين (Banner + Columns)</option>
        </select>
    </div>

    <div class="prop-group">
        <label>نمط وتصميم السيرة الذاتية (Theme):</label>
        <select id="prop-page-style">
            <option value="modern" ${AppState.canvas.classList.contains('style-modern') ? 'selected' : ''}>عصري (Modern)</option>
            <option value="classic" ${AppState.canvas.classList.contains('style-classic') ? 'selected' : ''}>كلاسيكي (Classic)</option>
            <option value="minimal" ${AppState.canvas.classList.contains('style-minimal') ? 'selected' : ''}>بسيط (Minimalist)</option>
            <option value="creative" ${AppState.canvas.classList.contains('style-creative') ? 'selected' : ''}>إبداعي (Creative)</option>
            <option value="executive" ${AppState.canvas.classList.contains('style-executive') ? 'selected' : ''}>تنفيذي فاخر (Executive)</option>
            <option value="emerald" ${AppState.canvas.classList.contains('style-emerald') ? 'selected' : ''}>زمردي أنيق (Emerald)</option>
            <option value="darktech" ${AppState.canvas.classList.contains('style-darktech') ? 'selected' : ''}>تقني مظلم (Dark Cyber)</option>
            <option value="warm" ${AppState.canvas.classList.contains('style-warm') ? 'selected' : ''}>دافئ وذهبي (Warm Gold)</option>
        </select>
    </div>`;

    // 2. لون خلفية الصفحة
    const pageBgHex = rgbToHex(computed.backgroundColor);
    html += `
    <div class="prop-section-title">تلوين خلفية الورقة والتدرجات</div>
    <div class="prop-group">
        <label>لون خلفية الورقة (Page Background):</label>
        <div class="color-picker-row">
            <input type="color" id="prop-page-bg" value="${pageBgHex}">
            <button type="button" class="transparent-btn" id="prop-page-reset-bg">افتراضي أبيض</button>
            <div class="color-swatches-grid" data-target="page-bg">
                ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
            </div>
        </div>
    </div>`;

    // 3. تدرجات خلفيات جاهزة Gradients
    html += `
    <div class="prop-group">
        <label>تدرجات خلفيات احترافية جاهزة:</label>
        <div class="toggle-group">
            ${PageGradientsPresets.map((g, i) => `<button type="button" class="toggle-btn" style="background:${g.val}; color:#1e293b; text-shadow:0 1px 2px #fff;" data-grad="${g.val}">${g.name}</button>`).join('')}
        </div>
    </div>`;

    // 4. أداة تقسيم وتلوين شريط جانبي مقتطع (Side/Top Color Band Splitter)
    const hasBand = !!splitBand;
    html += `
    <div class="prop-section-title">تلوين وتقسيم جزء مقتطع من الصفحة</div>
    <div class="prop-group">
        <label>تفعيل شريط خلفية مقسم (Split Band):</label>
        <div class="toggle-group">
            <button type="button" class="toggle-btn ${hasBand ? 'active' : ''}" id="btn-toggle-band">${hasBand ? 'مُفعل' : 'غير مفعل'}</button>
        </div>
    </div>`;

    if (hasBand) {
        const isLeft = splitBand.classList.contains('pos-left');
        const isTop = splitBand.classList.contains('pos-top');
        const isW25 = splitBand.classList.contains('band-w-25');
        const isW50 = splitBand.classList.contains('band-w-50');

        html += `
        <div class="prop-group">
            <label>موقع الجزء المقتطع:</label>
            <div class="toggle-group">
                <button type="button" class="toggle-btn ${(!isLeft && !isTop && !splitBand.classList.contains('pos-bottom')) ? 'active' : ''}" id="band-pos-right">يمين (Right)</button>
                <button type="button" class="toggle-btn ${isLeft ? 'active' : ''}" id="band-pos-left">يسار (Left)</button>
                <button type="button" class="toggle-btn ${isTop ? 'active' : ''}" id="band-pos-top">أعلى (Top Banner)</button>
                <button type="button" class="toggle-btn ${splitBand.classList.contains('pos-bottom') ? 'active' : ''}" id="band-pos-bottom">أسفل (Bottom Banner)</button>
            </div>
        </div>

        <div class="prop-group">
            <label>نسبة مقتطع التقسيم:</label>
            <div class="toggle-group">
                <button type="button" class="toggle-btn ${isW25 ? 'active' : ''}" id="band-w-25">ربع (25%)</button>
                <button type="button" class="toggle-btn ${(!isW25 && !isW50) ? 'active' : ''}" id="band-w-33">ثلث (33%)</button>
                <button type="button" class="toggle-btn ${isW50 ? 'active' : ''}" id="band-w-50">نصف (50%)</button>
            </div>
        </div>

        <div class="prop-group">
            <label>لون الجزء المقتطع:</label>
            <div class="color-picker-row">
                <input type="color" id="prop-band-bg" value="${rgbToHex(splitBand.style.backgroundColor || '#e94560')}">
                <div class="color-swatches-grid" data-target="band-bg">
                    ${ColorPaletteSwatches.map(c => `<button type="button" class="color-swatch-btn" style="background:${c};" data-color="${c}"></button>`).join('')}
                </div>
            </div>
        </div>`;
    }

    // 5. مسافات الصفحة Padding Slider
    const currentPadding = parseInt(computed.padding) || 44;
    html += `
    <div class="prop-group">
        <label>مسافة حواف الورقة (Padding): <span class="prop-val-badge" id="val-page-pad">${currentPadding}px</span></label>
        <div class="prop-slider-wrapper">
            <input type="range" id="prop-page-pad" min="10" max="80" value="${currentPadding}">
        </div>
    </div>`;

    AppState.propContent.innerHTML = html;
    bindPagePropertiesEvents(pageElement);
}

function bindPagePropertiesEvents(pageElement) {
    const pageLayoutSelect = document.getElementById('prop-page-layout');
    const pageStyleSelect = document.getElementById('prop-page-style');
    const pageBgInput = document.getElementById('prop-page-bg');
    const resetBgBtn = document.getElementById('prop-page-reset-bg');

    if (pageLayoutSelect) {
        pageLayoutSelect.addEventListener('change', () => {
            const currentLayout = pageLayoutSelect.value;
            AppState.canvas.classList.remove('layout-single', 'layout-two-column', 'layout-header-banner');
            AppState.canvas.classList.add('layout-' + currentLayout);
            if (AppState.layoutSelect) AppState.layoutSelect.value = currentLayout;
        });
    }

    if (pageStyleSelect) {
        pageStyleSelect.addEventListener('change', () => {
            const currentStyle = pageStyleSelect.value;
            AppState.canvas.classList.remove(
                'style-modern', 'style-classic', 'style-minimal', 
                'style-creative', 'style-executive', 'style-emerald', 
                'style-darktech', 'style-warm'
            );
            AppState.canvas.classList.add('style-' + currentStyle);
            if (AppState.styleSelect) AppState.styleSelect.value = currentStyle;
        });
    }

    if (pageBgInput) {
        pageBgInput.addEventListener('input', () => {
            pageElement.style.background = pageBgInput.value;
        });
    }

    if (resetBgBtn) {
        resetBgBtn.addEventListener('click', () => {
            pageElement.style.background = '#ffffff';
        });
    }

    document.querySelectorAll('.color-swatches-grid[data-target="page-bg"] button[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            pageElement.style.background = btn.dataset.color;
            if (pageBgInput) pageBgInput.value = btn.dataset.color;
        });
    });

    document.querySelectorAll('button[data-grad]').forEach(btn => {
        btn.addEventListener('click', () => {
            pageElement.style.background = btn.dataset.grad;
        });
    });

    const toggleBandBtn = document.getElementById('btn-toggle-band');
    if (toggleBandBtn) {
        toggleBandBtn.addEventListener('click', () => {
            let band = pageElement.querySelector('.page-split-band');
            if (band) {
                band.remove();
            } else {
                band = document.createElement('div');
                band.className = 'page-split-band pos-right band-w-33';
                pageElement.insertBefore(band, pageElement.firstChild);
            }
            showPageProperties(pageElement);
        });
    }

    const bandRight = document.getElementById('band-pos-right');
    const bandLeft = document.getElementById('band-pos-left');
    const bandTop = document.getElementById('band-pos-top');
    const bandBottom = document.getElementById('band-pos-bottom');
    const bandW25 = document.getElementById('band-w-25');
    const bandW33 = document.getElementById('band-w-33');
    const bandW50 = document.getElementById('band-w-50');
    const bandBgInput = document.getElementById('prop-band-bg');

    const band = pageElement.querySelector('.page-split-band');
    if (band) {
        if (bandRight) {
            bandRight.addEventListener('click', () => {
                band.classList.remove('pos-left', 'pos-top', 'pos-bottom');
                band.classList.add('pos-right');
                showPageProperties(pageElement);
            });
        }
        if (bandLeft) {
            bandLeft.addEventListener('click', () => {
                band.classList.remove('pos-right', 'pos-top', 'pos-bottom');
                band.classList.add('pos-left');
                showPageProperties(pageElement);
            });
        }
        if (bandTop) {
            bandTop.addEventListener('click', () => {
                band.classList.remove('pos-right', 'pos-left', 'pos-bottom');
                band.classList.add('pos-top');
                showPageProperties(pageElement);
            });
        }
        if (bandBottom) {
            bandBottom.addEventListener('click', () => {
                band.classList.remove('pos-right', 'pos-left', 'pos-top');
                band.classList.add('pos-bottom');
                showPageProperties(pageElement);
            });
        }

        if (bandW25) {
            bandW25.addEventListener('click', () => {
                band.classList.remove('band-w-33', 'band-w-50');
                band.classList.add('band-w-25');
                showPageProperties(pageElement);
            });
        }
        if (bandW33) {
            bandW33.addEventListener('click', () => {
                band.classList.remove('band-w-25', 'band-w-50');
                band.classList.add('band-w-33');
                showPageProperties(pageElement);
            });
        }
        if (bandW50) {
            bandW50.addEventListener('click', () => {
                band.classList.remove('band-w-25', 'band-w-33');
                band.classList.add('band-w-50');
                showPageProperties(pageElement);
            });
        }

        if (bandBgInput) {
            bandBgInput.addEventListener('input', () => {
                band.style.background = bandBgInput.value;
            });
        }

        document.querySelectorAll('.color-swatches-grid[data-target="band-bg"] button[data-color]').forEach(btn => {
            btn.addEventListener('click', () => {
                band.style.background = btn.dataset.color;
                if (bandBgInput) bandBgInput.value = btn.dataset.color;
            });
        });
    }

    const pagePadSlider = document.getElementById('prop-page-pad');
    const valPagePad = document.getElementById('val-page-pad');
    if (pagePadSlider) {
        pagePadSlider.addEventListener('input', () => {
            pageElement.style.padding = pagePadSlider.value + 'px';
            if (valPagePad) valPagePad.innerText = pagePadSlider.value + 'px';
        });
    }
}

function bindPropertiesEvents(wrapper, el) {
    const type = wrapper.dataset.type;

    // 1. تحديث المحتوى حسب نوع العنصر
    if (type === 'experience') {
        const expHeader = document.getElementById('prop-exp-header');
        const expDate = document.getElementById('prop-exp-date');
        const expDesc = document.getElementById('prop-exp-desc');

        const updateExp = () => {
            const hVal = expHeader ? expHeader.value : 'المسمّى الوظيفي - اسم الشركة';
            const dVal = expDate ? expDate.value : '2021 - الحالي';
            const descVal = expDesc ? expDesc.value : 'وصف الإنجازات...';

            const parts = hVal.split('-');
            const titlePart = parts[0] ? parts[0].trim() : hVal;
            const compPart = parts[1] ? parts[1].trim() : '';

            el.innerHTML = `<strong>${titlePart}</strong>${compPart ? ' - ' + compPart : ''}<br><span style="opacity:0.8; font-size:0.9em;">${dVal}</span><p>${descVal}</p>`;
        };

        if (expHeader) expHeader.addEventListener('input', updateExp);
        if (expDate) expDate.addEventListener('input', updateExp);
        if (expDesc) expDesc.addEventListener('input', updateExp);
    } else if (type === 'education') {
        const eduDeg = document.getElementById('prop-edu-degree');
        const eduSub = document.getElementById('prop-edu-subtitle');

        const updateEdu = () => {
            const deg = eduDeg ? eduDeg.value : 'درجة البكالوريوس';
            const sub = eduSub ? eduSub.value : 'اسم الجامعة | 2017 - 2021';
            el.innerHTML = `<strong>${deg}</strong><br><span style="opacity:0.8; font-size:0.9em;">${sub}</span>`;
        };

        if (eduDeg) eduDeg.addEventListener('input', updateEdu);
        if (eduSub) eduSub.addEventListener('input', updateEdu);
    } else if (type === 'skills') {
        const skillsListInput = document.getElementById('prop-skills-list');
        const tagColorInput = document.getElementById('prop-tag-color');
        const tagBgInput = document.getElementById('prop-tag-bg');

        if (skillsListInput) {
            skillsListInput.addEventListener('input', () => {
                const tagsArr = skillsListInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                if (tagsArr.length === 0) return;

                const firstTag = el.querySelector('.cv-skill-tag');
                const tColor = firstTag ? firstTag.style.color : '';
                const tBg = firstTag ? firstTag.style.backgroundColor : '';

                el.innerHTML = tagsArr.map(t => {
                    const styleAttr = (tColor || tBg) 
                        ? `style="${tColor ? 'color:'+tColor+';' : ''}${tBg ? 'background-color:'+tBg+';' : ''}"`
                        : '';
                    return `<span class="cv-skill-tag" contenteditable="true" ${styleAttr}>${t}</span>`;
                }).join(' ');
            });
        }

        if (tagColorInput) {
            tagColorInput.addEventListener('input', () => {
                const chosen = tagColorInput.value;
                el.querySelectorAll('.cv-skill-tag').forEach(t => t.style.color = chosen);
            });
        }

        if (tagBgInput) {
            tagBgInput.addEventListener('input', () => {
                const chosen = tagBgInput.value;
                el.querySelectorAll('.cv-skill-tag').forEach(t => t.style.backgroundColor = chosen);
            });
        }

        document.querySelectorAll('.color-swatches-grid[data-target="tag-color"] button[data-color]').forEach(btn => {
            btn.addEventListener('click', () => {
                const chosen = btn.dataset.color;
                el.querySelectorAll('.cv-skill-tag').forEach(t => t.style.color = chosen);
                if (tagColorInput) tagColorInput.value = chosen;
            });
        });

        document.querySelectorAll('.color-swatches-grid[data-target="tag-bg"] button[data-color]').forEach(btn => {
            btn.addEventListener('click', () => {
                const chosen = btn.dataset.color;
                el.querySelectorAll('.cv-skill-tag').forEach(t => t.style.backgroundColor = chosen);
                if (tagBgInput) tagBgInput.value = chosen;
            });
        });
    } else if (type === 'link') {
        const linkTextInput = document.getElementById('prop-link-text');
        const linkUrlInput = document.getElementById('prop-link-url');
        const linkTargetBtn = document.getElementById('prop-link-target');

        if (linkTextInput) {
            linkTextInput.addEventListener('input', () => {
                el.innerText = linkTextInput.value;
            });
        }

        if (linkUrlInput) {
            linkUrlInput.addEventListener('input', () => {
                let urlVal = linkUrlInput.value.trim();
                if (urlVal && !urlVal.startsWith('http://') && !urlVal.startsWith('https://') && !urlVal.startsWith('mailto:') && !urlVal.startsWith('tel:') && !urlVal.startsWith('#')) {
                    urlVal = 'https://' + urlVal;
                }
                el.setAttribute('href', urlVal || '#');
            });
        }

        if (linkTargetBtn) {
            linkTargetBtn.addEventListener('click', () => {
                const isBlank = el.getAttribute('target') === '_blank';
                if (isBlank) {
                    el.removeAttribute('target');
                    linkTargetBtn.classList.remove('active');
                    linkTargetBtn.innerText = 'نفس النافذة (_self)';
                } else {
                    el.setAttribute('target', '_blank');
                    linkTargetBtn.classList.add('active');
                    linkTargetBtn.innerText = 'نافذة جديدة (_blank)';
                }
            });
        }
    } else {
        const textContent = document.getElementById('prop-text-content');
        if (textContent) {
            textContent.addEventListener('input', () => {
                el.innerText = textContent.value;
            });
        }
    }

    // 2. أزرار العرض Flex Width
    document.querySelectorAll('.toggle-group button[data-w]').forEach(btn => {
        btn.addEventListener('click', () => {
            wrapper.classList.remove('w-100', 'w-50', 'w-33', 'w-25');
            wrapper.classList.add(btn.dataset.w);
            showProperties(wrapper);
        });
    });

    // 3. الخطوط
    const fontFamilySelect = document.getElementById('prop-font-family');
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', () => {
            el.style.fontFamily = fontFamilySelect.value;
        });
    }

    // 4. حجم الخط
    const fontSizeSlider = document.getElementById('prop-font-size');
    const valFontSize = document.getElementById('val-font-size');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', () => {
            const val = fontSizeSlider.value + 'px';
            el.style.fontSize = val;
            if (valFontSize) valFontSize.innerText = val;
            el.querySelectorAll('.cv-skill-tag').forEach(t => t.style.fontSize = val);
        });
    }

    // 5. لون النص ولون الخلفية الرئيسي للعنصر
    const colorInput = document.getElementById('prop-color');
    if (colorInput) {
        colorInput.addEventListener('input', () => {
            const chosen = colorInput.value;
            el.style.color = chosen;
            // إزالة أي ألوان صريحة من الوسوم الفرعية بداخل العنصر لكي ترث لون النص الرئيسي
            el.querySelectorAll('*').forEach(child => {
                if (!child.classList.contains('cv-skill-tag')) {
                    child.style.color = 'inherit';
                }
            });
        });
    }

    const bgColorInput = document.getElementById('prop-bg-color');
    if (bgColorInput) {
        bgColorInput.addEventListener('input', () => {
            el.style.backgroundColor = bgColorInput.value;
        });
    }

    const bgTransparentBtn = document.getElementById('prop-bg-transparent');
    if (bgTransparentBtn) {
        bgTransparentBtn.addEventListener('click', () => {
            el.style.backgroundColor = 'transparent';
        });
    }

    // Swatches
    document.querySelectorAll('.color-swatches-grid button[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.parentNode.dataset.target;
            const chosenColor = btn.dataset.color;
            if (target === 'color') {
                el.style.color = chosenColor;
                el.querySelectorAll('*').forEach(child => {
                    if (!child.classList.contains('cv-skill-tag')) {
                        child.style.color = 'inherit';
                    }
                });
                if (colorInput) colorInput.value = chosenColor;
            } else if (target === 'bg') {
                el.style.backgroundColor = chosenColor;
                if (bgColorInput) bgColorInput.value = chosenColor;
            }
        });
    });

    // 6. محاذاة النص
    document.querySelectorAll('.toggle-group button[data-align]').forEach(btn => {
        btn.addEventListener('click', () => {
            el.style.textAlign = btn.dataset.align;
            showProperties(wrapper);
        });
    });

    // 7. الهوامش Sliders
    const paddingSlider = document.getElementById('prop-padding');
    const valPadding = document.getElementById('val-padding');
    if (paddingSlider) {
        paddingSlider.addEventListener('input', () => {
            el.style.padding = paddingSlider.value + 'px';
            if (valPadding) valPadding.innerText = paddingSlider.value + 'px';
        });
    }

    const marginSlider = document.getElementById('prop-margin');
    const valMargin = document.getElementById('val-margin');
    if (marginSlider) {
        marginSlider.addEventListener('input', () => {
            wrapper.style.marginBottom = marginSlider.value + 'px';
            if (valMargin) valMargin.innerText = marginSlider.value + 'px';
        });
    }
}

function showEmptyProperties() {
    AppState.propContent.innerHTML = '<p style="color:#64748b; font-size:13px; text-align:center; padding-top:20px;">انقر على أي عنصر أو على خلفية ورقة الصفحة لتخصيص خصائصها المظهرية وتلوين أجزائها بالكامل.</p>';
}

function getElementLabel(type) {
    const labels = {
        header: 'عنوان رئيسي (H1)',
        section: 'عنوان قسم (H2)',
        text: 'فقرة نصية',
        divider: '📏 خط فاصل أنيق',
        experience: 'عنصر خبرة عملية',
        education: 'عنصر تعليم ومؤهل',
        skills: 'قائمة مهارات (Tags)',
        link: 'رابط خارجي',
        image: 'صورة شخصية'
    };
    return labels[type] || type;
}

function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return '#ffffff';
    return '#' + [match[1], match[2], match[3]].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

window.PropertiesManager = {
    showProperties,
    showPageProperties,
    showEmptyProperties,
    getElementLabel,
    rgbToHex
};
