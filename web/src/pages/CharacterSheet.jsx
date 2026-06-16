import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import realmBanner from '../assets/realm-arrival-banner.png'
import { useNavigate } from 'react-router-dom'
import '../CharacterSheet.css'

import blaze from '../assets/relics/blaze.png'
import ghost from '../assets/relics/ghost.png'
import forgottenKing from '../assets/relics/forgotten_king.png'
import firstSentinel from '../assets/relics/first_sentinel.png'
import nyxara from '../assets/relics/nyxara.png'
import originalForger from '../assets/relics/original_forger.png'
import ashDrake from '../assets/relics/ash_drake.png'
import lastChronicler from '../assets/relics/last_chronicler.png'
import stoneRaven from '../assets/relics/stone_raven.png'
import voidQueen from '../assets/relics/void_queen.png'
import realmMap from '../assets/maps/realm-map.png'

const relicImages = {

    blaze,
    ghost,
    forgotten_king: forgottenKing,
    first_sentinel: firstSentinel,
    nyxara,
    original_forger: originalForger,
    ash_drake: ashDrake,
    last_chronicler: lastChronicler,
    stone_raven: stoneRaven,
    void_queen: voidQueen

}

function CharacterSheet() {
  const [profile, setProfile] = useState(null)
  const [journalEntries, setJournalEntries] = useState([])
  const [relics, setRelics] = useState([])
  const [portfolioStats, setPortfolioStats] = useState(null)
  const [achievementCount, setAchievementCount] = useState(0)
  const [achievements, setAchievements] = useState([])
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('character')

  useEffect(() => {
    loadProfile()
    loadAchievements()
    loadAchievementGallery()
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

  async function loadAchievements() {

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { count, error } = await supabase

        .from('user_achievements')

        .select('*', {
            count: 'exact',
            head: true
        })

        .eq('user_id', user.id)

    if (error) {

        console.error(error)

        return

    }

    setAchievementCount(count || 0)

  }

  async function loadAchievementGallery() {

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase

        .from('user_achievements')

        .select(`
            earned_at,
            achievements:user_achievements_achievement_id_fkey (
                achievement_name,
                achievement_description,
                achievement_category
            )
        `)

        .eq('user_id', user.id)

        .order(
            'earned_at',
            { ascending: false }
        )

    if (error) {

        console.error(error)

        return

    }

    console.log('Achievement Gallery Data:', data)
    
    setAchievements(data || [])

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

  const realmPages = [

    "Forgotten Kings Chamber",

    "Lost Scribes",

    "Hidden Paths",

    "Ancient Symbols",

    "Raven Keep",

    "The Fallen Crowns",

    "Lost Keys",

    "The Moon Chamber",

    "Hall of Sentinels",

    "The Forge"

  ]

  const discoveredPages =

    journalEntries.map(
        entry => entry.realm_category
    )

  const mapLocations = {

    Kings: {
        top: '18%',
        left: '49%'
    },

    'Lost Scribes': {
        top: '29%',
        left: '33%'
    },

    'Hidden Paths': {
        top: '25%',
        left: '65%'
    },

    'Ancient Symbols': {
        top: '43%',
        left: '67%'
    },

    Ravens: {
        top: '51%',
        left: '22%'
    },

    Crowns: {
        top: '58%',
        left: '84%'
    },

    Keys: {
        top: '70%',
        left: '30%'
    },

    Moons: {
        top: '76%',
        left: '52%'
    },

    Sentinels: {
        top: '80%',
        left: '70%'
    },

    'The Forge': {
        top: '92%',
        left: '54%'
    }

  }

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

        <div className="character-tabs">

            <button
                className={
                    activeTab === 'character'
                        ? 'tab-button active'
                        : 'tab-button'
                }
                onClick={() =>
                    setActiveTab('character')
                }
            >

                Character Sheet

            </button>

            <button
                className={
                    activeTab === 'realm'
                        ? 'tab-button active'
                        : 'tab-button'
                }
                onClick={() =>
                    setActiveTab('realm')
                }
            >

                Realm

            </button>

        </div>       

        {activeTab === 'character' && (
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
            <h2>ACHIEVEMENTS</h2>

            <div className="achievement-summary">

                <div className="achievement-count">

                    {achievementCount} / 51
              
                </div>
                
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

                            <img
                                src={relicImages[relic.image_key]}
                                alt={relic.legend}
                                className="relic-image"
                            />

                            <div className="relic-info">
                                
                                <p>

                                    Series: {relic.series}

                                </p>

                                <p>

                                    Serial: {relic.serial_number}

                                </p>

                                <p>

                                    Relic Value: {relic.card_value.toLocaleString()}

                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

          </div>

          <div className="character-card full-width achievement-card">

            <h2>
                ACHIEVEMENTS
            </h2>

            <div className="achievement-scroll">

                {achievements.length === 0 ? (

                    <div className="coming-soon">
                        No achievements unlocked.
                    </div>

                ) : (

                    achievements.map((achievement, index) => (

                        <div
                            key={index}
                            className="achievement-entry"
                        >

                            <div className="achievement-header">

                                <span className="achievement-name">

                                    🏆 {
                                        achievement.achievements
                                            ?.achievement_name
                                    }

                                </span>

                                <span className="achievement-date">

                                    {
                                        new Date(
                                            achievement.earned_at
                                        ).toLocaleDateString()
                                    }

                                </span>

                            </div>

                            <div className="achievement-description">

                                {
                                    achievement.achievements
                                        ?.achievement_description
                                }

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

        )}

        {activeTab === 'realm' && (

            <div className="realm-tab">

                <div className="character-card full-width">

                    <h2>REALM MAP</h2>

                    <div className="realm-map-container">

                        <img
                            src={realmMap}
                            alt="Realm Map"
                            className="realm-map-image"
                        />

                        {Object.entries(mapLocations).map(
                            ([location, position]) =>

                                discoveredPages.includes(location) && (

                                    <div
                                        key={location}
                                        className="realm-marker"
                                        style={{

                                            top: position.top,

                                            left: position.left

                                        }}
                                    >

                                        ✨

                                    </div>

                                )

                        )}

                    </div>

                </div>

                <div className="character-card full-width">

                    <h2>DISCOVERIES OF THE REALM</h2>

                    <div className="discoveries-list">

                        {[...realmPages]
                            .sort((a, b) => a.localeCompare(b))
                            .map(page => {

                                const unlocked =
                                    discoveredPages.includes(page)

                                return (

                                    <div
                                        key={page}
                                        className="discovery-row"
                                    >

                                        <span>

                                            {unlocked ? '✓' : '🔒'}

                                            {' '}

                                            {page}

                                        </span>

                                        <span>

                                            {unlocked
                                                ? 'Enter'
                                                : 'Locked'}

                                        </span>

                                    </div>

                                )

                            })}

                    </div>

                </div>

            </div>

        )}

      </div>
    </div>
  )
}

export default CharacterSheet