/* eslint-disable no-console */
import { sendMessage } from "webext-bridge/content-script";
import { Memo } from "~/global";

getMemosFromIndexDB((memos: Memo[]) => {
  sendMessage("sync-memos", { memos }).then(() =>
    toast(`同步完成 ${memos.length} 条笔记`)
  );
});

function getMemosFromIndexDB(fn: any) {
  try {
    const request = indexedDB.open("flomo");
    let data: Memo[] = [];

    request.onsuccess = function (event: any) {
      const db = event.target.result;
      try {
        const transaction = db.transaction(["memos"], "readonly");
        const objectStore = transaction.objectStore("memos");

        objectStore.openCursor().onsuccess = function (event: any) {
          const cursor = event.target.result;
          if (cursor) {
            const { deleted_at } = cursor.value as Memo;
            !deleted_at && data.push(cursor.value);
            cursor.continue();
          } else {
            fn(data);
          }
        };
      } catch (e: any) {
        toast("同步失败");
      }
    };

    request.onerror = function (event: any) {
      toast("同步失败");
    };
  } catch (e: any) {
    toast("同步失败");
  }
}

function toast(text: string) {
  // @ts-ignore
  Toastify({
    text,
    duration: 3000,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}
