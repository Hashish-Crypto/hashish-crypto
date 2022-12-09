import { _decorator, Component, game, Vec3 } from 'cc'
import spawnPositions from '../lib/spawnPositions'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  public wallet: number = 100
  public spawnPosition: Vec3 = spawnPositions.mainCenter

  onLoad() {
    game.addPersistRootNode(this.node)
  }
}
