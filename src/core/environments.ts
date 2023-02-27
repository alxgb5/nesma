export interface IEnvironment {
    DATABASE_URL: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    TOKEN_KEY: string;
    TOKEN_EXPIRATION: string;
}

const EnvironmentData: IEnvironment = {
    DATABASE_URL: process.env.DATABASE_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    TOKEN_KEY: process.env.TOKEN_KEY,
    TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION || '7d',
};

export const Environment = EnvironmentData;
