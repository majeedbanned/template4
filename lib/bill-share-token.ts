import crypto from "crypto";
import client from "@/lib/prismadb1";

export interface BillSharePayload {
  pelak: string;
  expDay: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_EXPIRES_SECONDS = 60 * 60 * 24 * 30;
const BASE32_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const EXP_CHARS = 3;
const PELAK_CACHE_MS = 5 * 60 * 1000;

const getSecret = (): string =>
  process.env.BILL_SHARE_SECRET?.trim() ||
  process.env.NEXTAUTH_SECRET?.trim() ||
  "bill-share-secret-change-me";

const getShareLength = (): number => {
  const configured = Number(process.env.BILL_SHARE_CODE_LENGTH || "8");
  if (Number.isNaN(configured)) return 8;
  return Math.min(10, Math.max(8, Math.floor(configured)));
};

const normalizePelak = (pelak: string): string => pelak.trim().toUpperCase();

const toBase32 = (buffer: Buffer): string => {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
};

const encodeNumberBase32Fixed = (value: number, length: number): string => {
  let n = Math.max(0, Math.floor(value));
  let out = "";

  for (let i = 0; i < length; i++) {
    out = BASE32_ALPHABET[n % 32] + out;
    n = Math.floor(n / 32);
  }

  return out;
};

const decodeNumberBase32 = (value: string): number => {
  let result = 0;
  const normalized = value.toUpperCase();

  for (let i = 0; i < normalized.length; i++) {
    const index = BASE32_ALPHABET.indexOf(normalized[i]);
    if (index < 0) return Number.NaN;
    result = result * 32 + index;
  }

  return result;
};

const createSignaturePart = (
  pelak: string,
  expDay: number,
  signatureLength: number,
): string => {
  const signatureInput = `v2|${normalizePelak(pelak)}|${expDay}`;
  const digest = crypto
    .createHmac("sha256", getSecret())
    .update(signatureInput)
    .digest();

  return toBase32(digest).slice(0, signatureLength);
};

let pelakCache:
  | {
      expiresAt: number;
      items: string[];
    }
  | undefined;

const getPelakCandidates = async (): Promise<string[]> => {
  if (pelakCache && pelakCache.expiresAt > Date.now()) {
    return pelakCache.items;
  }

  const stores = await client.store.findMany({
    select: {
      pelak: true,
    },
    take: 10000,
  });

  const items = stores
    .map((item) => item.pelak)
    .filter((value): value is string => !!value)
    .map(normalizePelak);

  pelakCache = {
    expiresAt: Date.now() + PELAK_CACHE_MS,
    items,
  };

  return items;
};

const timingSafeEqualText = (a: string, b: string): boolean => {
  const aBuf = Buffer.from(a.toUpperCase());
  const bBuf = Buffer.from(b.toUpperCase());

  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
};

export const createBillShareToken = (
  pelak: string,
  expiresInSeconds = DEFAULT_EXPIRES_SECONDS,
): string => {
  const totalLength = getShareLength();
  const signatureLength = totalLength - EXP_CHARS;
  const expDay = Math.floor((Date.now() + expiresInSeconds * 1000) / DAY_MS);
  const expPart = encodeNumberBase32Fixed(expDay, EXP_CHARS);
  const signaturePart = createSignaturePart(pelak, expDay, signatureLength);
  return `${expPart}${signaturePart}`;
};

export const verifyAndResolveBillShareToken = async (
  share?: string | null,
): Promise<BillSharePayload | null> => {
  if (!share) return null;

  const normalizedShare = share.trim().toUpperCase();
  if (normalizedShare.length <= EXP_CHARS) return null;

  const expPart = normalizedShare.slice(0, EXP_CHARS);
  const signaturePart = normalizedShare.slice(EXP_CHARS);
  const expDay = decodeNumberBase32(expPart);

  if (!Number.isFinite(expDay)) return null;
  const nowDay = Math.floor(Date.now() / DAY_MS);
  if (expDay < nowDay) return null;

  const pelakCandidates = await getPelakCandidates();

  let matchedPelak: string | null = null;
  for (let i = 0; i < pelakCandidates.length; i++) {
    const pelak = pelakCandidates[i];
    const expectedSignature = createSignaturePart(
      pelak,
      expDay,
      signaturePart.length,
    );

    if (timingSafeEqualText(signaturePart, expectedSignature)) {
      if (matchedPelak && matchedPelak !== pelak) {
        return null;
      }
      matchedPelak = pelak;
    }
  }

  if (!matchedPelak) return null;

  return {
    pelak: matchedPelak,
    expDay,
  };
};

