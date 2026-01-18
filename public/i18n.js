// ==========================================
// INTERNATIONALIZATION (i18n)
// Traduções completas carregadas de arquivos JSON
// ==========================================

// Cache para as traduções
const I18N = {};

// Idiomas suportados
const SUPPORTED_LANGS = ['pt-BR', 'en', 'es', 'de'];

// Idioma padrão
let currentLang = localStorage.getItem('language') || 'pt-BR';

// Flag para indicar se as traduções estão carregadas
let translationsReady = false;

// Função para carregar traduções de arquivo JSON
async function loadTranslations(lang) {
    if (I18N[lang]) {
        return I18N[lang];
    }
    
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();
        I18N[lang] = translations;
        return translations;
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        return {};
    }
}

// Pré-carregar todas as traduções
async function preloadAllTranslations() {
    const promises = SUPPORTED_LANGS.map(lang => loadTranslations(lang));
    await Promise.all(promises);
    translationsReady = true;
    console.log('All translations preloaded:', Object.keys(I18N));
}

// Função para obter texto traduzido
function t(key) {
    const translations = I18N[currentLang] || I18N['pt-BR'] || {};
    return translations[key] || key;
}

// Função para aplicar traduções na página
function applyI18nStrings() {
    const translations = I18N[currentLang] || {};
    
    if (Object.keys(translations).length === 0) {
        console.warn('No translations found for:', currentLang);
        return;
    }
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[key];
        
        if (translation && typeof translation === 'string') {
            el.textContent = translation;
        }
    });
    
    // Também aplicar em placeholders se existirem
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = translations[key];
        
        if (translation && typeof translation === 'string') {
            el.setAttribute('placeholder', translation);
        }
    });
    
    console.log('Applied translations for:', currentLang, '- Elements updated:', document.querySelectorAll('[data-i18n]').length);
}

// Função principal para trocar idioma (SÍNCRONA se traduções já carregadas)
function changeLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
        console.warn('Unsupported language:', lang);
        return;
    }
    
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Se as traduções já estiverem carregadas, aplicar imediatamente
    if (I18N[lang]) {
        applyI18nStrings();
        document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : lang;
        console.log(`Language changed to: ${lang}`);
    } else {
        // Carregar e depois aplicar (fallback)
        loadTranslations(lang).then(() => {
            applyI18nStrings();
            document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : lang;
            console.log(`Language changed to: ${lang} (loaded async)`);
        });
    }
}

// Inicialização - Pré-carregar TODAS as traduções
document.addEventListener('DOMContentLoaded', async () => {
    // Pré-carregar todas as traduções
    await preloadAllTranslations();
    
    // Aplicar traduções iniciais
    applyI18nStrings();
    
    console.log(`i18n initialized with language: ${currentLang}`);
});

// Exportar funções para uso global
window.changeLanguage = changeLanguage;
window.t = t;
window.I18N = I18N;
window.applyI18nStrings = applyI18nStrings;
