import { _decorator, Component, Node } from 'cc'

const { ccclass } = _decorator

@ccclass('ButtonsManager')
export class ButtonsManager extends Component {
  public button0: Node | null = null
  public fishingButton: Node | null = null

  onLoad() {
    this.button0 = this.node.getChildByName('Button0')
    this.fishingButton = this.node.getChildByName('FishingButton')

    // this.button0.on(Button.EventType.CLICK, this._button0Click, this)
  }

  update(deltaTime: number) {}
}
