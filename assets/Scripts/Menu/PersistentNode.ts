import { _decorator, Component, game } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  public wallet: number = 100

  onLoad() {
    game.addPersistRootNode(this.node)
  }
}
