import { useEffect, useState } from "react";
import type { StateGameDto } from "../core/dto.ts";
import { watchGame } from "../services/AppService.ts";

export function useGameState(gameId: string): StateGameDto | undefined {
  const [state, setState] = useState<StateGameDto>();
  useEffect(() => {
    const res = watchGame(gameId, (message) => {
      if (message.type === "status-update" || message.type === "status-info") {
        setState(message.message);
      }
    });
    return () => res.controller.abort();
  }, []);
  return state;
}
