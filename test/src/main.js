import Vue from "vue";
import CommonDB from "@beeweb/indexeddb";

Vue.config.productionTip = false;

// const db = new CommonDB("testDatabase", "person", [{
//   name: false,
//   mobile: false,
// }], 1);
// setTimeout(async () => {
//   console.log("[debug]db.load:", db.load);
//   if (db.load) {
//     const create = await db.create({ name: 'zhangsan' });
//     console.log("[debug]create:", create);
//     // db.clear()
//     // const findOne = await db.findOne(6);
//     // console.log("[debug]findOne:", findOne);
//     // const findAll = await db.findAll();
//     // console.log("[debug]findAll:", findAll);
//     // const find = await db.find("name", "张三");
//     // console.log("[debug]find:", find);
//     // const update = await db.updateById(1, { aaa: 1 });
//     // console.log("[debug]update:", update);
//     // const findLimit = await db.findLimit(2);
//     // console.log("[debug]findLimit:", findLimit);
//     // const findCount = await db.findCount();
//     // console.log("[debug]findCount:", findCount);
//     // const deleteById = await db.deleteById(1);
//     // console.log("[debug]deleteById:", deleteById);
//   }
// }, 500);

// const db2 = new CommonDB("testDatabase", "children", [{
//   name: false,
//   age: false,
// }], 2);
// setTimeout(async () => {
//   console.log("[debug]db2.load:", db2.load)
//   if (db2.load) {
//     const create2 = await db2.create({ name: 'xiaoming'})
//     console.log("[debug]create2:", create2)
//   }
// }, 500);

const db3 = new CommonDB("testDatabase", "com", true, 3);
setTimeout(async () => {
  console.log("[debug]db3.load:", db3.load)
  if (db3.load) {
    const names = db3.getStoreNames()
    console.log("[debug]names:", names)
    const create3 = await db3.create({ aaa: 1})
  }
}, 500);




new Vue();
