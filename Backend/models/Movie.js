const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true
    },
    title: String,
    rating: Number,
    watched: {
      type: Boolean,
      default: false
    },
    
    watchedAt: {
      type: Date,
      default: null
    },

    posterPath: {
      type: String
    },

    backdropPath: String,
    overview: String,
    releaseDate: Date,

    providerName: {
      type: String,
      default: null
    },

    providerLogo: {
      type: String,
      default: null
    },

    providerId: {
      type: Number,
      default: null
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
