describe('Test Setup', () => {
  test('Jest is working', () => {
    expect(true).toBe(true);
  });

  test('Can perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });

  test('Environment is test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});