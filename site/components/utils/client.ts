import React from 'react'

// VENDURESHOPAPI
const API_URL = '/vendure-shop-api' || 'https://discobabes.store/shop-api'

let languageCode: string | undefined
let channelToken: string | undefined

export function setLanguageCode(value: string | undefined) {
  languageCode = value
}

export function setChannelToken(value: string | undefined) {
  channelToken = value
}

export function query(document: string, variables: Record<string, any> = {}) {
  const headers = new Headers({
    'content-type': 'application/json',
  })

  // Optionally, add the channelToken to the headers if available
  if (channelToken) {
    headers.append('vendure-token', channelToken)
  }

  let endpoint = API_URL
  if (languageCode) {
    endpoint += `?languageCode=${languageCode}`
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
      throw new Error(`An error occurred, HTTP status: ${res.status}`)
    }
    console.log('res', res)
    return res.json()
  })
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
  const [data, setData] = React.useState<TData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    query(document, variables)
      .then((result) => {
        setData(result.data as TData) // Cast result.data to TData
        setError(null)
      })
      .catch((err) => {
        setError(err)
        setData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
