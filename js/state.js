/**
 * js/state.js - State Management Module
 * إدارة الحالة العامة والملاحظات المشتركة
 */
const AppState = {
    selectedWrapper: null,
    draggedType: null,
    pageCounter: 1,
    elementUniqueId: 0,
    eventsRules: [],
    isPreviewMode: false,
    
    // DOM Elements Cache
    canvas: null,
    emptyState: null,
    propertiesPanel: null,
    propContent: null,
    layoutSelect: null,
    styleSelect: null,
    previewBtn: null,
    exportPdfBtn: null,
    exportBtn: null,
    clearBtn: null,
    addPageBtn: null,
    
    // Event Builder DOM Elements
    evSourceSelect: null,
    evActionSelect: null,
    evTargetSelect: null,
    evEffectSelect: null,
    evValuePickerContainer: null,
    addEventRuleBtn: null,
    eventsRulesList: null,

    init() {
        this.canvas = document.getElementById('cv-canvas');
        this.emptyState = document.getElementById('empty-state');
        this.propertiesPanel = document.getElementById('properties-panel');
        this.propContent = document.getElementById('prop-content');
        this.layoutSelect = document.getElementById('layout-select');
        this.styleSelect = document.getElementById('style-select');
        this.previewBtn = document.getElementById('preview-btn');
        this.exportPdfBtn = document.getElementById('export-pdf-btn');
        this.exportBtn = document.getElementById('export-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.addPageBtn = document.getElementById('add-page-btn');

        this.evSourceSelect = document.getElementById('ev-source-select');
        this.evActionSelect = document.getElementById('ev-action-select');
        this.evTargetSelect = document.getElementById('ev-target-select');
        this.evEffectSelect = document.getElementById('ev-effect-select');
        this.evValuePickerContainer = document.getElementById('ev-value-picker-container');
        this.addEventRuleBtn = document.getElementById('add-event-rule-btn');
        this.eventsRulesList = document.getElementById('events-rules-list');
    }
};

window.AppState = AppState;
