import * as z from "zod";
import validator from "validator";


export const userAuthSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }), // Email validation
});