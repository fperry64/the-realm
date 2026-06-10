import { useState } from 'react'
import { supabase } from '../supabase'

import '../HallOfForgottenLore.css'
import hallBackground from '../assets/hall.png'

const COOLDOWN_HOURS = 12

function HallOfForgottenLore() {

    const [result, setResult] = useState(null)

    async function getRandomRow(tableName) {

        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('is_active', true)

        if (error || !data || data.length === 0) {
            console.error(error)
            return null
        }

        return data[Math.floor(Math.random() * data.length)]

    }

    async function addJournalEntry(userId, entryType, sourceTable, sourceId, entry) {

        const { data: existing } = await supabase
            .from('user_journal')
            .select('id')
            .eq('user_id', userId)
            .eq('source_table', sourceTable)
            .eq('source_id', sourceId)
            .maybeSingle()

        if (existing) return

        await supabase
            .from('user_journal')
            .insert({
                user_id: userId,
                entry_type: entryType,
                realm_category: entry.realm_category,
                title: entry.title,
                entry_text: entry.entry_text,
                source_table: sourceTable,
                source_id: sourceId
            })

    }

    async function findRelicByRarity(rarity) {

        const { data: ownedRelics } = await supabase
            .from('user_relics')
            .select('relic_id')

        const ownedIds = ownedRelics?.map(r => r.relic_id) || []

        let query = supabase
            .from('relics')
            .select('*')
            .eq('rarity', rarity)

        if (ownedIds.length > 0) {
            query = query.not('id', 'in', `(${ownedIds.join(',')})`)
        }

        const { data, error } = await query

        if (error || !data || data.length === 0) {
            console.error(error)
            return null
        }

        return data[Math.floor(Math.random() * data.length)]

    }

    async function exploreArchives() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            setResult({
                type: 'error',
                title: 'Access Denied',
                text: 'You must be signed in to explore the Hall of Forgotten Lore.'
            })
            return
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('renown, last_lore_search')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error(profileError)
            setResult({
                type: 'error',
                title: 'The Archives Resist',
                text: 'Unable to read your profile.'
            })
            return
        }

        if (profile?.last_lore_search) {

            const lastSearch = new Date(profile.last_lore_search)
            const now = new Date()

            const hoursPassed =
                (now - lastSearch) / (1000 * 60 * 60)

            if (hoursPassed < COOLDOWN_HOURS) {

                const hoursRemaining =
                    Math.ceil(COOLDOWN_HOURS - hoursPassed)

                setResult({
                    type: 'cooldown',
                    title: 'The Archives Remain Silent...for now',
                    text: `You may explore again in approximately ${hoursRemaining} hour(s).`
                })

                return

            }

        }

        const roll = Math.random() * 100

        let outcome
        let renownAward
        let relicRarity = null

        if (roll < 80) {
            outcome = 'knowledge'
            renownAward = 1
        } else if (roll < 90) {
            outcome = 'clue'
            renownAward = 2
        } else if (roll < 95) {
            outcome = 'relic'
            relicRarity = 'Epic'
            renownAward = 3
        } else if (roll < 99) {
            outcome = 'relic'
            relicRarity = 'Legendary'
            renownAward = 4
        } else {
            outcome = 'relic'
            relicRarity = 'Mythic'
            renownAward = 5
        }

        const nowIso = new Date().toISOString()

        await supabase
            .from('profiles')
            .update({
                renown: (profile.renown || 0) + renownAward,
                last_lore_search: nowIso
            })
            .eq('id', user.id)

        if (outcome === 'knowledge') {

            const entry = await getRandomRow('lore_knowledge')

            if (!entry) return

            await addJournalEntry(
                user.id,
                'knowledge',
                'lore_knowledge',
                entry.id,
                entry
            )

            setResult({
                type: 'knowledge',
                title: entry.title,
                text: entry.entry_text,
                renown: renownAward
            })

            return

        }

        if (outcome === 'clue') {

            const entry = await getRandomRow('lore_clues')

            if (!entry) return

            await addJournalEntry(
                user.id,
                'clue',
                'lore_clues',
                entry.id,
                entry
            )

            setResult({
                type: 'clue',
                title: entry.title,
                text: entry.entry_text,
                renown: renownAward
            })

            return

        }

        if (outcome === 'relic') {

            let relic =
                await findRelicByRarity(relicRarity)

            if (!relic && relicRarity === 'Mythic') {
                relic = await findRelicByRarity('Legendary')
                relicRarity = 'Legendary'
                renownAward = 4
            }

            if (!relic && relicRarity === 'Legendary') {
                relic = await findRelicByRarity('Epic')
                relicRarity = 'Epic'
                renownAward = 3
            }

            if (!relic) {
                setResult({
                    type: 'knowledge',
                    title: 'The Empty Shelf',
                    text: 'The archives revealed traces of a relic, but none remain to be discovered.',
                    renown: renownAward
                })
                return
            }

            await supabase
                .from('user_relics')
                .insert({
                    user_id: user.id,
                    relic_id: relic.id
                })

            setResult({
                type: 'relic',
                title: 'Relic Discovered',
                text: `${relic.legend} — ${relic.card_name}`,
                relic,
                renown: renownAward
            })

        }

    }

    return (

        <div
            className="hall-page"
            style={{
                backgroundImage:
                    `url(${hallBackground})`
            }}
        >

            <div className="hall-center">

                <button
                    className="explore-button"
                    onClick={exploreArchives}
                >
                    EXPLORE
                </button>

                {result && (

                    <div className="hall-result-card">

                        <h3>
                            {result.title}
                        </h3>

                        <p>
                            {result.text}
                        </p>

                        {result.relic && (

                            <div className="relic-result">

                                <p>
                                    <strong>ID:</strong> {result.relic.id}
                                </p>

                                <p>
                                    <strong>Series:</strong> {result.relic.series}
                                </p>

                                <p>
                                    <strong>Serial:</strong> {result.relic.serial_number}
                                </p>

                                <p>
                                    <strong>Rarity:</strong> {result.relic.rarity}
                                </p>

                                <p>
                                    <strong>Value:</strong> {result.relic.card_value.toLocaleString()}
                                </p>

                            </div>

                        )}

                        {result.renown && (

                            <p className="renown-award">

                                +{result.renown} Renown

                            </p>

                        )}

                    </div>

                )}

            </div>

            <div className="hall-lore-text">

                For centuries, the Hall of Forgotten Lore
                has stood in silence, its towering shelves
                preserving the histories of kings,
                dragons, sentinels, and forgotten gods.
                Those who dare search its dusty archives
                may uncover lost knowledge, ancient relics,
                and fragments of the Realm's greatest
                mysteries.

            </div>

        </div>

    )

}

export default HallOfForgottenLore