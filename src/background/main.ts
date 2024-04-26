import { onMessage } from 'webext-bridge/background'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('flomotab installed')
})

onMessage('sync-memos', ({ data: { memos } }) => {
  browser.storage.local.set({
    'flomo-tab-memos': memos,
  })
})

browser.action.onClicked.addListener(async (tab) => {
  if (!tab.url?.includes('v.flomoapp.com'))
    return
  browser.scripting.executeScript({
    target: {
      tabId: tab.id!,
    },
    files: ['dist/contentScripts/index.global.js'],
  })
})
