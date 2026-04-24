/**
 * Store screenshot generator (Playwright)
 *
 * Run from the Expo app root (or set APP_ROOT). Screens are listed in
 *   APP_ROOT/scripts/store-screens.config.json
 * Copy templates/store-screens.config.json from this kit into your app.
 *
 *   yarn add -D playwright && npx playwright install chromium
 *   yarn web
 *   APP_URL=http://localhost:8081 node /path/to/expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
 *
 * Env:
 *   APP_ROOT   — root of the Expo app (default: process.cwd())
 *   APP_URL    — dev server URL (default: http://localhost:8081)
 */

import { chromium } from 'playwright'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))

const APP_ROOT = process.env.APP_ROOT || process.cwd()
const BASE_URL = process.env.APP_URL || 'http://localhost:8081'
const AUTH_FILE = join(APP_ROOT, 'scripts', '.auth', 'session.json')
const OUT_DIR = join(APP_ROOT, 'store-assets', 'screenshots')
const SCREENS_CONFIG = join(APP_ROOT, 'scripts', 'store-screens.config.json')

const DEFAULT_SCREENS = [{ route: '/', label: '1-home', waitFor: null }]

const DEVICES = [
  {
    platform: 'ios',
    name: 'iphone-6.7',
    description: 'iPhone 6.7" (1290×2796) — required for App Store',
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
  },
  {
    platform: 'ios',
    name: 'iphone-6.5',
    description: 'iPhone 6.5" (1242×2688)',
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 3,
  },
  {
    platform: 'ios',
    name: 'ipad-pro-12.9',
    description: 'iPad Pro 12.9" (2048×2732) — if iPad supported',
    viewport: { width: 1024, height: 1366 },
    deviceScaleFactor: 2,
  },
  {
    platform: 'android',
    name: 'phone',
    description: 'Android phone (1080×1920)',
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 3,
  },
  {
    platform: 'android',
    name: 'tablet-10',
    description: 'Android 10" tablet (1600×2560)',
    viewport: { width: 800, height: 1280 },
    deviceScaleFactor: 2,
  },
]

function loadScreensConfig () {
  if (!existsSync(SCREENS_CONFIG)) {
    console.warn(`⚠  No ${SCREENS_CONFIG}`)
    console.warn('   Copy templates/store-screens.config.json from expo-store-publishing-kit to scripts/store-screens.config.json\n')
    return { screens: DEFAULT_SCREENS, manualNotes: [] }
  }
  try {
    const raw = JSON.parse(readFileSync(SCREENS_CONFIG, 'utf8'))
    const screens = Array.isArray(raw.screens) && raw.screens.length ? raw.screens : DEFAULT_SCREENS
    const manualNotes = Array.isArray(raw.manualNotes) ? raw.manualNotes : []
    return { screens, manualNotes }
  } catch (e) {
    console.error('Invalid store-screens.config.json:', e.message)
    process.exit(1)
  }
}

function prompt (question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans) }))
}

function px (device) {
  return `${device.viewport.width * device.deviceScaleFactor}×${device.viewport.height * device.deviceScaleFactor}`
}

function sleep (ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function ensureAuth (browser) {
  if (existsSync(AUTH_FILE)) {
    console.log('✓ Reusing saved session:', AUTH_FILE)
    return
  }

  console.log('\n🔐 No saved session.')
  console.log(`   Browser opens: ${BASE_URL}`)
  console.log('   Log in, then press Enter here.\n')

  mkdirSync(dirname(AUTH_FILE), { recursive: true })

  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(BASE_URL)

  await prompt('   Press Enter after login... ')

  await context.storageState({ path: AUTH_FILE })
  await context.close()

  console.log('\n✓ Session saved.\n')
}

async function captureDevice (browser, device, screens) {
  const outDir = join(OUT_DIR, device.platform, device.name)
  mkdirSync(outDir, { recursive: true })

  const context = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: device.deviceScaleFactor,
    storageState: AUTH_FILE,
    userAgent: device.platform === 'ios'
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  })

  const page = await context.newPage()

  for (const screen of screens) {
    try {
      await page.goto(`${BASE_URL}${screen.route}`, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      })
      if (screen.waitFor) {
        await page.waitForSelector(screen.waitFor, { timeout: 8_000 }).catch(() => {})
      }
      await sleep(1_500)
      const file = join(outDir, `${screen.label}.png`)
      await page.screenshot({ path: file, fullPage: false })
      console.log(`  ✓ ${screen.label}.png`)
    } catch (err) {
      console.warn(`  ⚠ ${screen.label}: ${err.message}`)
    }
  }

  await context.close()
}

async function main () {
  const args = process.argv.slice(2)
  const resetSession = args.includes('--reset-session')
  const platformFilter = args.find(a => a.startsWith('--platform='))?.split('=')[1]
  const deviceFilter = args.find(a => a.startsWith('--device='))?.split('=')[1]

  if (resetSession && existsSync(AUTH_FILE)) {
    rmSync(AUTH_FILE)
    console.log('✓ Session cleared.\n')
  }

  const { screens, manualNotes } = loadScreensConfig()

  console.log('══════════════════════════════════════════')
  console.log('  Store screenshots (Playwright)         ')
  console.log('══════════════════════════════════════════')
  console.log(`APP_ROOT: ${APP_ROOT}`)
  console.log(`App URL:  ${BASE_URL}`)
  console.log(`Output:   ${OUT_DIR}\n`)

  const browser = await chromium.launch({ headless: false })

  try {
    await ensureAuth(browser)

    const targets = DEVICES.filter(d => {
      if (platformFilter && d.platform !== platformFilter) return false
      if (deviceFilter && d.name !== deviceFilter) return false
      return true
    })

    if (!targets.length) {
      console.error('No devices match --platform / --device')
      process.exit(1)
    }

    for (const device of targets) {
      console.log(`\n📱 ${device.name}  ${px(device)}  (${device.description})`)
      await captureDevice(browser, device, screens)
    }

    console.log('\n✅ Done.')
    for (const d of targets) {
      console.log(`   ${d.platform}/${d.name}: ${px(d)} px`)
    }

    const notes = manualNotes.length
      ? manualNotes
      : ['Any screen that needs camera, BLE, push notifications, or native-only UI — capture on device or with designer mockups.']
    console.log('\n⚠  Manual / designer:')
    for (const n of notes) console.log(`   • ${n}`)
  } finally {
    await browser.close()
  }
}

main().catch(err => {
  console.error('\n❌', err.message)
  process.exit(1)
})
