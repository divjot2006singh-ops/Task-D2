import { auth, db } from "./firebaseAdmin.js";

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(token);

        // Get user from Firestore
        const userDoc = await db
            .collection("users")
            .doc(decodedToken.uid)
            .get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        req.user = {
            uid: decodedToken.uid,
            ...userDoc.data()
        };

        next();

    } catch (error) {
        console.error(
            "Authentication Error:",
            error.code,
            error.message
        );

        return res.status(401).json({
            message: "Authentication failed.",
            error: error.message
        });
    }
};

export default verifyUser;