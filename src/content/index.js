import createOpsHtml from "./renderHtml.js";
import { decodeCallData, decodeDataForUnknownABI } from './utils.js'
import { ethers } from "ethers"

console.info('chrome-ext template-vue-js content script')

function getSelectors() {
  let currentUrl = window.location.href

  if (currentUrl.includes('etherscan')) {
    return {
      'tabsSelector': '#ContentPlaceHolder1_myTab',
      'tabContentsSelector': '#pills-tabContent',
      'rawInputSelector': '#rawinput',
      'contentId': (name) => `${name}-tab-content`,
    }
  } else if (currentUrl.includes('polygonscan')) {
    return {
      'tabsSelector': '#nav_tabs',
      'tabContentsSelector': '#myTabContent',
      'rawInputSelector': '#rawinput',
      'contentId': (name) => name,
    }
  } else {

  }
}

async function parseOps(selectors) {
  let rawInput = document.querySelector(selectors.rawInputSelector)

  let {decodedParams, _} = await decodeCallData(rawInput.textContent)
  let [ops, beneficiary] = decodedParams
  return {ops, beneficiary}
}

async function addTab(name, selectors) {
  console.log(selectors)
  let tabs = document.querySelector(selectors.tabsSelector)
  let tabContents = document.querySelector(selectors.tabContentsSelector)

  let tabTemplate = tabs.children[tabs.children.length - 2].cloneNode(true)
  let tabTemplateLink = tabTemplate.querySelector('a')
  let tabContentTemplate = tabContents.children[tabContents.children.length - 1].cloneNode(true)
  let {ops, beneficiary} = await parseOps(selectors)

  tabTemplateLink.setAttribute('id', `${name}-tab`)
  tabTemplateLink.setAttribute('href', `#${name}`)
  tabTemplateLink.setAttribute('data-bs-target', `#${name}-tab-content`)
  tabTemplateLink.setAttribute('onclick', `javascript:updatehash('${name}');`)
  tabTemplateLink.text = `${name} (${ops.length})`

  tabContentTemplate.setAttribute('id', selectors.contentId(name))
  tabContentTemplate.innerHTML = await createOpsHtml(ops, beneficiary)

  tabs.appendChild(tabTemplate)
  tabContents.appendChild(tabContentTemplate)
}

addTab('UserOps', getSelectors())

export {}
