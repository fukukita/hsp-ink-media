import {
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from 'sanity'

// 「公開」ボタンを押した瞬間に、日付を自動で書き込む。
//
//   publishedAt（公開日）… まだ空のときだけ、公開した日時を入れる。
//                          自分で日付を選んでいた場合はそのまま残す。
//   updatedAt（更新日）  … すでに公開済みの記事を公開し直したときだけ、その日時に書き換える。
//                          初回公開では入れない（公開日と同じ日付になってしまうため）。
//
// Sanityが自動で持っている _updatedAt は、記事の手直しだけでなく
// スクリプトでまとめて手を入れたときにも動いてしまう。
// 読者に見せる更新日は自前のフィールドで持ち、公開の操作だけで動くようにしている。
export function createPublishWithDatesAction(
  originalAction: DocumentActionComponent
): DocumentActionComponent {
  const PublishWithDates: DocumentActionComponent = (props: DocumentActionProps) => {
    const originalResult = originalAction(props)
    const { patch } = useDocumentOperation(props.id, props.type)

    if (!originalResult) return originalResult

    return {
      ...originalResult,
      onHandle: () => {
        const now = new Date().toISOString()
        patch.execute(
          props.published
            ? [{ setIfMissing: { publishedAt: now } }, { set: { updatedAt: now } }]
            : [{ setIfMissing: { publishedAt: now } }]
        )
        originalResult.onHandle?.()
      },
    }
  }

  PublishWithDates.action = originalAction.action
  return PublishWithDates
}
