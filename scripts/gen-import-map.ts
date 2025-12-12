import fs from 'fs'
import path from 'path'
import { generateImportMap } from 'payload'
import config from '../payload.config'

async function main() {
  const resolvedConfig = await Promise.resolve(config)
  const importMapPath = path.join(process.cwd(), '.payload/import-map.js')
  console.log('resolved.admin keys', resolvedConfig?.admin ? Object.keys(resolvedConfig.admin) : [])
  console.log('using import map file', importMapPath)
  await generateImportMap(resolvedConfig, {
    log: true,
    force: true,
    importMapFilePath: importMapPath as unknown as string,
  })
  console.log('generated', fs.existsSync(importMapPath))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
