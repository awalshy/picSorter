import {isWhatsAppPicture, getDateWA} from '../../src/utils/whatsapp'
// eslint-disable-next-line unicorn/prefer-node-protocol
import {strict as assert} from 'assert'

describe('Testing isWhatsAppPicture function', () => {
  it('Valid dates', () => {
    assert.equal(isWhatsAppPicture('IMG-20180528-WA0000.jpg'), true)
    assert.equal(isWhatsAppPicture('IMG-20200108-WA0003.jpg'), true)
  })
  it('Invalid Dates', () => {
    assert.equal(isWhatsAppPicture('IMG-2020032-WA0003.jpg'), false)
  })
})

describe('Testing getDateWA function', () => {
  it('Valid return date - 2018 05 28', () => {
    assert.equal(getDateWA('IMG-20180528-WA0000.jpg'), new Date('2018/05/28').getTime())
  })
  it('Valid return date - 2020 01 18', () => {
    assert.equal(getDateWA('IMG-20200118-WA0003.jpg'), new Date('2020/01/18').getTime())
  })
  it('Invalid size returns undefined', () => {
    assert.equal(getDateWA('IMG-2020032-WA0003.jpg'), undefined)
  })
  it('Invalid month returns undefined', () => {
    assert.equal(getDateWA('IMG-20200012-WA0000.jpg'), undefined)
  })
})
