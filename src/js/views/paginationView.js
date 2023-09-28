import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    //Page 1 + other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
        <button data-goto="${
          this._data.page + 1
        }" class="btn--inline pagination__btn--next">
            <span> Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    //Last page
    if (this._data.page === numPages && numPages > 1) {
      return `
        <button data-goto="${
          this._data.page - 1
        }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${this._data.page - 1}</span>
        </button>
      `;
    }
    //Other pages
    if (this._data.page < numPages) {
      return `
      <button data-goto="${
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span> Page ${this._data.page - 1}</span>
      </button>
      <button data-goto="${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
      <span> Page ${this._data.page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button> 
    `;
    }
    //Only page 1
    if (this._data.page === 1) {
      return '';
    }
  }
}

export default new PaginationView();
