import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  NearestFilter
} from 'three'

const textureLoader = new TextureLoader()
const texture = textureLoader.load('res/instructions.png')
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter

const geometry = new PlaneGeometry(128, 128)
const material = new MeshBasicMaterial({ map: texture })

export default class Instructions {
  constructor(uiScale) {
    this.mesh = new Mesh(geometry, material)
    this.mesh.scale.x = uiScale
    this.mesh.scale.y = uiScale
  }
}
