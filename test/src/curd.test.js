import CommonDB from "@beeweb/indexeddb";

const db = new CommonDB("curdDatabase", "person", {
  name: false,
  mobile: false,
});
setTimeout(async () => {
  console.log("[debug]db.load:", db.load);
  if (db.load) {
    const create = await db.create({ name: "zhangsan", mobile: "13111110000" });
    console.log("[debug]create:", create);
    const findById = await db.findById(1);
    console.log("[debug]findById:", findById);
    console.assert(findById.ok);
    console.assert(findById.data.name === "zhangsan");
    const findAll = await db.findAll();
    console.log("[debug]findAll:", findAll);
    const find = await db.find("name", "张三");
    console.log("[debug]find:", find);
    const updateById = await db.updateById(1, { name: "zhangsan", update: 1 });
    console.log("[debug]updateById:", updateById);
    console.assert(updateById.ok);
    console.assert(updateById.data === 1);
    const findLimit = await db.findLimit(2);
    console.log("[debug]findLimit:", findLimit);
    const findCount = await db.findCount();
    console.log("[debug]findCount:", findCount);
    // const deleteById = await db.deleteById(1);
    // console.log("[debug]deleteById:", deleteById);
    // db.clear()
  }
}, 500);
