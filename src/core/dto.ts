import type { RunningStateGameDto } from "./game-dto.ts";

export interface AllStateResponseDto {
  status: ({
    id: string;
  })[] | null;
}

export type Targets = [number, number, number];

export type StateGameDto =
  | OpenStateGameDto
  | FiniscedStateGameDto
  | RunningStateGameDto;

export interface BaseStateGameDto<T> {
  state: T;
  name: string;
  adminId: string;
  players: PlayerDto[];
}

export interface OpenStateGameDto extends BaseStateGameDto<"open"> {
}

export interface FiniscedStateGameDto extends BaseStateGameDto<"finished"> {
}

export interface PlayerDto {
  id: string;
  name: string;
  assetId: number;
}

export interface NewStatusResponseDTO {
  id: string;
  data: StateGameDto;
}

export interface GetStatusResponseDto {
  id: string;
  data: StateGameDto;
}

export type MessageDto = StatusMessageDto;

export interface StatusMessageDto {
  type: "status-update" | "status-info";
  message: StateGameDto;
}
