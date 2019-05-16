import "isomorphic-fetch";

export async function fetchData(url, params = {}) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&");

  const endpoint = queryString ? `${url}?${queryString}` : `${url}`;

  const resp = await fetch(endpoint);
  const data = await resp.json();
  return data;
}
