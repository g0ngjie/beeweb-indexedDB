type TResponse = {
    ok: boolean,
    data?: any,
    message: string,
    err?: any
}
type TIndex = {
    [key: string]: boolean
}

export default class BrowserDB {
    // 数据库
    private dbName: string;
    // 表名
    private storeName: string;
    // 索引
    private targetIndex: TIndex;
    private dataBase: any;
    // 版本
    public version: number | undefined;
    // 加载完毕
    public load: boolean = false;
    /**
     * 构造器
     * @param {string} dbName 数据库
     * @param {string} storeName 表名
     * @param {TIndex} targetIndex 索引
     * @example
     * ```
     * // 无索引使用
     * new BrowserDB('beewebDatabase', 'table_1');
     * // 添加索引使用
     * // 索引targetIndex为对象列表
     * // key 对应索引key，value为boolean格式，对应unique
     * new BrowserDB('beewebDatabase2', 'table_2', {
     *  name: false,
     *  mobile: true,
     * });
     * // 数据库新增store
     * // 通过改变version来增加，新增version不能小于前version
     * new BrowserDB('beewebDatabase', 'table_3', {}, 2)
     * ```
     */
    constructor(dbName: string, storeName: string, targetIndex: TIndex, version?: number) {
        if (!window.indexedDB) throw new Error("Current browser does not support");
        this.dbName = dbName;
        this.storeName = storeName;
        this.targetIndex = targetIndex;
        this.version = version;
        this.initDatabase().then(({ ok, err, message }: TResponse) => {
            this.load = ok;
            if (!ok) {
                console.error(err);
                throw new Error(message);
            }
        });
    }

    /**初始化 */
    private initDatabase(): Promise<TResponse> {
        return new Promise(resolve => {
            const DB: IDBOpenDBRequest = indexedDB.open(this.dbName, this.version);
            DB.onerror = (e: any) => {
                resolve({
                    ok: false,
                    err: e,
                    message: `Database ${this.dbName} connection failed`,
                });
            };
            DB.onsuccess = (e: any) => {
                this.dataBase = e.target.result;
                resolve({
                    ok: true,
                    message: `Database ${this.dbName} connected successfully`,
                });
            };
            // 表初始化
            DB.onupgradeneeded = (e: any) => {
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

    /**开启事务 */
    private openTransaction(): IDBObjectStore {
        // 读写权限
        const transaction: IDBTransaction = this.dataBase.transaction(this.storeName, "readwrite");
        const store: IDBObjectStore = transaction.objectStore(this.storeName);
        return store;
    }

    /**获取Store列表 */
    getStoreNames(): string[] {
        const domStrings: DOMStringList = this.dataBase.objectStoreNames;
        const names = [];
        for (const key in domStrings) {
            if (Object.prototype.hasOwnProperty.call(domStrings, key)) {
                const name = domStrings[key];
                names.push(name)
            }
        }
        return names;
    }

    /**
     * 增加
     * @param {object} target 新增对象
     */
    create(target: object): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const req: IDBRequest = store.add(target);
            req.onsuccess = (e: any) => {
                const _id = e.target.result;
                resolve({
                    ok: true,
                    data: _id,
                    message: "success",
                });
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**清空表数据 */
    clear(): Promise<TResponse> {
        return new Promise(resolve => {
            const store = this.openTransaction();
            const req = store.clear();
            req.onsuccess = () => {
                resolve({
                    ok: true,
                    message: "success",
                });
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**
     * 根据_id删除
     * @param {number} _id 主键
     */
    deleteById(_id: number): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const req: IDBRequest = store.delete(_id);
            req.onsuccess = (e: any) => {
                const result = e.target.result;
                resolve({
                    ok: true,
                    data: result,
                    message: "success",
                });
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**
     * 根据主键修改
     * @param {number} key 主键
     * @param {object} data 修改对象
     */
    updateById(key: number, data: object): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const req: IDBRequest = store.get(key);
            req.onsuccess = (e: any) => {
                let result = e.target.result;
                result = { _id: result._id, ...data };
                const target = store.put(result);
                target.onsuccess = (e: any) => {
                    const count = e.target.result;
                    resolve({
                        ok: true,
                        message: "success",
                        data: count,
                    });
                };
                target.onerror = (error: any) => {
                    resolve({
                        ok: false,
                        message: error?.target?.error?.message,
                    });
                };
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**
     * 根据主键查询
     * @param {number} key 主键
     */
    findById(key: number): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const req: IDBRequest = store.get(key);
            req.onsuccess = (e: any) => {
                const result = e.target.result;
                if (result)
                    resolve({
                        ok: true,
                        data: result,
                        message: "success",
                    });
                else {
                    resolve({
                        ok: false,
                        message: 'not found'
                    })
                }
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**
     * 根据条件索引
     * @param {string} key 索引
     * @param {string} value 值
     */
    find(key: string, value: string): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const dbIndex: IDBIndex = store.index(key);
            const req: IDBRequest = dbIndex.getAll(value);
            req.onsuccess = (e: any) => {
                const result = e.target.result;
                resolve({
                    ok: true,
                    data: result,
                    message: "success",
                });
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**
     * 查询全部
     */
    findAll(): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const req: IDBRequest = store.getAll();
            req.onsuccess = (e: any) => {
                const result = e.target.result;
                resolve({
                    ok: true,
                    data: result,
                    message: "success",
                });
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**
     * 获取集合总数
     */
    findCount(): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const req: IDBRequest = store.count();
            req.onsuccess = (e: any) => {
                const count = e.target.result;
                resolve({
                    ok: true,
                    data: count,
                    message: "success",
                });
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

    /**
     * 查看范围内集合
     * @param limit 查询条数
     */
    findLimit(limit = 10): Promise<TResponse> {
        return new Promise(resolve => {
            const store: IDBObjectStore = this.openTransaction();
            const req: IDBRequest = store.openCursor();
            let _limit = 1;
            let list: object[] = [];
            req.onsuccess = function (event: any) {
                const c = event.target.result;
                if (c) {
                    list.push(c.value);
                    if (_limit < limit) c.continue();
                    else return resolve({
                        ok: true,
                        data: list,
                        message: 'success'
                    });
                    _limit++;
                } else {
                    resolve({
                        ok: true,
                        data: list,
                        message: "success",
                    });
                }
            };
            req.onerror = (error: any) => {
                resolve({
                    ok: false,
                    message: error?.target?.error?.message,
                });
            };
        });
    }

}
