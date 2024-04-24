<script setup lang="ts">
import type { Memo } from "~/global";

let memos = reactive<Memo[]>([]);
let memo = ref<Memo | null>(null);
const mainRef = ref<HTMLDivElement>();

function getRandomMemo() {
  const index = Math.floor(Math.random() * memos.length);
  return memos[index];
}
onMounted(() => {
  applyTheme();

  // @ts-ignore
  browser.default.storage.local.get().then((res) => {
    const data: Memo[] = res["flomo-tab-memos"] || [];
    data.map((memo) => {
      !memo.deleted_at &&
        memos.push({
          ...memo,
          content: memo.content,
        });
    });
    const randomMemo = getRandomMemo();
    if (randomMemo) {
      memo.value = randomMemo;
    }
    nextTick(() => {
      formatHTML();
    });
  });
});
function applyTheme() {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const body = document.body;
  body.classList.toggle("dark", prefersDarkMode);
}
function formatHTML() {
  const paragraphs = document.getElementsByTagName("p");
  for (var i = 0; i < paragraphs.length; i++) {
    var text = paragraphs[i].textContent;
    var replacedText = text!.replace(
      /(https:\/\/v\.flomoapp\.com[^\s]*)/g,
      '<a title="$1" href="$1">笔记↗️</a>'
    );
    paragraphs[i].innerHTML = replacedText;
  }
}
</script>

<template>
  <main
    ref="mainRef"
    class="w-screen h-screen flex justify-center items-center text-lg text-[#121212] bg-[#fafafa] dark:text-[#d9d9d9] dark:bg-[#121212]"
  >
    <div v-if="memos.length == 0">请先同步</div>
    <div
      v-else
      class="memo max-w-[320px] leading-10 font-sans"
      v-html="memo?.content"
    />
  </main>
  <nav class="fixed bottom-4 right-1/2">
    <a
      title="Open in flomo"
      class="flomo-btn block w-6 h-6 bg-contain bg-no-repeat rounded-md ring-1 ring-black/10 shadow-md"
      :href="`https://v.flomoapp.com/mine/?memo_id=${memo?.slug}`"
    ></a>
  </nav>
</template>

<style>
.flomo-btn {
  background-image: url("https://v.flomoapp.com/img/icons/apple-touch-icon-76x76.png");
}
.memo a {
  color: #5783f7;
}
.memo ol,
.memo ul {
  @apply ml-10;
}
.memo ol li {
  @apply list-decimal;
}
.memo ul li {
  @apply list-circle;
}
</style>
