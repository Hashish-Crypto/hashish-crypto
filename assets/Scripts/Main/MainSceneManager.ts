import { _decorator, Node, Collider2D, Animation, director } from 'cc'
import { FishingManager } from '../Fishing/FishingManager'
import spawnPositions from '../lib/spawnPositions'
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
  private museumDoor: Node | null = null

  @property({ type: Node })
  private fishingManagerNode: Node | null = null

  private _fishing: FishingManager | null = null

  protected _onLoadExtension() {
    this._fishing = this.fishingManagerNode.getComponent(FishingManager)
  }

  // update(deltaTime: number) {}

  protected _onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player' || b.node.name === 'Player') {
      if (b.node.name === 'BankDoorTrigger0' || a.node.name === 'BankDoorTrigger0') {
        this.bankDoor.getComponent(Animation).play('BankDoorOpen')
      } else if (b.node.name === 'BankDoorTrigger1' || a.node.name === 'BankDoorTrigger1') {
        this._persistentNode.spawnPosition = spawnPositions.bankEntrance
        director.loadScene('Bank')
      } else if (b.node.name === 'BarDoorTrigger0' || a.node.name === 'BarDoorTrigger0') {
        this.barDoor.getComponent(Animation).play('BarDoorOpen')
      } else if (b.node.name === 'BarDoorTrigger1' || a.node.name === 'BarDoorTrigger1') {
        this._persistentNode.spawnPosition = spawnPositions.barEntrance
        director.loadScene('Bar')
      } else if (b.node.name === 'HouseDoorTrigger0' || a.node.name === 'HouseDoorTrigger0') {
        this.houseDoor.getComponent(Animation).play('HouseDoorOpen')
      } else if (b.node.name === 'PoliceStationDoorTrigger0' || a.node.name === 'PoliceStationDoorTrigger0') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorOpen')
      } else if (b.node.name === 'ShopDoorTrigger0' || a.node.name === 'ShopDoorTrigger0') {
        this.shopDoor.getComponent(Animation).play('ShopDoorOpen')
      } else if (b.node.name === 'MuseumDoorTrigger0' || a.node.name === 'MuseumDoorTrigger0') {
        this.museumDoor.getComponent(Animation).play('MuseumDoorOpen')
      } else if (b.node.name === 'FishingTrigger' || a.node.name === 'FishingTrigger') {
        this._fishing.activateFountainFishingButton()
      }
    }

    if ((a.node.name === 'Catch' && b.node.name === 'Fish') || (b.node.name === 'Catch' && a.node.name === 'Fish')) {
      this._fishing.catchOverlapFish = true
    }
  }

  protected _onEndContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player' || b.node.name === 'Player') {
      if (b.node.name === 'BankDoorTrigger0' || a.node.name === 'BankDoorTrigger0') {
        this.bankDoor.getComponent(Animation).play('BankDoorClose')
      } else if (b.node.name === 'BarDoorTrigger0' || a.node.name === 'BarDoorTrigger0') {
        this.barDoor.getComponent(Animation).play('BarDoorClose')
      } else if (b.node.name === 'HouseDoorTrigger0' || a.node.name === 'HouseDoorTrigger0') {
        this.houseDoor.getComponent(Animation).play('HouseDoorClose')
      } else if (b.node.name === 'PoliceStationDoorTrigger0' || a.node.name === 'PoliceStationDoorTrigger0') {
        this.policeStationDoor.getComponent(Animation).play('PoliceStationDoorClose')
      } else if (b.node.name === 'ShopDoorTrigger0' || a.node.name === 'ShopDoorTrigger0') {
        this.shopDoor.getComponent(Animation).play('ShopDoorClose')
      } else if (b.node.name === 'MuseumDoorTrigger0' || a.node.name === 'MuseumDoorTrigger0') {
        this.museumDoor.getComponent(Animation).play('MuseumDoorClose')
      } else if (b.node.name === 'FishingTrigger' || a.node.name === 'FishingTrigger') {
        this._fishing.deactivateFountainFishingButton()
      }
    }

    if ((a.node.name === 'Catch' && b.node.name === 'Fish') || (b.node.name === 'Catch' && a.node.name === 'Fish')) {
      this._fishing.catchOverlapFish = false
    }
  }

  protected _onTouchScreenStart() {
    if (this._fishing.fishingUI.active === true) {
      this._fishing.moveCatchBar()
    }
  }
}
