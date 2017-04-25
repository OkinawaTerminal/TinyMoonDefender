import { EventEmitter } from 'events'

export default class KeyReader extends EventEmitter {
  constructor(game) {
    super()
    this.game = game
    this.pressed = new Set()

    this.game.container.addEventListener('keydown', (evt) => {
      const keyCode = evt.keyCode || evt.charCode || evt.which

      if (!this.pressed.has(keyCode))
        this.emit('pressed', keyCode)

      this.pressed.add(keyCode)
      evt.preventDefault()
    }, false)

    this.game.container.addEventListener('keyup', (evt) => {
      const keyCode = evt.keyCode || evt.charCode || evt.which

      if (this.pressed.has(keyCode))
        this.emit('released', keyCode)

      this.pressed.delete(keyCode)
      evt.preventDefault()
    }, false)
  }

  isDown(keyCode) {
    return this.pressed.has(keyCode)
  }

  isUp(keyCode) {
    return !this.pressed.has(keyCode)
  }
}
