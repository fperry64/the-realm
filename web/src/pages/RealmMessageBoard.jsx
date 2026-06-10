import '../RealmMessageBoard.css'
import { useState } from 'react'
import {supabase } from '../supabase'
import boardBanner from '../assets/board.png'

function RealmMessageBoard() {

    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')

    async function createPost() {

        console.log('POST CLICKED')

    }

    return (

        <div className="message-board-page">

            <div className="message-board-container">

                <img
                    src={boardBanner}
                    alt="Realm Message Board"
                    className="message-board-banner"
                />

                <div className="post-card">

                    <h2>Create Post</h2>

                    <input
                        type="text"
                        placeholder="Post Title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <textarea
                        placeholder="Write your message..."
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                    />

                    <button
                        onClick={createPost}
                    >
                        POST MESSAGE
                    </button>

                </div>

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