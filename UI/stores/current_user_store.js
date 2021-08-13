var Store = require('flux/utils').Store;

var AppDispatcher = require('../dispatcher/dispatcher'),
    CurrentUserConstants = require('../constants/current_user_constants'),
    UserConstants = require('../constants/user_constants');

var _currentUser = {},
    _currentUserHasBeenFetched = false;

var CurrentUserStore = new Store(AppDispatcher);

CurrentUserStore.currentUser = function () {

  return $.extend({}, _currentUser);
};

CurrentUserStore.isLoggedIn = function () {
  return !!_currentUser.id;
};

CurrentUserStore.removeCurrentUser = function () {
  _currentUser = {};
  _currentUserHasBeenFetched = false;
};

CurrentUserStore.addCurrentUser = function (currentUser) {
  _currentUserHasBeenFetched = true;
  _currentUser = currentUser;
};

CurrentUserStore.userHasBeenFetched = function () {
  return _currentUserHasBeenFetched;
};

CurrentUserStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case CurrentUserConstants.REMOVE_CURRENT_USER:
      CurrentUserStore.removeCurrentUser();
      CurrentUserStore.__emitChange();
      break;
    case CurrentUserConstants.RECEIVE_CURRENT_USER:
      CurrentUserStore.addCurrentUser(payload.currentUser);
      CurrentUserStore.__emitChange();
      break;
    case UserConstants.RECEIVE_USER_UPDATE:
      CurrentUserStore.addCurrentUser(payload.user);
      CurrentUserStore.__emitChange();
      break;
  }
};

module.exports = CurrentUserStore;
