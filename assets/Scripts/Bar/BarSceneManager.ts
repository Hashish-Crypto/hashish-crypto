import { _decorator, Camera, Color, Collider2D, director, Button } from 'cc'
import spawnPositions from '../lib/spawnPositions'
import { TopDownSceneManager } from '../lib/TopDownSceneManager'
// import { BarButtonsManager } from '../UI/Buttons/BarButtonsManager'

const { ccclass } = _decorator

@ccclass('BarSceneManager')
export class BarSceneManager extends TopDownSceneManager {
  // private _buttonsManager: BarButtonsManager | null = null

  protected _onLoadExtension() {
    // this._buttonsManager = this.gameUI.getComponentInChildren(BarButtonsManager)
    this._player.node.getChildByName('Camera').getComponent(Camera).clearColor = new Color('#000000')
  }

  // update(deltaTime: number) {}

  protected _onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player' || b.node.name === 'Player') {
      if (b.node.name === 'MainTrigger' || a.node.name === 'MainTrigger') {
        this._persistentNode.spawnPosition = spawnPositions.mainBar
        director.loadScene('Main')
      } else if (b.node.name === 'PachinkoTrigger' || a.node.name === 'PachinkoTrigger') {
        this._activatePachinkoButton()
      }
    }
  }

  protected _onEndContact(a: Collider2D, b: Collider2D) {
    if (a.node.name === 'Player' || b.node.name === 'Player') {
      if (b.node.name === 'PachinkoTrigger' || a.node.name === 'PachinkoTrigger') {
        this._deactivatePachinkoButton()
      }
    }
  }

  private _activatePachinkoButton() {
    console.log('_activatePachinkoButton')
    // this._buttonsManager.button0.active = false
    // this._buttonsManager.coinButton.active = true
    // this._buttonsManager.coinButton.on(Button.EventType.CLICK, this._startPachinkoScene, this)
  }

  private _deactivatePachinkoButton() {
    console.log('_deactivatePachinkoButton')
    // this._buttonsManager.button0.active = true
    // this._buttonsManager.coinButton.active = false
    // this._buttonsManager.coinButton.off(Button.EventType.CLICK, this._startPachinkoScene, this)
  }

  private _startPachinkoScene() {
    director.loadScene('Pachinko')
  }
}
