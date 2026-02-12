import express from "express";
import auth from "../middleware/auth.js"
import User from "../models/User.js";
import Article from "../models/Article.js";
import Topic from "../models/Topic.js";

const router = express.Router();

// /All admin routes require authentication
router.use(auth(["admin"]));

// Get admin dashboard statistics
router.get("/dashboard", async (req, res) => {
    try {
        const [ 
            totalArticles, publishedArticles, draftArticles,
            totalTopics, totalUsers, recentArticles, popularArticles 
        ] = await Promise.all([
            Article.countDocuments(), Article.countDocuments({ status: 'published' }),
            Article.countDocuments({ status: 'draft' }), Topic.countDocuments(),
            User.countDocuments(),
            Article.find({ status: 'published' })
                .sort('-publishedAt')
                .limit(5)
                .populate('author', 'name')
                .select('title.yo title.en views publishedAt'),
            Article.find({ status: 'published' })
                .sort('-views')
                .limit(5)
                .populate('author', 'name')
                .select('title.yo title.en views publishedAt')
        ]);

        res.json({
            success: true, dashboard: {
            stats: {
                totalArticles, publishedArticles, draftArticles,
                totalTopics, totalUsers
            },
            recentArticles, popularArticles
            }
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to load dashboard"
        });
    }
});

// get all articles for admin including draft
router.get("/articles", async (req, res) => {
    try {
        const { page = 1, limit = 20, status, category, author} = req.query;

        let query = {};

        if (status && status !== "all") {
            query.status = status;
        }

        if (category && category !== "all") {
            query.category = category;
        }

        if (author && author !== "all") {
            query.author = author;
        }

        const articles = await Article.find(query)
            .populate("author", "name email")
            .populate("topic", "name.yo name.en")
            .sort("-createdAt")
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

            const total = await Article.countDocuments(query);

            res.json({
                success: true, articles, pagination:{
                    total, pages: Math.ceil(total / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            });
    } catch (error) {
        console.error("Admin get articles error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch articles"
        });
    }
});

// Get single article for admin edit
router.get("/articles/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const article = await Article.findById(id)
            .populate("author", "name email")
            .populate("topic", "name.yo name.en");

            if (!article) {
                return res.status(404).json({
                    success: false,
                    error: "Article not found"
                });
            }

            res.json({
                success: true,
                article
            });
    } catch (error) {
        console.error("Admin get article error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch article"
        });
    }
});

// Update article status (publish/unpuplish)
router.put("/articles/:id/status", async (req, res) => {
    try {
        const {id}= req.params;
        const {status} = req.body;

        if (!["draft", "published", "archived"].includes(status)) {
            return res.status(400).json({
                success: false,
                error: "Invalid status"
            });
        }

        const updateData = {status};

        if (status === "published") {
            updateData.publishedAt = new Date();
        }

        const article = await Article.findByIdAndUpdate(
            id, updateData, {new: true}
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found"
            });
        }

        res.json({
            success: true,
            article,
            message: `Article ${status === "published" ? "published" : status} successfully`
        });
    } catch (error) {
        console.error("Update article status error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update article status"
        });
    }
});

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort("-createdAt");

            res.json({
                success: true,
                users
            });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch users"
        });
    }
});

// Update user role or status
router.put("/users/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {role, isActive} = req.body;

        // Prevent admin from modifying themselves
        if (id === req.user._id.toString() && role !== "admin") {
            return res.status(400).json({
                success: false,
                error: "Cannot change your own role"
            });
        }

        const updateData = {};
        if (role) updateData.role = role;
        if (typeof isActive === "boolean") updateData.isActive = isActive;

        const user = await User.findByIdAndUpdate(
            id, updateData, {new: true}
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.json({
            success: true,
            user, message: "User updated successfully"
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update user"
        });
    }
});

// Initialize admin user if none exists
// (Only works when no admin exists)

router.post("/initialize", async (req, res) => {
    try {
        // Check if any admin exists
        const adminExists = await User.findOne({role: "admin"});

        if (adminExists) {
            return res.status(400).json({
                success: false,
                error: "Admin already exists"
            });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide name, email, and password"
            });
        }

        // Create admin user
        const admin = await User.create({
            name, email, password, role: "admin"
        });

        res.status(201).json({
            success: true, message: "Admin user created successfully",
            user: {
                id: admin._id, name: admin.name, email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Initialize admin error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to initialize admin"
        });
    }
});

export default router;