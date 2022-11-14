import exactMath from 'exact-math'
import {
  _decorator,
  Component,
  Node,
  find,
  EditBoxComponent,
  ToggleComponent,
  Label,
  Button,
  director,
  randomRangeInt,
  instantiate,
  Prefab,
} from 'cc'
import { PersistentNode } from '../Menu/PersistentNode'

const { ccclass, property } = _decorator

enum LightBulbColor {
  GREEN,
  RED,
  BLUE,
}

interface ILightBulb {
  node: Node
  color: LightBulbColor
}

@ccclass('VaultSceneManager')
export class VaultSceneManager extends Component {
  @property(EditBoxComponent)
  private betEditBox: EditBoxComponent | null = null

  @property([ToggleComponent])
  private betToggles: ToggleComponent[] = []

  @property({ type: [Node] })
  public numbersNode: Node[] | null = []

  @property({ type: Node })
  private lightBulbRef: Node | null = null

  @property({ type: Prefab })
  private lightBulbPrefab: Prefab | null = null

  private _persistentNode: PersistentNode | null = null
  private _menuUI: Node | null = null
  private _loseUI: Node | null = null
  private _winUI: Node | null = null
  private _vaultUI: Node | null = null
  private _speed: number = 1
  private _betMultiplier: number = 1.5
  private _bet: number = 0

