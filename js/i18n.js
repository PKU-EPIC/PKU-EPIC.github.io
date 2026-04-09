// 读取 URL 参数中的语言，优先于 localStorage
function getUrlLang() {
  var params = new URLSearchParams(window.location.search);
  if (params.get('lang')) return params.get('lang');
  // 兼容 #hash?lang=xx 的情况
  var hash = window.location.hash;
  var idx = hash.indexOf('?');
  if (idx !== -1) {
    var hashParams = new URLSearchParams(hash.substring(idx));
    if (hashParams.get('lang')) return hashParams.get('lang');
  }
  return null;
}
var urlLang = getUrlLang();
var currentLang = urlLang || localStorage.getItem('lang') || 'en';

// 更新语言按钮状态
function updateLangUI(lang) {
  $('.lang-btn').attr('src', lang === 'en' ? './assets/cn.png' : './assets/en.png');
}

// 翻译渲染
function renderI18n(data) {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var keys = el.getAttribute('data-i18n').split('.');
    var value = data;
    for (var i = 0; i < keys.length; i++) {
      value = value && value[keys[i]];
    }
    if (typeof value === 'string') {
      el.innerHTML = value;
    }
  });
}

// 获取语言数据
function getLangData(lang) {
  return I18N_LANG_DATA[lang] || I18N_LANG_DATA['en'];
}

// 更新跨站链接，追加 ?lang= 参数
function updateCrossSiteLinks(lang) {
  document.querySelectorAll('a[href*="hughw19.github.io"]').forEach(function (a) {
    var url = new URL(a.href);
    url.searchParams.set('lang', lang);
    a.href = url.toString();
  });
}

// 语言切换
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  updateLangUI(lang);
  renderI18n(getLangData(lang));
  updateCrossSiteLinks(lang);
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
  updateLangUI(currentLang);
  renderI18n(getLangData(currentLang));
  updateCrossSiteLinks(currentLang);

  // 如果是通过 URL 参数传入的语言，同步到 localStorage
  if (urlLang) {
    localStorage.setItem('lang', urlLang);
  }

  // 语言切换按钮绑定
  document.getElementById('global-lang-toggle').addEventListener('click', function () {
    setLang(currentLang === 'en' ? 'zh' : 'en');
  });
  document.getElementById('modal-lang-toggle').addEventListener('click', function () {
    setLang(currentLang === 'en' ? 'zh' : 'en');
  });
});
