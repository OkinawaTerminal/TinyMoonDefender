import {
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  CubeTextureLoader,
  NearestFilter,
  Vector3
} from 'three'

import Instructions from './instructions'
import KeyReader from './key-reader'
import Planet from './planet'
import Player from './player'
import WaveManager from './wave-manager'
import { KeyCode } from './constants'

const path = 'res/space/256/'
const format = '.png'
const textureCube = new CubeTextureLoader().load([
  `${path}left${format}`,
  `${path}right${format}`,
  `${path}top${format}`,
  `${path}bottom${format}`,
  `${path}front${format}`,
  `${path}back${format}`
])
textureCube.minFilter = NearestFilter
textureCube.magFilter = NearestFilter

const States = {
  WAITING: 0,
  RUNNING: 1
}

export default class GameScreen {
  constructor(game) {
    this.game = game
    this.state = States.WAITING
  }

  load() {
    this.state = States.WAITING
    this.firstWait = true

    this.scene = new Scene()
    this.camera = new PerspectiveCamera(60, this.game.width / this.game.height, 0.1, 1000)
    this.camera.position.z = 2.3

    const halfWidth = this.game.width / 2
    const halfHeight = this.game.height / 2
    this.uiScene = new Scene()
    this.uiCamera = new OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight)
    this.uiCamera.position.z = 1
    this.uiCamera.lookAt(new Vector3(0, 0, 0))

    this.scene.background = textureCube

    this.planet = new Planet()
    this.scene.add(this.planet.mesh)

    const keyReader = new KeyReader(this.game)

    this.player = new Player(keyReader)
    this.player.obj.add(this.camera)
    this.planet.mesh.add(this.player.obj)

    this.player.onDeath(() => {
      this.state = States.WAITING
    })

    this.waveManager = new WaveManager(this.planet.mesh)

    this.instructions = new Instructions(2)
    this.uiScene.add(this.instructions.mesh)

    keyReader.on('pressed', (keyCode) => {
      if (keyCode === KeyCode.ENTER && this.state === States.WAITING) {
        this.state = States.RUNNING
        this.firstWait = false
        this.player.reset()
        this.waveManager.reset()
      }
    })

    const audio = document.createElement('audio')
    document.body.appendChild(audio)
    audio.src = 'res/reformat.mp3'
    audio.volume = 0.2
    audio.addEventListener('ended', () => {
      audio.currentTime = 0
      audio.play()
    }, false)
    audio.play()
  }

  update() {
    if (this.firstWait)
      return

    this.player.update()
    this.waveManager.update(this.player)
  }

  render(renderer) {
    renderer.clear()
    renderer.render(this.scene, this.camera)
    if (this.state === States.WAITING)
      renderer.render(this.uiScene, this.uiCamera)
  }

  resize(width, height) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    this.planetGeometry.dispose()
    this.planetMaterial.dispose()
  }
}
