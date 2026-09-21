import { defineCliConfig } from 'sanity/cli'

// CLI（npx sanity ...）用の接続先。Studio本体の設定は sanity.config.ts。
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jgmm0gpv',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
