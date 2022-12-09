import { _decorator, Camera, Color, Collider2D, director, Button } from 'cc'
import spawnPositions from '../lib/spawnPositions'
import { TopDownSceneManager } from '../lib/TopDownSceneManager'
import { BankButtonsManager } from '../UI/Buttons/BankButtonsManager'

const { ccclass } = _decorator

@ccclass('BankSceneManager')
export class BankSceneManager extends TopDownSceneManager {
  private _buttonsManager: BankButtonsManager | null = null

  protected _onLoadExtension() {
    this._buttonsManager = this.gameUI.getComponentInChildren(BankButtonsManager)
    this._player.node.getChildByName('Camera').getComponent(Camera).clearColor = new Color('#000000')
    this._player.node.getParent().setSiblingIndex(4)
  }

  // update(deltaTime: number) {}

  protected _onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player' || b.node.name === 'Player') {
      if (b.node.name === 'MainTrigger' || a.node.name === 'MainTrigger') {
        this._persistentNode.spawnPosition = spawnPositions.mainBank
        director.loadScene('Main')
      } else if (b.node.name === 'VaultTrigger' || a.node.name === 'VaultTrigger') {
        this._activateVaultButton()
      }
    }
  }

  protected _onEndContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player' || b.node.name === 'Player') {
      if (b.node.name === 'VaultTrigger' || a.node.name === 'VaultTrigger') {
        this._deactivateVaultButton()
      }
    }
  }

  private _activateVaultButton() {
    this._buttonsManager.button0.active = false
    this._buttonsManager.coinButton.active = true
    this._buttonsManager.coinButton.on(Button.EventType.CLICK, this._startVaultScene, this)
  }

  private _deactivateVaultButton() {
    this._buttonsManager.button0.active = true
    this._buttonsManager.coinButton.active = false
    this._buttonsManager.coinButton.off(Button.EventType.CLICK, this._startVaultScene, this)
  }

  private _startVaultScene() {
    director.loadScene('Vault')
  }
}
