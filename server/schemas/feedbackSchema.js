const { z } = require("zod");

const feedbackSchema = z.object({
  complaint_id: z.number().min(1, "complaint_id is required"),
  user_id: z.number().min(1, "user_id is required"),
  assigned_personnel_id: z.number().min(1, "assigned_personnel_id is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

module.exports = { feedbackSchema };