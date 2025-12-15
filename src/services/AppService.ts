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
  async statusList(): Promise<string[]> {
    const result = await fetch("http://localhost:8080/status", {
      mode: "cors",
      referrerPolicy: "no-referrer",
    });
    console.log("result", result);
    console.log("status", result.status);
    const response = await result.json() as StatusResponseDTO;
    return response.status?.map((s) => s.id) ?? [];
  }

  async createGame(name: string): Promise<string> {
    const result = await fetch("http://localhost:8080/status", {
      method: "POST",
      mode: "cors",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        data: {
          name: name,
        },
      }),
    });
    console.log("result", result);
    console.log("status", result.status);
    const response = await result.json() as NewStatusResponseDTO;
    return response.id;
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
}
