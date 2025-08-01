export type Result<T> = { ok: true; data: T; message?: string } | { ok: false; errors?: string[]; message?: string };
