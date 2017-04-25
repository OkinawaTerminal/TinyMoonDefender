import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  TextureLoader,
  NearestFilter,
  Vector2,
  Quaternion,
  Object3D,
  Euler
} from 'three'

import BulletPool from './bullet-pool'
import Counter from './counter'
import Explosion from './explosion'
import PlayerBullet from './player-bullet'
import { KeyCode, ShipStates } from './constants'

const tempQuat = new Quaternion()

const textureLoader = new TextureLoader()
const texture = textureLoader.load('res/ship.png')
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter

const geometry = new PlaneGeometry(0.1, 0.1)
geometry.translate(0, 0, 1.05)

const angularRadius = Math.atan(0.05 / 1.05)


export default class Player {
  constructor(keyReader) {
    this.type = 'player'
    this.health = 5
    this.state = ShipStates.SPAWNING

    this.keys = keyReader

    this.obj = new Object3D()

    this.material = new MeshBasicMaterial({ transparent: true, map: texture, depthWrite: false })
    this.mesh = new Mesh(geometry, this.material)
    this.obj.add(this.mesh)

    this.facing = new Vector2(0, 1)
    this.rotationDelta = new Euler()

    this.angularRadius = angularRadius

    this.bulletPool = new BulletPool(PlayerBullet)

    this.deathCallback = () => {}

    this.spawnCounter = new Counter(100).onUpdate((frame, duration) => {
      const pct = frame / duration
      const angle = 5 * Math.PI / 8
      this.mesh.rotation.x = angle - pct * angle
    }).onComplete(() => { this.state = ShipStates.NORMAL })

    this.fireCounter = new Counter(30).onComplete(() => {
      this.fire()
      this.fireCounter.reset()
    })

    this.hitCounter = new Counter(20).onUpdate((frame) => {
      const opacity = Math.floor(frame / 4) % 2
      this.material.opacity = opacity
    }).onComplete(() => {
      this.state = ShipStates.NORMAL
      this.hitCounter.reset()
    })

    this.explosion = new Explosion(this.obj.quaternion).onComplete(() => {
      this.explosion.mesh.visible = false
      this.deathCallback()
    })
    this.obj.add(this.explosion.mesh)

    this.reset()
  }

  reset() {
    this.mesh.visible = true
    this.mesh.rotation.z = Math.PI / 2
    this.facing.set(0, 1)
    this.obj.quaternion.set(0, 0, 0, 1)
    this.mesh.rotation.x = 2 * Math.PI / 3 // hide player round back of planet
    this.explosion.mesh.visible = false

    this.spawnCounter.reset()
    this.fireCounter.reset()
    this.hitCounter.reset()
    this.explosion.reset()
    this.bulletPool.reset()

    this.state = ShipStates.SPAWNING
    this.health = 5
  }

  update() {
    if (this.state === ShipStates.SPAWNING)
      this.spawnCounter.update()

    if (this.state === ShipStates.NORMAL || this.state === ShipStates.HIT) {
      this.rotationDelta.set(0, 0, 0)

      if (this.keys.isDown(KeyCode.LEFT)) this.rotationDelta.y -= 1
      if (this.keys.isDown(KeyCode.RIGHT)) this.rotationDelta.y += 1
      if (this.keys.isDown(KeyCode.UP)) this.rotationDelta.x -= 1
      if (this.keys.isDown(KeyCode.DOWN)) this.rotationDelta.x += 1

      const sqAng = (this.rotationDelta.x * this.rotationDelta.x) + (this.rotationDelta.y * this.rotationDelta.y)
      if (sqAng > 1) {
        const ang = Math.sqrt(sqAng)
        this.rotationDelta.x /= ang
        this.rotationDelta.y /= ang
      }

      this.rotationDelta.x *= 0.01
      this.rotationDelta.y *= 0.01

      tempQuat.setFromEuler(this.rotationDelta)
      this.obj.quaternion.multiply(tempQuat)

      if (this.rotationDelta.x || this.rotationDelta.y) {
        this.facing.x = this.rotationDelta.y
        this.facing.y = -this.rotationDelta.x
      }

      const facingAngle = this.facing.angle()
      this.mesh.rotation.z = facingAngle

      this.fireCounter.update()
    }

    if (this.state === ShipStates.HIT)
      this.hitCounter.update()

    if (this.state === ShipStates.DESTROYED)
      this.explosion.update()

    this.bulletPool.update()
  }

  handleCollision(other) {
    if (this.state !== ShipStates.NORMAL)
      return

    if (other.type === 'enemy' && other.state !== ShipStates.NORMAL)
      return

    if (--this.health === 0) {
      this.mesh.visible = false
      this.explosion.mesh.visible = true
      this.state = ShipStates.DESTROYED
      return
    }

    this.state = ShipStates.HIT
  }

  fire() {
    for (let i = -1; i < 2; i++) {
      const bullet = this.bulletPool.getBullet()
      bullet.setLocation(this.obj.quaternion, this.mesh.rotation.z + i * Math.PI / 16)
      this.obj.parent.add(bullet.mesh)
    }
  }

  onDeath(callback) {
    this.deathCallback = callback
  }
}
