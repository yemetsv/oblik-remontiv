import {readFile,writeFile} from 'node:fs/promises';
import {hashPassword} from '../worker/index.js';
const users=JSON.parse(await readFile('.users-secret.local','utf8'));
if(users.some(u=>u.login.toLowerCase()==='менеджер')){
 console.log('Менеджер уже існує; пароль та наявні облікові записи не змінено.');
}else{
 const salt=Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url');
 const password=Buffer.from(crypto.getRandomValues(new Uint8Array(18))).toString('base64url');
 users.push({login:'Менеджер',role:'manager',salt,hash:await hashPassword(password,salt)});
 await writeFile('.manager-password.local',JSON.stringify({login:'Менеджер',password},null,2),{mode:0o600});
 await writeFile('.users-secret.local',JSON.stringify(users),{mode:0o600});
 console.log('Менеджера додано. Оновіть USERS_JSON у Cloudflare з .users-secret.local. Пароль — у .manager-password.local. Паролі точок і SESSION_SECRET збережено.');
}
