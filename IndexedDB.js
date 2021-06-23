class IndexedDB {
  dbName;
  storeName;
  indexList;
  dataBase;
  constructor(dbName, storeName, indexList) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.indexList = indexList;
    this.initDatabase();
  }

  initDatabase() {
    return new Promise((resolve) => {
      const DB = indexedDB.open(this.dbName);

      DB.onerror = (e) => {
        console.error(`Failed to open database ${dbName}`);
      };

      DB.onsuccess = (e) => {
        this.dataBase = e.target.result;
      };

      //表初始化
      DB.onupgradeneeded = (e) => {
        let db = e.target.result;
        if (!db.objectStoreNames.contains(keyPath)) {
          db.createObjectStore(keyPath, { keyPath: "_id" });
        }
      };
    });
  }
}
