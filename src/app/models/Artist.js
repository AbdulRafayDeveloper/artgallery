import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema(
  {
    artistName: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);