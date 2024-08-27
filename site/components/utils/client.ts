import React from 'react';

// Function to validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Get baseURL based on environment
const getBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use window.location.origin
    return window.location.origin;
  } else {
    // Server-side or fallback
    // Since `window` is not available on the server-side,
    // return a default value or throw an error
    // For server-side, you may need to handle it differently based on your setup
    return 'http://localhost:8000'; // Provide a sensible default or throw an error
  }
};

// Use a fallback URL if environment variable is not set
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || getBaseURL();

// Ensure baseURL is valid
if (!baseURL || !isValidUrl(baseURL)) {
  throw new Error(`Invalid baseURL: ${baseURL}`);
}

// Append the API path to the baseURL
const API_URL = `${baseURL}/vendure-shop-api`;

export { baseURL, API_URL };

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