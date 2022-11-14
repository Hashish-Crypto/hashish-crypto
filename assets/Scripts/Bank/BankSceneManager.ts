import { _decorator, Camera, Color } from 'cc'
import { TopDownSceneManager } from '../lib/TopDownSceneManager'

const { ccclass } = _decorator

@ccclass('BankSceneManager')
export class BankSceneManager extends TopDownSceneManager {
  protected _onLoadExtension() {
    this._player.node.getChildByName('Camera').getComponent(Camera).clearColor = new Color('#000000')
  }

  // update(deltaTime: number) {}
}
