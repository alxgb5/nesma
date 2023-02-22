export interface JwtPayload {
    id: string;
    roles: string[];
    email: string;
    firstname: string;
    lastname?: string;
    imgUrl?: string;
    enabled: boolean;
    iat?: string;
    exp?: string;
}

export interface JwtPayloadWithRt extends JwtPayload {
    refreshToken: string;
}