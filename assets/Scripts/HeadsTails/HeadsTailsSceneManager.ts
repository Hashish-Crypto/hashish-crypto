import exactMath from 'exact-math'
import { _decorator, Component, Node, randomRangeInt, Animation } from 'cc'

const { ccclass, property } = _decorator

@ccclass('HeadsTailsSceneManager')
export class HeadsTailsSceneManager extends Component {
  @property({ type: Node })
  private coin1: Node | null = null

  @property({ type: Node })
  private coin2: Node | null = null

  @property({ type: Node })
  private coin3: Node | null = null

  @property({ type: Node })
  private coin4: Node | null = null

  @property({ type: Node })
  private coin5: Node | null = null

  private _wallet: number = 0
  private _bet: number = 2
  private _victories: number = 0
  private _defeats: number = 0
  private _coinFlips: number = 0

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
  }

  start() {
    // this.coin1.getComponent(Animation).play('coinFlip')
    // this._coinFlips += 1
    // setTimeout(() => {
    //   this.coin1.getComponent(Animation).play('coinFlip')
    // }, this.coin1.getComponent(Animation).clips[0].duration * 1000)
  }

  update(deltaTime: number) {
    if (!this.coin1.getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips < 2) {
      this.coin1.getComponent(Animation).play('coinFlip')
      this._coinFlips += 1
    } else if (!this.coin1.getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips < 3) {
      this.coin1.getComponent(Animation).play('head')
      this._coinFlips += 1
    } else if (
      !this.coin2.getComponent(Animation).getState('coinFlip').isPlaying &&
      this._coinFlips >= 3 &&
      this._coinFlips < 5
    ) {
      this.coin2.getComponent(Animation).play('coinFlip')
      this._coinFlips += 1
    } else if (!this.coin2.getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 5) {
      this.coin2.getComponent(Animation).play('tail')
      this._coinFlips += 1
    } else if (
      !this.coin3.getComponent(Animation).getState('coinFlip').isPlaying &&
      this._coinFlips >= 6 &&
      this._coinFlips < 8
    ) {
      this.coin3.getComponent(Animation).play('coinFlip')
      this._coinFlips += 1
    } else if (!this.coin3.getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 8) {
      this.coin3.getComponent(Animation).play('tail')
      this._coinFlips += 1
    } else if (
      !this.coin4.getComponent(Animation).getState('coinFlip').isPlaying &&
      this._coinFlips >= 9 &&
      this._coinFlips < 11
    ) {
      this.coin4.getComponent(Animation).play('coinFlip')
      this._coinFlips += 1
    } else if (!this.coin4.getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 11) {
      this.coin4.getComponent(Animation).play('head')
      this._coinFlips += 1
    } else if (
      !this.coin5.getComponent(Animation).getState('coinFlip').isPlaying &&
      this._coinFlips >= 12 &&
      this._coinFlips < 14
    ) {
      this.coin5.getComponent(Animation).play('coinFlip')
      this._coinFlips += 1
    } else if (!this.coin5.getComponent(Animation).getState('coinFlip').isPlaying && this._coinFlips === 14) {
      this.coin5.getComponent(Animation).play('head')
      this._coinFlips += 1
    }
  }
}
