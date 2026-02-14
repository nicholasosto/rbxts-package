import { Controller, OnStart } from '@flamework/core';
import { UserInputService } from '@rbxts/services';
import { InputAction } from '../types';
import { CombatController } from './combat-controller';

/**
 * InputController
 *
 * Captures player input and routes it to the appropriate system.
 * Binds keyboard/gamepad/touch actions to InputAction enum values.
 */
@Controller({})
export class InputController implements OnStart {
  // Key bindings — maps Enum.KeyCode to InputAction
  private readonly keyBindings = new Map<Enum.KeyCode, InputAction>([
    [Enum.KeyCode.E, InputAction.Attack],
    [Enum.KeyCode.Q, InputAction.Block],
    [Enum.KeyCode.LeftShift, InputAction.Dodge],
    [Enum.KeyCode.One, InputAction.Ability1],
    [Enum.KeyCode.Two, InputAction.Ability2],
    [Enum.KeyCode.Three, InputAction.Ability3],
    [Enum.KeyCode.Four, InputAction.Ability4],
    [Enum.KeyCode.F, InputAction.Interact],
    [Enum.KeyCode.I, InputAction.ToggleInventory],
    [Enum.KeyCode.Escape, InputAction.ToggleMenu],
  ]);

  constructor(private combatController: CombatController) {}

  onStart(): void {
    print('[InputController] Started');
    this.bindInputActions();
  }

  /** Wire up UserInputService listeners */
  private bindInputActions(): void {
    UserInputService.InputBegan.Connect((input: InputObject, gameProcessed: boolean) => {
      if (gameProcessed) return;
      this.handleInput(input.KeyCode);
    });
  }

  /** Route a keycode to the correct action handler */
  private handleInput(keyCode: Enum.KeyCode): void {
    const action = this.keyBindings.get(keyCode);
    if (action === undefined) return;

    // TODO: Dispatch to the correct controller based on action
    switch (action) {
      case InputAction.Attack:
      case InputAction.Block:
      case InputAction.Dodge:
        // TODO: Forward to combatController
        break;
      case InputAction.Ability1:
      case InputAction.Ability2:
      case InputAction.Ability3:
      case InputAction.Ability4:
        // TODO: Forward to combatController.useAbility(action)
        break;
      case InputAction.ToggleInventory:
      case InputAction.ToggleMenu:
        // TODO: Forward to UI state
        break;
      case InputAction.Interact:
        // TODO: Forward to interaction system
        break;
    }
  }
}
