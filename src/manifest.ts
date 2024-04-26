import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, isFirefox, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    homepage_url: pkg.homepage,
    action: {
      default_icon: './assets/icon-512.png',
      // default_popup: "./dist/popup/index.html",
    },
    chrome_url_overrides: {
      newtab: './dist/newtab/index.html',
    },
    background: isFirefox
      ? {
          scripts: ['dist/background/index.mjs'],
          type: 'module',
        }
      : {
          service_worker: './dist/background/index.mjs',
        },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    permissions: ['storage', 'scripting'],
    host_permissions: ['https://v.flomoapp.com/*'],
    content_scripts: [
      {
        matches: ['https://v.flomoapp.com/*'],
        js: [
          // "dist/contentScripts/index.global.js",
          './lib/toastify/toastify.js',
        ],
        css: ['./lib/toastify/toastify.css'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/style.css'],
        matches: ['https://v.flomoapp.com/*'],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
        : 'script-src \'self\'; object-src \'self\'',
    },
  }

  if (isDev)
    manifest.permissions?.push('webNavigation')

  return manifest
}
