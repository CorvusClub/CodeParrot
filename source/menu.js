class Menu {
  constructor(element, codeMirror) {
    this.element = element;
    this.codeMirror = codeMirror;
    this.themeSelector = this.element.querySelector(".theme");
    this.themeSelector.addEventListener("change", this.themeSelect.bind(this));
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

    this.themeSelect();
  }
  themeSelect() {
    let theme = this.themeSelector.value;
    if(!document.querySelector("link." + theme)) {
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "./codemirror/theme/" + theme + ".css";
      link.className = theme;
      document.head.appendChild(link);
      link.addEventListener("load", () => {
        this.codeMirror.setOption("theme", theme);
      });
    }
    else {
      this.codeMirror.setOption("theme", theme);
    }
  }
}

module.exports = Menu;
