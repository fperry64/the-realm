import '../RealmMessageBoard.css'
import { useState, useEffect } from 'react'
import {supabase } from '../supabase'
import boardBanner from '../assets/board.png'

function RealmMessageBoard() {

    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [posts, setPosts] = useState([])

    async function createPost() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {

            alert('You must be logged in.')

            return

        }

        const { data: profile } = await supabase

            .from('profiles')

            .select('username')

            .eq('id', user.id)

            .single()

        const { error } = await supabase

            .from('realm_messages')

            .insert({

                user_id: user.id,

                username: profile.username,

                title: title,

                message: message

            })

        if (error) {

            console.error(error)

            alert('Failed to create post.')

            return

        }

        alert('Post created successfully!')

        setTitle('')

        setMessage('')

        loadPosts()

    }

    async function loadPosts() {

        const { data, error } = await supabase

            .from('realm_messages')

            .select('*')

            .order(
                'created_at',
                { ascending: false }
            )

        if (error) {

            console.error(error)

            return

        }

        setPosts(data)

    }

    async function likePost(postId) {

        const post = posts.find(
            p => p.id === postId
        )

        if (!post) return

        const { error } = await supabase

            .from('realm_messages')

            .update({

                likes: (post.likes || 0) + 1

            })

            .eq('id', postId)

        if (error) {

            console.error(error)

            return

        }

        loadPosts()

    }

    useEffect(() => {
        loadPosts()

    }, [])

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

                <div className="posts-container">

                    {posts.map(post => (

                        <div
                            key={post.id}
                            className="post-display-card"
                        >

                            <h3 className="post-title">
                                {post.title}
                            </h3>

                            <p className="post-meta">

                                Posted by {post.username}

                                <br />

                                {new Date(
                                    post.created_at
                                ).toLocaleString()}

                            </p>

                            <p className="post-message">
                                {post.message}
                            </p>

                            <div className="post-actions">

                                <button
                                    onClick={(( =>
                                        likePost(post.id)
                                    }
                                >
                                    👍 Like
                                </button>

                                <span>
                                    {post.likes || 0}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>                

            </div>

        </div>

    )

}

export default RealmMessageBoard