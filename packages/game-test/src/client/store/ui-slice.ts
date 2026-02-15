import { createProducer } from '@rbxts/reflex';

export interface UIState {
  isMenuOpen: boolean;
  isInventoryOpen: boolean;
}

const initialState: UIState = {
  isMenuOpen: false,
  isInventoryOpen: false,
};

export const uiSlice = createProducer(initialState, {
  toggleMenu: (state): UIState => ({
    isMenuOpen: !state.isMenuOpen,
    isInventoryOpen: false, // close inventory when opening menu
  }),
  toggleInventory: (state): UIState => ({
    isMenuOpen: false, // close menu when opening inventory
    isInventoryOpen: !state.isInventoryOpen,
  }),
  closeAll: (): UIState => ({
    isMenuOpen: false,
    isInventoryOpen: false,
  }),
});
