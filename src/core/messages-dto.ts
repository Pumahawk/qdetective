import type { StateGameDto } from "./dto.ts";

export type MessageDto = StatusMessageDto | ShowItemMessage;

export interface MessageBaseDto<T, B> {
  type: T;
  message: B;
}

export interface StatusMessageDto
  extends MessageBaseDto<"status-update" | "status-info", StateGameDto> {
}

export interface ShowItemMessage extends
  MessageBaseDto<"show-item", {
    item?: number;
  }> {
  type: "show-item";
}
