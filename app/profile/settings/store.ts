import zustand, { create } from "zustand";

interface ModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const defaultValues = {
  isOpen: false,
};

const useModal = create<ModalStore>((set) => {
  return {
    ...defaultValues,
    open: () => set(() => ({ isOpen: true })),
    close: () => {
      set(() => ({ isOpen: false }));
    },
  };
});

export default useModal;
