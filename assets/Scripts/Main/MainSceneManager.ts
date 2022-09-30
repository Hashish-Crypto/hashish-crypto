import { _decorator, Component, Node, input, Input, EventKeyboard } from 'cc'
import { PlayerManager } from './PlayerManager'
import playerMovement from '../lib/playerMovement'

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
    playerMovement.onKeyDown(this._player, event)
  }

  private _onKeyUp(event: EventKeyboard) {
    playerMovement.onKeyUp(this._player, event)
  }

  // update(deltaTime: number) {}
}
