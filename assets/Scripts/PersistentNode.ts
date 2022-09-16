import { _decorator, Component, director } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  onLoad() {
    director.addPersistRootNode(this.node)
  }
}
