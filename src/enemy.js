import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  TextureLoader,
  NearestFilter,
  DoubleSide,
  Object3D,
  Euler,
  Vector2,
  Quaternion
} from 'three'

import Counter from './counter'
import Explosion from './explosion'
import { randInt } from './utils'
import { ShipStates } from './constants'

const tempEuler = new Euler()
const tempQuat = new Quaternion()

const textureLoader = new TextureLoader()
const texture = textureLoader.load('res/enemy.png')
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter

const geometry = new PlaneGeometry(0.1, 0.1)
geometry.translate(0, 0, 1.05)

const angularRadius = Math.atan(0.05 / 1.05)

export default class Enemy {
  constructor(manager) {
    this.type = 'enemy'
    this.health = 3
    this.state = ShipStates.SPAWNING

    this.manager = manager
    this.bulletPool = manager.bulletPool

    this.obj = new Object3D()
    tempEuler.set(Math.random() * Math.PI, Math.random() * Math.PI * 2, 0)
    this.obj.quaternion.setFromEuler(tempEuler)

    this.material = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide, depthWrite: false, opacity: 0 })
    this.mesh = new Mesh(geometry, this.material)
    this.obj.add(this.mesh)

    this.rotationDelta = new Vector2(Math.random(), Math.random()).setLength(0.005)

    this.angularRadius = angularRadius

    this.spawnCounter = new Counter(60).onUpdate((frame, duration) => {
      const pct = frame / duration
      this.material.opacity = pct
      this.obj.scale.z = 1.5 - pct * 0.5
    }).onComplete(() => { this.state = ShipStates.NORMAL })

    this.fireCounter = new Counter(100).onComplete(() => {
      this.fireCounter.reset()
      this.fire()
    })
    this.fireCounter.frameCount = randInt(100)

    this.courseCounter = new Counter(randInt(300)).onComplete(() => {
      this.rotationDelta.rotateAround(this.mesh.position, Math.random() * Math.PI / 2 - Math.PI / 4)
      this.courseCounter.duration = randInt(300)
      this.courseCounter.reset()
    })

    this.hitCounter = new Counter(20).onUpdate((frame) => {
      const opacity = Math.floor(frame / 4) % 2
      this.material.opacity = opacity
    }).onComplete(() => {
      this.state = ShipStates.NORMAL
      this.hitCounter.reset()
    })

    this.explosion = new Explosion().onComplete(() => {
      this.dispose()
      this.manager.disposeOfEnemy(this)
    })
    this.explosion.mesh.visible = false
    this.obj.add(this.explosion.mesh)
  }

  fire() {
    for (let i = 0; i < 6; i++) {
      const bullet = this.bulletPool.getBullet()
      bullet.setLocation(this.obj.quaternion, this.mesh.rotation.z + i * Math.PI / 3)
      this.obj.parent.add(bullet.mesh)
    }
  }

  handleCollision(other) {
    if (this.state !== ShipStates.NORMAL)
      return

    if (other.type === 'player' && other.state !== ShipStates.NORMAL)
      return

    if (--this.health === 0) {
      this.mesh.visible = false
      this.explosion.mesh.visible = true
      this.state = ShipStates.DESTROYED
      return
    }

    this.state = ShipStates.HIT
  }

  update() {
    if (this.state === ShipStates.SPAWNING)
      this.spawnCounter.update()

    if (this.state === ShipStates.NORMAL || this.state === ShipStates.HIT) {
      this.fireCounter.update()
      this.courseCounter.update()

      tempEuler.set(this.rotationDelta.x, this.rotationDelta.y, 0)
      tempQuat.setFromEuler(tempEuler)
      this.obj.quaternion.multiply(tempQuat)

      this.mesh.rotation.z += 0.05
    }

    if (this.state === ShipStates.HIT) {
      this.hitCounter.update()
    }

    if (this.state === ShipStates.DESTROYED) {
      this.explosion.update()
    }
  }

  dispose() {
    this.obj.parent.remove(this.obj)
    this.material.dispose()
    this.manager.disposeOfEnemy(this)
  }
}
