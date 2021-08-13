var UserActions = require('../actions/user_actions'),
    CurrentUserActions = require('../actions/current_user_actions'),
    FlashActions = require("../actions/flash_actions");

var UsersApiUtil = {
  fetchUsers: function () {
    $.ajax({
      url: '/api/users',
      type: 'GET',
      dataType: 'json',
      success: function (users) {
        UserActions.receiveUsers(users);
      }
    });
  },

  fetchUser: function (id) {
    $.ajax({
      url: '/api/users/' + id,
      type: 'GET',
      dataType: 'json',
      success: function (user) {
        UserActions.receiveUser(user);
      }
    });
  },

  createUser: function (attrs, callback) {
    $.ajax({
      url: '/api/users',
      type: 'POST',
      dataType: 'json',
      data: attrs,
      success: function (user) {
        UserActions.receiveUser(user);
        CurrentUserActions.receiveCurrentUser(user);
        callback && callback();
      },
      error: function (data) {
        FlashActions.receiveFlash(data.responseJSON.errors);
      }
    });
  },

  updateUser: function (user, userId, callback) {

    $.ajax({
      url: '/api/users/' + userId,
      type: 'patch',
      processData: false,
      contentType: false,
      dataType: 'json',
      data: user,
      success: function (user) {
        UserActions.receiveUserUpdate(user);
        callback && callback();
      },
      errors: function (data) {
      }
    });
  }
};


module.exports = UsersApiUtil;
