import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import '../CharacterSheet.css'

function CharacterSheet() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
      console.error(error)
      return
    }

    setProfile(data)
  }

  const destinyTitles = {
    LORE: 'Keeper of Forgotten Knowledge',
    RELICS: 'Seeker of Lost Artifacts',
    WEALTH: 'Master of Fortune and Prosperity',
    LEGACY: 'Builder of Enduring Greatness',
    FORTUNE: "Walker of Fate's Uncertain Road"
  }

  const destinySubtitle =
    destinyTitles[profile?.current_destiny] ||
    'Wanderer of The Realm'

  if (!profile) {
    return (
      <div className="character-page">
        Loading Character Profile...
      </div>
    )
  }

  return (
    <div className="character-page">
      <div className="character-container">

        <h1 className="character-title">
            THE REALM HAS BEEN WAITING
        </h1>

        <div className="realm-arrival-banner">
            <h2>WANDERER: {profile.username}</h2>

            <div className="destiny-reveal">
                <div className="destiny-title">
                DESTINY REVEALED
                </div>

                <div className="destiny-name">
                    {profile.current_destiny}
                </div>

                <div className="destiny-subtitle">
                    {destinySubtitle}
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
              <strong>Name:</strong> {profile.username}
            </p>

            <p>
              <strong>Title:</strong> {profile.title}
            </p>
          </div>

          <div className="character-card">
            <h2>DESTINY</h2>

            <p>
              <strong>Original Destiny:</strong> {profile.original_destiny}
            </p>

            <p>
              <strong>Current Destiny:</strong> {profile.current_destiny}
            </p>
          </div>

          <div className="character-card">
            <h2>TREASURY</h2>

            <p>{profile.ghost_coins}</p>
          </div>

          <div className="character-card">
            <h2>RENOWN</h2>

            <p>{profile.reputation}</p>
          </div>

          <div className="character-card">
            <h2>RELIC COLLECTION</h2>

            <p>{profile.relics}</p>
          </div>

          <div className="character-card">
            <h2>MORAL ALIGNMENT</h2>

            <p>{profile.alignment}</p>
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