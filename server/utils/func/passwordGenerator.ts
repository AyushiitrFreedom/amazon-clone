import bcryptjs from "bcryptjs";

export default async function GeneratePassword(pass: string): Promise<string> {
    const salt = await bcryptjs.genSaltSync(10);
    const secPass = await bcryptjs.hash(pass, salt);
    return secPass;
}