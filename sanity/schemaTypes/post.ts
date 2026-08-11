import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: '記事',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ（URL）',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '概要（記事一覧・SNS用）',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'mainImage',
      title: 'アイキャッチ画像',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'audience',
      title: '対象読者',
      type: 'string',
      options: {
        list: [
          { title: 'HSP向け', value: 'hsp' },
          { title: 'HSS型HSP向け', value: 'hss-hsp' },
          { title: '両方向け', value: 'both' },
        ],
        layout: 'radio',
      },
      initialValue: 'hss-hsp',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'カテゴリ（テーマ）',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: '本文', value: 'normal' },
            { title: '見出し2（H2）', value: 'h2' },
            { title: '見出し3（H3）', value: 'h3' },
            { title: '見出し4（H4）', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: '太字', value: 'strong' },
              { title: '斜体', value: 'em' },
              { title: '下線', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'リンク',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: '新しいタブで開く',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '代替テキスト（alt）',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'キャプション',
            },
          ],
        },
        {
          type: 'object',
          name: 'checklist',
          title: 'チェックリスト',
          fields: [
            {
              name: 'items',
              title: '項目',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: { items: 'items' },
            prepare({ items }: { items?: string[] }) {
              return {
                title: '☑ チェックリスト',
                subtitle: (items || []).join(' / '),
              }
            },
          },
        },
        {
          type: 'object',
          name: 'lineCallout',
          title: 'LINE誘導（記事内）',
          fields: [
            {
              name: 'text',
              title: '誘導文（任意）',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: { text: 'text' },
            prepare({ text }: { text?: string }) {
              return { title: '📢 LINE誘導', subtitle: text || '（文言なし）' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'relatedPosts',
      title: '関連記事',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      validation: (Rule) => Rule.max(3),
    }),
    // SEO設定
    defineField({
      name: 'seoTitle',
      title: 'SEOタイトル（省略時は記事タイトルを使用）',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'メタディスクリプション',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'mainImage',
    },
  },
})
