import { useEffect, useState } from 'react'
import { searchAdventures, saveAdventure } from '../services/api'

function HomePage() {
  const [city, setCity] = useState('')
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [viewMode, setViewMode] = useState('Grid')

  function applyFilter(data, filterName) {
    if (filterName === 'All') {
      return data
    }

    if (filterName === 'Parks') {
      return data.filter((item) => item.category === 'Park')
    }

    if (filterName === 'Trails') {
      return data.filter((item) => item.category === 'Trail')
    }

    if (filterName === 'Events') {
      return data.filter(
        (item) => item.category === 'Event' || item.category === 'Concert'
      )
    }

    return data
  }

  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity')
    const savedResults = localStorage.getItem('lastResults')
    const savedFilter = localStorage.getItem('lastFilter')
    const savedViewMode = localStorage.getItem('lastViewMode')

    if (savedCity) {
      setCity(savedCity)
    }

    if (savedViewMode) {
      setViewMode(savedViewMode)
    }

    if (savedResults) {
      const parsedResults = JSON.parse(savedResults)
      const filterToUse = savedFilter || 'All'

      setResults(parsedResults)
      setActiveFilter(filterToUse)
      setFilteredResults(applyFilter(parsedResults, filterToUse))
      setMessage(`Found ${parsedResults.length} adventures`)
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('Searching...')

    try {
      const data = await searchAdventures(city)

      if (Array.isArray(data)) {
        const newFiltered = applyFilter(data, activeFilter)

        setResults(data)
        setFilteredResults(newFiltered)
        setMessage(`Found ${data.length} adventures`)

        localStorage.setItem('lastCity', city)
        localStorage.setItem('lastResults', JSON.stringify(data))
        localStorage.setItem('lastFilter', activeFilter)
        localStorage.setItem('lastViewMode', viewMode)
      } else {
        setResults([])
        setFilteredResults([])
        setMessage('')
        setError('Search failed')
      }
    } catch (error) {
      console.log(error)
      setResults([])
      setFilteredResults([])
      setMessage('')
      setError('Search failed')
    }
  }

  function handleFilterChange(filterName) {
    const newFiltered = applyFilter(results, filterName)

    setActiveFilter(filterName)
    setFilteredResults(newFiltered)

    localStorage.setItem('lastFilter', filterName)
  }

  function handleViewModeChange(mode) {
    setViewMode(mode)
    localStorage.setItem('lastViewMode', mode)
  }

  async function handleSave(item) {
    try {
      const savedData = {
        adventure: item,
        notes: '',
        is_completed: false,
      }

      await saveAdventure(savedData)
      alert('Adventure saved')
    } catch (error) {
      console.log(error)
      alert('Save failed')
    }
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-left">
          <p className="eyebrow">Explore your city</p>
          <h2 className="hero-heading">
            Discover local adventures, parks, trails, concerts, and events.
          </h2>
          <p className="hero-text">
            Search by city, browse real places, and save the ones you want to
            try next.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-input"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter a city"
            />
            <button className="button button-primary" type="submit">
              Search
            </button>
          </form>

          {message && <p className="status-message">{message}</p>}
          {error && <p className="status-error">{error}</p>}
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <p className="small-label">Why use Adventure Tracker?</p>
            <ul className="feature-list">
              <li>Search real places by city</li>
              <li>Browse trails, parks, concerts, and events</li>
              <li>Save adventures you want to try</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="results-section">
        <div className="section-heading">
          <p className="eyebrow">Results</p>
          <h2 className="section-title">Places to explore</h2>
        </div>

        <div className="toolbar-row">
          <div className="filter-buttons">
            <button
              className={
                activeFilter === 'All'
                  ? 'button button-primary'
                  : 'button button-light'
              }
              onClick={() => handleFilterChange('All')}
            >
              All
            </button>
            <button
              className={
                activeFilter === 'Parks'
                  ? 'button button-primary'
                  : 'button button-light'
              }
              onClick={() => handleFilterChange('Parks')}
            >
              Parks
            </button>
            <button
              className={
                activeFilter === 'Trails'
                  ? 'button button-primary'
                  : 'button button-light'
              }
              onClick={() => handleFilterChange('Trails')}
            >
              Trails
            </button>
            <button
              className={
                activeFilter === 'Events'
                  ? 'button button-primary'
                  : 'button button-light'
              }
              onClick={() => handleFilterChange('Events')}
            >
              Events
            </button>
          </div>

          <div className="view-buttons">
            <button
              className={
                viewMode === 'Grid'
                  ? 'button button-primary'
                  : 'button button-light'
              }
              onClick={() => handleViewModeChange('Grid')}
            >
              Grid
            </button>
            <button
              className={
                viewMode === 'Map'
                  ? 'button button-primary'
                  : 'button button-light'
              }
              onClick={() => handleViewModeChange('Map')}
            >
              Map
            </button>
          </div>
        </div>

        {viewMode === 'Grid' && (
          <div className="results-grid">
            {filteredResults.map((item, index) => (
              <article className="adventure-card" key={index}>
                {item.image_url ? (
                  <img className="card-image" src={item.image_url} alt={item.title} />
                ) : (
                  <div className="card-top"></div>
                )}

                <div className="card-body">
                  <p className="card-tag">
                    {item.icon ? `${item.icon} ${item.category}` : item.category || 'Adventure'}
                  </p>

                  <h3>
                    <a
                      className="title-link"
                      href={item.website_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title || 'No title'}
                    </a>
                  </h3>

                  <p className="card-city">{item.city || ''}</p>
                  <p className="card-description">{item.description || ''}</p>

                  <div className="card-actions">
                    <a
                      className="button button-light"
                      href={item.website_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn More
                    </a>

                    <button
                      className="button button-primary"
                      onClick={() => handleSave(item)}
                    >
                      Save Adventure
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {viewMode === 'Map' && (
          <div className="map-placeholder">
            <h3>Map View</h3>
            <p>
              Map view is turned on. A simple next step would be showing saved
              Google or Geoapify map links for each result.
            </p>

            <div className="results-grid">
              {filteredResults.map((item, index) => (
                <article className="adventure-card" key={index}>
                  {item.image_url ? (
                    <img className="card-image" src={item.image_url} alt={item.title} />
                  ) : (
                    <div className="card-top"></div>
                  )}

                  <div className="card-body">
                    <p className="card-tag">
                      {item.icon ? `${item.icon} ${item.category}` : item.category || 'Adventure'}
                    </p>
                    <h3>{item.title || 'No title'}</h3>
                    <p className="card-city">{item.city || ''}</p>
                    <a
                      className="button button-light"
                      href={item.website_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Info
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default HomePage