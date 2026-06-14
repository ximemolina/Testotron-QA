
class Statement {
  run() { return { changes: 0, lastInsertRowid: 0 }; }
  get() { return undefined; }
  all() { return []; }
}
class Database {
  constructor() {}
  prepare() { return new Statement(); }
  exec() {}
  pragma() {}
  close() {}
}
module.exports = Database;
 