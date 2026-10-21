export const statuses = ['Прийнято','Діагностика','У ремонті','Очікує запчастин','Готово','Видано'];
export const fields = ['id','createdAt','client','phone','device','serial','issue','status','master','cost','paid','notes','updatedAt','updatedBy','version'];
export function validateRepair(x) {
 for(const k of ['client','phone','device','issue']) if(typeof x[k] !== 'string' || !x[k].trim() || x[k].length>2000) throw new Error('Заповніть клієнта, телефон, пристрій та несправність');
 if(!statuses.includes(x.status)) throw new Error('Невідомий статус');
 for(const k of ['cost','paid']) if(!Number.isFinite(Number(x[k])) || Number(x[k])<0 || Number(x[k])>10000000) throw new Error('Некоректна сума');
 for(const k of ['serial','master','notes']) if(typeof x[k]!=='string'||x[k].length>5000) throw new Error('Некоректне текстове поле');
 return Object.fromEntries(['client','phone','device','serial','issue','status','master','cost','paid','notes'].map(k=>[k,['cost','paid'].includes(k)?Number(x[k]):x[k].trim()]));
}
export function csv(rows){return '\uFEFF'+[fields,...rows.map(r=>fields.map(k=>r[k]??''))].map(row=>row.map(v=>'"'+String(v).replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"').join(';')).join('\r\n');}
