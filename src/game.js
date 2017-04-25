import {
  WebGLRenderer
} from 'three'

import ScreenManager from './screen-manager'

export default class Game {
  constructor(container) {
    this.container = container
    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.autoClear = false
    this.renderer.domElement.style.display = 'block'
    container.appendChild(this.renderer.domElement)

    this.screenManager = new ScreenManager(this)

    const loop = () => {
      this.screenManager.update()
      this.screenManager.render(this.renderer)
      requestAnimationFrame(loop)
    }

    const resize = () => {
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.screenManager.resize(this.container.clientWidth, this.container.clientHeight)
    }

    window.addEventListener('resize', resize)
    loop()
  }


  get width() {
    return this.container.clientWidth
  }


  get height() {
    return this.container.clientHeight
  }
}
