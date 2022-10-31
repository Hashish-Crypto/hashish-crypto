import exactMath from 'exact-math'
import { _decorator, Component, Node, randomRangeInt, Animation } from 'cc'

const { ccclass, property } = _decorator

@ccclass('HeadsTailsSceneManager')
export class HeadsTailsSceneManager extends Component {
  @property({ type: [Node] })
  private coins: Node[] = []

  private _wallet: number = 0
  private _bet: number = 2
  private _victories: number = 0
  private _defeats: number = 0
  private _coinFlips: number = 0
  private _flips: boolean[] = []

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

    for (let i = 0; i < 5; i++) {
      if (randomRangeInt(0, 2) === 0) {
        this._flips[i] = true
      } else {
        this._flips[i] = false
      }
    }
  }

  start() {
    // this.coins[0].getComponent(Animation).play('coinFlip')
  }

  update(deltaTime: number) {
    if (this._coinFlips <= 9) {
      if (!this.coins[0].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 0) {
        this.coins[0].getComponent(Animation).play('coinFlip')
        this._coinFlips += 1
      } else if (!this.coins[0].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 1) {
        if (this._flips[0]) {
          this.coins[0].getComponent(Animation).play('head')
        } else {
          this.coins[0].getComponent(Animation).play('tail')
        }
        this._coinFlips += 1
      } else if (!this.coins[1].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 2) {
        this.coins[1].getComponent(Animation).play('coinFlip')
        this._coinFlips += 1
      } else if (!this.coins[1].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 3) {
        if (this._flips[1]) {
          this.coins[1].getComponent(Animation).play('head')
        } else {
          this.coins[1].getComponent(Animation).play('tail')
        }
        this._coinFlips += 1
      } else if (!this.coins[2].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 4) {
        this.coins[2].getComponent(Animation).play('coinFlip')
        this._coinFlips += 1
      } else if (!this.coins[2].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 5) {
        if (this._flips[2]) {
          this.coins[2].getComponent(Animation).play('head')
        } else {
          this.coins[2].getComponent(Animation).play('tail')
        }
        this._coinFlips += 1
      } else if (!this.coins[3].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 6) {
        this.coins[3].getComponent(Animation).play('coinFlip')
        this._coinFlips += 1
      } else if (!this.coins[3].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 7) {
        if (this._flips[3]) {
          this.coins[3].getComponent(Animation).play('head')
        } else {
          this.coins[3].getComponent(Animation).play('tail')
        }
        this._coinFlips += 1
      } else if (!this.coins[4].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 8) {
        this.coins[4].getComponent(Animation).play('coinFlip')
        this._coinFlips += 1
      } else if (!this.coins[4].getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 9) {
        if (this._flips[4]) {
          this.coins[4].getComponent(Animation).play('head')
        } else {
          this.coins[4].getComponent(Animation).play('tail')
        }
        this._coinFlips += 1
      }
    }
  }
}
