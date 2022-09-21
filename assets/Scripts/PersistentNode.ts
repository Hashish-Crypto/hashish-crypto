import { _decorator, Component, game } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  onLoad() {
    game.addPersistRootNode(this.node)
  }
}
