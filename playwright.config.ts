import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'
import path from 'path'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

config({ path: path.resolve(__dirname, '.env') })

const serverPort = process.env.SERVERPORT || 3001
const BASE_URL = `http://localhost:${serverPort}`

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'yarn mock:server',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe'
  }
})
