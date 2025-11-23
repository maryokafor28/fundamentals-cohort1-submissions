const db = require('../src/data/store');


beforeEach(() => {
  if (db && typeof db.reset === 'function') {
    db.reset();
  }
});
