import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDNキャッシュを使わず常にSanity APIから直接取得する。
  // useCdn: true にすると、Webhookでキャッシュを消しても
  // SanityのCDN側に古いデータが残り即時反映されない。
  useCdn: false,
})
