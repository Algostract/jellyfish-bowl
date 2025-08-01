// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    ignores: ['**/src-tauri/**', '**/prisma/**'],
  },
  {
    rules: {
      'vue/html-self-closing': 'off',
    },
  },
])
