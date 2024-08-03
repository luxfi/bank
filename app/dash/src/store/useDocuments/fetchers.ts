import Cookies from 'js-cookie';

import { dataFetch } from '@/api/fetchers';
import { getFetchBaseClient } from '@/api/fetchers/client';

import { IDocument } from '../useClient/types';
import { IDeleteDocumentPayload, ILinkDocumentToClient, PATHS } from './types';

export async function uploadClientDocumentAPI(
  binaryFile: FormData
): Promise<IDocument> {
  const baseConfig = await getFetchBaseClient();
  const url = baseConfig.baseURL + PATHS.UPLOAD_CLIENT_DOCUMENTS;
  const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '');

  try {
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: binaryFile,
    });

    const res = await resp.json();

    if (res.message) {
      throw new Error('Error uploading file');
    }
    return res.data.document;
  } catch (err) {
    throw new Error('Error uploading file');
  }
}
export async function deleteClientDocumentAPI(payload: IDeleteDocumentPayload) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.DELETE_DOCUMENT(payload.clientId),
      method: 'DELETE',
      bodyParams: { documentUuid: payload.documentUuid },
    });

    if (res.message) {
      throw new Error('Error deleting file');
    }
    return res;
  } catch (err) {
    throw new Error('Error deleting file');
  }
}

export async function downloadClientDocumentAPI(id: string) {
  const baseConfig = await getFetchBaseClient();
  const url = baseConfig.baseURL + PATHS.DOWNLOAD_DOCUMENT(id);
  try {
    const res = await fetch(url, {
      ...baseConfig.options,
      method: 'GET',
    });

    return res.blob();
  } catch (err) {
    throw new Error('Error downloading file');
  }
}
export async function linkDocumentToClientAPI(payload: ILinkDocumentToClient) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.LINK_DOCUMENT_TO_CLIENT(payload.clientId),
      method: 'POST',
      bodyParams: { documentUuid: payload.documentUuid, type: payload.type },
    });

    if (res.message) {
      throw new Error('Error linking file to client');
    }
    return res;
  } catch (err) {
    throw new Error('Error linking file to client');
  }
}
