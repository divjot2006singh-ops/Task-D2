import { useEffect, useState } from "react";
import { auth } from "../firebase";

function UpgradeModal({ user, onClose, onUpgradeSuccess }) {
const [name, setName] = useState("");
const [email, setEmail] = useState(user?.email || "");
const [cardNumber, setCardNumber] = useState("");
const [expiry, setExpiry] = useState("");
const [cvv, setCvv] = useState("");


const [error, setError] = useState("");
const [processing, setProcessing] = useState(false);

// Close the modal using the Escape key.
useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === "Escape" && !processing) {
            onClose();
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
}, [processing, onClose]);

const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Check authentication.
    if (!user || !auth.currentUser) {
        setError("Please log in before upgrading your subscription.");
        return;
    }

    // Validate name.
    if (!name.trim()) {
        setError("Please enter the name on the card.");
        return;
    }

    // Validate email.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
    }

    // Validate demonstration card number.
    const digits = cardNumber.replace(/\s/g, "");

    if (!/^\d{16}$/.test(digits)) {
        setError("Enter a 16-digit demonstration card number.");
        return;
    }

    // Validate expiry format.
    const expiryMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);

    if (!expiryMatch) {
        setError("Enter the expiry date in MM/YY format.");
        return;
    }

    // Check that the card has not expired.
    const expiryMonth = Number(expiryMatch[1]);
    const expiryYear = 2000 + Number(expiryMatch[2]);
    const now = new Date();

    if (
        expiryYear < now.getFullYear() ||
        (
            expiryYear === now.getFullYear() &&
            expiryMonth < now.getMonth() + 1
        )
    ) {
        setError("Please enter a future expiry date.");
        return;
    }

    // Validate demonstration security code.
    if (!/^\d{3,4}$/.test(cvv)) {
        setError("Enter a 3- or 4-digit demonstration security code.");
        return;
    }

    setProcessing(true);

    try {
        const currentUser = auth.currentUser;
        const token = await currentUser.getIdToken();

        // Send upgrade request to the Express backend.
        const response = await fetch("http://localhost:5000/api/upgrade", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to upgrade subscription."
            );
        }

        // Clear demonstration payment details.
        setCardNumber("");
        setExpiry("");
        setCvv("");

        // Refresh subscription information in Pricing.jsx.
        await onUpgradeSuccess();

    } catch (err) {
        console.error("Subscription upgrade failed:", err);

        setError(
            err.message ||
            "Unable to upgrade your subscription. Please try again."
        );
    } finally {
        setProcessing(false);
    }
};

return (
    <div
        className="upgrade-overlay"
        onMouseDown={(event) => {
            if (
                event.target === event.currentTarget &&
                !processing
            ) {
                onClose();
            }
        }}
    >
        <section
            className="upgrade-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
        >
            <button
                type="button"
                className="upgrade-close"
                onClick={onClose}
                disabled={processing}
                aria-label="Close payment form"
            >
                ×
            </button>

            <h2 id="upgrade-modal-title">
                Upgrade to Paid
            </h2>

            <p className="upgrade-description">
                Complete this demonstration form to activate your
                Paid subscription. No real payment will be processed.
            </p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="upgrade-name">
                    Name on card
                </label>

                <input
                    id="upgrade-name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />

                <label htmlFor="upgrade-email">
                    Email address
                </label>

                <input
                    id="upgrade-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="upgrade-card">
                    Demonstration card number
                </label>

                <input
                    id="upgrade-card"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Enter 16 digits"
                    maxLength={16}
                    value={cardNumber}
                    onChange={(event) =>
                        setCardNumber(
                            event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16)
                        )
                    }
                    required
                />

                <div className="upgrade-card-row">
                    <div>
                        <label htmlFor="upgrade-expiry">
                            Expiry date
                        </label>

                        <input
                            id="upgrade-expiry"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={expiry}
                            onChange={(event) => {
                                const digits = event.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 4);

                                setExpiry(
                                    digits.length > 2
                                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                                        : digits
                                );
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="upgrade-cvv">
                            Security code
                        </label>

                        <input
                            id="upgrade-cvv"
                            type="password"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="3–4 digits"
                            maxLength={4}
                            value={cvv}
                            onChange={(event) =>
                                setCvv(
                                    event.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 4)
                                )
                            }
                            required
                        />
                    </div>
                </div>

                {error && (
                    <p className="upgrade-error" role="alert">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="pricing-button upgrade-button"
                    disabled={processing}
                >
                    {processing
                        ? "Activating subscription..."
                        : "Confirm Upgrade"}
                </button>
            </form>

            <p className="upgrade-security-note">
                Demonstration only. Do not enter real payment details.
                Card information is not saved.
            </p>
        </section>
    </div>
);


}

export default UpgradeModal;
