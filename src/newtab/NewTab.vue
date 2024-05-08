<script setup lang="ts">
import type { Memo } from '~/global'

const memos = reactive<Memo[]>([])
const memo = ref<Memo | null>(null)
const mainRef = ref<HTMLDivElement>()

onMounted(() => {
  applyTheme()

  // @ts-expect-error bugfix
  browser.default.storage.local.get().then((res) => {
    const data: Memo[] = res['flomo-tab-memos'] || []
    data.map((memo) => {
      !memo.deleted_at
      && memos.push({
        ...memo,
        content: memo.content,
      })
      return true
    })
    setMemo()
  })
})

function getRandomMemo() {
  const index = Math.floor(Math.random() * memos.length)
  return memos[index]
}

function setMemo() {
  const randomMemo = getRandomMemo()
  if (randomMemo)
    memo.value = randomMemo

  nextTick(() => {
    formatHTML()
  })
}

function applyTheme() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
  const body = document.body
  body.classList.toggle('dark', prefersDarkMode)
}
function formatHTML() {
  const paragraphs = document.getElementsByTagName('p')
  for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i].textContent
    const replacedText = text!.replace(
      /(https:\/\/v\.flomoapp\.com[^\s]*)/g,
      '<a title="$1" href="$1" target="_blank">笔记↗️</a>',
    )
    paragraphs[i].innerHTML = replacedText
  }
}
</script>

<template>
  <main
    ref="mainRef"
    class="w-screen h-screen flex justify-center items-center text-lg text-[#121212] bg-[#fafafa] dark:text-[#d9d9d9] dark:bg-[#121212]"
  >
    <div v-if="memos.length === 0">
      请先同步
    </div>
    <div
      v-else
      class="memo max-w-[600px] leading-10 font-sans"
      v-html="memo?.content"
    />
  </main>
  <nav class="fixed flex bottom-4 gap-4 right-1/2 ml-1/2 text-lg select-none">
    <a
      title="打开flomo"
      class="w-6 h-6 cursor-pointer flex justify-center items-center"
      :href="`https://v.flomoapp.com/mine/?memo_id=${memo?.slug}`"
      target="_blank"
    >
      🔗
    </a>
    <a
      title="再来一条"
      class="w-6 h-6 cursor-pointer flex justify-center items-center"
      @click="setMemo"
    >
      🆕
    </a>
    <a
      title="反馈"
      class="w-6 h-6 cursor-pointer flex justify-center items-center"
      href="https://github.com/coderfe/flomotab/issues"
      target="_blank"
    >
      ℹ️
    </a>
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
