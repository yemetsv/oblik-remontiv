import React from 'react';
import {Printer,X} from 'lucide-react';
const money=value=>new Intl.NumberFormat('uk-UA',{style:'currency',currency:'UAH',minimumFractionDigits:2}).format(Number(value)||0);
export default function Receipt({repair,onClose,demo}){
 const date=new Intl.DateTimeFormat('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Kyiv'}).format(new Date(repair.createdAt));
 return <div className="receipt-overlay" role="dialog" aria-modal="true" aria-label="Квитанція про ремонт"><div className="receipt-toolbar"><span>Квитанція за збереженими даними</span><button onClick={()=>window.print()}><Printer size={17}/>Друк / PDF</button><button className="secondary" onClick={onClose}><X size={17}/>Закрити</button></div><article className="receipt-paper">
 <div className="receipt-heading"><div><strong>{repair.branch||'Точку не призначено'}</strong><p>Облік ремонтів</p></div><span>{demo?'ДЕМОНСТРАЦІЙНИЙ ЗРАЗОК':'КВИТАНЦІЯ ПРО РЕМОНТ'}</span></div>
 <h1>Квитанція № {repair.id.slice(0,8).toUpperCase()}</h1><p className="receipt-id">Повний номер замовлення: {repair.id}</p>
 <dl className="receipt-details">{[['Дата приймання',date],['Статус',repair.status],['Клієнт',repair.client],['Телефон',repair.phone],['Пристрій / модель',repair.device],['Серійний номер / IMEI',repair.serial||'Не зазначено'],['Майстер',repair.master||'Не зазначено']].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
 <section><h2>Заявлена несправність</h2><p className="receipt-text">{repair.issue}</p></section>
 <section><h2>Примітки / виконані роботи</h2><p className="receipt-text">{repair.notes||'Не зазначено'}</p></section>
 <div className="receipt-totals"><div><span>Вартість</span><strong>{money(repair.cost)}</strong></div><div><span>Сплачено</span><strong>{money(repair.paid)}</strong></div><div><span>До сплати</span><strong>{money(Math.max(0,Number(repair.cost)-Number(repair.paid)))}</strong></div>{Number(repair.paid)>Number(repair.cost)&&<div><span>Переплата</span><strong>{money(Number(repair.paid)-Number(repair.cost))}</strong></div>}</div>
 <p className="receipt-note">Суми та статус наведено станом на останнє збереження замовлення. Квитанція не є фіскальним чеком.</p>
 <div className="receipt-signatures"><div>Представник точки<span>Підпис / ПІБ</span></div><div>Клієнт<span>Підпис / ПІБ</span></div></div>
 </article></div>;
}
