import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import '../Sentinels.css'
import sentinelsBanner from '../assets/sentinels_banner.png'

import ashDrake from '../assets/ash_drake.png'
import stoneRaven from '../assets/stone_raven.png'
import voidQueen from '../assets/void_queen.png'
import cemeteryWarden from '../assets/cemetery_warden.png'
import forgottenKingShade from '../assets/forgotten_king_shade.png'

import hollowSentinel from '../assets/hollow_sentinel.png'
import realmbreakerOgre from '../assets/realmbreaker_ogre.png'
import nyxara from '../assets/nyxara.png'
import blazeMortem from '../assets/blaze_mortem.png'
import originalForger from '../assets/original_forger.png'

function Sentinels() {

    const [profile, setProfile] =
        useState(null)

    const [currentThreat, setCurrentThreat] =
        useState(null)

    const [rankData, setRankData] =
        useState(null)

    const [allRanks, setAllRanks] =
        useState([])

    const [victories, setVictories] =
        useState(0)

    const [defeats, setDefeats] =
        useState(0)

    const [hallOfSentinels, setHallOfSentinels] =
        useState([])

    const enemyImages = {

        ash_drake: ashDrake,

        stone_raven: stoneRaven,

        void_queen: voidQueen,

        cemetery_warden: cemeteryWarden,

        forgotten_king_shade: forgottenKingShade,

        hollow_sentinel: hollowSentinel,

        realmbreaker_ogre: realmbreakerOgre,

        nyxara: nyxara,

        blaze_mortem: blazeMortem,

        original_forger: originalForger

    }

    useEffect(() => {

        window.scrollTo(0, 0)

        loadSentinelData()

    }, [])

    async function loadSentinelData() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) return

        const { data: profileData } =
            await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

        setProfile(profileData)

        const { data: enemyData } =
            await supabase
                .from('sentinel_enemies')
                .select('*')

        if (
            enemyData &&
            enemyData.length > 0
        ) {

            const randomEnemy =

                enemyData[
                    Math.floor(
                        Math.random() *
                        enemyData.length
                    )
                ]

            setCurrentThreat(
                randomEnemy
            )

        }

        const { data: battleData } =
            await supabase
                .from('sentinel_battles')
                .select('*')
                .eq('user_id', user.id)

        const victoryCount =

            battleData?.filter(
                battle =>
                    battle.result === 'Victory'
            ).length || 0

        const defeatCount =

            battleData?.filter(
                battle =>
                    battle.result === 'Defeat'
            ).length || 0

        setVictories(
            victoryCount
        )

        setDefeats(
            defeatCount
        )

        const { data: ranksData } =
            await supabase
                .from('sentinel_ranks')
                .select('*')
                .order(
                    'victories_required',
                    {
                        ascending: true
                    }
                )

        setAllRanks(
            ranksData || []
        )

        if (
            ranksData &&
            ranksData.length > 0
        ) {

            let currentRank =

                ranksData[0]

            ranksData.forEach(rank => {

                if (
                    victoryCount >=
                    rank.victories_required
                ) {

                    currentRank = rank

                }

            })

            setRankData(
                currentRank
            )

        }

        const { data: leaderboardData } =
            await supabase
                .from('sentinel_battles')
                .select(`
                    user_id,
                    result,
                    profiles (
                        username
                    )
                `)

        if (leaderboardData) {

            const leaderboardMap = {}

            leaderboardData.forEach(
                battle => {

                    if (
                        battle.result !==
                        'Victory'
                    ) return

                    const username =

                        battle.profiles
                            ?.username

                    if (!username)
                        return

                    leaderboardMap[
                        username
                    ] =

                        (
                            leaderboardMap[
                                username
                            ] || 0
                        ) + 1

                }
            )

            const leaderboard =

                Object.entries(
                    leaderboardMap
                )

                .map(
                    ([username,
                        wins]) => ({

                        username,

                        wins

                    })
                )

                .sort(
                    (a, b) =>
                        b.wins - a.wins
                )

                .slice(0, 5)

            setHallOfSentinels(
                leaderboard
            )

        }

    }

    if (
        !profile ||
        !rankData
    ) {

        return (

            <div className="sentinels-page">

                Loading Sentinels...

            </div>

        )

    }

    const winRate =

        victories + defeats > 0

            ? Math.round(

                (
                    victories /
                    (victories + defeats)
                ) * 100

            )

            : 0

    return (

        <div className="sentinels-page">

            <img
                src={sentinelsBanner}
                alt="Sentinels"
                className="sentinels-banner"
            />

            <div className="sentinels-content">

                <h1>

                    THE ORDER OF SENTINELS

                </h1>

                <div className="sentinels-lore">

                    <p>

                        While kings sought power
                        and druids sought knowledge,
                        the Sentinels swore an oath
                        to defend The Realm from
                        threats that emerged from
                        beyond its borders.

                    </p>

                    <p>

                        Their duty is eternal.
                        Their vigilance unwavering.
                        Their victories become
                        legend.

                    </p>

                </div>

                <div className="sentinel-grid">

                    <div className="sentinel-card">

                        <h2>

                            ⚔ CURRENT THREAT ⚔

                        </h2>

                        {currentThreat && (

                            <>

                                <div
                                    className="threat-header"
                                >

                                    <div>

                                        <h3>

                                            {
                                                currentThreat.enemy_name
                                            }

                                        </h3>

                                    </div>

                                    <img
                                        src={
                                            enemyImages[
                                                currentThreat.image_key
                                            ]
                                        }
                                        alt={
                                            currentThreat.enemy_name
                                        }
                                        className="threat-image"
                                    />

                                </div>

                                <p>

                                    {
                                        currentThreat.lore
                                    }

                                </p>

                                <p>

                                    Armor Class:
                                    {' '}
                                    {
                                        currentThreat.armor_class
                                    }

                                </p>

                                <p>

                                    Hit Points:
                                    {' '}
                                    {
                                        currentThreat.hit_points
                                    }

                                </p>

                                <p>

                                    Attack Bonus:
                                    {' '}
                                    +
                                    {
                                        currentThreat.attack_bonus
                                    }

                                </p>

                                <p>

                                    Damage:
                                    {' '}
                                    {
                                        currentThreat.damage_min
                                    }
                                    {' - '}
                                    {
                                        currentThreat.damage_max
                                    }

                                </p>

                                <p>

                                    Reward:

                                </p>

                                <p>

                                    {
                                        currentThreat.reward_renown
                                    }

                                    {' '}
                                    Renown

                                </p>

                                <p>

                                    {
                                        currentThreat.reward_victories
                                    }

                                    {' '}
                                    Sentinel Victory

                                </p>

                                <button
                                    className="challenge-button"
                                >

                                    ACCEPT CHALLENGE

                                </button>

                            </>

                        )}

                    </div>

                    <div className="sentinel-card">

                        <h2>

                            ⚔ YOUR SENTINEL PROFILE ⚔

                        </h2>

                        <p>

                            Rank:
                            {' '}
                            {rankData.rank_name}

                        </p>

                        <p>

                            Victories:
                            {' '}
                            {victories}

                        </p>

                        <p>

                            Defeats:
                            {' '}
                            {defeats}

                        </p>

                        <p>

                            Win Rate:
                            {' '}
                            {winRate}%

                        </p>

                        <hr />

                        <p>

                            HP:
                            {' '}
                            {rankData.hit_points}

                        </p>

                        <p>

                            Armor Class:
                            {' '}
                            {rankData.armor_class}

                        </p>

                        <p>

                            Strength:
                            {' '}
                            +{rankData.strength}

                        </p>

                        <p>

                            Damage:
                            {' '}
                            {rankData.damage_min}

                            {' - '}

                            {rankData.damage_max}

                        </p>

                        <hr />

                        <p>

                            {rankData.description}

                        </p>

                    </div>

                </div>

                <div className="sentinel-grid">

                    <div className="sentinel-card">

                        <h2>

                            🏆 HALL OF SENTINELS

                        </h2>

                        {

                            hallOfSentinels.length === 0

                                ? (

                                    <p>

                                        No Sentinel
                                        Victories
                                        Recorded

                                    </p>

                                )

                                : (

                                    hallOfSentinels.map(
                                        (
                                            sentinel,
                                            index
                                        ) => (

                                            <p
                                                key={
                                                    sentinel.username
                                                }
                                            >

                                                {
                                                    index + 1
                                                }.

                                                {' '}

                                                {
                                                    sentinel.wins
                                                }

                                                {' '}

                                                Victories

                                                {' - '}

                                                {
                                                    sentinel.username
                                                }

                                            </p>

                                        )
                                    )

                                )

                        }

                    </div>

                    <div className="sentinel-card">

                        <h2>

                            PATH OF THE SENTINELS

                        </h2>

                        {

                            allRanks.map(
                                rank => (

                                    <p
                                        key={
                                            rank.id
                                        }
                                    >

                                        {

                                            victories >=
                                            rank.victories_required

                                                ? '✓'

                                                : '🔒'

                                        }

                                        {' '}

                                        {
                                            rank.rank_name
                                        }

                                    </p>

                                )
                            )

                        }

                    </div>

                </div>

                <div className="sentinel-card full-width">

                    <h2>

                        ACTIVE BATTLE

                    </h2>

                    <p>

                        No active battle.

                    </p>

                    <p>

                        Accept a challenge to
                        defend The Realm.

                    </p>

                </div>

            </div>

        </div>

    )

}

export default Sentinels

