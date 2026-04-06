const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const BASE_URL = isLocal
? "http://127.0.0.1:8000"
: "https://pulseapi-kbnm.onrender.com";