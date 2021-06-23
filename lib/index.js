class BrowserDB {
  dbName;
  storeName;
  targetIndex;
  dataBase;
  // 加载完毕
  load = false;
  /**
   * 构造器
   * @param {String} dbName 数据库
   * @param {String} storeName 表名
   * @param {Object} targetIndex 索引
   */
  constructor(dbName, storeName, targetIndex) {
    if (!window.indexedDB) throw new Error("Current browser does not support");
    this.dbName = dbName;
    this.storeName = storeName;
    this.targetIndex = targetIndex;
    this.initDatabase().then(({ ok, err, message }) => {
      this.load = ok;
      if (!ok) {
        console.error(err);
        throw new Error(message);
      }
    });
  }

  initDatabase() {
    return new Promise((resolve) => {
      const DB = indexedDB.open(this.dbName);
      DB.onerror = (e) => {
        resolve({
          ok: false,
          err: e,
          message: `Database ${this.dbName} connection failed`,
        });
      };
      DB.onsuccess = (e) => {
        console.log("触发了 success 事件");
        this.dataBase = e.target.result;
        resolve({
          ok: true,
          message: `Database ${this.dbName} connected successfully`,
        });
      };
      // 表初始化
      DB.onupgradeneeded = (e) => {
        console.log("表初始化");
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const instantiation = db.createObjectStore(this.storeName, {
            keyPath: "_id",
            autoIncrement: true,
          });
          // 添加索引
          instantiation.createIndex("_id", "_id", { unique: true });
          // 批量添加索引
          if (
            Object.prototype.toString.call(this.targetIndex) ===
            "[object Object]"
          ) {
            // 建立单重条件索引
            for (const key in this.targetIndex) {
              if (Object.hasOwnProperty.call(this.targetIndex, key)) {
                const unique = this.targetIndex[key];
                instantiation.createIndex(key, key, { unique });
              }
            }
          }
          resolve({
            ok: true,
            message: `Datasheet ${this.storeName} created successfully`,
          });
        }
      };
    });
  }

  async openTransaction() {
    const transaction = this.dataBase.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    return store;
  }

  /**清空表数据 */
  clear() {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      const req = store.clear();
      req.onsuccess = () => {
        console.log(">>>>>>>> 数据清空 <<<<<<<<");
        resolve({
          ok: true,
          message: "success",
        });
      };
      req.onerror = (error) => {
        reject(error);
      };
    });
  }

  async deleteById(_id) {
    const store = await this.openTransaction();
    store.delete(_id);
    return "delete success";
  }

  findById(key) {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      const req = store.get(key);
      req.onsuccess = (e) => {
        const result = e.target.result;
        resolve(result);
      };
      req.onerror = (error) => {
        reject(error);
      };
    });
  }

  /**
   * 根据条件索引
   * @param {String} key 索引
   * @param {String} value 值
   */
  find(key, value) {
    return new Promise(async (resolve, reject) => {
      const transaction = await this.openTransaction();
      const req = transaction.index(key);
      const store = req.getAll(value);
      store.onsuccess = (e) => {
        const result = e.target.result;
        resolve(result);
      };
      store.onerror = (error) => {
        reject(error);
      };
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      const transaction = await this.openTransaction();
      const store = transaction.getAll();
      store.onsuccess = (e) => {
        const result = e.target.result;
        resolve(result);
      };
      store.onerror = (error) => {
        reject(error);
      };
    });
  }

  findCount() {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      const req = store.count();
      req.onsuccess = (e) => {
        const count = e.target.result;
        resolve(count);
      };
      req.onerror = (error) => {
        reject(error);
      };
    });
  }

  findLimit(limit = 10) {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      const req = store.openCursor();
      let _limit = 1;
      let list = [];
      req.onsuccess = function (event) {
        const c = event.target.result;
        if (c) {
          list.push(c.value);
          if (_limit < limit) c.continue();
          else return resolve(list);
          _limit++;
        } else {
          console.log("Finished iterating");
          resolve(list);
        }
      };
      store.onerror = (error) => {
        reject(error);
      };
    });
  }

  add(target) {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      store.add(target);
      store.onsuccess = (e) => {
        const result = e.target.result;
        console.log("add", result);
        resolve(result);
      };
      store.onerror = (error) => {
        reject(error);
      };
    });
  }

  updateById(key, data) {
    return new Promise(async (resolve, reject) => {
      const store = await this.openTransaction();
      const req = store.get(key);
      req.onsuccess = (e) => {
        let result = e.target.result;
        result = { _id: result._id, ...data };
        store.put(result);
        resolve("update one success");
      };
      req.onerror = (error) => {
        reject(error);
      };
    });
  }
}

export default BrowserDB;
