// https://forkify-api.herokuapp.com/v2
import 'core-js/stable'; // polifilling everything except async await
import 'regenerator-runtime/runtime'; //async await polifilling
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import newRecipeView from './views/newRecipeView.js';
import { CLOSE_WINDOW_SEC } from './config.js';
// if (module.hot) {module.hot.accept()};
///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Loading spinner
    recipeView.renderSpinner();
    //0. Update results and bookmarks view  to mark selected  results
    resultView.update(model.loadSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1. Loading recipe
    await model.loadRecipe(id);
    //2. render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    //0. Loading spinner
    resultView.renderSpinner();
    //1. load search result
    await model.loadSearchResults(query);
    //2. render results
    resultView.render(model.loadSearchResultsPage());
    // 3. render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (pageNew) {
  //2. render NEW results
  resultView.render(model.loadSearchResultsPage(pageNew));
  // 3. render NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update servings in state
  model.updateServings(newServings);
  //Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlNewRecipe = async function (newRecipe) {
  try {
    // Loading spinner
    newRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    newRecipeView.renderMessage();
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close form Window
    setTimeout(function () {
      newRecipeView.toggleWindow();
      location.reload();
    }, CLOSE_WINDOW_SEC * 1000);
  } catch (err) {
    newRecipeView.renderErrorMessage(err.message);
    location.reload();
  }
};

const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  newRecipeView.addHandlerUpload(controlNewRecipe);
};
init();
