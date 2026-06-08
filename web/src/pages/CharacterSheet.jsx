import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import realmBanner from '../assets/realm-arrival-banner.png'
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
                        Your journey awaits...
                    </p>

                    <p className="realm-divider">
                        ════════════════════════════
                    </p>
                </div>

            </div>
        </div>

        <div className="character-grid">

          <div className="character-card identity-card full-width">
            <h2>PROFILE</h2>

            <div className="identity-content">

                <div className="identity-avatar">
                    <img
                        src={
                            profile.avatar_url ||
                            'https://placehold.co/200x200?text=Portrait'
                        }
                        alt="Character Portrait"
                        className="indentity-avatar"
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
                        <strong>Current Destiny:</strong><br />
                        {profile.current_destiny}
                        </p>

                        <p>
                        <strong>Original Destiny:</strong><br />
                        {profile.original_destiny}
                        </p>

                        <p>
                        <strong>Alignment:</strong><br />
                        {profile.alignment || 'Neutral'}
                        </p>

                    </div>

                </div>

            </div>
          </div>

          <div className="character-card">
            <h2>TREASURY</h2>

            <p>{profile.ghost_coins} Ghost Coins</p>
          </div>

          <div className="character-card">
            <h2>RENOWN</h2>

            <p>{profile.reputation}</p>
          </div>

          <div className="character-card">
            <h2>RELICS COLLECTED</h2>

            <p>{profile.relics}</p>
          </div>

          <div className="character-card">
            <h2>ACHIEVEMENTS UNLOCKED</h2>

            <div className="coming-soon">
              COMING REAL SOON
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CharacterSheet