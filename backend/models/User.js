import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true,
        maxlength: [50, "Name cannot be more than 50 character"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // Don't return password in queries
    },
    role: {
        type: String,
        enum: ["admin", "editor", "viewer"],
        default: "viewer"
    },
    yorubaProficiency: {
        type: String,
        enum: ["beginner", "intermediate", "fluent", "native"],
        default: null
    },
    lastLogin: {
        type: Date,
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now}
});

// Update timestamp before saving
UserSchema.pre("save", function() {
    this.updatedAt = Date.now();
});

// Hash password
UserSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// compare pass
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", UserSchema);

export default User;