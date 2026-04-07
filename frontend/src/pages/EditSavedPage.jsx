import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSavedAdventure, updateSavedAdventure } from '../services/api'

function EditSavedPage() {
  const [item, setItem] = useState(null)
  const [notes, setNotes] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadItem() {
      const data = await getSavedAdventure(id)
      setItem(data)
      setNotes(data.notes)
      setIsCompleted(data.is_completed)
    }

    loadItem()
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()

    const updatedData = {
      adventure: item.adventure,
      notes: notes,
      is_completed: isCompleted,
    }

    await updateSavedAdventure(id, updatedData)
    navigate('/saved')
  }

  if (!item) {
    return <p className="status-message">Loading...</p>
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <p className="eyebrow">Update your plan</p>
        <h2 className="section-title">Edit saved adventure</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="notes-input"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add notes"
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(event) => setIsCompleted(event.target.checked)}
            />
            Mark as completed
          </label>

          <button className="button button-primary" type="submit">Update</button>
        </form>
      </div>
    </main>
  )
}

export default EditSavedPage