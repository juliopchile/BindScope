import { test, expect } from '@playwright/test'

test('landing page renders BindScope header', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Game Keymap Availability' })).toBeVisible()
  await expect(page.getByLabel('Game search')).toBeVisible()
})
