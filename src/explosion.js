import {
  TextureLoader,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  NearestFilter,
  DoubleSide
} from 'three'

import Counter from './counter'

const textureLoader = new TextureLoader()
const texture = textureLoader.load('res/explosion.png')
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter

const geometry = new PlaneGeometry(0.2, 0.2)
geometry.translate(0, 0, 1.05)

const material = new ShaderMaterial({
  vertexShader: document.getElementById('AnimationVertexShader').textContent,
  fragmentShader: document.getElementById('AnimationFragmentShader').textContent,
  uniforms: {
    frames: { value: 8.0 },
    offset: { value: 0.0 },
    map: { value: texture }
  },
  side: DoubleSide,
  transparent: true
})

export default class Explosion extends Counter {
  constructor(location) {
    super(32)
    this.mesh = new Mesh(geometry, material)
    if (location)
      this.mesh.quaternion.copy(location)
  }

  update() {
    super.update()
    const frame = Math.floor(this.frameCount / 4)
    const offset = frame / 8
    material.uniforms.offset.value = offset
  }
}
