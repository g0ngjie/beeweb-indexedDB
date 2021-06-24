import CommonDB from "@beeweb/indexeddb";

const db = new CommonDB("1000database", "create_test", {
  name: false,
  mobile: false,
  age: false,
  nick: false,
});
setTimeout(async () => {
  if (db.load) {
    let i = 0;
    await db.clear();
    console.time("1000 data");
    while (i < 1000) {
      await db.create({
        name: "zhangsan",
        mobile: "13111110000",
        age: 18,
        nick: "test",
        createAt: new Date(),
      });
      i += 1;
    }
    console.timeEnd("1000 data");
  }
}, 500);
