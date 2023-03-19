declare namespace NodeJS{
    interface ProcessEnv{
        NODE_ENV: "development" | "production" | "test";
        PORT: string;
        DATABASE_URL: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        NEXT_PUBLIC_BASE_URL: string;
              

    }
}