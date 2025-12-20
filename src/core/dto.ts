export interface AllStateResponseDto {
  status: ({
    id: string;
  })[] | null;
}

export interface StatusGameDto {
  name: string;
  adminId: string;
  players: PlayerDto[];
}

export interface PlayerDto {
  id: string;
  name: string;
  assetId: number;
}

export interface NewStatusResponseDTO {
  id: string;
  data: StatusGameDto;
}

export interface GetStatusResponseDto {
  id: string;
  data: StatusGameDto;
}
