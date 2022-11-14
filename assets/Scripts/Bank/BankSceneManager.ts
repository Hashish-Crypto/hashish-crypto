import { _decorator, Camera, Color, Collider2D, director } from 'cc'
import spawnPositions from '../lib/spawnPosition'
import { TopDownSceneManager } from '../lib/TopDownSceneManager'

const { ccclass } = _decorator

@ccclass('BankSceneManager')
export class BankSceneManager extends TopDownSceneManager {
  protected _onLoadExtension() {
    this._player.node.getChildByName('Camera').getComponent(Camera).clearColor = new Color('#000000')
  }

  // update(deltaTime: number) {}

  protected _onBeginContact(a: Collider2D, b: Collider2D) {
    console.log('begin', a, b)
    if (a.node.name === 'Player') {
      if (b.node.name === 'MainTrigger') {
        this._persistentNode.spawnPosition = spawnPositions.mainBank
        director.loadScene('Main')
      } else if (b.node.name === 'VaultTrigger') {
        console.log('VaultTrigger Begin')
      }
    } else if (b.node.name === 'Player') {
      if (a.node.name === 'MainTrigger') {
        this._persistentNode.spawnPosition = spawnPositions.mainBank
        director.loadScene('Main')
      } else if (a.node.name === 'VaultTrigger') {
        console.log('VaultTrigger Begin')
      }
    }
  }

  protected _onEndContact(a: Collider2D, b: Collider2D) {
    console.log('end', a, b)
    if (a.node.name === 'Player') {
      if (b.node.name === 'VaultTrigger') {
        console.log('VaultTrigger End')
      }
    } else if (b.node.name === 'Player') {
      if (a.node.name === 'VaultTrigger') {
        console.log('VaultTrigger End')
      }
    }
  }

  private _activateFountainFishingButton() {
    // this._buttonsManager.button0.active = false
    // this._buttonsManager.fishingButton.active = true
    // this._buttonsManager.fishingButton.getComponent(Button).interactable = true
    // this._buttonsManager.fishingButton.on(Button.EventType.CLICK, this._activateFountainFishingUI, this)
  }

  private _deactivateFountainFishingButton() {
    // this._buttonsManager.button0.active = true
    // this._buttonsManager.fishingButton.active = false
    // this._buttonsManager.fishingButton.off(Button.EventType.CLICK, this._activateFountainFishingUI, this)
  }
}
