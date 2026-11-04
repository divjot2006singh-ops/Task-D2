import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../Auth.css";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Create account in Firebase Authentication
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Save user details in Firestore
            await setDoc(doc(db, "users", result.user.uid), {
                name: name.trim(),
                email: result.user.email,
                uid: result.user.uid,
                subscription: "Free",
                createdAt: new Date()
            });

            alert("Account created successfully!");
            navigate("/login");

        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Sign up to get started</p>

                <form className="auth-form" onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <button className="auth-button" type="submit">
                        Sign Up
                    </button>
                </form>

                <p className="auth-text">
                    Already have an account?{" "}
                    <Link className="auth-link" to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;