import * as React from 'react'

interface FacetValueResult {
  facetValue: {
    id: string
    name: string
    facet: {
      id: string
      name: string
    }
  }
  count: number
}

export function FacetValueFilters(props: {
  results?: FacetValueResult[]
  filterIds: string[]
  updateFilterIds: (ids: string[]) => void
}) {
  const { results = [], filterIds, updateFilterIds } = props
  const [checkedFacets, setCheckedFacets] = React.useState<string[]>([])

  const onTagClick = (id: string) => {
    const newCheckedFacets = checkedFacets.includes(id)
      ? checkedFacets.filter((fid) => fid !== id)
      : [...checkedFacets, id]
    setCheckedFacets(newCheckedFacets)
    updateFilterIds(newCheckedFacets)
  }

  // Group the results by facet name
  const groupedFacets = results.reduce((groups, item) => {
    const facetName = item.facetValue.facet.name
    if (!groups[facetName]) {
      groups[facetName] = []
    }
    groups[facetName].push(item)
    return groups
  }, {} as { [key: string]: FacetValueResult[] })

  return (
    <div style={{ marginTop: '8px' }}>
      {results.length > 0 ? (
        Object.keys(groupedFacets).map((group) => (
          <div key={group} style={{ marginBottom: '8px' }}>
            <h4 style={{ marginBottom: '4px' }}>{group}</h4>{' '}
            {/* Group heading */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              {groupedFacets[group].map((f) => (
                <div
                  key={f.facetValue.id}
                  onClick={() => onTagClick(f.facetValue.id)}
                  style={{
                    cursor: 'pointer',
                    border: checkedFacets.includes(f.facetValue.id)
                      ? '2px solid #007BFF'
                      : '2px solid #ccc',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    backgroundColor: checkedFacets.includes(f.facetValue.id)
                      ? '#E0F7FF'
                      : '#f5f5f5',
                    color: checkedFacets.includes(f.facetValue.id)
                      ? '#007BFF'
                      : '#333',
                    fontWeight: checkedFacets.includes(f.facetValue.id)
                      ? '600'
                      : '300',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {f.facetValue.name} ({f.count})
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No facets available</p>
      )}
    </div>
  )
}
