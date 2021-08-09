var AppDispatcher = require('../dispatcher/dispatcher');
var UserConstants = require('../constants/user_constants');

var UserActions = {
  receiveUsers: function (users) {
    AppDispatcher.dispatch({
      actionType: UserConstants.RECEIVE_USERS,
      users: users
    });
  },

  receiveUserUpdate: function (user) {
    AppDispatcher.dispatch({
      actionType: UserConstants.RECEIVE_USER_UPDATE,
      user: user
    });
  },

  receiveUser: function (user) {
    AppDispatcher.dispatch({
      actionType: UserConstants.RECEIVE_USER,
      user: user
    });
  }
};

module.exports = UserActions;
