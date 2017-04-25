export default class Counter {
  constructor(duration) {
    this.duration = duration
    this.frameCount = 0
    this.updateCallback = () => {}
    this.completeCallback = () => {}
  }

  onUpdate(updateCallback) {
    this.updateCallback = updateCallback
    return this
  }

  onComplete(completeCallback) {
    this.completeCallback = completeCallback
    return this
  }

  reset() {
    this.frameCount = 0
  }

  update() {
    if (this.frameCount > this.duration)
      return

    if (this.frameCount++ === this.duration) {
      this.completeCallback()
      return
    }

    this.updateCallback(this.frameCount, this.duration)
  }
}
