import {Command, Flags} from '@oclif/core'
import {cli} from 'cli-ux'

export default class List extends Command {
  static description = 'List events in folder'

  static examples = [
    `$ picsorter-cli event list <folder-path>
      gathering information
    `,
  ]

  static args = [
    {
      name: 'folder',
      required: false,
      description: 'The folder path where to look for event files',
    },
  ]

  static flags = {
    recursive: Flags.boolean({
      char: 'r',
      description: 'Look in all sub-folders',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {args} = await this.parse(List)

    let folder = args.folder
    if (!folder)
      folder = await cli.prompt('Folder were to generate files')

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
