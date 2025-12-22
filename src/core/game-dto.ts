import type { BaseStateGameDto, PlayerDto, Targets } from "./dto.ts";

export type RoundState =
  | DiceRoundState
  | MoveRoundState
  | AskFaseCallRoundState
  | ResponseFaseCallRoundState;

export interface PlayingPlayerDto extends PlayerDto {
  deckIds: number[];
  position: [number, number];
}

export interface RunningStateGameDto extends BaseStateGameDto<"running"> {
  players: PlayingPlayerDto[];
  round: RoundState;
  targets: Targets;
}

interface RoundBase<T> {
  state: T;
  playerId: string;
}

export interface DiceRoundState extends RoundBase<"dice"> {
}

export interface MoveRoundState extends RoundBase<"move"> {
  step: number;
  selection: [number, number][];
  highlight: [number, number][];
}

interface CallRoundState<T> extends RoundBase<"call"> {
  callState: T;
}

export interface AskFaseCallRoundState extends CallRoundState<"ask-fase"> {
}

export interface ResponseFaseCallRoundState
  extends CallRoundState<"response-fase"> {
  callPlayerId: string;
  items: Targets;
}
