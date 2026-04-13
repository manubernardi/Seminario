import { Injectable, UnauthorizedException } from "@nestjs/common";
import { sign, verify, JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

interface Payload extends JwtPayload {
    legajo: number, 
    exp: number, //Fecha de expiración del token
    rol: string;
    permissions: string[];
}

@Injectable()
export class JwtService{
    constructor(){}

    config = {
        auth: {
            secret: process.env.JWT_SECRET as string,
            expiresIn: process.env.JWT_EXPIRES_IN as string,  
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET as string,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
        },
    };

    generateToken(
        payload: {sub: number, rol: string, permissions: string[]}, 
        type: 'refresh' | 'auth' = 'auth')
        : string{
        
        const secret = this.config[type].secret;
        const options: SignOptions = {
        expiresIn: this.config[type].expiresIn as SignOptions['expiresIn']
    };

    return sign(payload as object, secret, options);
    }

    //Verifica un JWT y devuelve su contenido
    getPayload(token: string, type: 'refresh' | 'auth' = 'auth'): Payload {

    return verify(token, this.config[type].secret) as Payload; // Verifica y decodifica el token con el secreto correspondiente
    }

    //Encripta la contraseña enviada
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    //Compara la contraseña enviada con la encriptada
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
} 