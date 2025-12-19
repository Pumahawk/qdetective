export interface AllStateResponseDto {
  status: ({
    id: string;
  })[] | null;
}

export interface StatusGameDto {
  name: string;
  players: PlayerDto[];
}

interface PlayerDto {
  id: string;
  name: string;
  asset: number;
}

export interface NewStatusResponseDTO {
  id: string;
  data: StatusGameDto;
}
