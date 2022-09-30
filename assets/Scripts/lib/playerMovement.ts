import { EventKeyboard, KeyCode } from 'cc'
import { PlayerManager } from '../Main/PlayerManager'

import Direction from '../enums/Direction'

const playerMovement = {
  onKeyDown: (player: PlayerManager, event: EventKeyboard) => {
    if (!player.controllerEnabled) return

    if (event.keyCode === KeyCode.KEY_W) {
      player.lastMovementCommand = Direction.UP
      player.movementCommands.push(Direction.UP)
      player.move()
    } else if (event.keyCode === KeyCode.KEY_D) {
      player.lastMovementCommand = Direction.RIGHT
      player.movementCommands.push(Direction.RIGHT)
      player.move()
    } else if (event.keyCode === KeyCode.KEY_S) {
      player.lastMovementCommand = Direction.DOWN
      player.movementCommands.push(Direction.DOWN)
      player.move()
    } else if (event.keyCode === KeyCode.KEY_A) {
      player.lastMovementCommand = Direction.LEFT
      player.movementCommands.push(Direction.LEFT)
      player.move()
    }
  },
  onKeyUp: (player: PlayerManager, event: EventKeyboard) => {
    if (!player.controllerEnabled) return

    if (event.keyCode === KeyCode.KEY_W) {
      player.movementCommands = player.movementCommands.filter((direction) => direction !== Direction.UP)
      if (player.movementCommands.length === 0) {
        player.idleUp()
      }
    } else if (event.keyCode === KeyCode.KEY_D) {
      player.movementCommands = player.movementCommands.filter((direction) => direction !== Direction.RIGHT)
      if (player.movementCommands.length === 0) {
        player.idleRight()
      }
    } else if (event.keyCode === KeyCode.KEY_S) {
      player.movementCommands = player.movementCommands.filter((direction) => direction !== Direction.DOWN)
      if (player.movementCommands.length === 0) {
        player.idleDown()
      }
    } else if (event.keyCode === KeyCode.KEY_A) {
      player.movementCommands = player.movementCommands.filter((direction) => direction !== Direction.LEFT)
      if (player.movementCommands.length === 0) {
        player.idleLeft()
      }
    }

    // If there is still a key pressed, it triggers the player movement.
    if (player.movementCommands.length > 0) {
      player.move()
    }
  },
}

export default playerMovement
