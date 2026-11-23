import { z } from "zod";

/**
 * Validation schema for public newsletter subscription.
 *
 * Enforces:
 * 1. Email presence and standard RFC format.
 * 2. Automatic normalization: whitespace trimming and lowercase transformation.
 * 3. Length boundary to match database column constraint (VarChar 255).
 * 4. Explicit user consent requirement.
 */
export const SubscribeNewsletterSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .trim()
    .min(1, "Email address is required.")
    .max(255, "Email address must not exceed 255 characters.")
    .email("Please enter a valid email address.")
    .toLowerCase(),
  consent: z
    .boolean({ required_error: "Explicit consent is required to subscribe." })
    .refine((val) => val === true, "Explicit consent is required to subscribe."),
});

export type SubscribeNewsletterInput = z.infer<typeof SubscribeNewsletterSchema>;
