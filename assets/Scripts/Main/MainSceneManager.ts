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
  Prefab,
  instantiate,
} from 'cc'
import { PlayerManager } from './PlayerManager'
import playerMovement from '../lib/playerMovement'
import { FishingManager } from '../Fishing/FishingManager'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  @property({ type: Node })
  private gameUI: Node | null = null

  @property({ type: Node })
  private playersRef: Node | null = null

  @property({ type: Prefab })
  private joystickPrefab: Prefab | null = null

  @property({ type: Prefab })
  private playerPrefab: Prefab | null = null

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
  private fishingManagerNode: Node | null = null

  private _joystick: Node | null = null
  private _player: PlayerManager | null = null
  private _fishing: FishingManager | null = null

  onLoad() {
    this._joystick = instantiate(this.joystickPrefab)
    this.gameUI.addChild(this._joystick)
    this._joystick.setSiblingIndex(0)
    this._player = instantiate(this.playerPrefab).getComponent(PlayerManager)
    this.playersRef.addChild(this._player.node)

    this._fishing = this.fishingManagerNode.getComponent(FishingManager)

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this)
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this._onEndContact, this)
    this.gameUI.on(Node.EventType.TOUCH_START, this._onTouchScreenStart, this)

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
        this._fishing.activateFountainFishingButton()
      }
    }

    if (a.node.name === 'Catch' && b.node.name === 'Fish') {
      this._fishing.catchOverlapFish = true
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
        this._fishing.deactivateFountainFishingButton()
      }
    }

    if (a.node.name === 'Catch' && b.node.name === 'Fish') {
      this._fishing.catchOverlapFish = false
    }
  }

  private _onTouchScreenStart() {
    if (this._fishing.fishingUI.active === true) {
      this._fishing.moveCatchBar()
    }
  }
}
