interface StatusResponseDTO {
  status: ({
    id: string;
  })[] | null;
}

interface NewStatusResponseDTO {
  id: string;
  data: {
    name: string;
  };
}

export class AppService {
  async createGame(address: string, status: {
    playerAsset: string;
    playerName: string;
    gameName: string | null;
  }): Promise<string> {
    const result = await fetch(address + "/status", {
      method: "POST",
      body: JSON.stringify({
        data: {
          name: status.gameName,
          players: [{ name: status.playerName, asset: status.playerAsset }],
        },
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
}
