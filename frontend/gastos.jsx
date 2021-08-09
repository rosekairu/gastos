var React = require('react'),
    ReactDOM = require('react-dom'),
    ReactRouter = require('react-router'),
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    IndexRoute = ReactRouter.IndexRoute,
    createBrowserHistory = ReactRouter.createBrowserHistory;

var App = require('./app'),
    AccountIndex = require('./components/account_index'),
    AccountShow = require('./components/account_show'),
    AccountTypeIndex = require('./components/account_type_index'),
    TransactionIndex = require('./components/transaction_index'),
    CurrentUserStore = require('./stores/current_user_store'),
    SessionsApiUtil = require('./util/sessions_api_util'),
    SessionForm = require('./components/sessions/new'),
    UserForm = require('./components/users/user_form'),
    ModalIndex = require('./components/modals/modal_index');


var routes = (
  <Router >
    <Route path="login" component={ SessionForm }/>
    <Route path="users/new" component={ UserForm } />
    <Route path="/" component={App} onEnter={_ensureLoggedIn}>
      <IndexRoute component={AccountIndex} />
      <Route path="accounts" component={AccountIndex} />
      <Route path="type/:type" component={AccountIndex} />
      <Route path="accounts/:accountId" component={ AccountShow } />
      <Route path="transactions" component={TransactionIndex} />
    </Route>
  </Router>
);

// <Route path="settings" component={ModalIndex} />

window.init = function () {
  ReactDOM.render(
  routes,
  document.getElementById('root') );
};


function _ensureLoggedIn(nextState, replace, callback) {


  if (CurrentUserStore.userHasBeenFetched()) {
    _redirectIfNotLoggedIn(); // this function below
  } else {
    SessionsApiUtil.fetchCurrentUser(_redirectIfNotLoggedIn);
  }

  function _redirectIfNotLoggedIn() {
    if (!CurrentUserStore.isLoggedIn()) {
      replace({}, "/login");
    }
    callback();
  }
}
