import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSavedAdventures, deleteSavedAdventure } from '../services/api'

function SavedPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  async function loadSavedAdventures() {
    try {
      const data = await getSavedAdventures()

      if (Array.isArray(data)) {
        setItems(data)
        setError('')
      } else {
        setItems([])
        setError('Could not load saved adventures')
      }
    } catch (err) {
      console.log(err)
      setItems([])
      setError('Could not load saved adventures')
    }
  }

  useEffect(() => {
    loadSavedAdventures()
  }, [])

  async function handleDelete(id) {
    try {
      await deleteSavedAdventure(id)
      loadSavedAdventures()
    } catch (err) {
      console.log(err)
      alert('Delete failed')
    }
  }

  return (
    <main className="results-section">
      <div className="section-heading">
        <p className="eyebrow">Your list</p>
        <h2 className="section-title">Saved adventures</h2>
      </div>

      {error && <p className="status-error">{error}</p>}

      {!error && items.length === 0 && (
        <p className="status-message">You have no saved adventures yet.</p>
      )}

      <div className="results-grid">
        {items.map((item) => {
          const adventure = item.adventure || {}

          return (
            <article className="adventure-card" key={item.id}>
              {adventure.image_url ? (
                <img
                  className="card-image"
                  src={adventure.image_url}
                  alt={adventure.title || 'Adventure'}
                />
              ) : (
                <div className="card-top"></div>
              )}

              <div className="card-body">
                <p className="card-tag">
                  {item.is_completed ? 'Completed' : 'Planned'}
                </p>

                <h3>
                  {adventure.website_url ? (
                    <a
                      className="title-link"
                      href={adventure.website_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {adventure.title || 'No title'}
                    </a>
                  ) : (
                    adventure.title || 'No title'
                  )}
                </h3>

                <p className="card-city">{adventure.city || ''}</p>

                {/* ORIGINAL DESCRIPTION (always shows) */}
                {adventure.description && (
                  <p className="card-description">
                    {adventure.description}
                  </p>
                )}

                {/* USER NOTES (separate + clearly labeled) */}
                {item.notes && (
                  <div className="user-notes-box">
                    <p className="user-notes-label">Your Notes</p>
                    <p className="user-notes-text">{item.notes}</p>
                  </div>
                )}

                {!adventure.description && !item.notes && (
                  <p className="card-description">No details available.</p>
                )}

                <div className="card-actions">
                  {adventure.website_url && (
                    <a
                      className="button button-light"
                      href={adventure.website_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn More
                    </a>
                  )}

                  <Link
                    className="button button-light"
                    to={`/saved/${item.id}/edit`}
                  >
                    Edit
                  </Link>

                  <button
                    className="button button-primary"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default SavedPage