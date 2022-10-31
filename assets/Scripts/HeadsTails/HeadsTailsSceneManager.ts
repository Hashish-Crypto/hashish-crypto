import exactMath from 'exact-math'
import { _decorator, Component, Node, randomRangeInt, Animation, Label } from 'cc'

const { ccclass, property } = _decorator

@ccclass('HeadsTailsSceneManager')
export class HeadsTailsSceneManager extends Component {
  @property({ type: [Node] })
  private coins: Node[] = []

  @property({ type: Label })
  private hitLabel: Label | null = null

  @property({ type: Label })
  private multiplierLabel: Label | null = null

  @property({ type: Label })
  private resultLabel: Label | null = null

  @property({ type: Label })
  private walletLabel: Label | null = null

  private _wallet: number = 100
  private _hit: number = 2
  private _bet: number = 10
  private _coinFlips: number = 0
  private _flips: boolean[] = []
  private _animationDelay: number = 0

  onLoad() {
    for (let i = 0; i < 5; i++) {
      if (randomRangeInt(0, 2) === 0) {
        this._flips[i] = true
      } else {
        this._flips[i] = false
      }
    }

    this.hitLabel.string = 'To hit: ' + this._hit + ' Heads | Bet: HC$' + this._bet

    let betMultiplier: number = 0

    switch (this._hit) {
      case 0:
      case 5:
        betMultiplier = Number(
          exactMath.floor((32 / 1) * 0.99, -2, {
            returnString: true,
          })
        )
        break
      case 1:
      case 4:
        betMultiplier = Number(
          exactMath.floor((32 / 5) * 0.99, -2, {
            returnString: true,
          })
        )
        break
      case 2:
      case 3:
        betMultiplier = Number(
          exactMath.floor((32 / 10) * 0.99, -2, {
            returnString: true,
          })
        )
        break
    }

    this.multiplierLabel.string = 'Bet multiplier: ' + betMultiplier + 'X'

    let heads: number = 0
    this._flips.forEach((value) => {
      if (value) {
        heads += 1
      }
    })

    if (this._hit === heads) {
      const prize = Number(
        exactMath.floor(exactMath.mul(this._bet, betMultiplier), -2, {
          returnString: true,
        })
      )

      this._wallet = Number(
        exactMath.ceil(exactMath.add(this._wallet, prize), -2, {
          returnString: true,
        })
      )

      this.resultLabel.string = heads + ' Heads, you win HC$' + prize
    } else {
      this._wallet = Number(
        exactMath.floor(exactMath.sub(this._wallet, this._bet), -2, {
          returnString: true,
        })
      )

      this.resultLabel.string = heads + ' Heads, you loose HC$' + this._bet
    }

    this.walletLabel.string = 'Wallet: HC$' + this._wallet
  }

  update(deltaTime: number) {
    if (this._animationDelay < 1) {
      this._animationDelay += deltaTime
    } else if (this._coinFlips <= 9) {
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
        this.resultLabel.node.active = true
        this.walletLabel.node.active = true
      }
    }
  }
}
