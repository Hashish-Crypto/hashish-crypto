import { _decorator, Component, Node, RigidBody2D, Animation, Vec2 } from 'cc'
import Direction from './enums/Direction'

const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  @property({ type: Number })
  private velocity: number = 4

  public controllerEnabled: boolean = false
  public movementCommands: Direction[] = []
  public lastMovementCommand: Direction = Direction.NULL
  private _body: RigidBody2D | null = null
  private _animation: Animation | null = null
  private _cos = Math.cos(Math.PI / 4) + 8 - 8
  private _sin = Math.sin(Math.PI / 4) + 8 - 8

  onLoad() {
    this._body = this.node.getComponent(RigidBody2D)
    // this._animation = this.node.getComponent(Animation)
  }

  walkUp() {
    this._body.linearVelocity = new Vec2(0, this.velocity)
    // this._animation.play('walkUp')
  }

  walkUpRight() {
    this._body.linearVelocity = new Vec2(this.velocity * this._cos, this.velocity * this._sin)
    // this._animation.play('walkUpRight')
  }

  walkRight() {
    this._body.linearVelocity = new Vec2(this.velocity, 0)
    // this._animation.play('walkRight')
  }

  walkRightDown() {
    this._body.linearVelocity = new Vec2(this.velocity * this._cos, this.velocity * -this._sin)
    // this._animation.play('walkRightDown')
  }

  walkDown() {
    this._body.linearVelocity = new Vec2(0, -this.velocity)
    // this._animation.play('walkDown')
  }

  walkDownLeft() {
    this._body.linearVelocity = new Vec2(this.velocity * -this._cos, this.velocity * -this._sin)
    // this._animation.play('walkDownLeft')
  }

  walkLeft() {
    this._body.linearVelocity = new Vec2(-this.velocity, 0)
    // this._animation.play('walkLeft')
  }

  walkLeftUp() {
    this._body.linearVelocity = new Vec2(this.velocity * -this._cos, this.velocity * this._sin)
    // this._animation.play('walkLeftUp')
  }

  idleUp() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleUp')
  }

  idleUpRight() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleUpRight')
  }

  idleRight() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleRight')
  }

  idleRightDown() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleRightDown')
  }

  idleDown() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleDown')
  }

  idleDownLeft() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleDownLeft')
  }

  idleLeft() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleLeft')
  }

  idleLeftUp() {
    this._body.linearVelocity = new Vec2(0, 0)
    // this._animation.play('idleLeftUp')
  }

  update(deltaTime: number) {}
}
