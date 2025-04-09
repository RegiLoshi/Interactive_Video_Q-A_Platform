import { z } from "zod";

const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 letters!" }),
    lastName: z.string().min(2, { message: "Last Name must at least 2 letters!" }),
    email: z.string().email({ message: "Invalid email format!" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long!" }),
    confirmPassword: z.string().min(6, { message: "Confirmation password must be at least 6 characters long!" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default signUpSchema;