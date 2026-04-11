import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSavedAdventure, updateSavedAdventure } from '../services/api'

function EditSavedPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    notes: '',
    is_completed: false,
  })

  const [title, setTitle] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSavedAdventure() {
      try {
        const data = await getSavedAdventure(id)

        setFormData({
          notes: data.notes || '',
          is_completed: data.is_completed || false,
        })

        if (data.adventure) {
          setTitle(data.adventure.title || '')
          setCity(data.adventure.city || '')
        }
      } catch (err) {
        console.log(err)
        setError('Could not load saved adventure')
      }
    }

    loadSavedAdventure()
  }, [id])

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await updateSavedAdventure(id, formData)
      navigate('/saved')
    } catch (err) {
      console.log(err)
      setError('Update failed')
    }
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <p className="eyebrow">Edit saved adventure</p>
        <h2 className="section-title">{title || 'Saved adventure'}</h2>
        {city && <p className="card-city">{city}</p>}

        <form onSubmit={handleSubmit}>
          <label className="small-label" htmlFor="notes">
            Your Notes
          </label>
          <textarea
            id="notes"
            className="notes-input"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add your notes here"
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="is_completed"
              checked={formData.is_completed}
              onChange={handleChange}
            />
            Mark as completed
          </label>

          <button className="button button-primary" type="submit">
            Save Changes
          </button>
        </form>

        {error && <p className="status-error">{error}</p>}
      </div>
    </main>
  )
}

export default EditSavedPage