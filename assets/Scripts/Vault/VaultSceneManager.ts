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
} from 'cc'
import { PersistentNode } from '../Menu/PersistentNode'

const { ccclass, property } = _decorator

@ccclass('VaultSceneManager')
export class VaultSceneManager extends Component {
  private _persistentNode: PersistentNode | null = null

  @property(EditBoxComponent)
  private betEditBox: EditBoxComponent | null = null

  @property([ToggleComponent])
  private betToggles: ToggleComponent[] = []

  private _menuUI: Node | null = null
  private _loseUI: Node | null = null
  private _winUI: Node | null = null
  private _vaultUI: Node | null = null
  private _speed: number = 1
  private _betMultiplier: number = 1.5
  private _bet: number = 0

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
  }

  // update(deltaTime: number) {}

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
}
