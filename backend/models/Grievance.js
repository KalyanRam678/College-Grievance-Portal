const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    userMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    },
    status: {
      type: String,
      default: "Pending"
    },
    updates: [
      {
        note: String,
        date: String,
        updatedBy: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grievance", grievanceSchema);
