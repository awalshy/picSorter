import {Command, Flags} from '@oclif/core'
import {cli} from 'cli-ux'
import * as inquirer from 'inquirer'

export default class Generate extends Command {
  static description = 'Generate json or txt file with events'

  static examples = [
    `$ picsorter-cli event generate <folder-path>
      generated json
    `,
  ]

  static args = [
    {
      name: 'folder',
      required: false,
      description: 'The folder path where to generate event files',
    },
  ]

  static flags = {
    format: Flags.string({
      char: 'f',
      description: 'Format: json or txt',
      required: false,
    }),
    recursive: Flags.boolean({
      char: 'r',
      description: 'Create file in all sub-folders',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Generate)

    let folder = args.folder
    if (!folder)
      folder = await cli.prompt('Folder were to generate files')
    let format = flags.format
    if (!format)
      format = await inquirer.prompt([{
        name: 'File format',
        message: 'select a format',
        type: 'list',
        choices: [{name: 'json'}, {name: 'txt'}],
      }])

    const bar = cli.progress()
    bar.start()
    let progress = 0
    const timer = setInterval(() => {
      progress += 5
      bar.update(progress)
      if (progress === 100) {
        bar.stop()
        clearInterval(timer)
      }
    }, 500)
  }
}
