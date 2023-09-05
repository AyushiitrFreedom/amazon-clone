import jsonwebtoken from 'jsonwebtoken';
export default function jwtMaker(props: { id: string }): string {
    const authtoken: string = jsonwebtoken.sign(props, process.env.JWT_SECRET as string);
    return authtoken;
}