import { useState } from 'react'
import '../ChooseDestiny.css'

function ChooseDestiny() {
  const [selectedDestiny, setSelectedDestiny] = useState(null)

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

          <button className="continue-button">
            CONTINUE
          </button>
        </div>
      )}

    </div>
  )
}

export default ChooseDestiny