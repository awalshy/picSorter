/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/prefer-node-protocol */
import {Command, Flags} from '@oclif/core'
import * as fs from 'fs/promises'
import cli from 'cli-ux'
import * as notifier from 'node-notifier'
import * as ExifReader from 'exifreader'
import path = require('path')
import {moveFile} from '../../utils/move-file'
import {getPath} from '../../utils/get-path'
import {cwd} from 'process'

export default class Sort extends Command {
  static description = 'Sort Images by year/month/date from folder'

  static examples = [
    `$ picsorter-cli sort <folder-path>
      2057 images found and sortable
    `,
  ]

  static flags = {
    silent: Flags.boolean({
      char: 's',
      description: 'Silence - No notification no logs',
      required: false,
    }),
    forceSilence: Flags.boolean({
      description: 'Silence Forced - No logs',
    }),
  }

  static args = [
    {
      name: 'srcFolder',
      required: false,
      description: 'The folder path to sort',
    },
    {
      name: 'destFolder',
      require: false,
      description: 'The folder where the sorted images will be moved to',
    },
  ]

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Sort)

    // Get Missing Information
    let srcFolderPath = args.srcFolder
    if (!srcFolderPath)
      srcFolderPath = await cli.prompt('Source Folder')
    let destFolderPath = args.destFolder
    if (!destFolderPath)
      destFolderPath = await cli.prompt('Destination Folder')
    try {
      await fs.access(destFolderPath)
    } catch {
      const create  = await cli.confirm('The folder does not exist. Would you like to create it ?')
      if (!create)
        this.error('The Folder does not exist', {exit: 1})
      await fs.mkdir(destFolderPath)
    }

    // Gather information
    cli.action.start('Reading folder')
    const dir = await fs.readdir(srcFolderPath, {
      withFileTypes: true,
    }).then(res => res.filter(f => !f.isDirectory()))
    const pictureCount = dir.length
    cli.action.stop()
    if (!flags.forceSilence)
      this.log(`Found ${pictureCount} pictures and videos in the folder`)

    console.log(cwd())

    // Launch bar and sort files
    const progress = cli.progress({
      format: 'Sorting Pictures | {bar} | {value}/{total} Images',
    })
    progress.start(dir.length, 0)
    for (const [index, file] of dir.entries()) {
      console.log('\nHERE', getPath(srcFolderPath, file.name))
      const f = await fs.readFile(getPath(srcFolderPath, file.name))
      const ex = ExifReader.load(f)
      await moveFile(file.name, srcFolderPath, destFolderPath, ex.DateTimeOriginal)
      progress.update(index)
    }

    progress.stop()
    if (!flags.forceSilence)
      this.log('Finished sorting pictures. Enjoy !')
    if (!flags.silent)
      notifier.notify({
        title: 'Sorting Finished !',
        message: 'Your pictures are sorted in this folder',
        icon: path.join(__dirname, '../../assets/icon.png'),
      })
  }
}
