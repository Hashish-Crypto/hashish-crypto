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
  Button,
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
  private policeStationDoor: Node | null = null

  @property({ type: Node })
  private shopDoor: Node | null = null

  @property({ type: Node })
  private startFishingUI: Node | null = null

  private _player: PlayerManager | null = null

  onLoad() {
    this._player = this.playerNode.getComponent(PlayerManager)

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this)
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this._onEndContact, this)

    this.startFishingUI.getChildByName('StartFishingYesButton').on(Button.EventType.CLICK, this._startFishingYes, this)
    this.startFishingUI.getChildByName('StartFishingNoButton').on(Button.EventType.CLICK, this._startFishingNo, this)

    this._player.controllerEnabled = true
  }

  // update(deltaTime: number) {}

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
      } else if (b.node.name === 'PoliceStationDoorTrigger') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorOpen')
      } else if (b.node.name === 'ShopDoorTrigger') {
        this.shopDoor.getComponent(Animation).play('ShopDoorOpen')
      } else if (b.node.name === 'FishingTrigger') {
        this._player.controllerEnabled = false
        this._player.resetMovement()
        this.startFishingUI.active = true
        console.log('FishingTrigger In')
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
      } else if (b.node.name === 'PoliceStationDoorTrigger') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorClose')
      } else if (b.node.name === 'ShopDoorTrigger') {
        this.shopDoor.getComponent(Animation).play('ShopDoorClose')
      } else if (b.node.name === 'FishingTrigger') {
        console.log('FishingTrigger Out')
      }
    }
  }

  private _startFishingYes() {
    this._player.controllerEnabled = true
    this.startFishingUI.active = false
  }

  private _startFishingNo() {
    this._player.controllerEnabled = true
    this.startFishingUI.active = false
  }
}
