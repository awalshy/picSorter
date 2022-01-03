/* eslint-disable unicorn/prefer-node-protocol */
import {getPath} from '../../src/utils/get-path'
// eslint-disable-next-line unicorn/prefer-node-protocol
import {strict as assert} from 'assert'
import {platform} from 'process'

describe('Testing getPath funtion', () => {
  if (platform === 'linux') {
    it('Folder and File', () => {
      assert.equal(getPath('folder', 'filename.ts'), 'folder/filename.ts')
    })

    it('4 Folders with filename', () => {
      assert.equal(getPath('folder1', 'folder2', 'folder3', 'folder4', 'filename.ts'), 'folder1/folder2/folder3/folder4/filename.ts')
    })

    it('Folder name with already a slash', () => {
      assert.equal(getPath('folder/', 'filename.ts'), 'folder/filename.ts')
    })

    it('Folder name with backslash', () => {
      assert.equal(getPath('.\\example', 'filename.ts'), './example/filename.ts')
    })

    it('Folder in path with a slash', () => {
      assert.equal(getPath('folder/', 'path/', 'filename.ts'), 'folder/path/filename.ts')
    })

    it('Remove all backslashes in path', () => {
      assert.equal(getPath('folder\\', '\\folder', 'filename.ts'), 'folder/folder/filename.ts')
    })
  } else if (platform === 'win32') {
    it('Folder and File', () => {
      assert.equal(getPath('folder', 'filename.ts'), 'folder\\filename.ts')
    })

    it('4 Folders with filename', () => {
      assert.equal(getPath('folder1', 'folder2', 'folder3', 'folder4', 'filename.ts'), 'folder1\\folder2\\folder3\\folder4\\filename.ts')
    })

    it('Folder name with already a slash', () => {
      assert.equal(getPath('folder/', 'filename.ts'), 'folder\\filename.ts')
    })

    it('Folder name with backslash', () => {
      assert.equal(getPath('.\\example', 'filename.ts'), '.\\example\\filename.ts')
    })

    it('Folder in path with a slash', () => {
      assert.equal(getPath('folder/', 'path/', 'filename.ts'), 'folder\\path\\filename.ts')
    })

    it('Remove all backslashes in path', () => {
      assert.equal(getPath('folder\\', '\\folder', 'filename.ts'), 'folder\\folder\\filename.ts')
    })
  }
})
