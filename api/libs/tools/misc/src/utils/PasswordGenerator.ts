import { generate } from 'generate-password';
import { hash, compare } from 'bcryptjs';

export async function compareHash(plaintext: string, hash: string) {
    return compare(plaintext, hash);
}

export async function generateHash(plaintext: string) {
    const hashedCode = await hash(plaintext, 14);
    return hashedCode;
}

export function generatePassword(passwordLength: number) {
    return generate({
        length: passwordLength,
        numbers: true,
        uppercase: true,
        lowercase: true,
        excludeSimilarCharacters: true,
        symbols: false,
        strict: true,
    });
}

export async function generateCodeAndHash(codeLength: number) {
    const code = generate({
        length: codeLength,
        numbers: true,
        uppercase: true,
    });
    const hashedCode = await generateHash(code);
    return { code, hash: hashedCode };
}
