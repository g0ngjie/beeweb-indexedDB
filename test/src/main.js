import Vue from "vue";
import CommonDB from "../../lib/index";
Vue.config.productionTip = false;

const db = new CommonDB("testDatabase", "person", {
  name: false,
  mobile: false,
});

setTimeout(async () => {
  console.log("[debug]db.load:", db.load);
  if (db.load) {
    const create = await db.create({ _id: 1 });
    console.log("[debug]create:", create);
    // db.clear()
    // const findOne = await db.findOne(6);
    // console.log("[debug]findOne:", findOne);
    // const findAll = await db.findAll();
    // console.log("[debug]findAll:", findAll);
    // const find = await db.find("name", "张三");
    // console.log("[debug]find:", find);
    // const update = await db.updateById(1, { aaa: 1 });
    // console.log("[debug]update:", update);
    // const findLimit = await db.findLimit(2);
    // console.log("[debug]findLimit:", findLimit);
    // const findCount = await db.findCount();
    // console.log("[debug]findCount:", findCount);
    // const deleteById = await db.deleteById(1);
    // console.log("[debug]deleteById:", deleteById);
  }
}, 500);

new Vue();