  private _lightBulbQuantity: number = 60
  private _innerLightBulbCircle: ILightBulb[] = []
  private _innerLightBulbCircleRadius: number = 185
  private _outerLightBulbCircle: ILightBulb[] = []
  private _outerLightBulbCircleRadius: number = 205
  private _cycleTimer: number = 0
  private _lastActiveLightBulb: number = 0
  private _activeLightBulb: number = 0
  private _isClockwise: boolean = true
  private _round: number = 5
  private _gameOver: boolean = false

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)
    this._menuUI = this.node.getParent().getChildByName('GameUI').getChildByName('MenuUI')
    this._loseUI = this.node.getParent().getChildByName('GameUI').getChildByName('LoseUI')
    this._winUI = this.node.getParent().getChildByName('GameUI').getChildByName('WinUI')
    this._vaultUI = this.node.getParent().getChildByName('GameUI').getChildByName('VaultUI')

    this.betToggles.forEach((betToggle, index) => {
      if (betToggle.isChecked) {
        betToggle.interactable = false

        switch (index) {
          case 0:
            this._speed = 1
            this._betMultiplier = 1.5
            break
          case 1:
            this._speed = 1.3
            this._betMultiplier = 2
            break
          case 2:
            this._speed = 1.6
            this._betMultiplier = 2.5
            break
          case 3:
            this._speed = 2
            this._betMultiplier = 3
            break
        }
      }
    })

    this._setWallet()

    this.betEditBox.node.on(EditBoxComponent.EventType.TEXT_CHANGED, this._handleBetChange, this)
    this.betToggles.forEach((betToggle) => {
      betToggle.node.on(ToggleComponent.EventType.CLICK, this._setBetTarget, this)
    })

    this._menuUI
      .getChildByName('ButtonsLayout')
      .getChildByName('StartButton')
      .on(Button.EventType.CLICK, this._handleStartButton, this)
    this._menuUI
      .getChildByName('ButtonsLayout')
      .getChildByName('ReturnButton')
      .on(Button.EventType.CLICK, this._handleReturnButton, this)
    this._loseUI
      .getChildByName('ButtonsLayout')
      .getChildByName('PlayAgainButton')
      .on(Button.EventType.CLICK, this._handlePlayAgainButton, this)
    this._loseUI
      .getChildByName('ButtonsLayout')
      .getChildByName('ReturnButton')
      .on(Button.EventType.CLICK, this._handleReturnButton, this)
    this._winUI
      .getChildByName('ButtonsLayout')
      .getChildByName('GetPrizeButton')
      .on(Button.EventType.CLICK, this._handleGetPrizeButton, this)
    this._winUI
      .getChildByName('ButtonsLayout')
      .getChildByName('OpenVaultButton')
      .on(Button.EventType.CLICK, this._handleOpenVaultButton, this)

    for (let i = 0; i < this._lightBulbQuantity; i += 1) {
      this._innerLightBulbCircle[i] = {
        node: instantiate(this.lightBulbPrefab),
        color: LightBulbColor.GREEN,
      }
      let x = (Math.cos((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._innerLightBulbCircleRadius
      let y = (Math.sin((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._innerLightBulbCircleRadius
      this._innerLightBulbCircle[i].node.setPosition(x, y)
      this.lightBulbRef.addChild(this._innerLightBulbCircle[i].node)

      this._outerLightBulbCircle[i] = {
        node: instantiate(this.lightBulbPrefab),
        color: LightBulbColor.GREEN,
      }
      x = (Math.cos((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._outerLightBulbCircleRadius
      y = (Math.sin((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._outerLightBulbCircleRadius
      this._outerLightBulbCircle[i].node.setPosition(x, y)
      this.lightBulbRef.addChild(this._outerLightBulbCircle[i].node)
    }

    this._setGameRound()
    this._round -= 1
    this.node.getParent().getChildByName('Canvas').on(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }

  update(deltaTime: number) {
    if (!this._gameOver) {
      this._cycleTimer += deltaTime
      if (this._cycleTimer >= 0.035 / this._speed) {
        this._cycleTimer = 0
        this._lastActiveLightBulb = this._activeLightBulb

        if (this._isClockwise) {
          if (this._activeLightBulb > 0) {
            if (this._innerLightBulbCircle[this._activeLightBulb - 1].color === LightBulbColor.GREEN) {
              this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.GREEN)
              this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.GREEN)
            } else if (this._innerLightBulbCircle[this._activeLightBulb - 1].color === LightBulbColor.RED) {
              this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.RED)
              this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.RED)
            }
          } else if (this._activeLightBulb === 0) {
            if (this._innerLightBulbCircle[this._lightBulbQuantity - 1].color === LightBulbColor.GREEN) {
              this._setLightBulbColor(this._innerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.GREEN)
              this._setLightBulbColor(this._outerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.GREEN)
            } else if (this._innerLightBulbCircle[this._lightBulbQuantity - 1].color === LightBulbColor.RED) {
              this._setLightBulbColor(this._innerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.RED)
              this._setLightBulbColor(this._outerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.RED)
            }
          }

          this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)
          this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)

          this._activeLightBulb += 1
          if (this._activeLightBulb > 59) {
            this._activeLightBulb = 0
          }
        } else if (!this._isClockwise) {
          if (this._activeLightBulb < 59) {
            if (this._innerLightBulbCircle[this._activeLightBulb + 1].color === LightBulbColor.GREEN) {
              this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.GREEN)
              this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.GREEN)
            } else if (this._innerLightBulbCircle[this._activeLightBulb + 1].color === LightBulbColor.RED) {
              this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.RED)
              this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.RED)
            }
          } else if (this._activeLightBulb === 59) {
            if (this._innerLightBulbCircle[0].color === LightBulbColor.GREEN) {
              this._setLightBulbColor(this._innerLightBulbCircle[0], LightBulbColor.GREEN)
              this._setLightBulbColor(this._outerLightBulbCircle[0], LightBulbColor.GREEN)
            } else if (this._innerLightBulbCircle[0].color === LightBulbColor.RED) {
              this._setLightBulbColor(this._innerLightBulbCircle[0], LightBulbColor.RED)
              this._setLightBulbColor(this._outerLightBulbCircle[0], LightBulbColor.RED)
            }
          }

          this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)
          this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)

          this._activeLightBulb -= 1
          if (this._activeLightBulb < 0) {
            this._activeLightBulb = 59
          }
        }
      }
    }
  }

  private _setWallet() {
    this._menuUI
      .getChildByName('BalanceLayout')
      .getChildByName('BalanceLabel')
      .getChildByName('Label')
      .getComponent(Label).string = 'HC$' + this._persistentNode.wallet.toFixed(2)

    this._loseUI
      .getChildByName('BalanceLayout')
      .getChildByName('BalanceLabel')
      .getChildByName('Label')
      .getComponent(Label).string = 'HC$' + this._persistentNode.wallet.toFixed(2)

    this._vaultUI
      .getChildByName('BalanceLayout')
      .getChildByName('BalanceLabel')
      .getChildByName('Label')
      .getComponent(Label).string = 'HC$' + this._persistentNode.wallet.toFixed(2)
  }

  private _handleBetChange(editBox: EditBoxComponent) {
    this._bet = Number(editBox.string)
  }

  private _setBetTarget(betToggle: ToggleComponent) {
    if (betToggle.isChecked) return

    if (betToggle.node.name === 'Toggle0') {
      betToggle.interactable = false
      this._speed = 1
      this._betMultiplier = 1.5
    } else if (betToggle.node.name === 'Toggle1') {
      betToggle.interactable = false
      this._speed = 1.3
      this._betMultiplier = 2
    } else if (betToggle.node.name === 'Toggle2') {
      betToggle.interactable = false
      this._speed = 1.6
      this._betMultiplier = 2.5
    } else if (betToggle.node.name === 'Toggle3') {
      betToggle.interactable = false
      this._speed = 2
      this._betMultiplier = 3
    }

    const otherBetToggles = this.betToggles.filter((toggle) => toggle.node.name !== betToggle.node.name)
    otherBetToggles.forEach((toggle) => {
      toggle.isChecked = false
      toggle.interactable = true
    })
  }

  private _handleStartButton() {
    this._menuUI.active = false
  }

  private _handleReturnButton() {
    director.loadScene('Bank')
  }

  private _handlePlayAgainButton() {
    this._loseUI.active = false
    this._menuUI.active = true
  }

  private _handleGetPrizeButton() {
    const prize = Number(
      exactMath.floor(exactMath.mul(this._bet, this._betMultiplier), -2, {
        returnString: true,
      })
    )

    this._persistentNode.wallet = Number(
      exactMath.ceil(exactMath.add(this._persistentNode.wallet, prize), -2, {
        returnString: true,
      })
    )

    this._winUI.getChildByName('PrizeLabel').getComponent(Label).string = 'Prize: HC$' + prize

    this._winUI.active = false
    this._menuUI.active = true
  }

  private _handleOpenVaultButton() {
    const randomNumber = randomRangeInt(0, 10)

    if (randomNumber < 3) {
      const prize = Number(
        exactMath.floor(exactMath.mul(this._bet * 3, this._betMultiplier), -2, {
          returnString: true,
        })
      )
      this._persistentNode.wallet = Number(
        exactMath.ceil(exactMath.add(this._persistentNode.wallet, prize), -2, {
          returnString: true,
        })
      )

      this._vaultUI.getChildByName('ResultLabel').getComponent(Label).string =
        'There is a special prize\ninside the vault!'
      this._vaultUI.getChildByName('PrizeLabel').getComponent(Label).string = 'Prize: HC$' + prize.toFixed(2)
    } else {
      this._persistentNode.wallet = Number(
        exactMath.floor(exactMath.sub(this._persistentNode.wallet, this._bet), -2, {
          returnString: true,
        })
      )

      this._vaultUI.getChildByName('ResultLabel').getComponent(Label).string =
        'The vault is empty,\ngood luck next time.'
      this._vaultUI.getChildByName('PrizeLabel').getComponent(Label).string = 'Prize: HC$0.00'
    }

    this._setWallet()

    this._winUI.active = false
    this._vaultUI.active = true
  }

  private _setGameRound() {
    for (let i = 0; i < this._lightBulbQuantity; i += 1) {
      this._setLightBulbColor(this._innerLightBulbCircle[i], LightBulbColor.GREEN)
      this._setLightBulbColor(this._outerLightBulbCircle[i], LightBulbColor.GREEN)
    }

    if (this._round > 1) {
      for (let i = 1; i <= this._round; i += 1) {
        for (let j = 0; j < this._round; j += 1) {
          const index = Math.trunc((this._lightBulbQuantity * i) / this._round) - 1 - j

          this._setLightBulbColor(this._innerLightBulbCircle[index], LightBulbColor.RED)
          this._setLightBulbColor(this._outerLightBulbCircle[index], LightBulbColor.RED)
        }
      }
    } else if (this._round === 1) {
      for (let i = 1; i <= this._round; i += 1) {
        for (let j = 0; j < 2; j += 1) {
          const index = Math.trunc((this._lightBulbQuantity * i) / this._round) - 1 - j

          this._setLightBulbColor(this._innerLightBulbCircle[index], LightBulbColor.RED)
          this._setLightBulbColor(this._outerLightBulbCircle[index], LightBulbColor.RED)
        }
      }
    }
  }

  private _setLightBulbColor(lightBulb: ILightBulb, color: LightBulbColor) {
    if (color === LightBulbColor.GREEN) {
      lightBulb.node.getChildByName('GreenOff').active = true
      lightBulb.node.getChildByName('GreenOn').active = false
      lightBulb.node.getChildByName('RedOff').active = false
      lightBulb.node.getChildByName('RedOn').active = false
    } else if (color === LightBulbColor.RED) {
      lightBulb.node.getChildByName('GreenOff').active = false
      lightBulb.node.getChildByName('GreenOn').active = false
      lightBulb.node.getChildByName('RedOff').active = true
      lightBulb.node.getChildByName('RedOn').active = false
    } else if (color === LightBulbColor.BLUE) {
      lightBulb.node.getChildByName('GreenOff').active = false
      lightBulb.node.getChildByName('GreenOn').active = true
      lightBulb.node.getChildByName('RedOff').active = false
      lightBulb.node.getChildByName('RedOn').active = false
    }
  }

  private _unlockNumber() {
    this.numbersNode[this._round].getComponent(Label).string = String(randomRangeInt(0, 10))

    this._round -= 1
    if (this._round === -1) {
      this._stopGame()
      this._winUI.active = true
      return
    }

    this._resumeGame()
  }

  private _onTouchScreen() {
    this._stopGame()
    if (this._innerLightBulbCircle[this._lastActiveLightBulb].color === LightBulbColor.RED) {
      this._setGameRound()
      this._unlockNumber()
    } else if (this._innerLightBulbCircle[this._lastActiveLightBulb].color === LightBulbColor.GREEN) {
      this._stopGame()
      this._persistentNode.wallet = Number(
        exactMath.floor(exactMath.sub(this._persistentNode.wallet, this._bet), -2, {
          returnString: true,
        })
      )
      this._loseUI.active = true
    }

    this._isClockwise = !this._isClockwise
  }

  private _stopGame() {
    this._gameOver = true
    this.node.getParent().getChildByName('Canvas').off(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }

  private _resumeGame() {
    this._gameOver = false
    this.node.getParent().getChildByName('Canvas').on(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }
}
