// server/models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure usernames are unique
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce a minimum password length
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// --- Mongoose Middleware (Pre-save hook) ---
// This runs BEFORE a user document is saved to the database
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt (random string) to combine with the password
    const salt = await bcrypt.genSalt(10); // 10 is the cost factor for hashing
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save the user
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

// --- Instance Method (for comparing passwords) ---
// This method can be called on a user document (e.g., user.matchPassword('plainTextPass'))
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the entered plaintext password with the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
