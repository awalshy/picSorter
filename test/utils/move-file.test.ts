import {isMeme, isValidDate} from '../../src/utils/move-file'
// eslint-disable-next-line unicorn/prefer-node-protocol
import {strict as assert} from 'assert'

describe('Testing isValidDate function', () => {
  it('Check that valid date returns true', () => {
    assert.equal(isValidDate(new Date('12/10/23 15:03')), true)
    assert.equal(isValidDate(new Date('12/12/21')), true)
  })
  it('Check that invalid date returns false', () => {
    assert.equal(isValidDate(new Date('12:10:23 15:03')), false)
    assert.equal(isValidDate(new Date('15:03')), false)
  })
})

describe('Testing isMeme function', () => {
  it('Check that with FB_IMG_ it considers the picture as a meme', () => {
    assert.equal(isMeme('FB_IMG_1221.jpg'), true)
  })
  it('Check that normal images is are not considered as meme', () => {
    assert.equal(isMeme('IMG_21202312.jpg'), false)
  })
  it('Check that only FB_ is not a meme', () => {
    assert.equal(isMeme('FB_1221.jpg'), false)
  })
})
