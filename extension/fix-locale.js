/* e-Tax Dojo Japanese Locale Fix – runs in MAIN world at document_start. */
(() => {
  'use strict';

  const PREFIX = '[e-Tax Dojo Locale Fix]';
  const locale = 'ja';
  const browserLocale = 'ja-JP';

  // Legacy Dojo may inspect these Navigator properties during bootstrap.
  // Override only inside this document; Chrome's actual UI language is untouched.
  const replacements = {
    language: browserLocale,
    languages: Object.freeze([browserLocale, locale]),
    userLanguage: browserLocale,
    browserLanguage: browserLocale
  };

  for (const [key, value] of Object.entries(replacements)) {
    try {
      Object.defineProperty(Navigator.prototype, key, {
        configurable: true,
        enumerable: true,
        get: () => value
      });
    } catch (error) {
      console.warn(PREFIX, `Could not override navigator.${key}:`, error);
    }
  }

  // Dojo 1.x reads dojoConfig (or the older djConfig) BEFORE loading dojo.js.
  // Reuse a preexisting config object when it is available.
  const config = (window.dojoConfig && typeof window.dojoConfig === 'object')
    ? window.dojoConfig
    : ((window.djConfig && typeof window.djConfig === 'object') ? window.djConfig : {});

  config.locale = locale;
  config.extraLocale = [];
  window.dojoConfig = config;
  window.djConfig = config;

  // A simple marker to verify that this script ran in the current frame.
  window.__etaxLocaleFix = {
    applied: true,
    locale,
    browserLocale,
    href: location.href
  };

  console.info(PREFIX, 'Applied before Dojo initialization', window.__etaxLocaleFix);
})();
