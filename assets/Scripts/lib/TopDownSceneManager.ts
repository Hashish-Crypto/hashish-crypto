import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  input,
  Input,
  PhysicsSystem2D,
  Contact2DType,
  EventKeyboard,
  Collider2D,
} from 'cc'
import { PlayerManager } from '../Main/PlayerManager'
import playerMovement from './playerMovement'

const { ccclass, property } = _decorator

@ccclass('TopDownSceneManager')
export class TopDownSceneManager extends Component {
  @property({ type: Node })
  private gameUI: Node | null = null

  @property({ type: Node })
  private playersRef: Node | null = null

  @property({ type: Prefab })
  private joystickPrefab: Prefab | null = null

  @property({ type: Prefab })
  private playerPrefab: Prefab | null = null

  private _joystick: Node | null = null
  private _player: PlayerManager | null = null

  onLoad() {
    this._joystick = instantiate(this.joystickPrefab)
    this.gameUI.addChild(this._joystick)
    this._joystick.setSiblingIndex(0)
    this._player = instantiate(this.playerPrefab).getComponent(PlayerManager)
    this.playersRef.addChild(this._player.node)

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this)
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this._onEndContact, this)

    this.gameUI.on(Node.EventType.TOUCH_START, this._onTouchScreenStart, this)

    this._player.controllerEnabled = true

    this._onLoadExtension()
  }

  protected _onLoadExtension() {}

  // update(deltaTime: number) {}

  private _onKeyDown(event: EventKeyboard) {
    playerMovement.onKeyDown(this._player, event)
  }

  private _onKeyUp(event: EventKeyboard) {
    playerMovement.onKeyUp(this._player, event)
  }

  protected _onBeginContact(a: Collider2D, b: Collider2D) {}

  protected _onEndContact(a: Collider2D, b: Collider2D) {}

  protected _onTouchScreenStart() {}
}
