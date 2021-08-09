var Store = require('flux/utils').Store;

var AppDispatcher = require('../dispatcher/dispatcher'),
    InstitutionConstants = require('../constants/institution');

var _institutions = [];
var InstitutionStore = new Store(AppDispatcher);

InstitutionStore.all = function () {
  return _institutions.slice();
};

var resetInstitutions = function (institutions) {
  _institutions = institutions;
};

var find = function (id) {
  for (var i = 0; i < _institutions.length; i++) {
    if (_institutions[i].id === parseInt(id) ) {
      return _institutions[i];
    }
  }
};


InstitutionStore.__onDispatch = function (payload) {
  switch(payload.actionType) {
    case InstitutionConstants.INSTITUTIONS_RECEIVED:
      resetInstitutions(payload.institutions);
      InstitutionStore.__emitChange();
      break;
  }
};


module.exports = InstitutionStore;
