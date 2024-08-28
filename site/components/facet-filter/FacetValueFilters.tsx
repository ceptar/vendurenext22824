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
    <div style={{ marginTop: '24px', padding: '8px' }}>
      {results.length > 0 ? (
        Object.keys(groupedFacets).map((group) => (
          <div key={group} style={{ paddingBottom: '24px'}}>
            <h3 style={{ marginBottom: '16px', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.2em', fontWeight: 'bolder' }}>{group}</h3>{' '}
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
                ? '1px solid var(--text-primary)'
          : '1px solid var(--text-primary)',
                    borderRadius: '50px',
                    padding: '2px 6px',
                    backgroundColor: checkedFacets.includes(f.facetValue.id)
                      ? 'var(--discored)'
                      : 'var(--primary)',
                    color: checkedFacets.includes(f.facetValue.id)
                      ? 'var(--secondary)'
                      : 'var(--text-primary)',
                    fontWeight: checkedFacets.includes(f.facetValue.id)
                      ? '300'
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
