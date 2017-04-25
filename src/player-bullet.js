import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  TextureLoader,
  NearestFilter,
  DoubleSide,
  Quaternion,
  Euler
} from 'three'

const tempQuat = new Quaternion()
const tempEuler = new Euler()

const textureLoader = new TextureLoader()
const texture = textureLoader.load('res/player-bullet.png')
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter

const geometry = new PlaneGeometry(0.1, 0.1)
geometry.translate(0, 0, 1.05)

const angularRadius = Math.atan(0.025 / 1.05)

const material = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide, depthWrite: false })

export default class PlayerBullet {
  constructor(pool) {
    this.type = 'player_bullet'

    this.pool = pool
    this.mesh = new Mesh(geometry, material)
    this.angularRadius = angularRadius
    this.rotationQuaternion = new Quaternion()
    this.reset()
  }

  reset() {
    this.lifeCounter = 40
    return this
  }

  setLocation(quaternion, rotation) {
    tempEuler.set(0, 0, rotation)
    tempQuat.setFromEuler(tempEuler)
    this.mesh.quaternion.copy(quaternion.clone().multiply(tempQuat))

    tempEuler.set(0, 0.02, 0)
    this.rotationQuaternion.setFromEuler(tempEuler)
    return this
  }

  update() {
    this.mesh.quaternion.multiply(this.rotationQuaternion)
    if (--this.lifeCounter <= 0)
      return true
    return false
  }

  handleCollision() {
    this.lifeCounter = 0
  }

  dispose() {
    const parentMesh = this.mesh.parent
    parentMesh.remove(this.mesh)
  }
}

// export default class PlayerBulletPool {
//   constructor() {
//     this.active = []
//     this.inactive = []
//   }
//
//   getBullet() {
//     let bullet
//
//     if (this.inactive.length > 0)
//       bullet = this.inactive.pop().reset()
//     else
//       bullet = new PlayerBullet(this)
//
//     this.active.push(bullet)
//     return bullet
//   }
//
//   update() {
//     const toDeactivate = []
//     // if (this.active.length >= 2) {
//     //   debugger
//     // }
//     for (let i = 0; i < this.active.length; i++) {
//       const bullet = this.active[i]
//       if (bullet.update()) {
//         toDeactivate.push(bullet)
//         bullet.dispose()
//       }
//     }
//
//     for (let i = 0; i < toDeactivate.length; i++) {
//       const bullet = toDeactivate[i]
//       const index = this.active.indexOf(bullet)
//       if (index !== -1)
//         this.active.splice(index, 1)
//
//       this.inactive.push(bullet)
//     }
//   }
// }
