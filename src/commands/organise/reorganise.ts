/* eslint-disable unicorn/prefer-node-protocol */
import {Command} from '@oclif/core'
import {cli} from 'cli-ux'
import * as fs from 'fs/promises'
import {renameFolder} from '../../utils/move-file'

export default class Reorganise extends Command {
  static description = 'Reorganize folder'

  static examples = [
    `$ picsorter-cli organise reorganise <folder-path>
      moved 2018/01_Event to 2018/Jan/Event
    `,
  ]

  static args = [
    {
      name: 'folder',
      required: true,
      description: 'The folder path to reorganise',
    },
  ]

  async run(): Promise<void> {
    const {args} = await this.parse(Reorganise)

    let dir = await fs.readdir(args.folder, {withFileTypes: true})
    dir = dir.filter(f => f.isDirectory() && f.name.includes('_'))

    if (dir.length === 0) {
      console.log('Not folder to reorganise found... You\'re all good !')
      return
    }

    const folder = dir.map(file => ({
      name: file.name,
      renamed: renameFolder(file.name, false),
    }))

    cli.table(folder, {
      name: {
        minWidth: 10,
      },
      renamed: {
        minWidth: 10,
      },
    })

    const c = await cli.confirm('Rename ?')
    if (!c) {
      cli.info('Aborted !')
      return
    }

    // Get months
    const months: string[] = []
    for (const file of folder) {
      const m = renameFolder(file.name, true)
      if (m && !months.includes(m))
        months.push(m)
    }
  
    console.log(months)

    // Create Months folders
    const mp = months.map(m => fs.mkdir(`${args.folder}/${m}`))
    await Promise.all(mp)

    // Create destination folders
    const dp = folder.map(file => fs.mkdir(`${args.folder}/${file.renamed}`))
    await Promise.all(dp)

    // Move folders
    const promises = folder.map(file => fs.rename(`${args.folder}/${file.name}`, `${args.folder}/${file.renamed}`))
    await Promise.all(promises)
    cli.log('Done !')
  }
}
