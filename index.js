// if ("indexedDB" in window) {
//   console.log("当前浏览器支持 IndexedDB");
// } else {
//   console.log("您的浏览器不支持 IndexedDB");
//   // todo 建议升级或者更换其他浏览器
// }

// const connection = indexedDB.open("notes_db");

// connection.onsuccess = (e) => {
//   const database = e.target.result;
//   const transaction = database.transaction(["note_os"]);
//   const objectStore = transaction.objectStore("notes_os");
//   const index = objectStore.index("title");
//   const request = index.get("Edge ()");
//   request.onsuccess = (e) => {
//     console.log(e.target.result);
//   };
//   request.onerror = (e) => {
//     console.log("[debug]e.target.result:", e.target.result);
//   };
// };

class DB {
  constructor() {
    this.conf = {
      dbName: "Arsenal",
      keyPath: "bullet",
      maxDataNum: 100, //10 << 10 //最大数据存储量
      ignoreName: "OB无情小强",
    };
  }

  initDB() {
    return new Promise((resolve) => {
      const { dbName, keyPath } = this.conf;
      const DB = indexedDB.open(dbName);

      DB.onerror = (e) => {
        console.error(`Failed to open database ${dbName}`);
      };

      DB.onsuccess = (e) => {
        this.dataBase = e.target.result;
        resolve();
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

  async openTransaction() {
    const { keyPath } = this.conf;
    const transaction = this.dataBase.transaction(keyPath, "readwrite");
    const store = transaction.objectStore(keyPath);
    return store;
  }

  //获取溢出数据 key
  _getOverflowId(store) {
    return new Promise(async (resolve) => {
      const req = store.getAllKeys();
      req.onsuccess = (e) => {
        const list = e.target.result;
        resolve(list[0]);
      };
    });
  }

  //获取数据量
  _getCount(store) {
    return new Promise(async (resolve) => {
      const req = store.count();
      req.onsuccess = (e) => {
        const count = e.target.result;
        resolve(count);
      };
    });
  }

  async add(obj) {
    const { maxDataNum } = this.conf;
    obj._id = Date.now();
    const store = await this.openTransaction();
    const existing = await this._getCount(store);
    if (existing >= maxDataNum) {
      const _id = await this._getOverflowId(store);
      this.deleteOne(_id);
    }
    store.add(obj);
  }

  async deleteOne(_id) {
    const store = await this.openTransaction();
    store.delete(_id);
  }

  clear() {
    return new Promise(async (resolve) => {
      const store = await this.openTransaction();
      const req = store.clear();
      req.onsuccess = () => {
        console.log(">>>>>>>> 数据清空 <<<<<<<<");
        resolve();
      };
    });
  }

  findOne(key) {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      const req = store.get(key);
      req.onsuccess = (e) => {
        const result = e.target.result;
        console.log(result);
        resolve(result);
      };
      req.onerror = (error) => {
        reject(error);
      };
    });
  }

  findLimit(limit = 10) {
    return new Promise(async (resolve) => {
      const store = await this.openTransaction();
      const req = store.openCursor();
      let _limit = 1;
      let list = [];
      req.onsuccess = function (event) {
        const c = event.target.result;
        if (c) {
          if (_limit < limit) c.continue();
          list.push(c.value);
          _limit++;
        } else {
          console.log("Finished iterating");
        }
      };
      resolve(list);
    });
  }

  findAll() {
    return new Promise(async (resolve) => {
      const { ignoreName, maxDataNum } = this.conf;
      const store = await this.openTransaction();
      const allRecords = store.getAll();
      allRecords.onsuccess = () => {
        const list = allRecords.result.filter(
          (chat) => chat.nickName != ignoreName
        );
        resolve(list);
      };
    });
  }

  updateOne(key, data) {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      const req = store.get(key);
      req.onsuccess = (e) => {
        let result = e.target.result;
        result = { _id: result._id, ...data };
        store.put(result);
        resolve();
      };
      req.onerror = (error) => {
        reject(error);
      };
    });
  }
}

const db = new DB()
db.initDB()
db.add({ _id: 1, a: 1})