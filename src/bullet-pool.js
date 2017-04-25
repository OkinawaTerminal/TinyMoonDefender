export default class BulletPool {

  constructor(BulletType) {
    this.BulletType = BulletType
    this.active = []
    this.inactive = []
  }

  getBullet() {
    let bullet

    if (this.inactive.length > 0)
      bullet = this.inactive.pop().reset()
    else
      bullet = new this.BulletType(this)

    this.active.push(bullet)
    return bullet
  }

  update() {
    const toDeactivate = []

    for (let i = 0; i < this.active.length; i++) {
      const bullet = this.active[i]
      if (bullet.update()) {
        toDeactivate.push(bullet)
        bullet.dispose()
      }
    }

    for (let i = 0; i < toDeactivate.length; i++) {
      const bullet = toDeactivate[i]
      const index = this.active.indexOf(bullet)
      if (index !== -1)
        this.active.splice(index, 1)

      this.inactive.push(bullet)
    }
  }

  reset() {
    for (let i = 0; i < this.active.length; i++) {
      const bullet = this.active[i]
      bullet.dispose()
      this.inactive.push(bullet)
    }
    this.active = []
  }
}
