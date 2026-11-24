import React,{useState} from 'react';
import {ArrowUpRight} from 'lucide-react';

export default function LoginForm({onSubmit,busy,configured}){
 const [visible,setVisible]=useState(false);
 return <form id="sign-in" className="login-form" method="post" autoComplete="on" onSubmit={onSubmit}>
  <label htmlFor="username">Логін<input id="username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={100} list="account-names" placeholder="Vodafone, Technosmart або Менеджер"/></label>
  <datalist id="account-names"><option value="Vodafone"/><option value="Technosmart"/><option value="Менеджер"/></datalist>
  <label htmlFor="current-password">Пароль<input id="current-password" name="password" required type={visible?'text':'password'} autoComplete="current-password" maxLength={256}/></label>
  <button type="button" className="secondary" aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible?'Приховати пароль':'Показати пароль'}</button>
  <button type="submit" disabled={!configured||busy}>{busy?'Вхід…':'Увійти'} <ArrowUpRight size={18}/></button>
  <p className="password-hint">Після входу виберіть «Зберегти пароль» у браузері. Для іншого акаунта виберіть збережений логін у полі вище.</p>
 </form>;
}
