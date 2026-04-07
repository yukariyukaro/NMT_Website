import { useContext } from "react";
import {
  MusicPlayerContext,
  type MusicPlayerContextValue,
} from "./MusicPlayerProvider";

export function useMusicPlayer(): MusicPlayerContextValue {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used inside <MusicPlayerProvider>");
  }
  return ctx;
}
