import {
  Vector3
} from 'three'

const angleBetween = (function angleBetweenInit() {
  const tempVec1 = new Vector3()
  const tempVec2 = new Vector3()

  return function angleBetweenBody(a, b) {
    tempVec1.set(0, 0, 1).applyQuaternion(a)
    tempVec2.set(0, 0, 1).applyQuaternion(b)
    const angle = tempVec1.angleTo(tempVec2)
    return angle
  }
}())


function collides(q1, r1, q2, r2) {
  const angle = angleBetween(q1, q2)
  if (angle < r1 + r2)
    return true
  return false
}


function randInt(max) {
  return Math.floor(Math.random() * max)
}


export {
  angleBetween,
  collides,
  randInt
}
