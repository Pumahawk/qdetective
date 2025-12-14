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
}
