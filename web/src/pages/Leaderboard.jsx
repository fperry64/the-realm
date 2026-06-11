import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

import '../Leaderboard.css'

import leaderboardBanner from '../assets/leaderboard.png'

function Leaderboard() {

    const [renownLeaders, setRenownLeaders] = useState([])
    const [treasuryLeaders, setTreasuryLeaders] = useState([])

    const [myRenownRank, setMyRenownRank] = useState(null)
    const [myTreasuryRank, setMyTreasuryRank] = useState(null)

    const [relicCountLeaders, setRelicCountLeaders] = useState([])
    const [relicValueLeaders, setRelicValueLeaders] = useState([])

    const [myRelicCountRank, setMyRelicCountRank] = useState(null)
    const [myRelicValueRank, setMyRelicValueRank] = useState(null)

    async function loadRenownLeaders() {

        const { data, error } = await supabase

            .from('profiles')

            .select('username, renown')

            .order(
                'renown',
                { ascending: false }
            )

            .limit(5)

        if (error) {

            console.error(error)

            return

        }

        setRenownLeaders(data)

    }

    async function loadTreasuryLeaders() {

        const { data, error } = await supabase

            .from('profiles')

            .select('username, ghost_coins')

            .order(
                'ghost_coins',
                { ascending: false }
            )

            .limit(5)

        if (error) {

            console.error(error)

            return

        }

        setTreasuryLeaders(data)

    }

    async function loadMyRenownRank() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase

            .from('profiles')

            .select('id, renown')

            .order(
                'renown',
                { ascending: false }
            )

        if (error) {

            console.error(error)

            return

        }

        const rank =

            data.findIndex(
                profile => profile.id === user.id
            ) + 1

        setMyRenownRank(rank)

    }

    async function loadMyTreasuryRank() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase

            .from('profiles')

            .select('id, ghost_coins')

            .order(
                'ghost_coins',
                { ascending: false }
            )

        if (error) {

            console.error(error)

            return

        }

        const rank =

            data.findIndex(
                profile => profile.id === user.id
            ) + 1

        setMyTreasuryRank(rank)

    }

    async function loadMyRelicCountRank() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase

            .from('relic_count_leaderboard')

            .select('*')

            .order(
                'relic_count',
                { ascending: false }
            )

        if (error) {

            console.error(error)

            return

        }

        const rank =

            data.findIndex(
                profile => profile.id === user.id
            ) + 1

        setMyRelicCountRank(rank)

    }

    async function loadMyRelicValueRank() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase

            .from('relic_value_leaderboard')

            .select('*')

            .order(
                'relic_value',
                { ascending: false }
            )

        if (error) {

            console.error(error)

            return

        }

        const rank =

            data.findIndex(
                profile => profile.id === user.id
            ) + 1

        setMyRelicValueRank(rank)

    }

    async function loadRelicCountLeaders() {

        const { data, error } = await supabase

            .from('relic_count_leaderboard')

            .select('*')

            .order(
                'relic_count',
                { ascending: false }
            )

            .limit(5)

        if (error) {

            console.error(error)

            return

        }

        setRelicCountLeaders(data)

    }

    async function loadRelicValueLeaders() {

        const { data, error } = await supabase

            .from('relic_value_leaderboard')

            .select('*')

            .order(
                'relic_value',
                { ascending: false }
            )

            .limit(5)

        if (error) {

            console.error(error)

            return

        }

        setRelicValueLeaders(data)

    }

    useEffect(() => {

        loadRenownLeaders()
        loadTreasuryLeaders()
        loadMyRenownRank()
        loadMyTreasuryRank()
        loadRelicCountLeaders()
        loadRelicValueLeaders()
        loadMyRelicCountRank()
        loadMyRelicValueRank()

    }, [])

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
                    <br />
                    Wealth may fill one's treasury, but only renown secures a legacy.

                </p>

            </div>

            <div className="leaderboard-grid">
               
                <div className="leaderboard-card">

                    <h2>
                        TOP 5 RENOWN LEADERS
                    </h2>

                    <table className="leaderboard-table">

                        <thead>

                            <tr>

                                <th>Rank</th>

                                <th>Username</th>

                                <th>Renown</th>

                            </tr>

                        </thead>

                        <tbody>

                            {renownLeaders.map((user, index) => (

                                <tr key={user.username}>

                                    <td>{index + 1}</td>

                                    <td>{user.username}</td>

                                    <td>
                                        {user.renown?.toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <p className="my-rank">
                    
                        Your Rank: #{myRenownRank}
                        
                    </p>

                </div>

                <div className="leaderboard-card">

                    <h2>
                        TOP 5 TREASURY LEADERS
                    </h2>

                    <table className="leaderboard-table">

                        <thead>

                            <tr>

                                <th>Rank</th>

                                <th>Username</th>

                                <th>Treasury</th>

                            </tr>

                        </thead>

                        <tbody>

                            {treasuryLeaders.map((user, index) => (

                                <tr key={user.username}>

                                    <td>{index + 1}</td>

                                    <td>{user.username}</td>

                                    <td>
                                        {user.ghost_coins?.toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <p className="my-rank">

                        Your Rank: #{myTreasuryRank}

                    </p>

                </div>

                <div className="leaderboard-card">

                    <h2>
                        TOP 5 RELIC HUNTERS
                    </h2>

                    <table className="leaderboard-table">

                        <thead>

                            <tr>

                                <th>Rank</th>

                                <th>Username</th>

                                <th>Relics</th>

                            </tr>

                        </thead>

                        <tbody>

                            {relicCountLeaders.map((user, index) => (

                                <tr key={user.username}>

                                    <td>{index + 1}</td>

                                    <td>{user.username}</td>

                                    <td>
                                        {user.relic_count}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <p className="my-rank">

                        Your Rank: #{myRelicCountRank}

                    </p>

                </div>

                <div className="leaderboard-card">

                    <h2>
                        TOP 5 RELIC COLLECTORS
                    </h2>

                    <table className="leaderboard-table">

                        <thead>

                            <tr>

                                <th>Rank</th>

                                <th>Username</th>

                                <th>Value</th>

                            </tr>

                        </thead>

                        <tbody>

                            {relicValueLeaders.map((user, index) => (

                                <tr key={user.username}>

                                    <td>{index + 1}</td>

                                    <td>{user.username}</td>

                                    <td>
                                        {user.relic_value?.toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <p className="my-rank">

                        Your Rank: #{myRelicValueRank}

                    </p>

                </div>

            </div>

            </div>

        </div>

    )

}

export default Leaderboard