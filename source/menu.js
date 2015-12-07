var CodeMirror = require('codemirror');

class Menu {
  /** Locate all of the UI components on the DOM for the top menus */
  constructor(element, codeMirror) {
    this.element = element;
    this.codeMirror = codeMirror;
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
      if (!CodeMirror.modes.hasOwnProperty(languageChoice)) {
        console.log('mode %s not loaded, embedding script', languageChoice);
        let languageScript = document.createElement('script');
        languageScript.src = `code/mode/${languageChoice}/${languageChoice}.js`;
        languageScript.addEventListener('load', () => {
          this.codeMirror.setOption('mode', languageChoice);
        });
        document.querySelector('body').appendChild(languageScript);
      }
    });

    this.themeSelect();
  }

  /** Handle loading the user's desired theme */
  themeSelect() {
    let theme = this.themeSelector.value;
    if (!document.querySelector('link.' + theme)) {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = `./codemirror/theme/$(theme).css`;
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
