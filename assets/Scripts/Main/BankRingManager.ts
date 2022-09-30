import { _decorator, Component, Node, Vec3, RigidBody2D } from 'cc'

const { ccclass, property } = _decorator

@ccclass('BankRingManager')
export class BankRingManager extends Component {
  onLoad() {
    this.node.getComponent(RigidBody2D).angularVelocity = 15
  }
}
