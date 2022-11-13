import { _decorator, Node, Collider2D, Animation } from 'cc'
import { FishingManager } from '../Fishing/FishingManager'
import { TopDownSceneManager } from '../lib/TopDownSceneManager'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends TopDownSceneManager {
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

  private _fishing: FishingManager | null = null

  protected _onLoadExtension() {
    this._fishing = this.fishingManagerNode.getComponent(FishingManager)
  }

  // update(deltaTime: number) {}

  protected _onBeginContact(a: Collider2D, b: Collider2D) {
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

  protected _onEndContact(a: Collider2D, b: Collider2D) {
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

  protected _onTouchScreenStart() {
    if (this._fishing.fishingUI.active === true) {
      this._fishing.moveCatchBar()
    }
  }
}
