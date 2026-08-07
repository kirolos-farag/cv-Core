/**
 * js/events.js - Visual Events Builder Module
 * محرك التفاعلات البصرية وإنشاء القواعد الديناميكية
 */

function updateEventsDropdowns() {
    if (!AppState.evSourceSelect || !AppState.evTargetSelect) return;

    const elements = document.querySelectorAll('.cv-element-wrapper');
    let optionsHtml = '';

    elements.forEach(wrap => {
        const id = wrap.dataset.id;
        const type = wrap.dataset.type;
        const label = window.PropertiesManager ? window.PropertiesManager.getElementLabel(type) : type;
        const textSnippet = wrap.innerText.substring(0, 15).replace(/\n/g, ' ') || label;
        optionsHtml += `<option value="${id}">${label} (${id}) - "${textSnippet}..."</option>`;
    });

    if (elements.length === 0) {
        optionsHtml = '<option value="">(لا توجد عناصر بعد)</option>';
    }

    AppState.evSourceSelect.innerHTML = optionsHtml;
    AppState.evTargetSelect.innerHTML = optionsHtml;

    setupEventValuePicker();
}

function setupEventValuePicker() {
    if (!AppState.evEffectSelect || !AppState.evValuePickerContainer) return;
    const effect = AppState.evEffectSelect.value;
    let html = '';

    if (effect === 'fontSize') {
        html = `
        <div class="prop-slider-wrapper">
            <input type="range" id="ev-val-slider" min="10" max="72" value="24" style="flex:1;">
            <span id="ev-val-badge" class="prop-val-badge">24px</span>
        </div>`;
    } else if (effect === 'color' || effect === 'backgroundColor') {
        html = `
        <div class="color-picker-row">
            <input type="color" id="ev-val-color" value="#e94560" style="width:50px; height:36px; cursor:pointer;">
            <div class="color-swatches-grid" id="ev-swatches-grid">
                <button type="button" class="color-swatch-btn" style="background:#e94560;" data-c="#e94560"></button>
                <button type="button" class="color-swatch-btn" style="background:#3b82f6;" data-c="#3b82f6"></button>
                <button type="button" class="color-swatch-btn" style="background:#10b981;" data-c="#10b981"></button>
                <button type="button" class="color-swatch-btn" style="background:#1a1a2e;" data-c="#1a1a2e"></button>
            </div>
        </div>`;
    } else if (effect === 'hide' || effect === 'show') {
        html = `<p style="font-size:11px; color:#a0aec0; margin:4px 0;">سيتم ${effect === 'hide' ? 'إخفاء' : 'إظهار'} العنصر فور حدوث التفاعل تلقائياً.</p>`;
    }

    AppState.evValuePickerContainer.innerHTML = html;

    // ربط سلايدر الأحداث والألوان
    const slider = document.getElementById('ev-val-slider');
    const badge = document.getElementById('ev-val-badge');
    if (slider && badge) {
        slider.addEventListener('input', () => {
            badge.innerText = slider.value + 'px';
        });
    }

    document.querySelectorAll('#ev-swatches-grid button[data-c]').forEach(btn => {
        btn.addEventListener('click', () => {
            const colorInput = document.getElementById('ev-val-color');
            if (colorInput) colorInput.value = btn.dataset.c;
        });
    });
}

function getSelectedEventValue() {
    const effect = AppState.evEffectSelect.value;
    if (effect === 'fontSize') {
        const slider = document.getElementById('ev-val-slider');
        return slider ? slider.value + 'px' : '24px';
    } else if (effect === 'color' || effect === 'backgroundColor') {
        const colorInput = document.getElementById('ev-val-color');
        return colorInput ? colorInput.value : '#e94560';
    } else if (effect === 'hide') {
        return 'none';
    } else if (effect === 'show') {
        return 'block';
    }
    return '';
}

function addEventRule() {
    const sourceId = AppState.evSourceSelect.value;
    const action = AppState.evActionSelect.value;
    const targetId = AppState.evTargetSelect.value;
    const effect = AppState.evEffectSelect.value;
    const value = getSelectedEventValue();

    if (!sourceId || !targetId) {
        alert('⚠️ يرجى التأكد من وجود عناصر مضافة واختيار العنصر المحفز والعنصر المتأثر!');
        return;
    }

    const rule = {
        id: 'rule_' + Date.now(),
        sourceId,
        action,
        targetId,
        effect,
        value
    };

    AppState.eventsRules.push(rule);
    renderEventsRulesList();
    applyEventRule(rule);
}

function renderEventsRulesList() {
    if (!AppState.eventsRulesList) return;

    if (AppState.eventsRules.length === 0) {
        AppState.eventsRulesList.innerHTML = '<p class="no-events-text">لا توجد تفاعلات مضافة بعد</p>';
        return;
    }

    let html = '';
    AppState.eventsRules.forEach((rule, idx) => {
        html += `
        <div class="event-rule-card">
            <div>
                <strong>تفاعل ${idx + 1}:</strong> عند <code>${rule.action}</code> -> تغيير <code>${rule.effect}</code>
                <div style="font-size:10px; color:#a0aec0;">${rule.sourceId} ⚡ ${rule.targetId}</div>
            </div>
            <button class="delete-rule-btn" data-rule-id="${rule.id}">✕</button>
        </div>`;
    });

    AppState.eventsRulesList.innerHTML = html;

    AppState.eventsRulesList.querySelectorAll('.delete-rule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ruleId = btn.dataset.rule-id;
            AppState.eventsRules = AppState.eventsRules.filter(r => r.id !== ruleId);
            renderEventsRulesList();
        });
    });
}

function applyEventRule(rule) {
    const sourceWrapper = document.querySelector(`[data-id="${rule.sourceId}"]`);
    const targetWrapper = document.querySelector(`[data-id="${rule.targetId}"]`);

    if (!sourceWrapper || !targetWrapper) return;

    const sourceEl = sourceWrapper.querySelector('.cv-element') || sourceWrapper;
    const targetEl = targetWrapper.querySelector('.cv-element') || targetWrapper;

    sourceEl.addEventListener(rule.action, () => {
        if (!AppState.isPreviewMode) return; // تعمل التفاعلات في وضع المعاينة المعروض للعميل

        if (rule.effect === 'hide') {
            targetWrapper.style.display = 'none';
        } else if (rule.effect === 'show') {
            targetWrapper.style.display = 'block';
        } else if (rule.effect === 'fontSize') {
            targetEl.style.fontSize = rule.value;
        } else if (rule.effect === 'color') {
            targetEl.style.color = rule.value;
        } else if (rule.effect === 'backgroundColor') {
            targetEl.style.backgroundColor = rule.value;
        }
    });
}

function setupEventsManager() {
    if (AppState.evEffectSelect) {
        AppState.evEffectSelect.addEventListener('change', setupEventValuePicker);
    }
    if (AppState.addEventRuleBtn) {
        AppState.addEventRuleBtn.addEventListener('click', addEventRule);
    }
}

window.EventsManager = {
    updateEventsDropdowns,
    setupEventValuePicker,
    renderEventsRulesList,
    setupEventsManager
};
