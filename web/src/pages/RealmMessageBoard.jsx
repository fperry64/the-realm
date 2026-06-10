import '../RealmMessageBoard.css'
import boardBanner from '../assets/board.png'

function RealmMessageBoard() {

    return (

        <div className="message-board-page">

            <div className="message-board-container">

                <img
                    src={boardBanner}
                    alt="Realm Message Board"
                    className="message-board-banner"
                />

                <div className="message-board-content">
                    
                    <p>
                        Share discoveries, discuss clues,
                        celebrate achievements, and exchange
                        rumors from across The Realm.
                    </p>

                </div>

            </div>

        </div>

    )

}

export default RealmMessageBoard