// Used for the exit modal (exit modal is used for example when backing out of lessons)

import { create } from "zustand";

// Declaring types
type ExitModalState = {
    isOpen: boolean;
    open: () => void; // Open takes no parameters and returns no value
    close: () => void; // Close "
};

// Zustand store to manange modal state
export const useExitModal = create<ExitModalState>((set) => ({
    isOpen: false,
    open : () => set({ isOpen: true}),
    close: () => set({ isOpen: false}),
}));