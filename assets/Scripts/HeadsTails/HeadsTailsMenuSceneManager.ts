import { _decorator, Component, Node, Button, director, find } from 'cc'
import { PersistentNode } from '../Menu/PersistentNode'

const { ccclass, property } = _decorator

@ccclass('HeadsTailsMenuSceneManager')
export class HeadsTailsMenuSceneManager extends Component {
  @property({ type: Node })
  private startButton: Node | null = null

  private _persistentNode: PersistentNode | null = null

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)
    this.startButton.on(Button.EventType.CLICK, this._start, this)
  }

  private _start() {
    director.loadScene('HeadsTails')
  }

  // update(deltaTime: number) {}
}
