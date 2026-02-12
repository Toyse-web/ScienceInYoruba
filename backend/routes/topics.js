import express from "express";
import Topic from "../models/Topic.js";
import Article from "../models/Article.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all topics
router.get("/", async (req, res) => {
    try {
        const { featured, category } = req.query;

        let query = {};

        if (featured === "true") {
            query.isFeatured = true;
        }

        if (category) {
            // Filter category
            query.category = category;
        }

        // Execute the query with the built filter object
        const topics = await Topic.find(query)
            .sort("order")
            .lean(); // Using lean for better performance
        
            // get article for each topic
            const topicsWithCounts = await Promise.all(
                topics.map(async (topic) => {
                    const count = await Article.countDocuments({
                        topic: topic._id,
                        status: "published"
                    });
                    return { ...topic, articleCount: count};
                })
            );

            res.json({
            success: true,
            count: topicsWithCounts.length,
            topics: topicsWithCounts
        });
    } catch (error) {
        console.error("Get topics error:", error);
        res.status(500).json({
        success: false,
        error: "Failed to fetch topics"
    });
  }
});

// Get single topic by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const topic = await Topic.findById(id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        error: "Topic not found"
      });
    }

    // Get articles for this topic
    const articles = await Article.find({
      topic: topic._id,
      status: "published"
    })
    .sort("-publishedAt")
    .limit(10)
    .populate("author", "name")
    .select("title.yo title.en slug.yo slug.en featuredImage readTime publishedAt");

    res.json({
      success: true,
      topic,
      articles: {
        count: articles.length,
        items: articles
      }
    });
  } catch (error) {
    console.error("Get topic error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch topic"
    });
  }
});

// Get all articles for a topic
router.get("/:id/articles", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const topic = await Topic.findById(id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        error: "Topic not found"
      });
    }

    const articles = await Article.find({
        topic: topic._id,
      status: "published"
    })
    .populate("author", "name")
    .sort("-publishedAt")
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Article.countDocuments({
      topic: topic._id,
      status: "published"
    });

     res.json({
      success: true,
      topic: {
        id: topic._id,
        name: topic.name,
        description: topic.description
      },
      articles: {
        count: articles.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        items: articles
      }
    });
  } catch (error) {
    console.error("Get topic articles error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch topic articles"
    });
  }
});

// Create new topic (Admin only)
router.post("/", auth(["admin"]), async (req, res) => {
    try {
        const topic = await Topic.create(req.body);

        res.status(201).json({
            success: true,
            topic
        });
    } catch (error) {
        console.error("Create topic error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create topic"
        });
    }
});

// Update topic (By admin alone)
router.put("/:id", auth(["admin"]), async (req, res) => {
    try {
        const { id } = req.params;

        const topic = await Topic.findByIdAndUpdate(
            id,
            req.body,
            {new: true, runValidators: true}
        );

        if (!topic) {
            return res.status(404).json({
                success: false,
                error: "Topic not found"
            });
        }

    res.json({
      success: true,
      topic
    });
  } catch (error) {
    console.error("Update topic error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update topic"
    });
  }
});

// delete topic
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if topic has articles
    const articleCount = await Article.countDocuments({ topic: id });
    
    if (articleCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete topic with ${articleCount} articles. Remove articles first or reassign them.`
      });
    }

    const topic = await Topic.findByIdAndDelete(id);

    if (!topic) {
        return res.status(404).json({
            success: false,
            error: "Topic not found"
        });
    }

    res.json({
      success: true,
      message: "Topic deleted successfully"
    });
  } catch (error) {
    console.error("Delete topic error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete topic"
    });
  }
});

// Get article counts for all topics
router.get("/stats/counts", async (req, res) => {
  try {
    const topics = await Topic.find().lean();
    
    const stats = await Promise.all(
      topics.map(async (topic) => {
        const count = await Article.countDocuments({
          topic: topic._id,
          status: "published"
        });
        return {
          topicId: topic._id,
          name: topic.name,
          count
        };
      })
    );

     res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Get topic stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch topic statistics"
    });
  }
});

export default router;