import { _decorator, Component, Node, Prefab, instantiate } from 'cc'

const { ccclass, property } = _decorator

@ccclass('ButtonsManager')
export class ButtonsManager extends Component {
  @property({ type: Prefab })
  private button0Prefab: Prefab | null = null

  public button0: Node | null = null

  onLoad() {
    this.button0 = instantiate(this.button0Prefab)
    this.node.addChild(this.button0)
    this._onLoadExtension()
  }

  protected _onLoadExtension() {}

  // update(deltaTime: number) {}
}
