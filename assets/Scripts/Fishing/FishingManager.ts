import exactMath from 'exact-math'
import {
  _decorator,
  Component,
  Node,
  Button,
  UITransform,
  RigidBody2D,
  Vec2,
  randomRangeInt,
  Label,
  director,
  Director,
  find,
  EditBoxComponent,
  ToggleComponent,
} from 'cc'
import { PlayerManager } from '../Main/PlayerManager'
import { PersistentNode } from '../Menu/PersistentNode'
import { MainButtonsManager } from '../UI/Buttons/MainButtonsManager'

const { ccclass, property } = _decorator

@ccclass('FishingManager')
export class FishingManager extends Component {
  @property({ type: Node })
  private gameUI: Node | null = null

  @property(EditBoxComponent)
  public betEditBox: EditBoxComponent | null = null

  @property([ToggleComponent])
  private betToggles: ToggleComponent[] = []

  public catchOverlapFish: boolean = false
  public fishingUI: Node | null = null

  private _persistentNode: PersistentNode | null = null
  private _player: PlayerManager | null = null
  private _buttonsManager: MainButtonsManager | null = null
  private _fountainFishingUI: Node | null = null
  private _finishFishingUI: Node | null = null
  private _catchingFishInitialTime: number = 4
  private _catchingFishEndTime: number = 8.5
  private _catchingFishProgressTimer: number = this._catchingFishInitialTime
  private _fishMovementTimer: number = 0
  private _fishInitialMovementSpeed: number = 255
  private _fishMovementSpeed: number = this._fishInitialMovementSpeed
  private _betMultiplier: number = 1.5
  private _bet: number = 0

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)

    this._player = this.node
      .getParent()
      .getChildByName('Canvas')
      .getChildByName('PlayersRef')
      .getChildByName('Player')
      .getComponent(PlayerManager)

    this._buttonsManager = this.gameUI.getComponentInChildren(MainButtonsManager)
    this._fountainFishingUI = this.node.getParent().getChildByName('GameUI').getChildByName('FountainFishingUI')
    this.fishingUI = this.node.getParent().getChildByName('GameUI').getChildByName('FishingUI')
    this._finishFishingUI = this.node.getParent().getChildByName('GameUI').getChildByName('FinishFishingUI')

    this.betToggles.forEach((betToggle, index) => {
      if (betToggle.isChecked) {
        betToggle.interactable = false

        switch (index) {
          case 0:
            this._betMultiplier = 1.5
            this._fishMovementSpeed = 260
            break
          case 1:
            this._betMultiplier = 1.75
            this._fishMovementSpeed = 270
            break
          case 2:
            this._betMultiplier = 2
            this._fishMovementSpeed = 285
            break
          case 3:
            this._betMultiplier = 2.25
            this._fishMovementSpeed = 300
            break
        }
      }
    })

    this._setWallet()

    this.betEditBox.node.on(EditBoxComponent.EventType.TEXT_CHANGED, this._handleBetChange, this)
    this.betToggles.forEach((betToggle) => {
      betToggle.node.on(ToggleComponent.EventType.CLICK, this._setBetTarget, this)
    })
    this._fountainFishingUI
      .getChildByName('ButtonsLayout')
      .getChildByName('FountainFishingStartButton')
      .on(Button.EventType.CLICK, this._fountainFishingStart, this)
    this._fountainFishingUI
      .getChildByName('ButtonsLayout')
      .getChildByName('FountainFishingCloseButton')
      .on(Button.EventType.CLICK, this._fountainFishingClose, this)
    this._finishFishingUI.getChildByName('CloseButton').on(Button.EventType.CLICK, this._fountainFishingClose, this)
  }

  update(deltaTime: number) {
    if (this.fishingUI.active) {
      const progressBarMaxHeight = this.fishingUI
        .getChildByName('ProgressBar')
        .getChildByName('Background')
        .getComponent(UITransform).height

      if (this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').position.y >= this._fishMovementSpeed) {
        this._fishMovementTimer = 0
        this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').getComponent(RigidBody2D).linearVelocity =
          new Vec2(0, -4)
      } else if (
        this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').position.y <= -this._fishMovementSpeed
      ) {
        this._fishMovementTimer = 0
        this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').getComponent(RigidBody2D).linearVelocity =
          new Vec2(0, 4)
      }

      this._fishMovementTimer += deltaTime
      if (this._fishMovementTimer >= 1) {
        this._fishMovementTimer = 0
        if (randomRangeInt(0, 2) === 0) {
          this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').getComponent(RigidBody2D).linearVelocity =
            new Vec2(0, 4)
        } else {
          this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').getComponent(RigidBody2D).linearVelocity =
            new Vec2(0, -4)
        }
      }

      if (this._catchingFishProgressTimer <= 0) {
        this._didNotCaughtTheFish()
      } else if (this.catchOverlapFish) {
        if (this._catchingFishProgressTimer < this._catchingFishEndTime) {
          this._catchingFishProgressTimer += deltaTime

          this.fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
            Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / this._catchingFishEndTime))
        } else {
          this._caughtTheFish()
        }
      } else {
        this._catchingFishProgressTimer -= deltaTime
        this.fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
          Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / this._catchingFishEndTime))
      }
    }
  }

  private _setWallet() {
    this._fountainFishingUI
      .getChildByName('BalanceLayout')
      .getChildByName('BalanceLabel')
      .getChildByName('Label')
      .getComponent(Label).string = 'HC$' + this._persistentNode.wallet.toFixed(2)

    this._finishFishingUI
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
      this._betMultiplier = 1.5
      this._fishMovementSpeed = 255
    } else if (betToggle.node.name === 'Toggle1') {
      betToggle.interactable = false
      this._betMultiplier = 1.75
      this._fishMovementSpeed = 265
    } else if (betToggle.node.name === 'Toggle2') {
      betToggle.interactable = false
      this._betMultiplier = 2
      this._fishMovementSpeed = 275
    } else if (betToggle.node.name === 'Toggle3') {
      betToggle.interactable = false
      this._betMultiplier = 2.25
      this._fishMovementSpeed = 285
    }

    const otherBetToggles = this.betToggles.filter((toggle) => toggle.node.name !== betToggle.node.name)
    otherBetToggles.forEach((toggle) => {
      toggle.isChecked = false
      toggle.interactable = true
    })
  }

  public activateFountainFishingButton() {
    this._buttonsManager.button0.active = false
    this._buttonsManager.fishingButton.active = true
    this._buttonsManager.fishingButton.getComponent(Button).interactable = true
    this._buttonsManager.fishingButton.on(Button.EventType.CLICK, this._activateFountainFishingUI, this)
  }

  public deactivateFountainFishingButton() {
    this._buttonsManager.button0.active = true
    this._buttonsManager.fishingButton.active = false
    this._buttonsManager.fishingButton.off(Button.EventType.CLICK, this._activateFountainFishingUI, this)
  }

  private _activateFountainFishingUI() {
    this._buttonsManager.fishingButton.getComponent(Button).interactable = false
    this._player.controllerEnabled = false
    this._player.resetMovement()
    this._fountainFishingUI.active = true
  }

  private _fountainFishingStart() {
    if (
      this._bet <= 0 ||
      Number(
        exactMath.floor(exactMath.sub(this._persistentNode.wallet, this._bet), -2, {
          returnString: true,
        })
      ) < 0
    )
      return

    this._fountainFishingUI.active = false
    this.fishingUI.active = true
  }

  private _fountainFishingClose() {
    this._fountainFishingUI.active = false
    this._finishFishingUI.active = false
    this.activateFountainFishingButton()
    this._player.controllerEnabled = true
  }

  public moveCatchBar() {
    this.fishingUI
      .getChildByName('CatchBar')
      .getChildByName('Catch')
      .getComponent(RigidBody2D)
      .applyLinearImpulseToCenter(new Vec2(0, 15), true)
  }

  private _resetFishing() {
    const progressBarMaxHeight = this.fishingUI
      .getChildByName('ProgressBar')
      .getChildByName('Background')
      .getComponent(UITransform).height

    this.catchOverlapFish = false
    this._catchingFishProgressTimer = this._catchingFishInitialTime
    this._fishMovementTimer = 0
    this.fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
      Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / this._catchingFishEndTime))
    director.once(Director.EVENT_AFTER_PHYSICS, () => {
      this.fishingUI.getChildByName('CatchBar').getChildByName('Catch').getComponent(RigidBody2D).linearVelocity =
        new Vec2(0, 0)
      this.fishingUI.getChildByName('CatchBar').getChildByName('Catch').setPosition(0, 180)
      this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').setPosition(0, 0)
    })
    this.fishingUI.active = false
  }

  private _didNotCaughtTheFish() {
    this._resetFishing()
    this._finishFishingUI.getChildByName('ResultLabel').getComponent(Label).string = 'You failed to catch the fish.'
    this._finishFishingUI.getChildByName('PrizeLabel').getComponent(Label).string = 'You loose HC$' + this._bet
    this._persistentNode.wallet = Number(
      exactMath.floor(exactMath.sub(this._persistentNode.wallet, this._bet), -2, {
        returnString: true,
      })
    )
    this._setWallet()
    this._finishFishingUI.active = true
  }

  private _caughtTheFish() {
    this._resetFishing()

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

    this._finishFishingUI.getChildByName('ResultLabel').getComponent(Label).string = 'You managed to catch the fish!'
    this._finishFishingUI.getChildByName('PrizeLabel').getComponent(Label).string = 'You win HC$' + prize
    this._setWallet()
    this._finishFishingUI.active = true
  }
}
