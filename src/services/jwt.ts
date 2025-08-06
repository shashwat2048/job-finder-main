import jwt, { JwtPayload } from 'jsonwebtoken'

type Data = {
    id: string
}
export function createToken(data:Data){
    const token = jwt.sign(data, process.env.JWT_SECRET as string);
    return token;
}

export function verifytoken(token: string){
    try{
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        return data as JwtPayload & { id: string };
    }catch(error){
        return null;
    }
}