import { createWithEqualityFn } from "zustand/traditional";
import { persist } from 'zustand/middleware';
import { create } from "zustand";

interface IUserInfoStoreState {
  count: number,
  list: any[],
};

interface IUserInfoStoreAction {
  increment: () => void;
  clear: () => void;
  addList: (item: any) => void;
  removeList: () => void;
}

export const userInfoStore = createWithEqualityFn<IUserInfoStoreState & IUserInfoStoreAction>((set, get) => ({
  count: 0,
  list: [],
  increment: () => {
    const { count } = get();
    console.log('count in increment', count);
    set({ count: count + 1 });
  },
  clear: () => set({ count: 0 }),
  addList: (item: any) => set((state) => ({ list: [...state.list, item] })),
  removeList: () => set(({ list: [] })),
}));