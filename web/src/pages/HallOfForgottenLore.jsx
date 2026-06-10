import { useState } from 'react'
import { supabase } from '../supabase'

import '../HallOfForgottenLore.css'
import hallBackground from '../assets/hall.png'

function HallOfForgottenLore() {

    const [result, setResult] = useState('')

    async function exploreArchives() {

        setResult('The archives stir...')

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

                        {result}

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