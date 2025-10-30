import { getEnv } from "../utils/get-env";

export const Env = {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: getEnv("PORT", "8000"),
    MONGODB_URI: getEnv("MONGODB_URI"),
    FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:5173"),
} as const;