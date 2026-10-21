import {webcrypto} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {hashPassword} from '../worker/index.js';
globalThis.crypto??=webcrypto;
const names=['Техносмарт','Vodafone'];
const users=[];const passwords=[];
for(const login of names){const salt=Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url');const password=Buffer.from(crypto.getRandomValues(new Uint8Array(18))).toString('base64url');users.push({login,salt,hash:await hashPassword(password,salt)});passwords.push({login,password});}
await writeFile('.users-secret.local',JSON.stringify(users),{mode:0o600});
await writeFile('.session-secret.local',Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url'),{mode:0o600});
await writeFile('.passwords.local',JSON.stringify(passwords,null,2),{mode:0o600});
console.log('Створено .users-secret.local, .session-secret.local і .passwords.local. Завантажте секрети за README; паролі передайте двом користувачам особисто.');
