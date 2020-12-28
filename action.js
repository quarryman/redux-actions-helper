// @flow

export type ActionType<T, P: {}> = {|
  type: T,
  ...$Exact<P>,
|}

type ActionCreator<T, P: {}, A> = (a: A) => ActionType<T, P>

// export type SyncAction<T, P, A> = {
//   type: T,
//   (a: A): ActionType<T, P>
// }

export type SyncAction<T, P, A> = ActionCreator<T, P, A> & { type: T };

type MD<A> = {
  payload: A
}

function makeActionDefault<A>(payload: A) {
  return {
    payload,
  };
}

export function formOnSubmit(fun) {
  return (data, dispatch) => dispatch(fun(data));
}

export const POSTFIX = {
  request: '/REQUEST',
  success: '/SUCCESS',
  failure: '/FAILURE',
};

function makeActionCreator<T, P: {}, A>(base: T, makeAction: (a: A) => P): ActionCreator<T, P, A> {
  return (...args: A[]): ActionType<T, P> => {
    const action = makeAction(...args);
    return Object.assign({ type: base }, action);
  };
}

// eslint-disable-next-line max-len
export function syncAction<T, P: {}, A>(base: T, makeAction: (a: A) => P): SyncAction<T, P, A> {
  const actionCreator: ActionCreator<T, P, A> = makeActionCreator(base, makeAction);
  Object.defineProperty(actionCreator, 'type', {
    enumerable: true,
    value: base,
  });
  // actionCreator.type = base;
  // return Object.assign(actionCreator, { type: base });
  // actionCreator.type = base;
  // actionCreator.onSubmit = formOnSubmit(actionCreator);

  return (actionCreator: SyncAction<T, P, A>);
}


export function asyncAction(base, makeAction = makeActionDefault) {

  const actionCreator = makeActionCreator(base, makeAction);

  actionCreator.type = base;
  actionCreator.request = `${base}${POSTFIX.request}`;
  actionCreator.success = `${base}${POSTFIX.success}`;
  actionCreator.failure = `${base}${POSTFIX.failure}`;
  actionCreator.onSubmit = formOnSubmit(actionCreator);

  return actionCreator;
}
