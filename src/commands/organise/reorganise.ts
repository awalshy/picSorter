import {Command} from '@oclif/core'
import {cli} from 'cli-ux'

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
      required: false,
      description: 'The folder path to reorganise',
    },
  ]

  async run(): Promise<void> {
    const {args} = await this.parse(Reorganise)

    let folder = args.folder
    if (!folder)
      folder = await cli.prompt('Folder to reorganise')
  }
}
