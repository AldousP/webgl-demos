import test from 'ava';

import Map from '../src/ts/map';

test('A value can be added to the map', async (t) => {
  let map = new Map<string, string>();

  map.add('A', 'John');
  t.is(map.get('A'), 'John');
});

test('A value can be removed from the map', async (t) => {
  let map = new Map<string, string>();

  map.remove('A');
  t.is(map.get('A'), null);
});