var CodeMirror = require('codemirror');

// this is required to hotload codemirror language modules, it's nasty but it'll have to do
window.CodeMirror = CodeMirror;

class Menu {
  /** Locate all of the UI components on the DOM for the top menus */
  constructor(element, codeDocument) {
    this.element = element;
    this.codeDocument = codeDocument;
    this.codeMirror = this.codeDocument.codeMirrorInstance;
    this.themeSelector = this.element.querySelector('.theme');
    this.themeSelector.addEventListener('change', this.themeSelect.bind(this));
    this.languages = this.element.querySelector('.language');

    for (let lang of CodeMirror.modeInfo) {
      let nextMode = document.createElement('option');
      nextMode.value = lang.mode;
      nextMode.text = lang.name;
      this.languages.appendChild(nextMode);
    }

    this.languages.addEventListener('change', () => {
      let languageChoice = this.languages.value;
      this.changeLanguage(languageChoice);
      this.codeDocument.sendMessage({
        message: 'changeLanguage',
        language: this.codeDocument.language
      });
    });

    this.codeDocument.on('systemMessage', data => {
      if (data.message === 'changeLanguage') {
        this.changeLanguage(data.language);
      }
    });

    this.themeSelect();
  }
  /** Change language for syntax highlighting */
  changeLanguage(languageChoice) {
    if (this.languages.value !== languageChoice) {
      this.languages.value = languageChoice;
    }
    this.codeDocument.language = languageChoice;
    if (!CodeMirror.modes.hasOwnProperty(languageChoice)) {
      console.log('mode %s not loaded, embedding script', languageChoice);
      let languageScript = document.createElement('script');
      languageScript.src = `codemirror/mode/${languageChoice}/${languageChoice}.js`;
      languageScript.addEventListener('load', () => {
        this.codeMirror.setOption('mode', languageChoice);
      });
      document.querySelector('body').appendChild(languageScript);
    } else {
      this.codeMirror.setOption('mode', languageChoice);
    }
  }

  /** Handle loading the user's desired theme */
  themeSelect() {
    let theme = this.themeSelector.value;
    if (!document.querySelector('link.' + theme)) {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = `./codemirror/theme/${theme}.css`;
      link.className = theme;
      document.head.appendChild(link);
      link.addEventListener('load', () => {
        this.codeMirror.setOption('theme', theme);
      });
    } else {
      this.codeMirror.setOption('theme', theme);
    }
  }
}

module.exports = Menu;
