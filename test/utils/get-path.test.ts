import {getPath} from '../../src/utils/get-path'
// eslint-disable-next-line unicorn/prefer-node-protocol
import {strict as assert} from 'assert'

describe('Testinf getPath funtion', () => {
  it('Folder and File', () => {
    assert.equal(getPath('folder', 'filename.ts'), 'folder/filename.ts')
  })
})
