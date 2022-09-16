import { _decorator, Component, Node } from 'cc'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  onLoad() {
    console.log('Hi!')
  }

  // update(deltaTime: number) {}
}
