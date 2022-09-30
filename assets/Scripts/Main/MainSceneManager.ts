import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventKeyboard,
  PhysicsSystem2D,
  Contact2DType,
  Collider2D,
  Animation,
} from 'cc'
import { PlayerManager } from './PlayerManager'
import playerMovement from '../lib/playerMovement'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  @property({ type: Node })
  private playerNode: Node | null = null

  @property({ type: Node })
  private bankDoor: Node | null = null

  @property({ type: Node })
  private barDoor: Node | null = null

  @property({ type: Node })
  private houseDoor: Node | null = null

  @property({ type: Node })
  private policeDoor: Node | null = null

  @property({ type: Node })
  private shopDoor: Node | null = null

  private _player: PlayerManager | null = null

  onLoad() {
    this._player = this.playerNode.getComponent(PlayerManager)

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this)
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this._onEndContact, this)

    this._player.controllerEnabled = true
  }

  private _onKeyDown(event: EventKeyboard) {
    playerMovement.onKeyDown(this._player, event)
  }

  private _onKeyUp(event: EventKeyboard) {
    playerMovement.onKeyUp(this._player, event)
  }

  private _onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player') {
      if (b.node.name === 'BankDoorTrigger') {
        this.bankDoor.getComponent(Animation).play('BankDoorOpen')
      } else if (b.node.name === 'BarDoorTrigger') {
        this.barDoor.getComponent(Animation).play('BarDoorOpen')
      } else if (b.node.name === 'HouseDoorTrigger') {
        this.houseDoor.getComponent(Animation).play('HouseDoorOpen')
      } else if (b.node.name === 'PoliceDoorTrigger') {
        this.policeDoor.getComponent(Animation).play('PoliceDoorOpen')
      } else if (b.node.name === 'ShopDoorTrigger') {
        this.shopDoor.getComponent(Animation).play('ShopDoorOpen')
      }
    }
  }

  private _onEndContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player') {
      if (b.node.name === 'BankDoorTrigger') {
        this.bankDoor.getComponent(Animation).play('BankDoorClose')
      } else if (b.node.name === 'BarDoorTrigger') {
        this.barDoor.getComponent(Animation).play('BarDoorClose')
      } else if (b.node.name === 'HouseDoorTrigger') {
        this.houseDoor.getComponent(Animation).play('HouseDoorClose')
      } else if (b.node.name === 'PoliceDoorTrigger') {
        this.policeDoor.getComponent(Animation).play('PoliceDoorClose')
      } else if (b.node.name === 'ShopDoorTrigger') {
        this.shopDoor.getComponent(Animation).play('ShopDoorClose')
      }
    }
  }

  // update(deltaTime: number) {}
}
