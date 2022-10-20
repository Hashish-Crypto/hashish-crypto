import { _decorator, Component, Node, Vec3, EventTouch } from 'cc'
import Direction from '../../enums/Direction'

const { ccclass } = _decorator

@ccclass('JoystickManager')
export class JoystickManager extends Component {
  private _ring: Node | null = null
  private _ball: Node | null = null
  private _maxRadius: number = 100
  private _piDividedBy4 = Math.PI / 4
  public move: Direction = Direction.IDLE_DOWN

  onLoad() {
    this._ring = this.node.getChildByName('Ring')
    this._ball = this._ring.getChildByName('Ball')

    this.node.on(Node.EventType.TOUCH_START, this._touchStart, this)
    // this.node.on(Node.EventType.TOUCH_MOVE, this._touchMove, this)
    // this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this)
    // this.node.on(Node.EventType.TOUCH_CANCEL, this._touchEnd, this)
  }

  onDisable() {
    this.node.off(Node.EventType.TOUCH_START, this._touchStart, this)
    // this.node.off(Node.EventType.TOUCH_MOVE, this._touchMove, this)
    // this.node.off(Node.EventType.TOUCH_END, this._touchEnd, this)
    // this.node.off(Node.EventType.TOUCH_CANCEL, this._touchEnd, this)
  }

  private _touchStart(event: EventTouch) {
    const touchLocation = event.getUILocation()
    const touchPosition = new Vec3(touchLocation.x, touchLocation.y)
    const movementVector = touchPosition.subtract(this._ring.getWorldPosition())
    const distance = movementVector.length()

    if (distance < this._maxRadius) {
      this._ball.setPosition(movementVector)
    } else {
      this._ball.setPosition(movementVector.normalize().multiplyScalar(this._maxRadius))
    }

    this._setMovement(movementVector.normalize())
  }

  // private _touchMove(event: EventTouch) {
  //   const location = event.getTouches()[0].getUILocation()
  //   const touchPosition = new Vec3(location.x, location.y)
  //   const moveVector = touchPosition.subtract(this._ring.getPosition())
  //   const distance = moveVector.length()

  //   if (this._maxRadius > distance) {
  //     this._ball.setPosition(moveVector)
  //   } else {
  //     this._ball.setPosition(moveVector.normalize().multiplyScalar(this._maxRadius))
  //   }

  //   this._setMove(moveVector.normalize())
  // }

  // private _touchEnd(event: EventTouch) {
  //   const location = event.getUILocation()
  //   const touchPosition = new Vec3(location.x, location.y)
  //   const moveVector = touchPosition.subtract(this._ring.getPosition())

  //   const vector = moveVector.normalize()
  //   if (vector.x < this._piDividedBy4 && vector.x > -this._piDividedBy4 && vector.y >= this._piDividedBy4) {
  //     this.move = Direction.IDLE_UP
  //   } else if (vector.x >= this._piDividedBy4 && vector.y < this._piDividedBy4 && vector.y > -this._piDividedBy4) {
  //     this.move = Direction.IDLE_RIGHT
  //   } else if (vector.x < this._piDividedBy4 && vector.x > -this._piDividedBy4 && vector.y <= -this._piDividedBy4) {
  //     this.move = Direction.IDLE_DOWN
  //   } else if (vector.x <= -this._piDividedBy4 && vector.y < this._piDividedBy4 && vector.y > -this._piDividedBy4) {
  //     this.move = Direction.IDLE_LEFT
  //   }

  //   this._ball.setPosition(new Vec3())
  // }

  private _setMovement(vector: Vec3) {
    if (
      vector.x <= Math.cos((Math.PI / 8) * 3) &&
      vector.x >= Math.cos((Math.PI / 8) * 5) &&
      vector.y >= Math.sin((Math.PI / 8) * 3)
    ) {
      console.log('UP')
      this.move = Direction.UP
    } else if (
      vector.x < Math.cos(Math.PI / 8) &&
      vector.x > Math.cos((Math.PI / 8) * 3) &&
      vector.y > Math.sin(Math.PI / 8) &&
      vector.y < Math.sin((Math.PI / 8) * 3)
    ) {
      console.log('UP_RIGHT')
      this.move = Direction.UP_RIGHT
    } else if (
      vector.x >= Math.cos(Math.PI / 8) &&
      vector.y <= Math.sin(Math.PI / 8) &&
      vector.y >= Math.sin((Math.PI / 8) * 15)
    ) {
      console.log('RIGHT')
      this.move = Direction.RIGHT
    } else if (
      vector.x < Math.cos((Math.PI / 8) * 15) &&
      vector.x > Math.cos((Math.PI / 8) * 13) &&
      vector.y < Math.sin((Math.PI / 8) * 15) &&
      vector.y > Math.sin((Math.PI / 8) * 13)
    ) {
      console.log('RIGHT_DOWN')
      this.move = Direction.RIGHT_DOWN
    } else if (
      vector.x <= Math.cos((Math.PI / 8) * 13) &&
      vector.x >= Math.cos((Math.PI / 8) * 11) &&
      vector.y <= Math.sin((Math.PI / 8) * 13)
    ) {
      console.log('DOWN')
      this.move = Direction.DOWN
    } else if (
      vector.x < Math.cos((Math.PI / 8) * 11) &&
      vector.x > Math.cos((Math.PI / 8) * 9) &&
      vector.y > Math.sin((Math.PI / 8) * 11) &&
      vector.y < Math.sin((Math.PI / 8) * 9)
    ) {
      console.log('DOWN_LEFT')
      this.move = Direction.DOWN_LEFT
    } else if (
      vector.x <= Math.cos((Math.PI / 8) * 9) &&
      vector.y >= Math.sin((Math.PI / 8) * 9) &&
      vector.y <= Math.sin((Math.PI / 8) * 7)
    ) {
      console.log('LEFT')
      this.move = Direction.LEFT
    } else if (
      vector.x > Math.cos((Math.PI / 8) * 7) &&
      vector.x < Math.cos((Math.PI / 8) * 5) &&
      vector.y > Math.sin((Math.PI / 8) * 7) &&
      vector.y < Math.sin((Math.PI / 8) * 5)
    ) {
      console.log('LEFT_UP')
      this.move = Direction.LEFT_UP
    }
  }
}
