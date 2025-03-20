import { z } from "zod";

const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 letters!" }),
    lastName: z.string().min(2, { message: "Last Name must at least 2 letters!" }),
    email: z.string().email({ message: "Invalid email format!" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long!" }),
    dateOfBirth: z.coerce.date().refine(
      (date) => date <= new Date(), 
      { message: "Date of birth must be in the past" }
    ),
  });

export default signUpSchema;