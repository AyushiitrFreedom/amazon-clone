const { z } = require("zod");

const RegisterSchema = z.object({
    username: z.string().nonempty("Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, 'Password must be at least 8 characters.')
        .refine((value: string) => /[A-Z]/.test(value), 'Password must contain at least one capital letter.')
        .refine((value: string) => /[a-z]/.test(value), 'Password must contain at least one small letter.')
        .refine((value: string) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\-=/\\|]/.test(value), 'Password must contain at least one special character.')
        .refine((value: string) => /\d/.test(value), 'Password must contain at least one number.'),
    isSeller: z.boolean(),
});

export default RegisterSchema;