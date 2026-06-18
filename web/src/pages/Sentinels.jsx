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

    const [activeBattle, setActiveBattle] =
        useState(null)

    const [activeEnemy, setActiveEnemy] =
        useState(null)

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

            const { data: activeBattleData } =
                await supabase
                    .from('active_sentinel_battles')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'Active')
                    .maybeSingle()

            if (activeBattleData) {

                setActiveBattle(activeBattleData)

                const { data: activeEnemyData } =
                    await supabase
                        .from('sentinel_enemies')
                        .select('*')
                        .eq('id', activeBattleData.enemy_id)
                        .single()

                setActiveEnemy(activeEnemyData)

            }

        }

    }

    async function acceptChallenge() {

        if (!profile || !currentThreat || !rankData) return

        if (activeBattle) return

        const { data, error } =
            await supabase
                .from('active_sentinel_battles')
                .insert({
                    user_id: profile.id,
                    enemy_id: currentThreat.id,
                    player_hp: rankData.hit_points,
                    enemy_hp: currentThreat.hit_points,
                    round_number: 1,
                    status: 'Active',
                    last_battle_log:
                        `${currentThreat.enemy_name} has appeared. The battle begins.`
                })
                .select()
                .single()

        if (error) {
            console.error(error)
            return
        }

        setActiveBattle(data)
        setActiveEnemy(currentThreat)

    }

    function rollBetween(min, max) {

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min

    }

    async function rollAttack() {

        if (!activeBattle || !activeEnemy || !rankData) return

        const playerRoll = rollBetween(1, 20)

        const playerTotal =
            playerRoll + rankData.strength

        const playerCritical =
            playerRoll === 20

        const playerFail =
            playerRoll === 1

        const playerHit =
            playerCritical ||
            (
                !playerFail &&
                playerTotal >= activeEnemy.armor_class
            )

        let playerDamage = 0

        if (playerHit) {

            playerDamage =
                rollBetween(
                    rankData.damage_min,
                    rankData.damage_max
                )

            if (playerCritical) {
                playerDamage *= 2
            }

        }

        const newEnemyHp =
            Math.max(
                activeBattle.enemy_hp - playerDamage,
                0
            )

        let battleLog =
            `You rolled ${playerRoll}. ` +
            `${playerHit ? 'Hit!' : 'Miss.'} ` +
            `Damage dealt: ${playerDamage}.`

        if (newEnemyHp <= 0) {

            await supabase
                .from('sentinel_battles')
                .insert({
                    user_id: profile.id,
                    enemy_id: activeEnemy.id,
                    result: 'Victory',
                    rounds_fought: activeBattle.round_number,
                    renown_awarded: activeEnemy.reward_renown
                })

            await supabase
                .from('profiles')
                .update({
                    renown:
                        (profile.renown || 0) +
                        activeEnemy.reward_renown
                })
                .eq('id', profile.id)

            await supabase
                .from('active_sentinel_battles')
                .delete()
                .eq('id', activeBattle.id)

            setActiveBattle(null)
            setActiveEnemy(null)

            await loadSentinelData()

            return

        }

        const enemyRoll = rollBetween(1, 20)

        const enemyTotal =
            enemyRoll + activeEnemy.attack_bonus

        const enemyCritical =
            enemyRoll === 20

        const enemyFail =
            enemyRoll === 1

        const enemyHit =
            enemyCritical ||
            (
                !enemyFail &&
                enemyTotal >= rankData.armor_class
            )

        let enemyDamage = 0

        if (enemyHit) {

            enemyDamage =
                rollBetween(
                    activeEnemy.damage_min,
                    activeEnemy.damage_max
                )

            if (enemyCritical) {
                enemyDamage *= 2
            }

        }

        const newPlayerHp =
            Math.max(
                activeBattle.player_hp - enemyDamage,
                0
            )

        battleLog +=
            ` ${activeEnemy.enemy_name} rolled ${enemyRoll}. ` +
            `${enemyHit ? 'Hit!' : 'Miss.'} ` +
            `Damage received: ${enemyDamage}.`

        if (newPlayerHp <= 0) {

            await supabase
                .from('sentinel_battles')
                .insert({
                    user_id: profile.id,
                    enemy_id: activeEnemy.id,
                    result: 'Defeat',
                    rounds_fought: activeBattle.round_number,
                    renown_awarded: 0
                })

            await supabase
                .from('active_sentinel_battles')
                .delete()
                .eq('id', activeBattle.id)

            setActiveBattle(null)
            setActiveEnemy(null)

            await loadSentinelData()

            return

        }

        const { data } =
            await supabase
                .from('active_sentinel_battles')
                .update({
                    player_hp: newPlayerHp,
                    enemy_hp: newEnemyHp,
                    round_number:
                        activeBattle.round_number + 1,
                    last_battle_log: battleLog
                })
                .eq('id', activeBattle.id)
                .select()
                .single()

        setActiveBattle(data)

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
                                    onClick={acceptChallenge}
                                    disabled={!!activeBattle}
                                >
                                    {activeBattle
                                        ? 'BATTLE IN PROGRESS'
                                        : 'ACCEPT CHALLENGE'}
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

                    <h2>ACTIVE BATTLE</h2>

                    {activeBattle && activeEnemy ? (

                        <>

                            <h3>{activeEnemy.enemy_name}</h3>

                            <p>
                                Your HP: {activeBattle.player_hp} / {rankData.hit_points}
                            </p>

                            <p>
                                Enemy HP: {activeBattle.enemy_hp} / {activeEnemy.hit_points}
                            </p>

                            <p>
                                Round: {activeBattle.round_number}
                            </p>

                            <p>
                                {activeBattle.last_battle_log}
                            </p>

                            <button
                                className="challenge-button"
                                onClick={rollAttack}
                            >
                                ROLL ATTACK
                            </button>

                        </>

                    ) : (

                        <>

                            <p>No active battle.</p>

                            <p>
                                Accept a challenge to defend The Realm.
                            </p>

                        </>

                    )}

                </div>

            </div>

        </div>

    )

}

export default Sentinels

