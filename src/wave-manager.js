import BulletPool from './bullet-pool'
import Enemy from './enemy'
import EnemyBullet from './enemy-bullet'
import { collides } from './utils'

export default class WaveManager {

  constructor(sceneParent) {
    this.sceneParent = sceneParent
    this.waveNumber = 0
    this.nextWaveCounter = 180
    this.enemies = []
    this.enemiesToDispose = new Set()
    this.bulletPool = new BulletPool(EnemyBullet)
  }

  reset() {
    for (let i = 0; i < this.enemies.length; i++)
      this.enemies[i].dispose()
    this.enemies = []
    this.enemiesToDispose.clear()

    this.waveNumber = 0
    this.nextWaveCounter = 180
    this.bulletPool.reset()
  }

  resetNextWaveCounter() {
    this.nextWaveCounter = 300
  }

  generateWave() {
    const numEnemiesToGenerate = Math.max(3, Math.min(this.waveNumber, 10))
    for (let i = 0; i < numEnemiesToGenerate; i++) {
      const enemy = new Enemy(this)
      this.sceneParent.add(enemy.obj)
      this.enemies.push(enemy)
    }
  }

  update(player) {
    if (this.enemies.length === 0 && --this.nextWaveCounter <= 0) {
      this.waveNumber++
      this.resetNextWaveCounter()
      this.generateWave()
      console.log(`Wave ${this.waveNumber} Incoming!`)
    }

    for (let i = 0; i < this.enemies.length; i++)
      this.enemies[i].update()

    this.bulletPool.update()

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i]
      if (collides(player.obj.quaternion, player.angularRadius, enemy.obj.quaternion, enemy.angularRadius)) {
        player.handleCollision(enemy)
        enemy.handleCollision(player)
      }

      for (let j = 0; j < player.bulletPool.active.length; j++) {
        const bullet = player.bulletPool.active[j]
        if (collides(bullet.mesh.quaternion, bullet.angularRadius, enemy.obj.quaternion, enemy.angularRadius)) {
          bullet.handleCollision(enemy)
          enemy.handleCollision(bullet)
        }
      }
    }

    for (let i = 0; i < this.bulletPool.active.length; i++) {
      const bullet = this.bulletPool.active[i]
      if (collides(bullet.mesh.quaternion, bullet.angularRadius, player.obj.quaternion, player.angularRadius)) {
        bullet.handleCollision(player)
        player.handleCollision(bullet)
      }
    }

    this.enemiesToDispose.forEach((enemy) => {
      const index = this.enemies.indexOf(enemy)
      if (index !== -1)
        this.enemies.splice(index, 1)
    })
    this.enemiesToDispose.clear()
  }

  disposeOfEnemy(enemy) {
    this.enemiesToDispose.add(enemy)
  }
}
