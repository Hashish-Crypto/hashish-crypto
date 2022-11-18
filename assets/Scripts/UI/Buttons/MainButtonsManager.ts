import { _decorator, Node, Prefab, instantiate } from 'cc'
import { ButtonsManager } from './ButtonsManager'

const { ccclass, property } = _decorator

@ccclass('MainButtonsManager')
export class MainButtonsManager extends ButtonsManager {
  @property({ type: Prefab })
  private fishingButtonPrefab: Prefab | null = null

  public fishingButton: Node | null = null

  protected _onLoadExtension() {
    this.fishingButton = instantiate(this.fishingButtonPrefab)
    this.node.addChild(this.fishingButton)
  }

  // update(deltaTime: number) {}
}
