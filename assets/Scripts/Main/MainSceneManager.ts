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
  director,
  Director,
  Label,
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
  private _fountainFishingUI: Node | null = null
  private _fountainFishingTimerActive: boolean = false
  private _fountainFishingTimer: number = 0
  private _fishingUI: Node | null = null
  private _finishFishingUI: Node | null = null
  private _pullingFishingRod: boolean = false
  private _catchingFishProgressTimer: number = 2
  private _catchOverlapFish: boolean = false

  onLoad() {
    this._player = this.playerNode.getComponent(PlayerManager)
    this._fountainFishingUI = this.gameUI.getChildByName('FountainFishingUI')
    this._fishingUI = this.gameUI.getChildByName('FishingUI')
    this._finishFishingUI = this.gameUI.getChildByName('FinishFishingUI')

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this)
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this._onEndContact, this)

    this._fountainFishingUI
      .getChildByName('FountainFishingYesButton')
      .on(Button.EventType.CLICK, this._fountainFishingYes, this)
    this._fountainFishingUI
      .getChildByName('FountainFishingNoButton')
      .on(Button.EventType.CLICK, this._fountainFishingNo, this)
    this._finishFishingUI.getChildByName('CloseButton').on(Button.EventType.CLICK, this._closeFinishFishingUI, this)
    this.gameUI.on(Node.EventType.TOUCH_START, this._onTouchScreenStart, this)
    this.gameUI.on(Node.EventType.TOUCH_END, this._onTouchScreenEnd, this)

    this._player.controllerEnabled = true
  }

  update(deltaTime: number) {
    if (this._fountainFishingTimerActive && Date.now() - this._fountainFishingTimer >= 1500) {
      this._player.controllerEnabled = false
      this._player.resetMovement()
      this._fountainFishingTimerActive = false
      this._fountainFishingTimer = 0
      this._fountainFishingUI.active = true
    }

    if (this._fishingUI.active) {
      const progressBarMaxHeight = this._fishingUI
        .getChildByName('ProgressBar')
        .getChildByName('Background')
        .getComponent(UITransform).height

      if (this._catchingFishProgressTimer <= 0) {
        this._catchOverlapFish = false
        this._catchingFishProgressTimer = 2.5
        this._fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
          Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / 5))
        director.once(Director.EVENT_AFTER_PHYSICS, () => {
          this._fishingUI.getChildByName('CatchBar').getChildByName('Catch').setPosition(0, 180)
        })
        this._fishingUI.active = false
        this._finishFishingUI.getChildByName('ResultLabel').getComponent(Label).string = 'You failed to catch the fish.'
        this._finishFishingUI.active = true
      } else if (this._catchOverlapFish) {
        if (this._catchingFishProgressTimer < 5) {
          this._catchingFishProgressTimer += deltaTime

          this._fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
            Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / 5))
        } else {
          this._catchOverlapFish = false
          this._catchingFishProgressTimer = 2.5
          this._fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
            Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / 5))
          director.once(Director.EVENT_AFTER_PHYSICS, () => {
            this._fishingUI.getChildByName('CatchBar').getChildByName('Catch').setPosition(0, 180)
          })
          this._fishingUI.active = false
          this._finishFishingUI.getChildByName('ResultLabel').getComponent(Label).string =
            'You managed to catch the fish!'
          this._finishFishingUI.active = true
        }
      } else {
        this._catchingFishProgressTimer -= deltaTime
        this._fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
          Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / 5))
      }
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
        this._fountainFishingTimerActive = true
        this._fountainFishingTimer = Date.now()
      }
    }

    if (a.node.name === 'Catch' && b.node.name === 'Fish') {
      this._catchOverlapFish = true
      console.log('Catch In')
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
        this._fountainFishingTimerActive = false
        this._fountainFishingTimer = 0
      }
    }

    if (a.node.name === 'Catch' && b.node.name === 'Fish') {
      this._catchOverlapFish = false
      console.log('Catch Out')
    }
  }

  private _fountainFishingYes() {
    this._fountainFishingUI.active = false
    this._fishingUI.active = true
  }

  private _fountainFishingNo() {
    this._fountainFishingUI.active = false
    this._player.controllerEnabled = true
  }

  private _onTouchScreenStart() {
    if (this._fishingUI.active === true) {
      this._pullingFishingRod = true
    }
  }

  private _onTouchScreenEnd() {
    if (this._fishingUI.active === true) {
      this._pullingFishingRod = false
    }
  }

  private _closeFinishFishingUI() {
    this._finishFishingUI.active = false
    this._player.controllerEnabled = true
  }
}
