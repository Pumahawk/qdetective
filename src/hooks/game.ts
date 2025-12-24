import { useEffect, useRef, useState } from "react";
import type { StateGameDto } from "../core/dto.ts";
import { watchGame } from "../services/AppService.ts";
import type { MessageDto } from "../core/messages-dto.ts";

export function useGameState(
  gameId: string,
  handler?: (game: StateGameDto, message: MessageDto) => void,
): StateGameDto | undefined {
  const [state, setState] = useState<StateGameDto>();
  const stateRef = useRef(state);
  if (state) {
    stateRef.current = state;
  }
  useEffect(() => {
    const res = watchGame(gameId, (message) => {
      if (message.type === "status-update" || message.type === "status-info") {
        setState(message.message);
      } else {
        handler && stateRef.current && handler(stateRef.current, message);
      }
    });
    return () => res.controller.abort();
  }, []);
  return state;
}
