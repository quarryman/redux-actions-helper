'use strict';

function makeActionDefault (payload) {
  return {
    payload: payload
  };
}

var POSTFIX = {
  request: '/REQUEST',
  success: '/SUCCESS',
  failure: '/FAILURE'
};

function assignType (action, base) {
  Object.defineProperty(action, 'type', {
    enumerable: true,
    value: base
  });
  return action;
}

function makeActionCreator (base, makeAction) {
  return function () {
    var action = makeAction.apply(undefined, arguments);
    return assignType(action, base);
  };
}

var actionMaker = function (makeAction) {
  if (typeof makeAction === 'function') {
    return makeAction;
  }
  return makeActionDefault;
};

var syncAction = function (base, makeAction) {
  var actionCreator = makeActionCreator(base, actionMaker(makeAction));
  return assignType(actionCreator, base);
};

function crateGetter (post) {
  return function () {
    return this.type + post;
  };
};

var asyncAction = function (base, makeAction) {
  var actionCreator = makeActionCreator(base, actionMaker(makeAction));
  assignType(actionCreator, base);
  for (var key in POSTFIX) {
    if (POSTFIX.hasOwnProperty(key)) {
      Object.defineProperty(actionCreator, key, {
        enumerable: true,
        get: crateGetter(POSTFIX[key])
      });
    }
  }
  return actionCreator;
};

var actionWrapper = function (fn, action) {
  var wrapper = fn(action);
  for (var key in action) {
    if (action.hasOwnProperty(key)) {
      Object.defineProperty(wrapper, key, {
        enumerable: true,
        value: action[key]
      });
    }
  }
  return wrapper;
};

module.exports = {
  asyncAction: asyncAction,
  syncAction: syncAction,
  actionWrapper: actionWrapper,
  POSTFIX: POSTFIX
};
