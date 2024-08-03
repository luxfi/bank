import * as ApiHelpers from "../../utils/api-helpers";
import { User } from "../auth/AuthApi";
import { AdminClientDto } from "./model/adminClientSchema";

export const getSubaccounts = async (
  gateway = "openpayd",
  page = 1,
  limit = 1000
): Promise<{ subaccounts: any[]; count: number }> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/subaccounts?page=${encodeURIComponent(
      page
    )}&limit=${encodeURIComponent(limit)}`,
    { method: "GET" },
    false
  );
  if (res.ok) {
    const response = await res.json();
    return {
      subaccounts: response?.data?.subaccounts || [],
      count: response?.data?.count || 0,
    };
  }

  return { subaccounts: [], count: 0 };
};
export const getClients = async (
  page = 1,
  limit = 20,
  searchQuery = ""
): Promise<{ clients: any[]; count: number }> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/clients?page=${encodeURIComponent(
      page
    )}&limit=${encodeURIComponent(limit)}&${searchQuery}`,
    { method: "GET" }
  );
  if (res.ok) {
    const response = await res.json();
    return {
      clients: response?.data?.clients || [],
      count: response?.data?.count || 0,
    };
  }

  return { clients: [], count: 0 };
};

export const getClient = async (
  uuid: string,
  clientId?: string
): Promise<User> => {
  const queryParams = new URLSearchParams();
  if (clientId) queryParams.append("client", clientId);
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/clients/${uuid}?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
  }

  throw new Error("Client couldn't be fetched.");
};

export const archiveClient = async (uuid: string) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/clients/${uuid}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
  }

  throw new Error("Archiving the client failed.");
};

export const createClient = async (data: AdminClientDto) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/clients`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
  }
  const error = await res.json();
  throw new Error(
    error.message ||
      "Creating the client failed, please make sure all the fields are valid and the email is not in use."
  );
};

export const updateClient = async (uuid: string, data: AdminClientDto) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/clients/${uuid}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
  }

  throw new Error("Updating failed.");
};

export const linkClient = async (uuid: string, data: any) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/clients/${uuid}/currency-cloud-data`,
    { method: "POST", body: JSON.stringify(data) }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
  }
  const error = await res.json();
  throw new Error(error.message || "Updating failed.");
};
export const linkOpenpayd = async (uuid: string, data: any) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/clients/${uuid}/openpayd`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
  }
  const error = await res.json();
  throw new Error(error.message || "Updating failed.");
};
export const updateClientMetadata = async (uuid: string, data: any) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/clients/${uuid}/metadata`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
    return response;
  }
  const error = await res.json();
  throw new Error(error.message || "Updating failed.");
};

export const addLinkedUser = async (data: any) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/users/link-user`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error("Updating failed.");
};

export const updateLinkedUserInfo = async (uuid: string, data: any) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/users/${uuid}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error("Updating failed.");
};

export const removeLinkedUser = async (uuid: string, clientId: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users/remove-link-user/${uuid}/client/${clientId}`,
    { method: "DELETE" }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error("Updating failed.");
};

export const complyLaunchSearch = async (data: any) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users/comply-launch/search`,
    { method: "POST", body: JSON.stringify(data) }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.res) {
      return response?.data?.res;
    }
  }

  throw new Error("Updating failed.");
};

export const resetPassword = async (resetPaswordData: any, uuid: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/clients/${uuid}/reset-password`,
    { method: "POST", body: JSON.stringify(resetPaswordData) }
  );
  const response = await res.json();
  if (response?.data?.client) {
    return response?.data;
  } else {
    return response;
  }
};

export const approveDocument = async (owner: string, uuid: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/clients/${owner}/document/${uuid}/approve`,
    { method: "POST" }
  );
  if (res.ok) {
    const response = await res.json();
    return response.data;
  }
  return new Error("Action failed.");
};
export const rejectDocument = async (owner: string, uuid: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/clients/${owner}/document/${uuid}/reject`,
    { method: "POST" }
  );
  if (res.ok) {
    const response = await res.json();
    return response.data;
  }
  return new Error("Action failed.");
};

export const getArchivedUsers = async () => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/clients/archived`, {
    method: "GET",
  });
  if (res.ok) {
    const response = await res.json();
    return response.data;
  }
  throw new Error("Failed to fetch.");
};

export const restoreUser = async (uuid: string) => {
  const res = await ApiHelpers.fetch(`/api/v1/admin/clients/${uuid}/restore`, {
    method: "POST",
  });
  if (res.ok) {
    const response = await res.json();
    return response.data;
  }
  console.log("failed");
  throw new Error("Failed to restore the user");
};
