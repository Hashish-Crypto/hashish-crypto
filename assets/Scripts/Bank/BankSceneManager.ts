import { _decorator, Component, Node, Camera, Color } from 'cc'
import { TopDownSceneManager } from '../lib/TopDownSceneManager'

const { ccclass, property } = _decorator

@ccclass('BankSceneManager')
export class BankSceneManager extends TopDownSceneManager {
  protected _onLoadExtension() {
    this._player.node.getChildByName('Camera').getComponent(Camera).clearColor = new Color('#000000')
    console.log('BankSceneManager')
  }

  // update(deltaTime: number) {}
}
