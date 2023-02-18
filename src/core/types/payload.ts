export interface JwtPayload {
    username: string;
    id: string;
    roles: string[];
    mail: string;
    firstname: string;
    lastname?: string;
    imgUrl?: string;
    disabled: boolean;
    iat?: string;
    exp?: string;
}

export interface JwtPayloadWithRt extends JwtPayload {
    refreshToken: string;
}