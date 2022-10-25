import exactMath from 'exact-math'
import { _decorator, Component, Node, randomRangeInt } from 'cc'

const { ccclass, property } = _decorator

@ccclass('HeadsTailsSceneManager')
export class HeadsTailsSceneManager extends Component {
  private _wallet: number = 0
  private _bet: number = 2
  private _victories: number = 0
  private _defeats: number = 0

  onLoad() {
    for (let j = 1; j <= 100000; j++) {
      this._wallet -= 10

      let heads: number = 0
      for (let i = 1; i <= 5; i++) {
        if (randomRangeInt(0, 2) === 0) {
          heads += 1
        }
      }

      if (this._bet === heads) {
        this._victories += 1

        switch (this._bet) {
          case 0:
            this._wallet = Number(
              exactMath.round(exactMath.add(this._wallet, 10 * (32 / 1) * 0.99), -2, {
                returnString: true,
              })
            )
            break
          case 1:
            this._wallet = Number(
              exactMath.round(exactMath.add(this._wallet, 10 * (32 / 5) * 0.99), -2, {
                returnString: true,
              })
            )
            break
          case 2:
            this._wallet = Number(
              exactMath.round(exactMath.add(this._wallet, 10 * (32 / 10) * 0.99), -2, {
                returnString: true,
              })
            )
            break
          case 3:
            this._wallet = Number(
              exactMath.round(exactMath.add(this._wallet, 10 * (32 / 10) * 0.99), -2, {
                returnString: true,
              })
            )
            break
          case 4:
            this._wallet = Number(
              exactMath.round(exactMath.add(this._wallet, 10 * (32 / 5) * 0.99), -2, {
                returnString: true,
              })
            )
            break
          case 5:
            this._wallet = Number(
              exactMath.round(exactMath.add(this._wallet, 10 * (32 / 1) * 0.99), -2, {
                returnString: true,
              })
            )
            break
        }
      } else {
        this._defeats += 1
      }
    }

    console.log(this._wallet, this._victories, this._defeats)
    console.log(exactMath.floor(10 * (32 / 5) * 0.99, -1))
    console.log(10 * (32 / 5) * 0.99)
  }

  // update(deltaTime: number) {}
}
