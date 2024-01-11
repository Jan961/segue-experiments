import { mapRecursive } from '../index';

describe('Tests for utility functions', () => {
  it('tests mapRecursive function', () => {
    const arr = [
      {
        name: 'A',
        status: 'off',
        options: [{ name: 'B', status: 'off', options: [{ name: 'C', status: 'off' }] }],
      },
    ];
    const updated = mapRecursive(arr, (i) => ({ ...i, status: 'on' }));

    expect(updated[0].status).toBe('on');
    expect(updated[0].options[0].status).toBe('on');
    expect(updated[0].options[0].options[0].status).toBe('on');
  });
});
