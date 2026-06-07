import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import '../ChooseDestiny.css'

function ChooseDestiny() {
  const [selectedDestiny, setSelectedDestiny] = useState(null)
  const navigate = useNavigate()

  async function handleBeginJourney() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    alert(`User ID: ${user.id}`)

    if (!user) {
      alert('No authenticated user found.')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        original_destiny: selectedDestiny,
        current_destiny: selectedDestiny
      })
      .eq('id', user.id)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

    navigate('/character')
  }

  const destinies = [
    {
      name: 'WEALTH',
      description: 'Build your fortune and pursue prosperity.'
    },
    {
      name: 'RELICS',
      description: 'Collect rare artifacts and hidden treasures.'
    },
    {
      name: 'LORE',
      description: 'Uncover forgotten knowledge and ancient secrets.'
    },
    {
      name: 'LEGACY',
      description: 'Earn influence, reputation, and recognition.'
    },
    {
      name: 'FORTUNE',
      description: 'Challenge fate through risk and reward.'
    }
  ]

  return (
    <div className="choose-destiny-page">

      <h1>THE GATE RECOGNIZES YOU</h1>

      <p className="destiny-message">
        Before entering The Realm, you must choose the path where your story begins.
      </p>

      <div className="destiny-grid">
        {destinies.map((destiny) => (
          <div
            key={destiny.name}
            className={`destiny-card ${
              selectedDestiny === destiny.name ? 'selected' : ''
            }`}
            onClick={() => setSelectedDestiny(destiny.name)}
          >
            <h2>{destiny.name}</h2>
            <p>{destiny.description}</p>
          </div>
        ))}
      </div>

      {selectedDestiny && (
        <div className="selected-destiny">
          <h2>YOUR DESTINY HAS BEEN CHOSEN: {selectedDestiny}</h2>

          <button
            className="continue-button"
            onClick={handleBeginJourney}
          >
            BEGIN YOUR JOURNEY
          </button>
        </div>
      )}

    </div>
  )
}

export default ChooseDestiny