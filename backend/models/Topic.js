import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
    name: {
        yo: {
            type: String,
            required: true,
            trim: true
        },
        en: {
            type: String,
            required: true,
            trim: true
        }
    },
    category: {
      type: String,
      enum: ["physics", "biology", "chemistry", "earth", "technology"],
      required: true,
      default: "physics"
    },
    
    description: {
        yo: String,
        en: String
    },
    icon: {
        type: String
    },
    color: {
        type: String,
        default: "#3498db"
    },
    parentTopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic"
  },
  
  articleCount: {
    type: Number,
    default: 0
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  order: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TopicSchema.pre("save", function() {
  this.updatedAt = Date.now();
});

const Topic = mongoose.model("Topic", TopicSchema);

export default Topic;