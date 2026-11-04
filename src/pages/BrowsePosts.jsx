import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import "../App.css";

function BrowsePosts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filtering states
    const [search, setSearch] = useState("");
    const [postType, setPostType] = useState("All");
    const [plan, setPlan] = useState("All");
    const [tag, setTag] = useState("");
    const [date, setDate] = useState("");

    // Hide and expand states
    const [hiddenPosts, setHiddenPosts] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState([]);

    const [userPlan, setUserPlan] = useState("Visitor");

    // Fetch posts from backend
    useEffect(() => {

        const fetchPosts = async () => {

            try {

                setLoading(true);
                setError("");

                const user = auth.currentUser;

                const headers = {};

                if (user) {
                    const token = await user.getIdToken();

                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(
                    "http://localhost:5000/api/posts",
                    {
                        method: "GET",
                        headers
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Unable to fetch posts.");
                }

                setPosts(result.posts || []);
                setUserPlan(result.userPlan || "Visitor");

            } catch (err) {

                console.error("Fetch Posts Error:", err);
                setError(err.message);

            } finally {

                setLoading(false);

            }

        };

        fetchPosts();

    }, []);

    // Hide post
    const handleHide = (id) => {

        setHiddenPosts(previous => [...previous, id]);

    };

    // Expand post
    const handleExpand = (id) => {

        setExpandedPosts(previous =>
            previous.includes(id)
                ? previous.filter(postId => postId !== id)
                : [...previous, id]
        );

    };

    // Convert Firestore timestamp into JavaScript Date
    const getPostDate = (createdAt) => {

        if (!createdAt) return null;

        if (typeof createdAt.toDate === "function") {
            return createdAt.toDate();
        }

        if (createdAt._seconds) {
            return new Date(createdAt._seconds * 1000);
        }

        if (createdAt.seconds) {
            return new Date(createdAt.seconds * 1000);
        }

        return null;

    };

    // Reset all filters and hidden posts
    const handleReset = () => {

        setSearch("");
        setPostType("All");
        setPlan("All");
        setTag("");
        setDate("");

        setHiddenPosts([]);
        setExpandedPosts([]);

    };

    // Filter posts
    const filteredPosts = posts.filter(post => {

        const matchesSearch =
            post.title?.toLowerCase().includes(search.toLowerCase()) ||
            post.description?.toLowerCase().includes(search.toLowerCase()) ||
            post.abstract?.toLowerCase().includes(search.toLowerCase());

        const matchesType =
            postType === "All" || post.postType === postType;

        const matchesPlan =
            plan === "All" || post.plan === plan;

        const matchesTag =
            !tag ||
            post.tags?.some(
                item => item.toLowerCase().includes(tag.toLowerCase())
            );

        const postDate = getPostDate(post.createdAt);

        const matchesDate =
            !date ||
            (postDate &&
                postDate.toISOString().slice(0, 10) === date);

        const isVisible = !hiddenPosts.includes(post.id);

        return (
            matchesSearch &&
            matchesType &&
            matchesPlan &&
            matchesTag &&
            matchesDate &&
            isVisible
        );

    });

    return (
        <>
            <Header />

            <main className="browse-container">

                <h2 className="browse-heading">
                    Browse Posts
                </h2>

                <div className="browse-user-info">
                    Your Subscription: <strong>{userPlan}</strong>
                </div>

                {/* Filters */}
                <div className="browse-filters">

                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <select
                        value={postType}
                        onChange={e => setPostType(e.target.value)}
                    >
                        <option value="All">All Post Types</option>
                        <option value="Question">Questions</option>
                        <option value="Article">Articles</option>
                    </select>

                    <select
                        value={plan}
                        onChange={e => setPlan(e.target.value)}
                    >
                        <option value="All">All Plans</option>
                        <option value="Free">Free</option>
                        <option value="Paid">Paid</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by tag..."
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />

                    <button
                        className="browse-reset"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>

                {/* Posts */}
                <div className="browse-post-list">

                    {loading && (
                        <p>Loading posts...</p>
                    )}

                    {error && (
                        <p className="post-error">{error}</p>
                    )}

                    {!loading && !error && filteredPosts.length === 0 && (
                        <p>No posts found.</p>
                    )}

                    {!loading && filteredPosts.map(post => {

                        const isExpanded = expandedPosts.includes(post.id);

                        const postDate = getPostDate(post.createdAt);

                        return (

                            <div className="browse-post-card" key={post.id}>

                                <div className="browse-post-header">

                                    <span className={`post-badge ${post.plan.toLowerCase()}`}>
                                        {post.plan}
                                    </span>

                                    <span className="post-type-badge">
                                        {post.postType}
                                    </span>

                                </div>

                                <h3>{post.title}</h3>

                                <p className="browse-author">
                                    By {post.author || "Unknown"}
                                </p>

                                {postDate && (
                                    <p className="browse-date">
                                        {postDate.toLocaleDateString()}
                                    </p>
                                )}

                                {/* Preview */}
                                <p className="browse-preview">

                                    {post.postType === "Question"
                                        ? post.description
                                        : post.abstract
                                    }

                                </p>

                                {/* Expanded Content */}
                                {isExpanded && (

                                    <div className="browse-full-content">

                                        {post.postType === "Article" ? (

                                            <>
                                                <h4>Abstract</h4>
                                                <p>{post.abstract}</p>

                                                <h4>Article Content</h4>
                                                <p>{post.articleText}</p>
                                            </>

                                        ) : (

                                            <>
                                                <h4>Question Details</h4>
                                                <p>{post.description}</p>
                                            </>

                                        )}

                                    </div>

                                )}

                                {/* Tags */}
                                <div className="browse-tags">

                                    {post.tags?.map((item, index) => (
                                        <span key={index}>
                                            #{item}
                                        </span>
                                    ))}

                                </div>

                                {/* Actions */}
                                <div className="browse-actions">

                                    <button
                                        onClick={() => handleExpand(post.id)}
                                    >
                                        {isExpanded ? "Show Less" : "Read More"}
                                    </button>

                                    <button
                                        onClick={() => handleHide(post.id)}
                                    >
                                        Hide
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

                <p className="browse-total">
                    Showing {filteredPosts.length} posts
                </p>

            </main>

            <Footer />
        </>
    );

}

export default BrowsePosts;