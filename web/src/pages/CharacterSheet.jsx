import '../CharacterSheet.css'

function CharacterSheet() {
  return (
    <div className="character-page">
      <div className="character-container">

        <h1 className="character-title">
          CHARACTER SHEET
        </h1>

        <div className="character-grid">

          <div className="character-card">
            <h2>CHARACTER</h2>

            <p>
              <strong>Name:</strong> Wanderer
            </p>

            <p>
              <strong>Title:</strong> Wanderer
            </p>
          </div>

          <div className="character-card">
            <h2>DESTINY</h2>

            <p>
              <strong>Original Destiny:</strong> LORE
            </p>

            <p>
              <strong>Current Destiny:</strong> LORE
            </p>
          </div>

          <div className="character-card">
            <h2>GHOST COINS</h2>

            <p>1000</p>
          </div>

          <div className="character-card">
            <h2>REPUTATION</h2>

            <p>0</p>
          </div>

          <div className="character-card">
            <h2>RELICS</h2>

            <p>0</p>
          </div>

          <div className="character-card">
            <h2>ALIGNMENT</h2>

            <p>Neutral</p>
          </div>

          <div className="character-card full-width">
            <h2>ACHIEVEMENTS</h2>

            <div className="coming-soon">
              COMING SOON
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CharacterSheet