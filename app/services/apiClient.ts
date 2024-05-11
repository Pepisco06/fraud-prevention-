export type FetchResponseType<T> = {
  count: number;
  next: string | null;
  prev: string | null;
  results: T[];
};

let baseURL =
  process.env.NODE_ENV === "production"
    ? "https://cc-fraud-detection.vercel.app/api"
    : "http://localhost:3000/api";

class APIClient<TData, TVariables = Partial<any>> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = baseURL + endpoint;
  }

  fetchMany = async (path?: string, config?: RequestInit) => {
    const response = await fetch(this.endpoint + (path || ""), config);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json() as Promise<TData[] | FetchResponseType<TData>>;
  };

  fetchOne = async (id: string) => {
    const response = await fetch(this.endpoint + "/" + id);
    if (!response.ok) {
      const resJson = await response.json();
      if (resJson.error) {
        return resJson;
      }

      throw new Error("Failed to post data");
    }
    return response.json() as Promise<TData>;
  };

  fetch = async () => {
    const response = await fetch(this.endpoint);
    if (!response.ok) {
      const resJson = await response.json();
      if (resJson.error) {
        return resJson;
      }

      throw new Error("Failed to post data");
    }
    return response.json() as Promise<TData>;
  };

  post = async (data: TVariables, id?: string, config?: RequestInit) => {
    const resourceId = id ? "/" + id : "";
    const response = await fetch(this.endpoint + resourceId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      ...config,
    });

    if (!response.ok) {
      const resJson = await response.json();
      if (resJson.error) {
        return resJson;
      }

      throw new Error("Failed to post data");
    }
    return response.json() as Promise<TData>;
  };

  put = async (data: TVariables, id?: string, config?: RequestInit) => {
    const resourceId = id ? "/" + id : "";

    const response = await fetch(this.endpoint + resourceId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      ...config,
    });

    if (!response.ok) {
      const resJson = await response.json();
      if (resJson.error) {
        return resJson;
      }

      throw new Error("Failed to post data");
    }
    return response.json() as Promise<TData>;
  };

  patch = async (data: TVariables, id?: string, config?: RequestInit) => {
    const resourceId = id ? "/" + id : "";

    const response = await fetch(this.endpoint + resourceId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      ...config,
    });

    if (!response.ok) {
      const resJson = await response.json();
      if (resJson.error) {
        return resJson;
      }
    }

    return response.json() as Promise<TData>;
  };

  delete = async (id: string, config?: RequestInit) => {
    const response = await fetch(this.endpoint + id + "/", {
      method: "DELETE",
      ...config,
    });
    if (!response.ok) {
      throw new Error("Failed to delete data");
    }
    return response.json() as Promise<TData>;
  };
}

export default APIClient;
