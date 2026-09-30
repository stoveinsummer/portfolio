declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    GOOGLE_CALENDAR_CLIENT_ID?: string;
    GOOGLE_CALENDAR_CLIENT_SECRET?: string;
    GOOGLE_CALENDAR_TOKEN_KEY?: string;
    GOOGLE_CALENDAR_REDIRECT_URI?: string;
  }
}
