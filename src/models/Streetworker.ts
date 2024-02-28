import mongoose, { Schema } from "mongoose";

export const StreetworkerModel = mongoose.model(
  "Streetworker",
  new Schema({
    group: Number,
    qq: Number,
    notify: Boolean,
    force: Boolean,
    score: {
      type: Number,
      default: 0,
    },
    count: {
      friends: {
        type: Number,
        default: 0,
      },
      others: {
        type: Number,
        default: 0,
      },
    },
    into: [
      {
        ts: Number,
        score: Number,
        others: {
          count: Number,
          score: Number,
        },
        friends: [
          {
            qq: Number,
            score: Number,
          },
        ],
      },
    ],
    out: [
      {
        qq: Number,
        score: Number,
        ts: Number,
      },
    ],
    stats: {
      into: Number,
      out: Number,
    },
    nextTime: Number,
  })
);
