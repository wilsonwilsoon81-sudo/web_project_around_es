export default class Section {
  constructor({ items, renderer }, selector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(selector);
  }

  renderItems() {
    this._items.forEach((item) => {
      const element = this._renderer(item);
      if (element) {
        this._container.prepend(element);
      }
    });
  }

  addItem(element) {
    if (element) {
      this._container.prepend(element);
    }
  }
}
