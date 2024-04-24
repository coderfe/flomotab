/* eslint-disable no-console */
import { sendMessage } from "webext-bridge/content-script";
import { Memo } from "~/global";

getMemosFromIndexDB((memos: Memo[]) => {
  sendMessage("sync-memos", { memos });
});

function getMemosFromIndexDB(fn: any) {
  const request = indexedDB.open("flomo");
  let data: Memo[] = [];

  request.onsuccess = function (event: any) {
    const db = event.target.result;
    const transaction = db.transaction(["memos"], "readonly");
    const objectStore = transaction.objectStore("memos");

    objectStore.openCursor().onsuccess = function (event: any) {
      const cursor = event.target.result;
      if (cursor) {
        data.push(cursor.value);
        cursor.continue();
      } else {
        console.log("flomo tab sync completed", data.length);
        fn(data);
      }
    };
  };

  request.onerror = function (event: any) {
    console.log("Database error: " + event.target.errorCode);
  };
}
