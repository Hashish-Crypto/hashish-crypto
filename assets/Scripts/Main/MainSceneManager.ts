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
  UITransform,
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
  private gameUI: Node | null = null

  private _player: PlayerManager | null = null
  private _startFishingUI: Node | null = null
  private _startFishingTimerActive: boolean = false
  private _startFishingTimer: number = 0
  private _fishingUI: Node | null = null
  private _touchScreenStart: boolean = false
  private _fishingProgressTimer: number = 0
  private _timer: number = 0
  private _counter: number = 0

  onLoad() {
    this._player = this.playerNode.getComponent(PlayerManager)
    this._startFishingUI = this.gameUI.getChildByName('StartFishingUI')
    this._fishingUI = this.gameUI.getChildByName('FishingUI')

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this)
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this._onEndContact, this)

    this._startFishingUI.getChildByName('StartFishingYesButton').on(Button.EventType.CLICK, this._startFishingYes, this)
    this._startFishingUI.getChildByName('StartFishingNoButton').on(Button.EventType.CLICK, this._startFishingNo, this)
    this.gameUI.on(Node.EventType.TOUCH_START, this._onTouchScreenStart, this)
    this.gameUI.on(Node.EventType.TOUCH_END, this._onTouchScreenEnd, this)

    this._player.controllerEnabled = true
  }

  update(deltaTime: number) {
    if (this._startFishingTimerActive && Date.now() - this._startFishingTimer >= 2000) {
      this._player.controllerEnabled = false
      this._player.resetMovement()
      this._startFishingTimerActive = false
      this._startFishingTimer = 0
      this._startFishingUI.active = true
    }

    if (this._touchScreenStart && Date.now() - this._fishingProgressTimer < 3000) {
      const elapsedTime = Date.now() - this._fishingProgressTimer
      const progressBarMaxHeight = this._fishingUI
        .getChildByName('ProgressBar')
        .getChildByName('Background')
        .getComponent(UITransform).height
      this._fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
        Math.floor(progressBarMaxHeight * (elapsedTime / 3000))
    }
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
      } else if (b.node.name === 'PoliceStationDoorTrigger') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorOpen')
      } else if (b.node.name === 'ShopDoorTrigger') {
        this.shopDoor.getComponent(Animation).play('ShopDoorOpen')
      } else if (b.node.name === 'FishingTrigger') {
        this._startFishingTimer = Date.now()
        this._startFishingTimerActive = true
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
        this._startFishingTimerActive = false
        this._startFishingTimer = 0
      }
    }
  }

  private _startFishingYes() {
    this._player.controllerEnabled = true
    this._startFishingUI.active = false
  }

  private _startFishingNo() {
    this._player.controllerEnabled = true
    this._startFishingUI.active = false
  }

  private _onTouchScreenStart() {
    this._fishingProgressTimer = Date.now()
    this._touchScreenStart = true
  }

  private _onTouchScreenEnd() {
    this._fishingProgressTimer = 0
    this._touchScreenStart = false
  }
}
