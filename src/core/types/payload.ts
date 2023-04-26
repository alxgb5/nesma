export interface JwtPayload {
  id: number;
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

export interface TokenResponse {
  accesToken: string;
  refreshToken: string;
}
