import {isMeme, isScreenshot, isValidDate, renameFolder} from '../../src/utils/move-file'
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

describe('Testing isScreenshot function', () => {
  it('Check that with Screenshot_ it considers the picture as a screenhshot', () => {
    assert.equal(isScreenshot('Screenshot_1221.jpg'), true)
  })
  it('Check that normal images is are not considered as meme', () => {
    assert.equal(isScreenshot('IMG_21202312.jpg'), false)
  })
})

describe('Testing renameFolder function', () => {
  it('06_Aprem Cerises', () => {
    assert.equal(renameFolder('06_Aprem Cerise'), 'Juin/Aprem Cerise')
  })
  it('12_Réveillon chez Clémence', () => {
    assert.equal(renameFolder('12_Réveillon chez Clémence'), 'Décembre/Réveillon chez Clémence')
  })
  it('Invalid month', () => {
    assert.equal(renameFolder('13_Invalid'), undefined)
  })
  it('Invalid format', () => {
    assert.equal(renameFolder('DossierNormal'), undefined)
  })
})
