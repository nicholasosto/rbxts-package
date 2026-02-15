import { Controller, OnStart } from '@flamework/core';
import { UserInputService } from '@rbxts/services';
import Maid from '@rbxts/maid';
import { InputAction } from '../types';
import { producer } from '../store';
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

  private maid = new Maid();

  constructor(private combatController: CombatController) {}

  onStart(): void {
    this.bindInputActions();
  }

  /** Wire up UserInputService listeners */
  private bindInputActions(): void {
    this.maid.GiveTask(
      UserInputService.InputBegan.Connect((input: InputObject, gameProcessed: boolean) => {
        if (gameProcessed) return;
        this.handleInput(input.KeyCode);
      }),
    );

    // Handle block release
    this.maid.GiveTask(
      UserInputService.InputEnded.Connect((input: InputObject) => {
        if (input.KeyCode === Enum.KeyCode.Q) {
          this.combatController.unblock();
        }
      }),
    );
  }

  /** Route a keycode to the correct action handler */
  private handleInput(keyCode: Enum.KeyCode): void {
    const action = this.keyBindings.get(keyCode);
    if (action === undefined) return;

    switch (action) {
      case InputAction.Attack:
        this.combatController.attack();
        break;
      case InputAction.Block:
        this.combatController.block();
        break;
      case InputAction.Dodge:
        this.combatController.dodge();
        break;
      case InputAction.Ability1:
        this.combatController.useAbility('Ability1');
        break;
      case InputAction.Ability2:
        this.combatController.useAbility('Ability2');
        break;
      case InputAction.Ability3:
        this.combatController.useAbility('Ability3');
        break;
      case InputAction.Ability4:
        this.combatController.useAbility('Ability4');
        break;
      case InputAction.ToggleInventory:
        producer.toggleInventory();
        break;
      case InputAction.ToggleMenu:
        producer.toggleMenu();
        break;
      case InputAction.Interact:
        // Interaction system — placeholder for future implementation
        break;
    }
  }
}
