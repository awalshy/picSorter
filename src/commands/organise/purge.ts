/* eslint-disable unicorn/prefer-node-protocol */
import {Command} from '@oclif/core'
import * as fs from 'fs/promises'
import {isMeme, isScreenshot} from '../../utils/move-file'

export default class Purge extends Command {
  static description = 'Purge folder from all screenshots and fb'

  static examples = [
    `$ picsorter-cli purge <folder-path>
      57 images deleted
    `,
  ]

  static args = [
    {
      name: 'folder',
      required: true,
      description: 'The folder path to purge',
    },
  ]

  async run(): Promise<void> {
    const {args} = await this.parse(Purge)

    try {
      await fs.access(args.folder)
    } catch {
      await fs.mkdir(args.folder)
    }

    let dir = await fs.readdir(args.folder, {
      withFileTypes: true,
    }).then(res => res.filter(f => !f.isDirectory()))

    dir = dir.filter(f => isMeme(f.name) || isScreenshot(f.name))
    console.log(dir.length)
    for (const file of dir) {
      console.log(`Deleting ${file.name}`)
      fs.rm(`${args.folder}/${file.name}`)
    }

    // notify({
    //   title: 'Purging finished',
    //   message: `Deleted ${dir.length} files`,
    //   icon: path.join(__dirname, '../../assets/icon.png')
    // })
  }
}
