class Menu {
  constructor(element, codeMirror) {
    this.element = element;
    this.codeMirror = codeMirror;
    this.themeSelector = this.element.querySelector(".theme");
    this.themeSelector.addEventListener("change", (event) => {
      let theme = this.themeSelector.value;
      this.codeMirror.setOption({theme});
    });
    this.languages = this.element.querySelector('.language');
    for (let lang of CodeMirror.modeInfo) {
      let nextMode = document.createElement('option');
      nextMode.value = lang.mode;
      nextMode.text = lang.name;
      this.languages.appendChild(nextMode);
    }

    this.languages.addEventListener("change", (event) => {
      let languageChoice = this.languages.value;
      if (CodeMirror.modes[languageChoice]) {
        console.log("CodeMirror mode already loaded!", languageChoice);
      } else {
        console.log("CodeMirror not loaded, embedding script tag...", languageChoice);
      }
    });

  }
}

module.exports = Menu;
