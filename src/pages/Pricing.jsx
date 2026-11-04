import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import Header from "../components/Header";
import UpgradeModal from "../components/UpgradeModal";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

function Pricing() {
const { user, loading } = useAuth();

const [subscription, setSubscription] = useState("Free");
const [checkingPlan, setCheckingPlan] = useState(false);
const [showUpgradeModal, setShowUpgradeModal] = useState(false);
const [upgradeMessage, setUpgradeMessage] = useState("");
const [planError, setPlanError] = useState("");

// Retrieve the user's subscription from Firestore.
const refreshSubscription = useCallback(async () => {
    if (!user) {
        setSubscription("Free");
        setPlanError("");
        setCheckingPlan(false);
        return;
    }

    setCheckingPlan(true);
    setPlanError("");

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            throw new Error(
                "Your user profile was not found in Firestore."
            );
        }

        const savedPlan = userSnapshot.data().subscription;

        setSubscription(savedPlan === "Paid" ? "Paid" : "Free");

    } catch (error) {
        console.error("Failed to retrieve subscription:", error);

        setPlanError(
            error.message ||
            "Unable to load your subscription. Please try again."
        );

    } finally {
        setCheckingPlan(false);
    }
}, [user]);

// Load subscription whenever the authenticated user changes.
useEffect(() => {
    if (!loading) {
        refreshSubscription();
    }
}, [loading, refreshSubscription]);

// Free plan features.
const freeFeatures = [
    "Browse community posts",
    "Create standard posts",
    "Basic monthly posting allowance",
    "Standard image upload allowance"
];

// Paid plan features.
const paidFeatures = [
    "Everything included in Free",
    "Increased monthly posting allowance",
    "Enhanced image upload allowance",
    "Paid member status"
];

// Handle Upgrade Plan button.
const handleUpgradeClick = () => {
    setUpgradeMessage("");

    if (loading || checkingPlan || planError) return;

    if (!user) {
        window.location.assign("/login");
        return;
    }

    if (subscription === "Paid") {
        setUpgradeMessage(
            "You already have a Paid subscription."
        );
        return;
    }

    setShowUpgradeModal(true);
};

// Handle successful upgrade.
const handleUpgradeSuccess = async () => {
    setShowUpgradeModal(false);

    await refreshSubscription();

    setUpgradeMessage(
        "Your subscription has been upgraded successfully!"
    );
};

return (
    <>
        <Header />

        <main className="pricing-page">

            <section className="pricing-intro">

                <p className="pricing-eyebrow">
                    DEV@DEAKIN MEMBERSHIP
                </p>

                <h1>Choose Your Plan</h1>

                <p>
                    Choose the subscription that suits your
                    learning and community experience.
                </p>

                {loading ? (
                    <p>Checking your account...</p>
                ) : user ? (
                    <div className="current-plan">
                        <span>Current subscription</span>

                        <strong>
                            {checkingPlan
                                ? "Checking..."
                                : subscription}
                        </strong>
                    </div>
                ) : (
                    <p className="login-notice">
                        <Link to="/login">Log in</Link> to upgrade
                        your subscription.
                    </p>
                )}

                {planError && (
                    <div className="pricing-error" role="alert">
                        <p>{planError}</p>

                        <button
                            type="button"
                            onClick={refreshSubscription}
                            disabled={checkingPlan || loading}
                        >
                            {checkingPlan ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                )}

                {upgradeMessage && (
                    <p className="upgrade-success" role="status">
                        {upgradeMessage}
                    </p>
                )}

            </section>

            <section
                className="pricing-grid"
                aria-label="Subscription plans"
            >

                {/* Free Plan */}
                <article className="pricing-card">

                    <div className="plan-heading">
                        <h2>Free</h2>

                        <p className="plan-description">
                            Get started with DEV@Deakin.
                        </p>

                        <p className="plan-price">
                            $0 <span>/ forever</span>
                        </p>
                    </div>

                    <ul className="plan-features">
                        {freeFeatures.map((feature) => (
                            <li key={feature}>
                                <span aria-hidden="true">✓</span>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="pricing-button secondary-button"
                        disabled
                    >
                        Free Plan
                    </button>

                </article>

                {/* Paid Plan */}
                <article className="pricing-card paid-card">

                    <div className="popular-badge">
                        RECOMMENDED
                    </div>

                    <div className="plan-heading">
                        <h2>Paid</h2>

                        <p className="plan-description">
                            Get more from your community experience.
                        </p>

                        <p className="plan-price">
                            $9.99 <span>/ month</span>
                        </p>
                    </div>

                    <ul className="plan-features">
                        {paidFeatures.map((feature) => (
                            <li key={feature}>
                                <span aria-hidden="true">✓</span>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="pricing-button upgrade-button"
                        onClick={handleUpgradeClick}
                        disabled={
                            loading ||
                            checkingPlan ||
                            Boolean(planError) ||
                            subscription === "Paid"
                        }
                    >
                        {loading
                            ? "Checking account..."
                            : checkingPlan
                                ? "Checking plan..."
                                : subscription === "Paid"
                                    ? "Current Plan"
                                    : user
                                        ? "Upgrade Plan"
                                        : "Log In to Upgrade"}
                    </button>

                </article>

            </section>

            <p className="pricing-disclaimer">
                This subscription interface is for demonstration
                purposes. No real payment is processed.
            </p>

        </main>

        {showUpgradeModal && user && (
            <UpgradeModal
                user={user}
                onClose={() => setShowUpgradeModal(false)}
                onUpgradeSuccess={handleUpgradeSuccess}
            />
        )}

    </>
);


}

export default Pricing;
