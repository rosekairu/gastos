var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var UserConstants = require('../constants/user_constants');

var _users = [];
var _usersIdx = {};

var CHANGE_EVENT = "change";

var _addUser = function (newUser) {
  _usersIdx[newUser.id] = newUser;
  _users.push(newUser);
};

var addUsers = function (users) {
  _users = users;
  users.forEach(function(user) {
    _usersIdx[user.id] = user;
  });
};

var updateUser = function (user) {
  _usersIdx[user.id] = user;
  for (var i = 0; i < _users.length; i++) {
    if (_users[i].id === user.id) {
      _users[i] = user;
      break;
    }
  }

};

var UsersStore = new Store(AppDispatcher);

UsersStore.all = function () {
  return _users.slice();
};

UsersStore.find = function (id) {
  return _usersIdx[id];
};

UsersStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case UserConstants.RECEIVE_USERS:
      addUsers(payload.users);
      UsersStore.__emitChange();
      break;
    case UserConstants.RECEIVE_USER:
      _addUser(payload.user);
      UsersStore.__emitChange();
      break;
    case UserConstants.RECEIVE_USER_UPDATE:
      updateUser(payload.user);
      UsersStore.__emitChange();
      break;
  }
};

module.exports = UsersStore;
