import OpenSimplexNoise from 'open-simplex-noise'
import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  DataTexture,
  RGBAFormat
} from 'three'

export default class Planet {
  constructor() {
    const simplex = new OpenSimplexNoise(Date.now())
    const texWidth = 128
    const texHeight = 128

    const genTexData = (iterCount, x, y, persistence, scale, low, high) => {
      let maxAmp = 0
      let amp = 1
      let freq = scale
      let noise = 0

      for (let i = 0; i < iterCount; ++i) {
        noise += simplex.noise2D(x * freq, y * freq) * amp
        maxAmp += amp
        amp *= persistence
        freq *= 2
      }

      noise /= maxAmp
      noise = noise * (high - low) / 2 + (high + low) / 2
      return noise
    }

    const dataArray = new Uint8Array(texWidth * texHeight * 4)
    for (let x = 0; x < texWidth; x++) {
      for (let y = 0; y < texHeight; y++) {
        const i = (x + y * texWidth) * 4
        const value = Math.floor(genTexData(4, x, y, 0.75, 0.1, 0, 255))
        dataArray[i] = value
        dataArray[i + 1] = value
        dataArray[i + 2] = value
        dataArray[i + 3] = 255
      }
    }

    const texture = new DataTexture(dataArray, texWidth, texHeight, RGBAFormat)
    texture.needsUpdate = true

    const geometry = new BoxGeometry(1, 1, 1, 6, 6, 6)
    geometry.vertices.forEach((v) => { v.normalize() })
    const material = new MeshBasicMaterial({ map: texture })
    this.mesh = new Mesh(geometry, material)
  }
}
