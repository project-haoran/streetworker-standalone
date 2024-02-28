import mongoose, { Schema } from "mongoose";

export const WalletModel = mongoose.model(
  "Wallet",
  new Schema({
    group: Number,
    qq: Number,
    balance: Number,
    bill: [
      {
        change: Number,
        desc: String,
        timestamp: Number,
      },
    ],
  })
);
