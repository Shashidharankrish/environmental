export interface LoginResponse {
    token: string;
}
export interface DecodedToken {
    exp: Date;
    iat: Date;
    iss: string;
    sub: string;
}
