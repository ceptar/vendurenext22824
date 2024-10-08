import React from 'react';

// Append the API path to the baseURL
const API_URL = `https://discobabes.store/shop-api`;

export { API_URL };

let languageCode: string | undefined;
let channelToken: string | undefined;

export function setLanguageCode(value: string | undefined) {
  languageCode = value;
}

export function setChannelToken(value: string | undefined) {
  channelToken = value;
}

export function query(document: string, variables: Record<string, any> = {}) {
  const headers = new Headers({
    'content-type': 'application/json',
  });

  // Optionally, add the channelToken to the headers if available
  if (channelToken) {
    headers.append('vendure-token', channelToken);
  }

  let endpoint = API_URL;
  if (languageCode) {
    endpoint += `?languageCode=${languageCode}`;
  }

  return fetch(endpoint, {
    method: 'POST',
    headers,
    credentials: 'include', // Ensure that cookies are included in the request
    body: JSON.stringify({
      query: document,
      variables,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`An error occurred, HTTP status: ${res.status}`);
    }
    return res.json();
  });
}

/**
 * React hook for running GraphQL queries
 * @param document - The GraphQL query string
 * @param variables - Variables for the GraphQL query
 * @param deps - Dependency array to control when the effect should re-run
 * @returns Object containing data, loading, and error states
 */
export function useQuery<TData = any>(
  document: string,
  variables: Record<string, any> = {},
  deps: React.DependencyList = []
) {
  const [data, setData] = React.useState<TData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    query(document, variables)
      .then((result) => {
        setData(result.data as TData); // Cast result.data to TData
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  return { data, loading, error };
}





// import * as React from 'react';

// // If using bearer-token based session management, we'll store the token
// // in localStorage using this key.
// const AUTH_TOKEN_KEY = 'auth_token';

// const API_URL = 'https://discobabes.store/shop-api';

// let languageCode: string | undefined;
// let channelToken: string | undefined;

// export function setLanguageCode(value: string | undefined) {
//   languageCode = value;
// }

// export function setChannelToken(value: string | undefined) {
//   channelToken = value;
// }

// export function query(document: string, variables: Record<string, any> = {}) {
//   const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
//   const headers = new Headers({
//     'content-type': 'application/json',
//   });
//   if (authToken) {
//     headers.append('authorization', `Bearer ${authToken}`);
//   }
//   if (channelToken) {
//     headers.append('vendure-token', channelToken);
//   }
//   let endpoint = API_URL;
//   if (languageCode) {
//     endpoint += `?languageCode=${languageCode}`;
//   }
//   return fetch(endpoint, {
//     method: 'POST',
//     headers,
//     credentials: 'include',
//     body: JSON.stringify({
//       query: document,
//       variables,
//     }),
//   }).then((res) => {
//     if (!res.ok) {
//       throw new Error(`An error ocurred, HTTP status: ${res.status}`);
//     }
//     const newAuthToken = res.headers.get('vendure-auth-token');
//     if (newAuthToken) {
//       localStorage.setItem(AUTH_TOKEN_KEY, newAuthToken);
//     }
//     return res.json();
//   });
// }

// /**
//  * Here we have wrapped the `query` function into a React hook for convenient use in
//  * React components.
//  */
// export function useQuery(
//   document: string,
//   variables: Record<string, any> = {},
//   deps: any[] = []
// ) {
//   const [data, setData] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     query(document, variables)
//       .then((result) => {
//         setData(result.data);
//         setError(null);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setData(null);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, deps);

//   return { data, loading, error };
// }
