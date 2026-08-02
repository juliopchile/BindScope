import { expect, test } from '@playwright/test'

/** Seed outside STARTER_POOL so Add is always available. */
const SEED_TITLE = 'OBS Studio'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bindscope.locale', 'en')
  })
})

test('home loads, Games add seed, visualizer + legend, layout toggle', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'BindScope', level: 1 })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Keyboard availability map' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Legend' })).toBeVisible()

  // Accessible name may include the selection badge (e.g. "Games 1 selected").
  await page.getByRole('button', { name: /^Games/ }).click()
  await expect(page.getByRole('region', { name: 'Games' })).toBeVisible()

  const search = page.getByRole('searchbox', { name: 'Search catalog' })
  await search.fill(SEED_TITLE)
  await page.getByRole('option', { name: new RegExp(SEED_TITLE) }).click()

  await expect(
    page.getByRole('region', { name: 'Games' }).getByRole('button', { name: `Remove ${SEED_TITLE}` }),
  ).toBeVisible()
  await expect(page.getByRole('group', { name: 'Keyboard availability map' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Legend' })).toBeVisible()

  const layout = page.getByLabel('Keyboard', { exact: true })
  await expect(layout).toHaveValue('ansi-full')
  await layout.selectOption('ansi-tkl')
  await expect(layout).toHaveValue('ansi-tkl')
  await expect(page.getByRole('group', { name: 'Keyboard availability map' })).toBeVisible()
})
