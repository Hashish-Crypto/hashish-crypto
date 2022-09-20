import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode } from 'cc'
import Direction from './enums/Direction'
import { PlayerManager } from './PlayerManager'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  @property({ type: Node })
  private playerNode: Node | null = null

  private _player: PlayerManager | null = null

  onLoad() {
    this._player = this.playerNode.getComponent(PlayerManager)

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this)
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this)

    this._player.controllerEnabled = true
  }

  private _onKeyDown(event: EventKeyboard) {
    if (!this._player.controllerEnabled) return

    if (event.keyCode === KeyCode.KEY_W) {
      this._player.lastMovementCommand = Direction.UP
      this._player.movementCommands.push(Direction.UP)
      if (
        !this._player.movementCommands.includes(Direction.RIGHT) ||
        !this._player.movementCommands.includes(Direction.LEFT)
      ) {
        this._player.walkUp()
      }
    } else if (event.keyCode === KeyCode.KEY_D) {
      this._player.lastMovementCommand = Direction.RIGHT
      this._player.movementCommands.push(Direction.RIGHT)
      if (
        !this._player.movementCommands.includes(Direction.UP) ||
        !this._player.movementCommands.includes(Direction.DOWN)
      ) {
        this._player.walkRight()
      }
    } else if (event.keyCode === KeyCode.KEY_S) {
      this._player.lastMovementCommand = Direction.DOWN
      this._player.movementCommands.push(Direction.DOWN)
      if (
        !this._player.movementCommands.includes(Direction.RIGHT) ||
        !this._player.movementCommands.includes(Direction.LEFT)
      ) {
        this._player.walkDown()
      }
    } else if (event.keyCode === KeyCode.KEY_A) {
      this._player.lastMovementCommand = Direction.LEFT
      this._player.movementCommands.push(Direction.LEFT)
      if (
        !this._player.movementCommands.includes(Direction.UP) ||
        !this._player.movementCommands.includes(Direction.DOWN)
      ) {
        this._player.walkLeft()
      }
    }
  }

  private _onKeyUp(event: EventKeyboard) {
    if (!this._player.controllerEnabled) return

    if (event.keyCode === KeyCode.KEY_W) {
      this._player.movementCommands = this._player.movementCommands.filter((direction) => direction !== Direction.UP)
      if (this._player.movementCommands.length === 0) {
        this._player.idleUp()
      }
    } else if (event.keyCode === KeyCode.KEY_D) {
      this._player.movementCommands = this._player.movementCommands.filter((direction) => direction !== Direction.RIGHT)
      if (this._player.movementCommands.length === 0) {
        this._player.idleRight()
      }
    } else if (event.keyCode === KeyCode.KEY_S) {
      this._player.movementCommands = this._player.movementCommands.filter((direction) => direction !== Direction.DOWN)
      if (this._player.movementCommands.length === 0) {
        this._player.idleDown()
      }
    } else if (event.keyCode === KeyCode.KEY_A) {
      this._player.movementCommands = this._player.movementCommands.filter((direction) => direction !== Direction.LEFT)
      if (this._player.movementCommands.length === 0) {
        this._player.idleLeft()
      }
    }

    // If there is still a key pressed, it triggers the player movement.
    // if (this._player.lastMovementCommand !== this._player.movementCommands[this._player.movementCommands.length - 1]) {
    //   this._player.move()
    // }
  }

  // update(deltaTime: number) {}
}
