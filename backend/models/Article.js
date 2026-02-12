import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    // Bilingual titles
    title: {
        yo: {type: String, required: true, trim: true},
        en: {type: String, required: true, trim: true}
    },

    // Bilingual content
    content: {
        yo: { type: String, required: true },
        en: { type: String, required: true }
    },

    slug: { 
        yo: { type: String, unique: true, lowercase: true, trim: true },
        en: { type: String, unique: true, lowercase: true, trim: true }
    },

    // Categories
    topic: {type: String, rrequired: true, trim: true },
    category: {
        type: String,
        enum: ["physics", "biology", "chemistry", "earth", "technology"],
        required: true
    },

    // Media
    featuredImage: String,
    images: [String],
    audioUrl: String, // For Yoruba pronounciation
    videoUrl: String, // Explanatory videos

    // Metadata
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    readTime: {
        type: Number,
        min: 1,
        default: 5
     },
    tags: [{yo: String, en: String}],

    // Status
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft"
    },

    // view count
    views: {
        type: Number,
        default: 0
    },

    // Dates
    publishedAt: Date,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

// Auto update timestamps
ArticleSchema.pre("save", function() {
    this.updatedAt = Date.now();

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[\u0300-\u036f]/g, "") // keep alphanumeric to characters
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    // Auto generate slug if not provided
    if (this.isModified("title.yo") && !this.slug.yo) {
        this.slug.yo = slugify(this.title.yo);
    }

    if (this.isModified("title.en") && !this.slug.en) {
        this.slug.en = slugify(this.title.en);
    }
});

const Article = mongoose.model("Article", ArticleSchema);

export default Article;