export default class Section {
  constructor({ items, renderer }, selector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(selector);
  }

  renderItems(items) {
    console.log(
      "🔄 Section.renderItems llamado con",
      items?.length,
      "elementos",
    );

    items.forEach((item) => {
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
