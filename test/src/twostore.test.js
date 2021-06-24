import CommonDB from "@beeweb/indexeddb";

const db1 = new CommonDB("twostore", "one", { name: false });
const db2 = new CommonDB("twostore", "two", { name: false }, 2);
setTimeout(async () => {
  if (db2.load) {
    console.log("[debug]db1.load:", db1.load);
    console.log("[debug]db2.load:", db2.load);
    await db1.create({ name: "张三" });
    await db2.create({ name: "李四" });
    const { ok: oneOk, data: findOne } = await db1.find("name", "张三");
    console.assert(findOne[0].name === "张三");
    console.assert(oneOk);
  }
}, 500);
