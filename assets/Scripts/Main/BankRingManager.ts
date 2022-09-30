import { _decorator, Component, RigidBody2D } from 'cc'

const { ccclass } = _decorator

@ccclass('BankRingManager')
export class BankRingManager extends Component {
  onLoad() {
    this.node.getComponent(RigidBody2D).angularVelocity = 15
  }
}
