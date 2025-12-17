type MessageDto = MessageStatusUpdateDto;
interface MessageStatusUpdateDto {
  type: "status-update" | "status-info";
  message: {
    players: PlayerDto[];
  };
}

interface PlayerDto {
  name: string;
  asset: string;
}

interface StatusGameDto {
  name: string;
  players: PlayerDto[];
}

interface StatusResponseDTO {
  status: ({
    id: string;
  })[] | null;
}

interface NewStatusResponseDTO {
  id: string;
  data: StatusGameDto;
}

export class AppService {
  async createGame(address: string, status: {
    playerAsset: string;
    playerName: string;
    gameName: string;
  }): Promise<string> {
    const bodyRequest: StatusGameDto = {
      name: status.gameName,
      players: [{ name: status.playerName, asset: status.playerAsset }],
    };
    const result = await fetch(address + "/status", {
      method: "POST",
      body: JSON.stringify({
        data: bodyRequest,
      }),
    });

    if (result.status == 200) {
      const body = await result.json() as NewStatusResponseDTO;
      return body.id;
    } else {
      throw new Error("Unable to create game. Status: " + result.status);
    }
  }

  async getGameStatus(address: string, id: string): Promise<StatusGameDto> {
    const result = await fetch(address + "/status/" + id);
    if (result.status == 200) {
      const body = await result.json() as NewStatusResponseDTO;
      return body.data;
    } else {
      throw new Error("Unable to get status geme. Status: " + result.status);
    }
  }

  async joinGame(address: string, id: string, player: {
    playerAsset: string;
    playerName: string;
  }): Promise<string> {
    const statusDto = await this.getGameStatus(address, id);
    statusDto.players.push({
      name: player.playerName,
      asset: player.playerAsset,
    });
    const result = await fetch(address + "/status/" + id, {
      method: "POST",
      body: JSON.stringify({
        data: statusDto,
      }),
    });

    if (result.status == 200) {
      const body = await result.json() as NewStatusResponseDTO;
      return body.id;
    } else {
      throw new Error("Unable to create game. Status: " + result.status);
    }
  }

  async ping(address: string): Promise<void> {
    const result = await fetch(address + "/status");
    if (result.status) {
      await result.json();
    } else {
      console.log("Invalid server: ", result);
      throw new Error("result: ");
    }
  }

  redirectToServerPage(serverAddress: string) {
    const url = new URL(globalThis.window.location.href);
    url.searchParams.set("server", serverAddress);
    console.log("url", url.toString());
    globalThis.window.location.href = url.toString();
  }

  async getGameListFromServer(address: string): Promise<StatusResponseDTO> {
    const result = await fetch(address + "/status");
    if (result.status == 200) {
      const body = await result.json() as StatusResponseDTO;
      return body;
    } else {
      throw new Error("server status code: " + 200);
    }
  }

  async watchGameLobby(
    address: string,
    id: string,
    callBack: (players: { name: string }[]) => void,
  ): Promise<void> {
    const result = await fetch(address + "/status/" + id + "/messages");
    if (result.status == 200) {
      const reader = result.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true });
        const messages = lines.split("\n").filter((m) => !!m);
        messages.forEach((message) => {
          console.log("messsage: ", message);
          const mj = JSON.parse(message) as MessageDto;
          if (mj.type == "status-update" || mj.type == "status-info") {
            callBack(mj.message.players);
          }
        });
      }
    } else {
      throw new Error("unable stream messages");
    }
  }
}
