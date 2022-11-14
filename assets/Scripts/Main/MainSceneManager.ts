import { _decorator, Node, Collider2D, Animation, director } from 'cc'
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
      if (b.node.name === 'BankDoorTrigger0') {
        this.bankDoor.getComponent(Animation).play('BankDoorOpen')
      } else if (b.node.name === 'BankDoorTrigger1') {
        director.loadScene('Bank')
      } else if (b.node.name === 'BarDoorTrigger0') {
        this.barDoor.getComponent(Animation).play('BarDoorOpen')
      } else if (b.node.name === 'HouseDoorTrigger0') {
        this.houseDoor.getComponent(Animation).play('HouseDoorOpen')
      } else if (b.node.name === 'PoliceStationDoorTrigger0') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorOpen')
      } else if (b.node.name === 'ShopDoorTrigger0') {
        this.shopDoor.getComponent(Animation).play('ShopDoorOpen')
      } else if (b.node.name === 'FishingTrigger') {
        this._fishing.activateFountainFishingButton()
      }
    } else if (b.node.name === 'Player') {
      if (a.node.name === 'BankDoorTrigger0') {
        this.bankDoor.getComponent(Animation).play('BankDoorOpen')
      } else if (a.node.name === 'BankDoorTrigger1') {
        director.loadScene('Bank')
      } else if (a.node.name === 'BarDoorTrigger0') {
        this.barDoor.getComponent(Animation).play('BarDoorOpen')
      } else if (a.node.name === 'HouseDoorTrigger0') {
        this.houseDoor.getComponent(Animation).play('HouseDoorOpen')
      } else if (a.node.name === 'PoliceStationDoorTrigger0') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorOpen')
      } else if (a.node.name === 'ShopDoorTrigger0') {
        this.shopDoor.getComponent(Animation).play('ShopDoorOpen')
      } else if (a.node.name === 'FishingTrigger') {
        this._fishing.activateFountainFishingButton()
      }
    }

    if (a.node.name === 'Catch' && b.node.name === 'Fish') {
      this._fishing.catchOverlapFish = true
    } else if (b.node.name === 'Catch' && a.node.name === 'Fish') {
      this._fishing.catchOverlapFish = true
    }
  }

  protected _onEndContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player') {
      if (b.node.name === 'BankDoorTrigger0') {
        this.bankDoor.getComponent(Animation).play('BankDoorClose')
      } else if (b.node.name === 'BarDoorTrigger0') {
        this.barDoor.getComponent(Animation).play('BarDoorClose')
      } else if (b.node.name === 'HouseDoorTrigger0') {
        this.houseDoor.getComponent(Animation).play('HouseDoorClose')
      } else if (b.node.name === 'PoliceStationDoorTrigger0') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorClose')
      } else if (b.node.name === 'ShopDoorTrigger0') {
        this.shopDoor.getComponent(Animation).play('ShopDoorClose')
      } else if (b.node.name === 'FishingTrigger') {
        this._fishing.deactivateFountainFishingButton()
      }
    } else if (b.node.name === 'Player') {
      if (a.node.name === 'BankDoorTrigger0') {
        this.bankDoor.getComponent(Animation).play('BankDoorClose')
      } else if (a.node.name === 'BarDoorTrigger0') {
        this.barDoor.getComponent(Animation).play('BarDoorClose')
      } else if (a.node.name === 'HouseDoorTrigger0') {
        this.houseDoor.getComponent(Animation).play('HouseDoorClose')
      } else if (a.node.name === 'PoliceStationDoorTrigger0') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorClose')
      } else if (a.node.name === 'ShopDoorTrigger0') {
        this.shopDoor.getComponent(Animation).play('ShopDoorClose')
      } else if (a.node.name === 'FishingTrigger') {
        this._fishing.deactivateFountainFishingButton()
      }
    }

    if (a.node.name === 'Catch' && b.node.name === 'Fish') {
      this._fishing.catchOverlapFish = false
    } else if (b.node.name === 'Catch' && a.node.name === 'Fish') {
      this._fishing.catchOverlapFish = false
    }
  }

  protected _onTouchScreenStart() {
    if (this._fishing.fishingUI.active === true) {
      this._fishing.moveCatchBar()
    }
  }
}
