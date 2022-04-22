import { Credential } from "firebase-admin/app"

export type adminAppConfig = {
    credential: Credential
}

export enum DISCORD_API_ENDPOINTS {
    API_ENDPOINT = "https://discord.com/api/v8",
    CDN = "https://cdn.discordapp.com",
    USER = "https://discord.com/api/v8/users/@me",
    OAUTH2_TOKEN = "https://discord.com/api/v8/oauth2/token",
}