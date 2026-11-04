import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { db, auth, FieldValue } from "./firebaseAdmin.js";
import verifyUser from "./authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("DEV@Deakin Backend is running!");
});


// SAVE POST API
app.post("/api/posts", verifyUser, async (req, res) => {

    try {

        const {
            postType,
            plan,
            title,
            abstract,
            articleText,
            description,
            tags
        } = req.body;

        // Validate post type
        if (!["Question", "Article"].includes(postType)) {
            return res.status(400).json({
                message: "Invalid post type."
            });
        }

        // Validate subscription plan
        if (!["Free", "Paid"].includes(plan)) {
            return res.status(400).json({
                message: "Invalid subscription plan."
            });
        }

        // Only Paid users can create Paid posts
        if (plan === "Paid" && req.user.subscription !== "Paid") {
            return res.status(403).json({
                message: "Upgrade to Paid to create Paid posts."
            });
        }

        // Validate title
        if (typeof title !== "string" || title.trim().length < 5) {
            return res.status(400).json({
                message: "Title must contain at least 5 characters."
            });
        }

        // Validate tags
        if (
            !Array.isArray(tags) ||
            tags.length === 0 ||
            tags.length > 3 ||
            tags.some(tag => typeof tag !== "string" || !tag.trim())
        ) {
            return res.status(400).json({
                message: "Enter between 1 and 3 valid tags."
            });
        }

        // Validate content
        if (postType === "Article") {

            if (
                typeof abstract !== "string" ||
                !abstract.trim() ||
                typeof articleText !== "string" ||
                !articleText.trim()
            ) {
                return res.status(400).json({
                    message: "Abstract and article text are required."
                });
            }

        }

        if (postType === "Question") {

            if (
                typeof description !== "string" ||
                !description.trim()
            ) {
                return res.status(400).json({
                    message: "Question description is required."
                });
            }

        }

        // Prepare post data
        const postData = {
            postType,
            plan,
            title: title.trim(),
            abstract: abstract || "",
            articleText: articleText || "",
            description: description || "",
            tags: tags.map(tag => tag.trim()),
            uid: req.user.uid,
            author: req.user.name || "Unknown",
            createdAt: FieldValue.serverTimestamp()
        };

        // Save to Firestore
        const postRef = await db.collection("posts").add(postData);

        res.status(201).json({
            success: true,
            message: "Post created successfully!",
            postId: postRef.id
        });

    } catch (error) {

        console.error("Post Error:", error);

        res.status(500).json({
            message: "Failed to create post."
        });

    }

});


// BROWSE POSTS API
app.get("/api/posts", async (req, res) => {

    try {

        let userPlan = "Free";

        const authHeader = req.headers.authorization;

        // Check if user is logged in
        if (authHeader && authHeader.startsWith("Bearer ")) {

            const token = authHeader.split(" ")[1];

            // Verify Firebase token
            const decodedToken = await auth.verifyIdToken(token);

            // Get user's subscription plan
            const userDoc = await db
                .collection("users")
                .doc(decodedToken.uid)
                .get();

            if (userDoc.exists) {
                userPlan = userDoc.data().subscription || "Free";
            }

        }

        // Fetch posts according to subscription
        let postsSnapshot;

        if (userPlan === "Paid") {

            // Paid users can see all posts
            postsSnapshot = await db
                .collection("posts")
                .get();

        } else {

            // Visitors and Free users can see Free posts
            postsSnapshot = await db
                .collection("posts")
                .where("plan", "==", "Free")
                .get();

        }

        // Convert Firestore documents into an array
        const posts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort newest posts first
        posts.sort((a, b) => {

            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;

            return dateB - dateA;

        });

        res.status(200).json({
            success: true,
            userPlan,
            totalPosts: posts.length,
            posts
        });

    } catch (error) {

        console.error("Browse Posts Error:", error);

        res.status(401).json({
            message: "Unable to fetch posts. Authentication may have failed."
        });

    }

});


// UPGRADE SUBSCRIPTION API
app.post("/api/upgrade", verifyUser, async (req, res) => {
    try {
        const userRef = db.collection("users").doc(req.user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: "User profile not found."
            });
        }

        const currentSubscription =
            userDoc.data().subscription || "Free";

        if (currentSubscription === "Paid") {
            return res.status(400).json({
                message: "You already have a Paid subscription."
            });
        }

        await userRef.update({
            subscription: "Paid",
            subscriptionUpdatedAt: FieldValue.serverTimestamp()
        });

        res.status(200).json({
            success: true,
            message: "Subscription upgraded successfully."
        });

    } catch (error) {
        console.error("Upgrade Error:", error);

        res.status(500).json({
            message: "Unable to upgrade subscription."
        });
    }
});


// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});