import { _decorator, Component, Node, Vec3, EventTouch } from 'cc'
import Direction from '../../enums/Direction'

const { ccclass } = _decorator

@ccclass('JoystickManager')
export class JoystickManager extends Component {
  private _ring: Node | null = null
  private _ball: Node | null = null
  private _maxRadius: number = 100
  private _piDividedBy8 = Math.PI / 8
  public movement: Direction = Direction.IDLE_DOWN
  public lastMovement: Direction = Direction.NULL
  public movementChanged: boolean = false

  onLoad() {
    this._ring = this.node.getChildByName('Ring')
    this._ball = this._ring.getChildByName('Ball')

    this.node.on(Node.EventType.TOUCH_START, this._touchStart, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this._touchMove, this)
    this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this)
    this.node.on(Node.EventType.TOUCH_CANCEL, this._touchEnd, this)
  }

  onDisable() {
    this.node.off(Node.EventType.TOUCH_START, this._touchStart, this)
    this.node.off(Node.EventType.TOUCH_MOVE, this._touchMove, this)
    this.node.off(Node.EventType.TOUCH_END, this._touchEnd, this)
    this.node.off(Node.EventType.TOUCH_CANCEL, this._touchEnd, this)
  }

  private _touchStart(event: EventTouch) {
    this.movementChanged = true
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

  private _touchMove(event: EventTouch) {
    this.movementChanged = true
    const touchLocation = event.getTouches()[0].getUILocation()
    const touchPosition = new Vec3(touchLocation.x, touchLocation.y)
    const movementVector = touchPosition.subtract(this._ring.getWorldPosition())
    const distance = movementVector.length()

    if (this._maxRadius > distance) {
      this._ball.setPosition(movementVector)
    } else {
      this._ball.setPosition(movementVector.normalize().multiplyScalar(this._maxRadius))
    }

    this._setMovement(movementVector.normalize())
  }

  private _touchEnd(event: EventTouch) {
    this.movementChanged = true
    const touchLocation = event.getUILocation()
    const touchPosition = new Vec3(touchLocation.x, touchLocation.y)
    const movementVector = touchPosition.subtract(this._ring.getWorldPosition())

    const vector = movementVector.normalize()
    if (
      vector.x <= Math.cos(this._piDividedBy8 * 3) &&
      vector.x >= Math.cos(this._piDividedBy8 * 5) &&
      vector.y >= Math.sin(this._piDividedBy8 * 3)
    ) {
      this.movement = Direction.IDLE_UP
    } else if (
      vector.x < Math.cos(this._piDividedBy8) &&
      vector.x > Math.cos(this._piDividedBy8 * 3) &&
      vector.y > Math.sin(this._piDividedBy8) &&
      vector.y < Math.sin(this._piDividedBy8 * 3)
    ) {
      this.movement = Direction.IDLE_UP_RIGHT
    } else if (
      vector.x >= Math.cos(this._piDividedBy8) &&
      vector.y <= Math.sin(this._piDividedBy8) &&
      vector.y >= Math.sin(this._piDividedBy8 * 15)
    ) {
      this.movement = Direction.IDLE_RIGHT
    } else if (
      vector.x < Math.cos(this._piDividedBy8 * 15) &&
      vector.x > Math.cos(this._piDividedBy8 * 13) &&
      vector.y < Math.sin(this._piDividedBy8 * 15) &&
      vector.y > Math.sin(this._piDividedBy8 * 13)
    ) {
      this.movement = Direction.IDLE_RIGHT_DOWN
    } else if (
      vector.x <= Math.cos(this._piDividedBy8 * 13) &&
      vector.x >= Math.cos(this._piDividedBy8 * 11) &&
      vector.y <= Math.sin(this._piDividedBy8 * 13)
    ) {
      this.movement = Direction.IDLE_DOWN
    } else if (
      vector.x < Math.cos(this._piDividedBy8 * 11) &&
      vector.x > Math.cos(this._piDividedBy8 * 9) &&
      vector.y > Math.sin(this._piDividedBy8 * 11) &&
      vector.y < Math.sin(this._piDividedBy8 * 9)
    ) {
      this.movement = Direction.IDLE_DOWN_LEFT
    } else if (
      vector.x <= Math.cos(this._piDividedBy8 * 9) &&
      vector.y >= Math.sin(this._piDividedBy8 * 9) &&
      vector.y <= Math.sin(this._piDividedBy8 * 7)
    ) {
      this.movement = Direction.IDLE_LEFT
    } else if (
      vector.x > Math.cos(this._piDividedBy8 * 7) &&
      vector.x < Math.cos(this._piDividedBy8 * 5) &&
      vector.y > Math.sin(this._piDividedBy8 * 7) &&
      vector.y < Math.sin(this._piDividedBy8 * 5)
    ) {
      this.movement = Direction.IDLE_LEFT_UP
    }

    this._ball.setPosition(new Vec3())
  }

  private _setMovement(vector: Vec3) {
    if (
      vector.x <= Math.cos(this._piDividedBy8 * 3) &&
      vector.x >= Math.cos(this._piDividedBy8 * 5) &&
      vector.y >= Math.sin(this._piDividedBy8 * 3)
    ) {
      this.movement = Direction.UP
    } else if (
      vector.x < Math.cos(this._piDividedBy8) &&
      vector.x > Math.cos(this._piDividedBy8 * 3) &&
      vector.y > Math.sin(this._piDividedBy8) &&
      vector.y < Math.sin(this._piDividedBy8 * 3)
    ) {
      this.movement = Direction.UP_RIGHT
    } else if (
      vector.x >= Math.cos(this._piDividedBy8) &&
      vector.y <= Math.sin(this._piDividedBy8) &&
      vector.y >= Math.sin(this._piDividedBy8 * 15)
    ) {
      this.movement = Direction.RIGHT
    } else if (
      vector.x < Math.cos(this._piDividedBy8 * 15) &&
      vector.x > Math.cos(this._piDividedBy8 * 13) &&
      vector.y < Math.sin(this._piDividedBy8 * 15) &&
      vector.y > Math.sin(this._piDividedBy8 * 13)
    ) {
      this.movement = Direction.RIGHT_DOWN
    } else if (
      vector.x <= Math.cos(this._piDividedBy8 * 13) &&
      vector.x >= Math.cos(this._piDividedBy8 * 11) &&
      vector.y <= Math.sin(this._piDividedBy8 * 13)
    ) {
      this.movement = Direction.DOWN
    } else if (
      vector.x < Math.cos(this._piDividedBy8 * 11) &&
      vector.x > Math.cos(this._piDividedBy8 * 9) &&
      vector.y > Math.sin(this._piDividedBy8 * 11) &&
      vector.y < Math.sin(this._piDividedBy8 * 9)
    ) {
      this.movement = Direction.DOWN_LEFT
    } else if (
      vector.x <= Math.cos(this._piDividedBy8 * 9) &&
      vector.y >= Math.sin(this._piDividedBy8 * 9) &&
      vector.y <= Math.sin(this._piDividedBy8 * 7)
    ) {
      this.movement = Direction.LEFT
    } else if (
      vector.x > Math.cos(this._piDividedBy8 * 7) &&
      vector.x < Math.cos(this._piDividedBy8 * 5) &&
      vector.y > Math.sin(this._piDividedBy8 * 7) &&
      vector.y < Math.sin(this._piDividedBy8 * 5)
    ) {
      this.movement = Direction.LEFT_UP
    }
  }
}
