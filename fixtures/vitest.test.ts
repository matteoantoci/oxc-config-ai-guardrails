// Deliberate violations of the vitest rules. Do not copy.
import { afterAll, expect, test, vi } from 'vitest';

// vitest/no-restricted-vi-methods, then vitest/padding-around-after-all-blocks on afterAll
vi.mock('./user-store');
vi.doMock('./config-store');
vi.stubGlobal('fetch', () => 1);
afterAll(() => undefined);

// vitest/padding-around-test-blocks on the second test
test('first', () => {
  expect(1).toBe(1);
});
test('second', () => {
  expect(2).toBe(2);
});

// vitest/no-conditional-in-test
test('branches', () => {
  const value = Math.random();

  if (value > 0.5) {
    expect(value).toBeGreaterThan(0.5);
  }
});

// vitest/no-disabled-tests: proves the vitest plugin loads its category rules
test.skip('skipped', () => {
  expect(3).toBe(3);
});

// vitest/no-large-snapshots
test('large snapshot', () => {
  expect('rows').toMatchInlineSnapshot(`
    row 01
    row 02
    row 03
    row 04
    row 05
    row 06
    row 07
    row 08
    row 09
    row 10
    row 11
    row 12
    row 13
    row 14
    row 15
    row 16
    row 17
    row 18
    row 19
    row 20
    row 21
    row 22
    row 23
    row 24
    row 25
    row 26
    row 27
    row 28
    row 29
    row 30
    row 31
    row 32
    row 33
    row 34
    row 35
    row 36
    row 37
    row 38
    row 39
    row 40
    row 41
    row 42
    row 43
    row 44
    row 45
    row 46
    row 47
    row 48
    row 49
    row 50
    row 51
    row 52
  `);
});
