import '../CharacterSheet.css'

function CharacterSheet() {
  return (
    <div className="character-page">
      <div className="character-container">

        <h1 className="character-title">
            THE REALM HAS BEEN WAITING
        </h1>

        <div className="realm-arrival-banner">
            <h2>WANDERER: WANDERER</h2>

            <div className="destiny-reveal">
                <div className="destiny-title">
                DESTINY REVEALED
                </div>

                <div className="destiny-name">
                LORE
                </div>

                <div className="destiny-subtitle">
                    Keep of Forgotten Knowledge
                </div>

                <p>
                The archives remain sealed.
                </p>

                <p>
                The ancient records remain hidden.
                </p>

                <p>
                The Forgotten King's story remains unfinished.
                </p>

                <p className="arrival-line">
                At last...
                </p>

                <p className="arrival-line">
                    another seeker has arrived.
                </p>

                <div className="realm-teaser">
                    <p className="realm-divider">
                        ════════════════════════════
                    </p>

                    <p className="teaser-title">
                        THE ARCHIVES REMAIN SEALED
                    </p>

                    <p>
                        Your journey has only begun.
                    </p>

                    <p className="realm-divider">
                        ════════════════════════════
                    </p>
                </div>

            </div>
        </div>

        <div className="character-grid">

          <div className="character-card">
            <h2>IDENTITY</h2>

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
            <h2>TREASURY</h2>

            <p>1000</p>
          </div>

          <div className="character-card">
            <h2>RENOWN</h2>

            <p>0</p>
          </div>

          <div className="character-card">
            <h2>RELIC COLLECTION</h2>

            <p>0</p>
          </div>

          <div className="character-card">
            <h2>MORAL ALIGNMENT</h2>

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