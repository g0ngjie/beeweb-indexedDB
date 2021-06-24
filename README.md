# beeweb-indexedDB

## Installing

```shell
$ yarn add @beeweb/indexeddb
```

## Usage

```js
import BrowserDB from "@beeweb/indexeddb";

const targetIndex = {};
const version = 1;
new BrowserDB("dbName", "storeName", targetIndex, version);
```

## Description

| field       | required | type                       |                                                                               |
| ----------- | -------- | -------------------------- | ----------------------------------------------------------------------------- |
| dbName      | true     | string                     |                                                                               |
| storeName   | true     | string                     |                                                                               |
| targetIndex | false    | { [key: string]: boolean } | **IDBObjectStore.createIndex**<br /> key as name & keyPath \| value as unique |
| version     | false    | number                     | default: 1                                                                    |

## License

[The ISC License](./LICENSE)
