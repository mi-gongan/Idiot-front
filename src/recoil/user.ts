import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const accountAtom = atom({
  key: "accountAtom",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const accountSelector = selector({
  key: "accountSelector",
  get: ({ get }) => {
    const accountCurrent = get(accountAtom);
    return accountCurrent;
  },
});
