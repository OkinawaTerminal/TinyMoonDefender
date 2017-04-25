import GameScreen from './game-screen'

export default class ScreenManager {
  constructor(game) {
    this.game = game
    this.screen = new GameScreen(game)
    this.screen.load()
  }

  update() {
    this.screen.update()
  }

  render(renderer) {
    this.screen.render(renderer)
  }

  resize(width, height) {
    this.screen.resize(width, height)
  }

  dispose() {
    this.screen.dispose()
  }
}
