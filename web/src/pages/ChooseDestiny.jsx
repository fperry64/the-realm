import '../ChooseDestiny.css'

import wealthImg from '../assets/wealth.png'
import relicsImg from '../assets/relics.png'
import loreImg from '../assets/lore.png'
import legacyImg from '../assets/legacy.png'
import fortuneImg from '../assets/fortune.png'

function ChooseDestiny() {
  return (
    <div className="choose-destiny-page">

      <h1>THE GATE RECOGNIZES YOU</h1>

      <p>
        Your account has been created.
      </p>

      <p>
        The Sentinel watches.
      </p>

      <p>
        Before entering The Realm, you must choose the path where your story begins.
      </p>

      <div className="section-divider"></div>

      <h2 className="legend-title">CHOOSE YOUR DESTINY</h2>

      <div className="pursuit-grid">

        <div className="pursuit-card">
          <img
            src={wealthImg}
            alt="Wealth"
            className="pursuit-icon"
          />
          <h3>WEALTH</h3>
          <p>
            Build your fortune in Ghost Coins and uncover new opportunities for prosperity.
          </p>
        </div>

        <div className="pursuit-card">
          <img
            src={relicsImg}
            alt="Relics"
            className="pursuit-icon"
          />
          <h3>RELICS</h3>
          <p>
            Collect rare relics, artifacts, treasures, and complete prestigious collections.
          </p>
        </div>

        <div className="pursuit-card">
          <img
            src={loreImg}
            alt="Lore"
            className="pursuit-icon"
          />
          <h3>LORE</h3>
          <p>
            Discover the history of The Realm and uncover the secrets of legendary figures.
          </p>
        </div>

        <div className="pursuit-card">
          <img
            src={legacyImg}
            alt="Legacy"
            className="pursuit-icon"
          />
          <h3>LEGACY</h3>
          <p>
            Earn titles, achievements, reputation, influence, and recognition.
          </p>
        </div>

        <div className="pursuit-card">
          <img
            src={fortuneImg}
            alt="Fortune"
            className="pursuit-icon"
          />
          <h3>FORTUNE</h3>
          <p>
            Challenge fate through games, events, risks, and rewards.
          </p>
        </div>

      </div>

    </div>
  )
}

export default ChooseDestiny