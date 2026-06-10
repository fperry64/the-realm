import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

import '../Leaderboard.css'

import leaderboardBanner from '../assets/leaderboard.png'

function Leaderboard() {

    const [renownLeaders, setRenownLeaders] = useState([])

    const [treasuryLeaders, setTreasuryLeaders] = useState([])

    return (

        <div className="leaderboard-page">

            <div className="leaderboard-container">

                <img
                    src={leaderboardBanner}
                    alt="Realm Leaderboard"
                    className="leaderboard-banner"
                />

            <div className="leaderboard-welcome">

                <p>

                    The Realm's greatest champions are recorded here for all eternity.
                    Wealth may fill one's treasury, but only renown secures a legacy.

                </p>

            </div>

            </div>

        </div>

    )

}

export default Leaderboard