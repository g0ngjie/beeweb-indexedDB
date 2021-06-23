import CommonDB from "../lib/index.js";

const db = new CommonDB("testDatabase", "person", {
  name: false,
  mobile: false,
});

setTimeout(async () => {
  console.log("[debug]db.load:", db.load);
  if (db.load) {
    // db.add({ name: "张三", mobile: "1312211" });
    // db.clear()
    // const findOne = await db.findOne(6);
    // console.log("[debug]findOne:", findOne);
    // const findAll = await db.findAll();
    // console.log("[debug]findAll:", findAll);
    // const find = await db.find("name", "张三");
    // console.log("[debug]find:", find);
    // const update = await db.updateById(6, { aaa: 1 });
    // console.log("[debug]update:", update);
    // const findLimit = await db.findLimit(2);
    // console.log("[debug]findLimit:", findLimit);
    const findCount = await db.findCount();
    console.log("[debug]findCount:", findCount);
  }
}, 500);
