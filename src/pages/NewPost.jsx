import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import "../App.css";

function NewPost() {
    const [postType, setPostType] = useState("Question");
    const [plan, setPlan] = useState("Free");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [abstract, setAbstract] = useState("");
    const [articleText, setArticleText] = useState("");
    const [tags, setTags] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handlePost(e) {
        e.preventDefault();

        setError("");
        setMessage("");

        const user = auth.currentUser;

        // Check login
        if (!user) {
            setError("Please login before submitting a post.");
            return;
        }

        // Prepare tags
        const tagList = tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        // Frontend validation
        if (title.trim().length < 5) {
            setError("Title must contain at least 5 characters.");
            return;
        }

        if (postType === "Question" && !description.trim()) {
            setError("Please describe your problem.");
            return;
        }

        if (
            postType === "Article" &&
            (!abstract.trim() || !articleText.trim())
        ) {
            setError("Please enter the abstract and article text.");
            return;
        }

        if (tagList.length === 0) {
            setError("Please enter at least one tag.");
            return;
        }

        if (tagList.length > 3) {
            setError("You can enter a maximum of 3 tags.");
            return;
        }

        try {
            setLoading(true);

            // Get Firebase authentication token
            const token = await user.getIdToken();

            // Prepare post data
            const postData = {
                postType,
                plan,
                title: title.trim(),
                description: description.trim(),
                abstract: abstract.trim(),
                articleText: articleText.trim(),
                tags: tagList
            };

            // Send post to backend
            const response = await fetch(
                "http://localhost:5000/api/posts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to submit post.");
            }

            setMessage("Your post has been submitted successfully!");

            // Clear form
            setTitle("");
            setDescription("");
            setAbstract("");
            setArticleText("");
            setTags("");
            setPlan("Free");

        } catch (err) {
            console.error("Post Error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />

            <main className="post-container">

                <h2 className="post-heading">New Post</h2>

                {/* Post Type */}
                <div className="post-type">

                    <span>Select Post Type:</span>

                    <label>
                        <input
                            type="radio"
                            name="postType"
                            checked={postType === "Question"}
                            onChange={() => {
                                setPostType("Question");
                                setError("");
                            }}
                        />
                        Question
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="postType"
                            checked={postType === "Article"}
                            onChange={() => {
                                setPostType("Article");
                                setError("");
                            }}
                        />
                        Article
                    </label>

                </div>

                {/* Subscription Plan */}
                <div className="post-type">

                    <span>Select Post Plan:</span>

                    <label>
                        <input
                            type="radio"
                            name="plan"
                            checked={plan === "Free"}
                            onChange={() => setPlan("Free")}
                        />
                        Free
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="plan"
                            checked={plan === "Paid"}
                            onChange={() => setPlan("Paid")}
                        />
                        Paid
                    </label>

                </div>

                <h3 className="post-section-heading">
                    What do you want to ask or share
                </h3>

                <form onSubmit={handlePost}>

                    {/* Title */}
                    <div className="post-field">

                        <label htmlFor="title">Title</label>

                        <input
                            id="title"
                            type="text"
                            placeholder={
                                postType === "Question"
                                    ? "Start your question with how, what, why, etc."
                                    : "Enter a descriptive title"
                            }
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ width: "75%" }}
                        />

                    </div>

                    {/* Question */}
                    {postType === "Question" ? (

                        <div className="post-field post-description">

                            <label htmlFor="description">
                                Describe your problem
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />

                        </div>

                    ) : (

                        <>
                            {/* Abstract */}
                            <div className="post-field">

                                <label htmlFor="abstract">Abstract</label>

                                <textarea
                                    id="abstract"
                                    placeholder="Enter a 1-paragraph abstract"
                                    value={abstract}
                                    onChange={e => setAbstract(e.target.value)}
                                />

                            </div>

                            {/* Article Text */}
                            <div className="post-field post-description">

                                <label htmlFor="articleText">
                                    Article Text
                                </label>

                                <textarea
                                    id="articleText"
                                    value={articleText}
                                    onChange={e => setArticleText(e.target.value)}
                                />

                            </div>
                        </>

                    )}

                    {/* Tags */}
                    <div className="post-field post-tags">

                        <label htmlFor="tags">Tags</label>

                        <input
                            id="tags"
                            type="text"
                            placeholder="Enter up to 3 tags, separated by commas"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                        />

                    </div>

                    {/* Messages */}
                    {error && (
                        <p className="post-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p style={{ color: "green" }}>
                            {message}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="post-submit"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Post"}
                    </button>

                </form>

            </main>

            <Footer />
        </>
    );
}

export default NewPost;