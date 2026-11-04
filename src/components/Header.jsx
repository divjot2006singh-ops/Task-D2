import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="navbar">
            <Link to="/" className="logo">
                DEV@Deakin
            </Link>

            <input
                type="text"
                placeholder="Search..."
                className="search-bar"
            />

            <div className="nav-links">
                <Link to="/post">Post</Link>
                <Link to="/browse-posts">Browse Posts</Link>
                <Link to="/pricing">Pricing</Link>

                {!loading && (
                    user ? (
                        <>
                            <span>{user.email}</span>
                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )
                )}
            </div>
        </header>
    );
}

export default Header;