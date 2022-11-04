import { _decorator, Component, RigidBody2D, Animation, Vec2, CCFloat, Node } from 'cc'
import Direction from '../enums/Direction'
import { JoystickManager } from '../UI/Joystick/JoystickManager'

const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  @property({ type: CCFloat })
  private velocity: number = 4

  @property({ type: Node })
  private joystickNode: Node | null = null

  public controllerEnabled: boolean = false
  public movementCommands: Direction[] = []
  public lastMovementCommand: Direction = Direction.NULL
  private _body: RigidBody2D | null = null
  private _animation: Animation | null = null
  private _cos = Math.cos(Math.PI / 4) + 8 - 8
  private _sin = Math.sin(Math.PI / 4) + 8 - 8
  private _joystick: JoystickManager | null = null

  onLoad() {
    this._body = this.node.getComponent(RigidBody2D)
    this._animation = this.node.getComponent(Animation)
    this._joystick = this.joystickNode.getComponent(JoystickManager)
  }

  update(deltaTime: number) {
    if (this.controllerEnabled && this._joystick.movementChanged) {
      if (this._joystick.movement === Direction.IDLE_UP && this._joystick.lastMovement !== Direction.IDLE_UP) {
        this._joystick.lastMovement = Direction.IDLE_UP
        this.idleUp()
      } else if (
        this._joystick.movement === Direction.IDLE_UP_RIGHT &&
        this._joystick.lastMovement !== Direction.IDLE_UP_RIGHT
      ) {
        this._joystick.lastMovement = Direction.IDLE_UP_RIGHT
        this.idleUpRight()
      } else if (
        this._joystick.movement === Direction.IDLE_RIGHT &&
        this._joystick.lastMovement !== Direction.IDLE_RIGHT
      ) {
        this._joystick.lastMovement = Direction.IDLE_RIGHT
        this.idleRight()
      } else if (
        this._joystick.movement === Direction.IDLE_RIGHT_DOWN &&
        this._joystick.lastMovement !== Direction.IDLE_RIGHT_DOWN
      ) {
        this._joystick.lastMovement = Direction.IDLE_RIGHT_DOWN
        this.idleRightDown()
      } else if (
        this._joystick.movement === Direction.IDLE_DOWN &&
        this._joystick.lastMovement !== Direction.IDLE_DOWN
      ) {
        this._joystick.lastMovement = Direction.IDLE_DOWN
        this.idleDown()
      } else if (
        this._joystick.movement === Direction.IDLE_DOWN_LEFT &&
        this._joystick.lastMovement !== Direction.IDLE_DOWN_LEFT
      ) {
        this._joystick.lastMovement = Direction.IDLE_DOWN_LEFT
        this.idleDownLeft()
      } else if (
        this._joystick.movement === Direction.IDLE_LEFT &&
        this._joystick.lastMovement !== Direction.IDLE_LEFT
      ) {
        this._joystick.lastMovement = Direction.IDLE_LEFT
        this.idleLeft()
      } else if (
        this._joystick.movement === Direction.IDLE_LEFT_UP &&
        this._joystick.lastMovement !== Direction.IDLE_LEFT_UP
      ) {
        this._joystick.lastMovement = Direction.IDLE_LEFT_UP
        this.idleLeftUp()
      } else if (this._joystick.movement === Direction.UP && this._joystick.lastMovement !== Direction.UP) {
        this._joystick.lastMovement = Direction.UP
        this.walkUp()
      } else if (this._joystick.movement === Direction.UP_RIGHT && this._joystick.lastMovement !== Direction.UP_RIGHT) {
        this._joystick.lastMovement = Direction.UP_RIGHT
        this.walkUpRight()
      } else if (this._joystick.movement === Direction.RIGHT && this._joystick.lastMovement !== Direction.RIGHT) {
        this._joystick.lastMovement = Direction.RIGHT
        this.walkRight()
      } else if (
        this._joystick.movement === Direction.RIGHT_DOWN &&
        this._joystick.lastMovement !== Direction.RIGHT_DOWN
      ) {
        this._joystick.lastMovement = Direction.RIGHT_DOWN
        this.walkRightDown()
      } else if (this._joystick.movement === Direction.DOWN && this._joystick.lastMovement !== Direction.DOWN) {
        this._joystick.lastMovement = Direction.DOWN
        this.walkDown()
      } else if (
        this._joystick.movement === Direction.DOWN_LEFT &&
        this._joystick.lastMovement !== Direction.DOWN_LEFT
      ) {
        this._joystick.lastMovement = Direction.DOWN_LEFT
        this.walkDownLeft()
      } else if (this._joystick.movement === Direction.LEFT && this._joystick.lastMovement !== Direction.LEFT) {
        this._joystick.lastMovement = Direction.LEFT
        this.walkLeft()
      } else if (this._joystick.movement === Direction.LEFT_UP && this._joystick.lastMovement !== Direction.LEFT_UP) {
        this._joystick.lastMovement = Direction.LEFT_UP
        this.walkLeftUp()
      }
      this._joystick.movementChanged = false
    }
  }

  resetMovement() {
    this.idleDown()
    this.movementCommands = []
    this.lastMovementCommand = Direction.NULL
  }

  walkUp() {
    this._body.linearVelocity = new Vec2(0, this.velocity)
    this._animation.play('walkUp')
  }

  walkUpRight() {
    this._body.linearVelocity = new Vec2(this.velocity * this._cos, this.velocity * this._sin)
    this._animation.play('walkUpRight')
  }

  walkRight() {
    this._body.linearVelocity = new Vec2(this.velocity, 0)
    this._animation.play('walkRight')
  }

  walkRightDown() {
    this._body.linearVelocity = new Vec2(this.velocity * this._cos, this.velocity * -this._sin)
    this._animation.play('walkRightDown')
  }

  walkDown() {
    this._body.linearVelocity = new Vec2(0, -this.velocity)
    this._animation.play('walkDown')
  }

  walkDownLeft() {
    this._body.linearVelocity = new Vec2(this.velocity * -this._cos, this.velocity * -this._sin)
    this._animation.play('walkDownLeft')
  }

  walkLeft() {
    this._body.linearVelocity = new Vec2(-this.velocity, 0)
    this._animation.play('walkLeft')
  }

  walkLeftUp() {
    this._body.linearVelocity = new Vec2(this.velocity * -this._cos, this.velocity * this._sin)
    this._animation.play('walkLeftUp')
  }

  idleUp() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleUp')
  }

  idleUpRight() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleUpRight')
  }

  idleRight() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleRight')
  }

  idleRightDown() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleRightDown')
  }

  idleDown() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleDown')
  }

  idleDownLeft() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleDownLeft')
  }

  idleLeft() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleLeft')
  }

  idleLeftUp() {
    this._body.linearVelocity = new Vec2(0, 0)
    this._animation.play('idleLeftUp')
  }

  move() {
    if (
      this.movementCommands.includes(Direction.UP) &&
      this.movementCommands.includes(Direction.RIGHT) &&
      !this.movementCommands.includes(Direction.DOWN) &&
      !this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkUpRight()
    } else if (
      !this.movementCommands.includes(Direction.UP) &&
      this.movementCommands.includes(Direction.RIGHT) &&
      this.movementCommands.includes(Direction.DOWN) &&
      !this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkRightDown()
    } else if (
      !this.movementCommands.includes(Direction.UP) &&
      !this.movementCommands.includes(Direction.RIGHT) &&
      this.movementCommands.includes(Direction.DOWN) &&
      this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkDownLeft()
    } else if (
      this.movementCommands.includes(Direction.UP) &&
      !this.movementCommands.includes(Direction.RIGHT) &&
      !this.movementCommands.includes(Direction.DOWN) &&
      this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkLeftUp()
    } else if (
      this.movementCommands.includes(Direction.UP) &&
      !this.movementCommands.includes(Direction.RIGHT) &&
      !this.movementCommands.includes(Direction.DOWN) &&
      !this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkUp()
    } else if (
      !this.movementCommands.includes(Direction.UP) &&
      this.movementCommands.includes(Direction.RIGHT) &&
      !this.movementCommands.includes(Direction.DOWN) &&
      !this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkRight()
    } else if (
      !this.movementCommands.includes(Direction.UP) &&
      !this.movementCommands.includes(Direction.RIGHT) &&
      this.movementCommands.includes(Direction.DOWN) &&
      !this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkDown()
    } else if (
      !this.movementCommands.includes(Direction.UP) &&
      !this.movementCommands.includes(Direction.RIGHT) &&
      !this.movementCommands.includes(Direction.DOWN) &&
      this.movementCommands.includes(Direction.LEFT)
    ) {
      this.walkLeft()
    }
  }
}
