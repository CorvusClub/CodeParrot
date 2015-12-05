class Menu {
  constructor(element) {
    this.element = element;
    this.element.addEventListener("click", this.onClick.bind(this));
    document.body.addEventListener("click", (event) => {
      if(!this.element.contains(event.target)) {
        this.open.forEach(function(menu) { menu.classList.remove("open") });
        this.open = [];
      }
    });
    this.open = [];
  }
  onClick(event) {
    let target = event.target;
    if(target.nodeName === "LABEL") {
      target = target.nextElementSibling;
    }
    if(target.nodeName === "LI") {
      // do menu item click stuff
      return;
    }
    if(this.open.length > 0) {
      if(this.open.indexOf(target) != -1) {
        target.classList.remove("open");
        this.open.splice(this.open.indexOf(target));
        return;
      }
      this.open.forEach((openMenu) => {
        if(openMenu.parentElement.parentElement === target.parentElement.parentElement) {
          openMenu.classList.remove("open");
          this.open.splice(this.open.indexOf(openMenu));
        }
      });
    }
    target.classList.add("open");
    this.open.push(target);
  }
}

module.exports = Menu;
