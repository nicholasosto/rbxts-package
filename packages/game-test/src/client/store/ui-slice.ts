import { createProducer } from '@rbxts/reflex';

export interface UIState {
  isMenuOpen: boolean;
  isInventoryOpen: boolean;
  isCatalogOpen: boolean;
}

const initialState: UIState = {
  isMenuOpen: false,
  isInventoryOpen: false,
  isCatalogOpen: false,
};

export const uiSlice = createProducer(initialState, {
  toggleMenu: (state): UIState => ({
    isMenuOpen: !state.isMenuOpen,
    isInventoryOpen: false,
    isCatalogOpen: false,
  }),
  toggleInventory: (state): UIState => ({
    isMenuOpen: false,
    isInventoryOpen: !state.isInventoryOpen,
    isCatalogOpen: false,
  }),
  toggleCatalog: (state): UIState => ({
    isMenuOpen: false,
    isInventoryOpen: false,
    isCatalogOpen: !state.isCatalogOpen,
  }),
  closeAll: (): UIState => ({
    isMenuOpen: false,
    isInventoryOpen: false,
    isCatalogOpen: false,
  }),
});
