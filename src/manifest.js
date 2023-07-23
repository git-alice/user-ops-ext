import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'user-ops-extension',
  description: '',
  version: '0.0.1',
  manifest_version: 3,
  icons: {
    16: 'img/logo.png',
    32: 'img/logo.png',
    48: 'img/logo.png',
    128: 'img/logo.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        'https://mumbai.polygonscan.com/*/*',
        'https://polygonscan.com/*/*',
        'https://etherscan.io/*/*',
      ],
      js: ['src/content/index.js'],
      runAt: "document_end",
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo.png'],
      matches: [],
    },
  ],
  permissions: [
    'tabs'
  ],
})
