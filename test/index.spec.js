const syncAction = require('../index').syncAction;
const asyncAction = require('../index').asyncAction;
const POSTFIX = require('../index').POSTFIX;
const actionWrapper = require('../index').actionWrapper;

it('syncAction', () => {
  const type = 'test/TEST';
  const action = syncAction('test/TEST');
  expect(typeof action).toEqual('function');
  expect(action('cat')).toEqual({
    type,
    payload: 'cat',
  });
  expect('type' in action).toBeTruthy();
  expect(action.type).toEqual(type);
});

it('syncAction configuration action creator', () => {
  const type = 'test/TEST';
  const action = syncAction('test/TEST', (payload, data) => ({ payload, data }));
  expect(typeof action).toEqual('function');
  expect(action('cat', 'dog')).toEqual({
    type,
    payload: 'cat',
    data: 'dog',
  });
  expect('type' in action).toBeTruthy();
  expect(action.type).toEqual(type);
});

it('asyncAction', () => {
  const type = 'test/TEST';
  const action = asyncAction('test/TEST');
  expect(typeof action).toEqual('function');
  expect(action('cat')).toEqual({
    type,
    payload: 'cat',
  });
  expect('type' in action).toBeTruthy();
  expect(action.type).toEqual(type);
  expect(action.request).toEqual(`${type}${POSTFIX.request}`);
  expect(action.success).toEqual(`${type}${POSTFIX.success}`);
  expect(action.failure).toEqual(`${type}${POSTFIX.failure}`);
});

it('actionWrapper', () => {
  const type = 'test/TEST';
  const action = asyncAction('test/TEST');
  const fn = (a) => (t) => t;
  const wrappedFunction = actionWrapper(fn, action);
  expect(wrappedFunction.type).toEqual(type);
  expect(wrappedFunction.request).toEqual(`${type}${POSTFIX.request}`);
  expect(wrappedFunction.success).toEqual(`${type}${POSTFIX.success}`);
  expect(wrappedFunction.failure).toEqual(`${type}${POSTFIX.failure}`);
  expect(wrappedFunction('cat')).toEqual('cat');
});
