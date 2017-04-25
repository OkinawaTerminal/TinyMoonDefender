import {
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  TextureLoader,
  Object3D
} from 'three'

const uiScale = 4

const textureWidthPx = 128

const numberWidthPx = 8
const numberHeightPx = 8
const numberWidth = numberWidthPx * uiScale
const numberHeight = numberHeightPx * uiScale

const numberUvScaleX = numberWidthPx / textureWidthPx

const labelWidthPx = 35
const labelHeightPx = 8
const labelOffsetPx = 80
const labelWidth = labelWidthPx * uiScale
const labelHeight = labelHeightPx * uiScale

const labelUvScaleX = labelWidthPx / textureWidthPx
const labelOffsetX = labelOffsetPx / textureWidthPx


const numberGeometry = new PlaneGeometry(numberWidth, numberHeight)
numberGeometry.translate(-numberWidth / 2, -numberHeight / 2)

const titleGeometry = new PlaneGeometry(labelWidth, labelHeight)
titleGeometry.translate(-labelWidth / 2, -labelHeight / 2)

const textureLoader = new TextureLoader()
const texture = textureLoader.load('./res/score.png')

const vertexShader = document.getElementById('SectionVertexShader').textContent
const fragmentShader = document.getElementById('SectionFragmentShader').textContent

export default class ScoreUI {

  constructor() {
    this.score = 0

    this.obj = new Object3D()

    this.numberMeshes = []
    for (let i = 0; i < 8; i++) {
      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uvScaleX: { value: numberUvScaleX },
          uvOffsetX: { value: 0 },
          map: { value: texture }
        }
      })

      const mesh = new Mesh(numberGeometry, material)
    }
  }
}
