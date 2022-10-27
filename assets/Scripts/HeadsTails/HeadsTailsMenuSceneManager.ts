import { _decorator, Component, Node, Button, director } from 'cc'

const { ccclass, property } = _decorator

@ccclass('HeadsTailsMenuSceneManager')
export class HeadsTailsMenuSceneManager extends Component {
  @property({ type: Node })
  private startButton: Node | null = null

  onLoad() {
    this.startButton.on(Button.EventType.CLICK, this._start, this)
  }

  private _start() {
    director.loadScene('HeadsTails')
  }

  // update(deltaTime: number) {}
}
