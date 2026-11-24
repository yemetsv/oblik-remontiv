import React from 'react';
import {Printer,X} from 'lucide-react';
const money=value=>new Intl.NumberFormat('uk-UA',{style:'currency',currency:'UAH',minimumFractionDigits:2}).format(Number(value)||0);
const compact=(value,limit)=>String(value||'Не зазначено').length>limit?String(value).slice(0,limit)+'… [повністю в картці]':String(value||'Не зазначено');
export const repairRules=[
 'Пристрій приймається для діагностики та погоджених ремонтних робіт. Заявлену несправність зазначено в цій квитанції.',
 'Обсяг, вартість і орієнтовний строк ремонту погоджуються з клієнтом після діагностики. Додаткові платні роботи потребують окремого погодження.',
 'До передавання пристрою створіть резервну копію важливих даних. Не передавайте паролі від особистих акаунтів; доступ для перевірки погоджується окремо.',
 'Комплектність, зовнішній стан і відомі пошкодження фіксуються в примітках до замовлення. Перевірте їх разом із представником точки.',
 'Про готовність пристрою та зміни щодо ремонту повідомляємо за телефоном, зазначеним у замовленні.',
 'Під час отримання перевірте пристрій і виконані роботи разом із представником точки. Остаточний розрахунок — за погодженою вартістю.',
 'Гарантійні умови на виконані роботи та встановлені деталі зазначаються окремо при видачі. Ця квитанція не є фіскальним чеком.'
];
export default function Receipt({repair,onClose,demo,accountLogin}){
 const receiptShop=['Technosmart','Техносмарт','Vodafone'].includes(accountLogin)?accountLogin:repair.branch;
 const branchName=receiptShop==='Техносмарт'||receiptShop==='Technosmart'?'Technosmart':receiptShop==='Vodafone'?'Vodafone':'';
 const date=new Intl.DateTimeFormat('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Kyiv'}).format(new Date(repair.createdAt));
 const shortened=String(repair.issue||'').length>220||String(repair.notes||'').length>180||[repair.client,repair.device,repair.serial,repair.master].some(v=>String(v||'').length>70);
 return <div className="receipt-overlay" role="dialog" aria-modal="true" aria-label="Квитанція про ремонт"><div className="receipt-toolbar"><span>A5 · горизонтально · дві частини</span><button disabled={!branchName&&!demo} onClick={()=>window.print()}><Printer size={17}/>Друк / PDF</button><button className="secondary" onClick={onClose}><X size={17}/>Закрити</button>{!branchName&&<p className="receipt-warning">Для цього замовлення точку не призначено. Менеджеру потрібно вибрати точку в картці ремонту та зберегти.</p>}{shortened&&<p className="receipt-warning">Довгі поля скорочено для A5 та позначено в документі. Повний текст залишається в картці ремонту.</p>}</div>
 <article className="receipt-paper"><div className="receipt-columns"><div className="receipt-left">
 <div className="receipt-heading"><strong>Магазин: {branchName||'не призначена'}</strong><span>{demo?'ДЕМОНСТРАЦІЙНИЙ ЗРАЗОК':'ПРИЙМАННЯ В РЕМОНТ'}</span></div>
 <h1>Квитанція № {repair.id.slice(0,8).toUpperCase()}</h1><p className="receipt-id">ID: {repair.id}</p>
 <dl className="receipt-details">{[['Прийнято',date],['Статус',repair.status],['Клієнт',compact(repair.client,70)],['Телефон',compact(repair.phone,40)],['Пристрій',compact(repair.device,70)],['IMEI / S/N',compact(repair.serial,70)],['Майстер',compact(repair.master,70)]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
 <section><h2>Заявлена несправність</h2><p className="receipt-text">{compact(repair.issue,220)}</p></section>
 <section><h2>Примітки / виконані роботи</h2><p className="receipt-text">{compact(repair.notes,180)}</p></section>
 <div className="receipt-totals"><div><span>Вартість</span><strong>{money(repair.cost)}</strong></div><div><span>Сплачено</span><strong>{money(repair.paid)}</strong></div><div><span>До сплати</span><strong>{money(Math.max(0,Number(repair.cost)-Number(repair.paid)))}</strong></div>{Number(repair.paid)>Number(repair.cost)&&<div><span>Переплата</span><strong>{money(Number(repair.paid)-Number(repair.cost))}</strong></div>}</div>
 <p className="receipt-note">Дані станом на останнє збереження замовлення.</p>
 </div><div className="receipt-right"><h2 className="rules-title">Правила ремонту</h2><ol className="repair-rules">{repairRules.map(rule=><li key={rule}>{rule}</li>)}</ol><p className="receipt-acknowledgment">Дані замовлення перевірено. З правилами ремонту ознайомлений(-а).</p><div className="receipt-signatures"><div>Клієнт<span>Підпис / ПІБ</span></div><div>Представник точки<span>Підпис / ПІБ</span></div></div><p className="receipt-note">Зберігайте квитанцію до отримання пристрою.</p></div></div></article></div>;
}
