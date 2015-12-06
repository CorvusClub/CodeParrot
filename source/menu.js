class Menu {
  constructor(element, codeMirror) {
    this.element = element;
    this.codeMirror = codeMirror;
    this.themeSelector = this.element.querySelector(".theme");
    this.themeSelector.addEventListener("change", (event) => {
      let theme = this.themeSelector.value;
      this.codeMirror.setOption({theme});
    });
  }
}

module.exports = Menu;
