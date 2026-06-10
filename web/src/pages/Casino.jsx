import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import '../Casino.css'
import blazeCasinoBanner from '../assets/blaze-casino-banner.png'
import SlotMachine from '../components/SlotMachine'
import emberRaven from '../assets/ember_raven.png'


function Casino() {
  const [profile, setProfile] = useState(null)
  const [jackpot, setJackpot] = useState(0)

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

    const {data: jackpotData, error: jackpotError} = await supabase
      .from('jackpots')
      .select('current_value')
      .eq('jackpot_name', "Blaze's Jackpot")
      .single()

    if (jackpotError) {
      console.error(jackpotError)
      } else {
        setJackpot(jackpotData.current_value)
      }

    }

  if (!profile) {
    return (
      <div className="casino-page">
        Loading Blaze Mortem&apos;s Casino...
      </div>
    )
  }

  return (
    <div className="casino-page">
      <div className="casino-container">

        <img
            src={blazeCasinoBanner}
            alt="Blaze Mortem's Casino"
            className="casino-banner"
        />        
        
<div className="casino-layout">

    <div className="side-card">

        <h3>HOW TO WIN</h3>

        <div className="card-section">

            <strong>Paylines: 5</strong>

            <div className="payline-list">
                Top Row<br />
                Middle Row<br />
                Bottom Row<br />
                V Pattern<br />
                Inverted V Pattern
            </div>

        </div>

        <div className="card-section">

            <strong>SCATTER PAYS</strong>

            <div>
                Scatter x3 = 5x Bet
            </div>

            <div>
                Scatter x4 = 10x Bet
            </div>

            <div>
                Scatter x5 = 25x Bet
            </div>

            <br />

            <div>
                Scatters may appear anywhere on the reels.
            </div>

        </div>

        <div className="card-section">

            <strong>WILD SYMBOL</strong>

            <div>
                Wilds substitute for all symbols except:
            </div>

            <ul>
                <li>Scatter</li>
                <li>Blaze's Jackpot</li>
            </ul>

        </div>

    </div>

    <SlotMachine
        jackpot={jackpot}
        ghostCoins={profile.ghost_coins}
    />

    <div className="side-card">

        <h3>EMBER RAVEN FEATURE</h3>

        <div className="card-section">

            The Ember Raven Feature may be triggered on any spin.

            <br /><br />

            If activated:

            <ul>
                <li>The Ember Raven flies across the reels.</li>
                <li>The Raven drops 3-8 Wild Symbols.</li>
                <li>Wilds may appear anywhere on the reels.</li>
                <li>Wilds can create massive payouts.</li>
            </ul>

        </div>

    </div>

</div>

      </div>
    </div>
  )
}

export default Casino