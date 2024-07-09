import * as ApiHelpers from '../../utils/api-helpers';
import { UserDocumentsDto } from './model/userDocumentsValidationSchema';

export const uploadDocument = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await ApiHelpers.fetch(
    `/api/v1/documents/`,
    {
      method: 'POST', body: formData
    }
  );

  if (res.ok) {
    const { data: { document } } = await res.json();
    return document;
  } else {
    const text = await res.text();
    const body = JSON.parse(text);
    if (body?.message) {
      throw new Error(body.message);
    }

    throw new Error('Upload failed, please try again.');
  }
}

export const deleteDocument = async (uuid:string): Promise<any> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/documents/${uuid}`,
    { method: "DELETE" }
  );
  if (res.ok) {
      return res.body;
    }

  throw new Error("Delete document failed.");
}






export const updateUserDocuments = async (data: UserDocumentsDto): Promise<any> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/users/current/documents`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  if (res.ok) {
    const { data } = await res.json();
    return data;
  } else {
    const text = await res.text();
    const body = JSON.parse(text);
    if (body?.message) {
      throw new Error(body.message);
    }

    throw new Error('Upload failed, please try again.');
  }
}

export const removeUserDocuments = async (data: UserDocumentsDto): Promise<any> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/users/current/remove_documents`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  if (res.ok) {
    const { data } = await res.json();
    return data;
  } else {
    const text = await res.text();
    const body = JSON.parse(text);
    if (body?.message) {
      throw new Error(body.message);
    }

    throw new Error('Upload failed, please try again.');
  }
}

export const getUserDocuments = async (): Promise<any[]> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/users/current/documents`,
    {
      method: 'GET',
    }
  );

  if (res.ok) {
    const { data: { documents } } = await res.json();
    return documents;
  }

  return [];
}
