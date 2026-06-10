import './HallOfForgottenLore.css'
import hallBackground from '../assets/hall.png'

function HallOfForgottenLore() {

    return (

        <div
            className="hall-page"
            style={{
                backgroundImage:
                    `url(${hallBackground})`
            }}
        >

            <div className="hall-center">

                <button className="explore-button">
                    EXPLORE
                </button>

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