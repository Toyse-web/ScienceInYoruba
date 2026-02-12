import express from "express";
import Article from "../models/Article.js";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      sort = "-createdAt"
    } = req.query;

    // Build query
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = "published";
    }

    // Filter by category
    if (category && category !== "all") {
      query.$or = [ 
        { category: {$regex: new RegExp(`^${category}$`, "i") }},
        {topic: mongoose.Types.ObjectId.isValid(category) ? category : undefined}
      ].filter(condition => Object.values(condition)[0] !== undefined);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { "title.en": { $regex: search, $options: "i" } },
        { "title.yo": { $regex: search, $options: "i" } },
        { "content.en": { $regex: search, $options: "i" } },
        { "content.yo": { $regex: search, $options: "i" } }
      ];
    }

    // Execute query with pagination
    const articles = await Article.find(query)
      .populate("author", "name email")
      .populate("topic", "name.yo name.en")
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

       // Get total count for pagination
    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      count: articles.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      articles
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch articles"
    });
  }
});

// Get articles by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const articles = await Article.find({ 
      category,
      status: "published"
    })
    .sort("-publishedAt")
    .populate("author", "name")
    .populate("topic", "name.yo name.en");

    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error("Get category articles error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch category articles"
    });
  }
});

// Get latest featured articles
router.get("/featured/latest", async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" })
      .sort("-publishedAt")
      .limit(6)
      .populate("author", "name")
      .populate("topic", "name.yo name.en icon");

    res.json({
      success: true,
      articles
    });
  } catch (error) {
    console.error("Get featured articles error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured articles"
    });
  }
});

// Get single article by ID or slug
router.get("/:identifier", async (req, res) => {
    try {
        const {identifier} = req.params;

        // Try to find by IF first
        let article = await Article.findById(identifier)
            .populate("author", "name email")
            .populate("topic", "name.yo name.en icon color");

            // If not found by ID, try by slug
    if (!article) {
      article = await Article.findOne({
        $or: [
          { "slug.en": identifier },
          { "slug.yo": identifier }
        ]
      })
      .populate("author", "name email")
      .populate("topic", "name.yo name.en icon color");
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found"
      });
    }

    // increment the view count
    article.views++;
    await article.save({validateBeforeSave: false});

    res.json({
        success: true,
        article
    });
    } catch (error) {
        console.error("Get article error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch article"
        });
    }
});

// Create new article (Admin only)
router.post("/", auth(["admin", "editor"]), async (req, res) => {
  try {
    const articleData = req.body;
    
    // Set author to current user
    articleData.author = req.user._id;

    const article = await Article.create(articleData);

    res.status(201).json({
      success: true,
      article
    });
    } catch (error) {
    console.error("Create article error:", error);
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Article with similar title already exists"
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create article"
    });
  }
});

// Update article (Protected)
// @access  Private (Admin/Editor)
router.put("/:id", auth(["admin", "editor"]), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

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
    console.error("Update article error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update article"
    });
  }
});

// Delete article
// Private (Admin only)
router.delete("/:id", auth(["admin"]), async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findByIdAndDelete(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found"
            });
        }

        res.json({
            success: true,
            message: "Article deleted successfully"
        });
    } catch (error) {
        console.error("Delete article error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete article"
        });
    }
});

export default router;