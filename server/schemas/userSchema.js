const { z } = require("zod");

const userSchema = z.object({
  name: z.string().min(4).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

module.exports = { userSchema };