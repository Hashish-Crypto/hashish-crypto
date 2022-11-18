import { _decorator, Node, Prefab, instantiate } from 'cc'
import { ButtonsManager } from './ButtonsManager'

const { ccclass, property } = _decorator

@ccclass('BankButtonsManager')
export class BankButtonsManager extends ButtonsManager {
  @property({ type: Prefab })
  private coinButtonPrefab: Prefab | null = null

  public coinButton: Node | null = null

  protected _onLoadExtension() {
    this.coinButton = instantiate(this.coinButtonPrefab)
    this.node.addChild(this.coinButton)
  }

  // update(deltaTime: number) {}
}
