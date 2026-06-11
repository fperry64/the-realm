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

function RelicCard({ relic }) {

    const image =
        relicImages[relic.image_key]

    return (

        <div className="relic-card">

            <img
                src={image}
                alt={relic.card_name}
                className="relic-image"
            />

        </div>

    )

}

export default RelicCard