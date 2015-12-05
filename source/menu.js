class Menu {
  constructor(element) {
    this.element = element;
    this.themeSelector = this.element.querySelector(".theme");
    this.themeSelector.addEventListener("change", (event) => {
      document.body.className = this.themeSelector.value;
    });
  }
}

module.exports = Menu;
