declare type TResponse = {
    ok: boolean;
    data?: any;
    message: string;
    err?: any;
};
declare type TIndex = {
    [key: string]: boolean;
};
export default class BrowserDB {
    private dbName;
    private storeName;
    private targetIndex;
    private dataBase;
    version: number | undefined;
    load: boolean;
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
    constructor(dbName: string, storeName: string, targetIndex: TIndex, version?: number);
    /**初始化 */
    private initDatabase;
    /**开启事务 */
    private openTransaction;
    /**获取Store列表 */
    getStoreNames(): string[];
    /**
     * 增加
     * @param {object} target 新增对象
     */
    create(target: object): Promise<TResponse>;
    /**清空表数据 */
    clear(): Promise<TResponse>;
    /**
     * 根据_id删除
     * @param {number} _id 主键
     */
    deleteById(_id: number): Promise<TResponse>;
    /**
     * 根据主键修改
     * @param {number} key 主键
     * @param {object} data 修改对象
     */
    updateById(key: number, data: object): Promise<TResponse>;
    /**
     * 根据主键查询
     * @param {number} key 主键
     */
    findById(key: number): Promise<TResponse>;
    /**
     * 根据条件索引
     * @param {string} key 索引
     * @param {string} value 值
     */
    find(key: string, value: string): Promise<TResponse>;
    /**
     * 查询全部
     */
    findAll(): Promise<TResponse>;
    /**
     * 获取集合总数
     */
    findCount(): Promise<TResponse>;
    /**
     * 查看范围内集合
     * @param limit 查询条数
     */
    findLimit(limit?: number): Promise<TResponse>;
}
export {};
