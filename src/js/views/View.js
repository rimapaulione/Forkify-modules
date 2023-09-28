import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();
    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); //string

    //convert string to DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup); //document fragment
    const newElements = Array.from(newDOM.querySelectorAll('*')); //nodeList to array
    const curElements = Array.from(this._parentEl.querySelectorAll('*')); //nodeList to array

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //Update changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const html = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
  renderErrorMessage(error = this._errorMessage) {
    const html = `
        <div class="error">
          <div>
             <svg>
               <use href="${icons}#icon-alert-triangle"></use>
              </svg>
           </div>
          <p>${error}</p>
        </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
  renderMessage(message = this._message) {
    const html = `
        <div class="message">
          <div>
             <svg>
               <use href="${icons}#icon-alert-triangle"></use>
              </svg>
           </div>
          <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
}
