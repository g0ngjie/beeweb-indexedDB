"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BrowserDB {
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
     * ```
     */
    constructor(dbName, storeName, targetIndex) {
        // 加载完毕
        this.load = false;
        if (!window.indexedDB)
            throw new Error("Current browser does not support");
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
    /**初始化 */
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
                this.dataBase = e.target.result;
                resolve({
                    ok: true,
                    message: `Database ${this.dbName} connected successfully`,
                });
            };
            // 表初始化
            DB.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const instantiation = db.createObjectStore(this.storeName, {
                        keyPath: "_id",
                        autoIncrement: true,
                    });
                    // 添加索引
                    instantiation.createIndex("_id", "_id", { unique: true });
                    // 批量添加索引
                    if (Object.prototype.toString.call(this.targetIndex) ===
                        "[object Object]") {
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
    openTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            // 读写权限
            const transaction = this.dataBase.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            return store;
        });
    }
    /**
     * 增加
     * @param {object} target 新增对象
     */
    create(target) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.add(target);
            req.onsuccess = (e) => {
                const _id = e.target.result;
                resolve({
                    ok: true,
                    data: _id,
                    message: "success",
                });
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**清空表数据 */
    clear() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.clear();
            req.onsuccess = () => {
                resolve({
                    ok: true,
                    message: "success",
                });
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**
     * 根据_id删除
     * @param {number} _id 主键
     */
    deleteById(_id) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.delete(_id);
            req.onsuccess = (e) => {
                const result = e.target.result;
                resolve({
                    ok: true,
                    data: result,
                    message: "success",
                });
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**
     * 根据主键修改
     * @param {number} key 主键
     * @param {object} data 修改对象
     */
    updateById(key, data) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.get(key);
            req.onsuccess = (e) => {
                let result = e.target.result;
                result = Object.assign({ _id: result._id }, data);
                const target = store.put(result);
                target.onsuccess = (e) => {
                    const count = e.target.result;
                    resolve({
                        ok: true,
                        message: "success",
                        data: count,
                    });
                };
                target.onerror = (error) => {
                    var _a, _b;
                    resolve({
                        ok: false,
                        message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                    });
                };
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**
     * 根据主键查询
     * @param {number} key 主键
     */
    findById(key) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.get(key);
            req.onsuccess = (e) => {
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
                    });
                }
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**
     * 根据条件索引
     * @param {string} key 索引
     * @param {string} value 值
     */
    find(key, value) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const dbIndex = store.index(key);
            const req = dbIndex.getAll(value);
            req.onsuccess = (e) => {
                const result = e.target.result;
                resolve({
                    ok: true,
                    data: result,
                    message: "success",
                });
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**
     * 查询全部
     */
    findAll() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.getAll();
            req.onsuccess = (e) => {
                const result = e.target.result;
                resolve({
                    ok: true,
                    data: result,
                    message: "success",
                });
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**
     * 获取集合总数
     */
    findCount() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.count();
            req.onsuccess = (e) => {
                const count = e.target.result;
                resolve({
                    ok: true,
                    data: count,
                    message: "success",
                });
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
    /**
     * 查看范围内集合
     * @param limit 查询条数
     */
    findLimit(limit = 10) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const store = yield this.openTransaction();
            const req = store.openCursor();
            let _limit = 1;
            let list = [];
            req.onsuccess = function (event) {
                const c = event.target.result;
                if (c) {
                    list.push(c.value);
                    if (_limit < limit)
                        c.continue();
                    else
                        return resolve({
                            ok: true,
                            data: list,
                            message: 'success'
                        });
                    _limit++;
                }
                else {
                    resolve({
                        ok: true,
                        data: list,
                        message: "success",
                    });
                }
            };
            req.onerror = (error) => {
                var _a, _b;
                resolve({
                    ok: false,
                    message: (_b = (_a = error === null || error === void 0 ? void 0 : error.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            };
        }));
    }
}
exports.default = BrowserDB;
