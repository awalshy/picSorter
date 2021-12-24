/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable no-new */
import {Command, Flags} from '@oclif/core'
import * as fs from 'fs/promises'
import exif from 'exifr'
import cli from 'cli-ux'
import * as notifier from 'node-notifier'
import {inspect} from 'util'
import path = require('path')

export default class Sort extends Command {
  static description = 'Sort Folder'

  static examples: [
    `$ picsorter-cli sort <folder-path>
      2057 images found and sortable
    `
  ]

  static flags = {
    silent: Flags.boolean({
      char: 's',
      description: 'Silence - No notification no logs',
      required: false,
    }),
  }

  static args = [
    {
      name: 'folder',
      required: true,
      description: 'The Folder Name to stats',
    },
  ]

  private getPath(folderName: string, ...other: string[]) {
    let res = folderName
    for (const n of other) {
      res += `/${n}`
    }

    return res
  }

  private async sortFile(date: Date, name: string, srcFolder: string, destFolder: string) {
    // check if folder exists
    const folderName = date.getFullYear().toString()
    try {
      await fs.access(this.getPath(destFolder, folderName))
    } catch {
      this.log(`Creating Dir ${this.getPath(destFolder, folderName)}`)
      await fs.mkdir(this.getPath(destFolder, folderName))
    }

    fs.rename(this.getPath(srcFolder, name), this.getPath(destFolder, folderName, name))
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Sort)

    const destFolderPath = await cli.prompt('Dossier de Destination')
    try {
      await fs.access(destFolderPath)
    } catch {
      const create  = await cli.confirm('Le dossier n\'existe pas. Voulez vous le créer ?')
      if (!create)
        this.error('Le dossier de destination n\'existe pas', {exit: 1})
      await fs.mkdir(destFolderPath)
    }

    cli.action.start('reading folder')
    let dir = await fs.readdir(args.folder, {
      withFileTypes: true,
    })
    dir = dir.filter(f => !f.isDirectory())

    setTimeout(() => {
      cli.action.stop()
      if (!flags.silent)
        notifier.notify({
          title: 'Sorting Finished !',
          message: 'Your pictures are sorted in this folder',
          icon: path.join(__dirname, '../../assets/icon.png'),
        })
    }, 5000)
    for (const file of dir) {
      const ex = await exif.parse(args.folder + file.name, ['DateTimeOriginal'])
      this.log(`${file.name} - ${inspect(ex, false, null, true)} - ${new Date(ex.DateTimeOriginal).toDateString()}`)
      await this.sortFile(ex.DateTimeOriginal, file.name, args.folder, destFolderPath)
    }
  }
}
