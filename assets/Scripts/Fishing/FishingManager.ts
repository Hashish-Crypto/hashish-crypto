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
} from 'cc'
import { PlayerManager } from '../Main/PlayerManager'
import { ButtonsManager } from '../UI/Buttons/ButtonsManager'

const { ccclass, property } = _decorator

@ccclass('FishingManager')
export class FishingManager extends Component {
  @property({ type: Node })
  private playerNode: Node | null = null

  @property({ type: Node })
  private gameUI: Node | null = null

  public catchOverlapFish: boolean = false
  public fishingUI: Node | null = null

  private _player: PlayerManager | null = null
  private _buttonsManager: ButtonsManager | null = null
  private _fountainFishingUI: Node | null = null
  private _finishFishingUI: Node | null = null
  private _catchingFishInitialTime: number = 3
  private _catchingFishEndTime: number = 7
  private _catchingFishProgressTimer: number = this._catchingFishInitialTime
  private _fishMovementTimer: number = 0

  onLoad() {
    this._player = this.playerNode.getComponent(PlayerManager)
    this._buttonsManager = this.gameUI.getComponentInChildren(ButtonsManager)
    this._fountainFishingUI = this.node.getParent().getChildByName('GameUI').getChildByName('FountainFishingUI')
    this._fountainFishingUI
      .getChildByName('FountainFishingStartButton')
      .on(Button.EventType.CLICK, this._fountainFishingStart, this)
    this._fountainFishingUI
      .getChildByName('FountainFishingCloseButton')
      .on(Button.EventType.CLICK, this._fountainFishingClose, this)
    this.fishingUI = this.node.getParent().getChildByName('GameUI').getChildByName('FishingUI')
    this._finishFishingUI = this.node.getParent().getChildByName('GameUI').getChildByName('FinishFishingUI')
    this._finishFishingUI.getChildByName('CloseButton').on(Button.EventType.CLICK, this._fountainFishingClose, this)
  }

  update(deltaTime: number) {
    if (this.fishingUI.active) {
      const progressBarMaxHeight = this.fishingUI
        .getChildByName('ProgressBar')
        .getChildByName('Background')
        .getComponent(UITransform).height

      if (this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').position.y >= 260) {
        this._fishMovementTimer = 0
        this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').getComponent(RigidBody2D).linearVelocity =
          new Vec2(0, -4)
      } else if (this.fishingUI.getChildByName('CatchBar').getChildByName('Fish').position.y <= -260) {
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
        this._resetFishing()
        this._finishFishingUI.getChildByName('ResultLabel').getComponent(Label).string = 'You failed to catch the fish.'
        this._finishFishingUI.active = true
      } else if (this.catchOverlapFish) {
        if (this._catchingFishProgressTimer < this._catchingFishEndTime) {
          this._catchingFishProgressTimer += deltaTime

          this.fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
            Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / this._catchingFishEndTime))
        } else {
          this._resetFishing()
          this._finishFishingUI.getChildByName('ResultLabel').getComponent(Label).string =
            'You managed to catch the fish!'
          this._finishFishingUI.active = true
        }
      } else {
        this._catchingFishProgressTimer -= deltaTime
        this.fishingUI.getChildByName('ProgressBar').getChildByName('Progress').getComponent(UITransform).height =
          Math.floor(progressBarMaxHeight * (this._catchingFishProgressTimer / this._catchingFishEndTime))
      }
    }
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
    this._fountainFishingUI.active = false
    this.fishingUI.active = true
  }

  private _fountainFishingClose() {
    this._fountainFishingUI.active = false
    this._finishFishingUI.active = false
    this.activateFountainFishingButton()
    this._player.controllerEnabled = true
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
}
