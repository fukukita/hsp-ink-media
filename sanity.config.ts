'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { createPublishWithDatesAction } from './sanity/actions/publishWithDates'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // 記事の「公開」ボタンだけ差し替えて、公開日と更新日を自動で入れる
    actions: (prev, context) =>
      context.schemaType === 'post'
        ? prev.map((originalAction) =>
            originalAction.action === 'publish'
              ? createPublishWithDatesAction(originalAction)
              : originalAction
          )
        : prev,
  },
})
