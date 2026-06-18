import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import realmBanner from '../assets/realm-arrival-banner.png'
import { useNavigate, Link } from 'react-router-dom'
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

  const realmPages = [

    {
        name: 'Moons',
        route: '/realm/moons'
    },

    {
        name: 'Crowns',
        route: '/realm/crowns'
    },

    {
        name: 'Kings',
        route: null
    },

    {
        name: 'Ravens',
        route: null
    },

    {
        name: 'Sentinels',
        route: '/realm/sentinels'
    },

    {
        name: 'The Forge',
        route: null
    }

  ]

  const discoveredPages =

    journalEntries.map(
        entry => entry.realm_category
    )

  const discoveredCategories = 
    discoveredPages

  const totalRelicValue =

    relics.reduce(

        (sum, relic) =>

            sum +
            (relic.card_value || 0),

        0

    )

  const renown =
      profile?.renown || 0

  const ghostCoins =
      profile?.ghost_coins || 0

  let nextLoreSearch =
      'Available Now'

  if (profile?.last_lore_search) {

      const lastSearch =
          new Date(
              profile.last_lore_search
          )

      const nextSearch =
          new Date(
              lastSearch.getTime() +
              (12 * 60 * 60 * 1000)
          )

      const now =
          new Date()

      const remaining =
          nextSearch - now

      if (remaining > 0) {

          const hours =
              Math.floor(
                  remaining /
                  (1000 * 60 * 60)
              )

          const minutes =
              Math.floor(
                  (
                      remaining %
                      (1000 * 60 * 60)
                  ) /
                  (1000 * 60)
              )

          nextLoreSearch =
              `${hours}h ${minutes}m`

      }

  }

  let crownTitle =
    'Wanderer'

  if (
      renown >= 5000 &&
      ghostCoins >= 1000000
  ) {

      crownTitle =
          'Keeper of the Coin'

  }

  if (
      renown >= 7500 &&
      ghostCoins >= 1500000
  ) {

      crownTitle =
          'Master of the Treasury'

  }

  if (
      renown >= 10000 &&
      ghostCoins >= 2000000 &&
      totalRelicValue >= 10000
  ) {

      crownTitle =
          'Guardian of the Forge'

  }

  if (
      renown >= 25000 &&
      ghostCoins >= 3500000 &&
      totalRelicValue >= 15000
  ) {

      crownTitle =
          'Warden of the Golden Vault'

  }

  if (
      renown >= 50000 &&
      ghostCoins >= 4500000 &&
      totalRelicValue >= 25000
  ) {

      crownTitle =
          'Crownbearer of the Realm'

  }

  if (
      renown >= 100000 &&
      ghostCoins >= 5000000 &&
      totalRelicValue >= 35000
  ) {

      crownTitle =
          'High Treasurer of the Forgotten Kingdom'

  }

  if (
      renown >= 250000 &&
      ghostCoins >= 10000000 &&
      totalRelicValue >= 50000
  ) {

      crownTitle =
          'The Crowned Sovereign'

  }

    let moonRank =
        'Initiate of the First Moon'

    const hasRavens =
        discoveredCategories.includes(
            'Ravens'
        )

    const hasLostScribes =
        discoveredCategories.includes(
            'Scrolls of the Lost Scribes'
        )

    const hasCrowns =
        discoveredCategories.includes(
            'Crowns'
        )

    const hasGoldenAge =
        discoveredCategories.includes(
            'Golden Age'
        )

    const hasKeys =
        discoveredCategories.includes(
            'Keys'
        )

    const hasCemetery =
        discoveredCategories.includes(
            'The Cemetery'
        )

    const hasSentinels =
        discoveredCategories.includes(
            'Sentinels'
        )

    const hasFirstSentinel =
        discoveredCategories.includes(
            'The First Sentinel'
        )

    const hasForge =
        discoveredCategories.includes(
            'The Forge'
        )

    const hasRealmForge =
        discoveredCategories.includes(
            'The Realm Forge'
        )

    const hasKings =
        discoveredCategories.includes(
            'Kings'
        )

    const hasForgottenKingsChamber =
        discoveredCategories.includes(
            'Forgotten Kings Chamber'
        )

    const rank2 =
        hasRavens &&
        hasLostScribes

    const rank3 =
        rank2 &&
        hasCrowns &&
        hasGoldenAge &&
        profile?.renown >= 15000

    const rank4 =
        rank3 &&
        hasKeys &&
        hasCemetery &&
        profile?.renown >= 17500

    const rank5 =
        rank4 &&
        hasSentinels &&
        hasFirstSentinel &&
        profile?.renown >= 25000

    const rank6 =
        rank5 &&
        hasForge &&
        hasRealmForge &&
        relicCount >= 5 &&
        profile?.renown >= 32500

    const rank7 =
        rank6 &&
        hasKings &&
        hasForgottenKingsChamber &&
        relicCount >= 7 &&
        profile?.renown >= 75000

    if (rank2) {

        moonRank =
            'Moon Observer'

    }

    if (rank3) {

        moonRank =
            'Keeper of the Silver Grove'

    }

    if (rank4) {

        moonRank =
            'Warden of the Moonstone Circle'

    }

    if (rank5) {

        moonRank =
            'Lunar Sage'

    }

    if (rank6) {

        moonRank =
            'Elder of the Silver Sky'

    }

    if (rank7) {

        moonRank =
            'Archdruid of the Moon'

    }

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
        top: '78%',
        left: '75%'
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

                        <h3>

                            {profile.username}

                        </h3>

                        <p className="identity-title">

                            Title:
                            {' '}
                            {crownTitle}

                        </p>

                        <p className="identity-subtitle">

                            Moon Druid Path:
                            {' '}
                            {moonRank}

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

                                Destiny:

                            </span>

                            {' '}

                            {profile.current_destiny}

                        </p>

                        <p>

                            <span className="identity-label">

                                Next Lore Search:

                            </span>

                            {' '}

                            {nextLoreSearch}

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
                            .sort((a, b) =>
                                a.name.localeCompare(b.name)
                            )
                            .map(page => {

                                const unlocked =
                                    discoveredPages.includes(
                                        page.name
                                    )

                                return (

                                    <div
                                        key={page.name}
                                        className="discovery-row"
                                    >

                                        <span>

                                            {unlocked ? '✓' : '🔒'}

                                            {' '}

                                            {page.name}

                                        </span>

                                        <span>

                                            {unlocked ? (

                                                page.route ? (

                                                    <Link
                                                        to={page.route}
                                                        className="realm-enter-link"
                                                    >

                                                        Enter

                                                    </Link>

                                                ) : (

                                                    'Unlocked'

                                                )

                                            ) : (

                                                'Locked'

                                            )}

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