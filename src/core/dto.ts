export interface AllStateResponseDto {
  status: ({
    id: string;
  })[] | null;
}

export interface StatusGameDto {
  name: string;
  status: "open" | "running" | "finished";
  adminId: string;
  players: PlayerDto[];
  targets: number[];
}

export interface PlayerDto {
  id: string;
  name: string;
  assetId: number;
  deck: number[];
}

export interface NewStatusResponseDTO {
  id: string;
  data: StatusGameDto;
}

export interface GetStatusResponseDto {
  id: string;
  data: StatusGameDto;
}

export type MessageDto = StatusMessageDto;

export interface StatusMessageDto {
  type: "status-update" | "status-info";
  message: StatusGameDto;
}
