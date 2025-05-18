// src/lib/cookie.ts
import { redirect } from 'next/dist/server/api-utils';
import { cookies } from 'next/headers';

export async function getCookieString(): Promise<string> {
    // cookies() trả về RequestCookies, có .getAll()
    const cookieStore = cookies();
    const pairs = (await cookieStore).getAll().map(({ name, value }) => `${name}=${value}`);
    return pairs.join('; ');
}
