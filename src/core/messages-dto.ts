import type { StateGameDto } from "./dto.ts";

export type MessageDto = StatusMessageDto | ShowItemMessage;

export interface StatusMessageDto {
  type: "status-update" | "status-info";
  message: StateGameDto;
}

export interface ShowItemMessage {
  type: "show-item";
  item?: number;
}
