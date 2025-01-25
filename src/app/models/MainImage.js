import mongoose from 'mongoose';

const MainImageSchema = new mongoose.Schema(
  {
    folderPathForImage: {
      type: String,
      trim: true,
    },
    folderNameForImage: {
      type: String,
      trim: true,
    },
    inventoryNumber: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    object: {
      type: {
        type: String,
        trim: true,
        enum: ['Painting', 'Fresco', 'Sculpture', 'Drawing'],
      },
      subjectTitle: {
        type: String,
        trim: true,
      },
      dating: {
        from: {
          type: Number,
        },
        to: {
          type: Number,
        },
      },
      century: {
        type: Number,
      },
      medium: {
        type: String,
        trim: true,
      },
      dimensions: {
        width: {
          type: Number,
        },
        height: {
          type: Number,
        },
      }
    },
    attribution: [
      {
        author: {
          type: String,
          trim: true,
        },
        authorDates: {
          birthYear: {
            type: Number,
          },
          deathYear: {
            type: Number,
          },
          birthCity: {
            type: String,
          },
          deathCity: {
            type: String,
          },
        },
        school: {
          type: String,
          trim: true,
        },
        centuryOfActivity: {
          type: String,
          trim: true,
        },
      },
    ],
    location: {
      lastKnow: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        trim: true,
      },
      dateIn: {
        type: Number,
        trim: true,
      },
    },
    provenance: [
      {
        collectionName: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        yearFrom: {
          type: Number,
          trim: true,
        },
        yearTo: {
          type: Number,
          trim: true,
        },
      },
    ],
    bibliography: [
      {
        authorName: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
        },
        publicationCity: {
          type: String,
          trim: true,
        },
        publicationName: {
          type: String,
          trim: true,
        },
        publicationYear: {
          type: Number,
          trim: true,
        },
        pageNumber: {
          type: Number,
          trim: true,
        },
      },
    ],
    exhibition: [
      {
        institution: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
        },
        exhibitionCity: {
          type: String,
          trim: true,
        },
        exhibitionYear: {
          type: Number,
          trim: true,
        },
      },
    ],
    photographs: [
      {
        images: [String],
        date: {
          type: Date,
        },
        location: {
          type: String,
          trim: true,
        },
        photographerName: {
          type: String,
          trim: true,
        },
      },
    ],
    additionalInformation: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MainImage || mongoose.model('MainImage', MainImageSchema);
