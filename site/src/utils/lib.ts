interface IAddParamsToPageProps {
  params: Record<string, any>;
  path: string;
}

export function addParamsToPath(data: IAddParamsToPageProps) {
  const queryString = Object.keys(data.params)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data.params[key])}`,
    )
    .join("&");

  return `${data.path}?${queryString}`;
}
