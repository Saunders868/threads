import mongoose from "mongoose";
import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, {
    message: "Minimum three characters",
  }),
  accountId: z.custom<mongoose.Schema.Types.ObjectId>(),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, {
    message: "Minimum three characters",
  }),
});
