import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import realmBanner from '../assets/realm-arrival-banner.png'
import { useNavigate } from 'react-router-dom'
import '../CharacterSheet.css'

function CharacterSheet() {
  const [profile, setProfile] = useState(null)
  const [journalEntries, setJournalEntries] = useState([])
  const [relics, setRelics] = useState([])
  const [portfolioStats, setPortfolioStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        navigate('/login')
        return
    }

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

    const { data: journalData } = await supabase
      .from('user_journal')
      .select('*')
      .eq('user_id', user.id)
      .order('discovered_at', {
        ascending: false
      })

    setJournalEntries(journalData || [])

    const { data: relicData, error: relicError } =
        await supabase
            .from('user_relics')
            .select(`
                discovered_at,
                relics (
                    id,
                    legend,
                    card_name,
                    series,
                    serial_number,
                    rarity,
                    card_value,
                    image_key,
                    lore
                )
            `)
            .eq('user_id', user.id)

    if (relicError) {

        console.error(relicError)

    } else {

        const relicList =
            relicData.map(r => ({
                ...r.relics,
                discovered_at: r.discovered_at
            }))

        setRelics(relicList)

    }

  }

  async function handleAvatarUpload() {
    const input = document.createElement('input')

    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async (event) => {
        const file = event.target.files[0]

        if (!file) return

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) return

        const fileName = `${user.id}-${Date.now()}-${file.name}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file)

        if (uploadError) {
            console.error(uploadError)
            alert('Avatar upload failed.')
            return
        }

        const {
            data: { publicUrl }
        } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                avatar_url: publicUrl
            })
            .eq('id', user.id)

        if (profileError) {
            console.error(profileError)
            return
        }

        await loadProfile()
    }

    input.click()
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

        <img
          src={realmBanner}
          alt="The Realm Has Been Waiting"
          className="realm-banner"
        />        

        <div className="character-grid">

          <div className="character-card identity-card full-width">
            <h2>PROFILE</h2>

            <div className="identity-content">

                <div className="identity-image">
                    <img
                        src={
                            profile.avatar_url ||
                            'https://placehold.co/200x200?text=Portrait'
                        }
                        alt="Character Portrait"
                        className="identity-avatar"
                    />
                </div>

                <div className="identity-details">

                    <div className="identity-left">

                        <h3>{profile.username}</h3>

                        <p className="identity-title">
                        {profile.title}
                        </p>

                        <p className="identity-subtitle">
                        {destinySubtitle}
                        </p>

                        <button
                            className="upload-avatar-button"
                            onClick={handleAvatarUpload}
                        >
                            Upload Portrait
                        </button>

                    </div>

                    <div className="identity-right">

                        <p>
                            <span className="identity-label">
                                Current Destiny:
                            </span>
                            <br />
                            {profile.current_destiny}
                        </p>

                        <p>
                            <span className="identity-label">
                                Original Destiny:
                            </span>
                            <br />
                            {profile.original_destiny}
                        </p>

                        <p>
                            <span className="identity-label">
                                Alignment:
                            </span>
                            <br />
                            {profile.alignment || 'Neutral'}
                        </p>

                    </div>

                </div>

            </div>
          </div>

          <div className="character-card">
            <h2>TREASURY</h2>

            <p>{profile.ghost_coins.toLocaleString()} Ghost Coins</p>
          </div>

          <div className="character-card">
            <h2>RENOWN</h2>

            <p>{profile.renown.toLocaleString()}</p>
          </div>

          <div className="character-card">
            <h2>RELICS COLLECTED</h2>

            <p>{profile.relics.toLocaleString()}</p>
          </div>

          <div className="character-card">
            <h2>ACHIEVEMENTS UNLOCKED</h2>

            <div className="coming-soon">
              COMING REAL SOON
            </div>
          </div>

          <div className="character-card full-width">

            <h2>RELIC PORTFOLIO</h2>

            <div className="portfolio-grid">

                <div className="portfolio-stat">

                    <span>Total Relics</span>

                    <strong>
                        {relics.length}
                    </strong>

                </div>

                <div className="portfolio-stat">

                    <span>Total Relic Value</span>

                    <strong>

                        {relics
                            .reduce(
                                (sum, relic) =>
                                    sum +
                                    (relic.card_value || 0),
                                0
                            )
                            .toLocaleString()
                        }

                    </strong>

                </div>

                <div className="portfolio-stat">

                    <span>Most Valuable Relic</span>

                    <strong>

                        {
                            relics.length > 0
                                ? Math.max(
                                    ...relics.map(
                                        relic =>
                                            relic.card_value
                                    )
                                ).toLocaleString()
                                : 0
                        }

                    </strong>

                </div>

                <div className="portfolio-stat">

                    <span>
                        Last Relic Discovered
                    </span>

                    <strong>

                        {
                            relics.length > 0

                                ? new Date(

                                    relics
                                        .sort(
                                            (a, b) =>
                                                new Date(
                                                    b.discovered_at
                                                ) -
                                                new Date(
                                                    a.discovered_at
                                                )
                                        )[0]
                                        .discovered_at

                                ).toLocaleDateString()

                                : 'None'
                        }

                    </strong>

                </div>

            </div>

          </div>

          <div className="character-card full-width">

            <h2>MY RELICS</h2>

            <div className="relic-grid">

                {relics.length === 0 ? (

                    <div className="coming-soon">

                        No relics discovered.

                    </div>

                ) : (

                    relics.map(relic => (

                        <div
                            key={relic.id}
                            className="relic-tile"
                        >

                            <div
                                className="relic-image-placeholder"
                            >

                                {relic.legend}

                            </div>

                            <div className="relic-info">

                                <strong>

                                    {relic.legend}

                                </strong>

                                <p>

                                    Relic ID:
                                    {relic.id}

                                </p>

                                <p>

                                    Series:
                                    {relic.series}

                                </p>

                                <p>

                                    Serial:
                                    {relic.serial_number}

                                </p>

                                <p>

                                    Relic Value:
                                    {relic.card_value.toLocaleString()}

                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

          </div>


          <div className="character-card journal-card full-width">

            <h2>EXPLORER'S JOURNAL</h2>

            {journalEntries.length === 0 ? (

                <div className="coming-soon">
                    No discoveries yet.
                </div>

            ) : (

                journalEntries.map(entry => (

                    <div
                        key={entry.id}
                        className={`journal-entry ${entry.entry_type}`}
                    >

                        <div className="journal-header">

                            <span className="journal-type">

                                {entry.entry_type?.toUpperCase()}

                            </span>

                            <span className="journal-date">

                                {new Date(
                                    entry.discovered_at
                                ).toLocaleDateString()}

                            </span>

                        </div>

                        <div className="journal-title">

                            {entry.title}

                        </div>

                        <div className="journal-text">

                            {entry.entry_text}

                        </div>

                    </div>

                ))

            )}

          </div>

        </div>

      </div>
    </div>
  )
}

export default CharacterSheet