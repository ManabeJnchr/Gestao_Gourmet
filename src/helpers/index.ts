import crypto from 'crypto';

const SECRET = "GESTAOGOURMET-76-AUTH"

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest();
}
