import React,{useState,useRef,useEffect} from 'react';
import styles from './SearchSelect.module.css';

export interface Option{ value:string; label:string; }

export default function SearchSelect({
  value,onChange,options,placeholder='Select…',multi=false
}:{
  value:string|string[]; onChange:(v:any)=>void;
  options:Option[]; placeholder?:string; multi?:boolean;
}){
  const [open,setOpen]=useState(false);
  const [filter,setFilter]=useState('');
  const popRef=useRef<HTMLDivElement>(null);

  /* click-outside closes */
  useEffect(()=>{
    const h=(e:any)=>open&&!popRef.current?.contains(e.target)&&setOpen(false);
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[open]);

  const list=options.filter(o=>o.label.toLowerCase().includes(filter.toLowerCase()));

  const toggle=(v:string)=>{
    if(multi){
      const set=new Set(value as string[]);
      set.has(v)?set.delete(v):set.add(v);
      onChange(Array.from(set));
    }else onChange(v);
  };

  const display=multi
    ? (value as string[]).map(v=>options.find(o=>o.value===v)?.label).join(', ')
    : options.find(o=>o.value===value)?.label;

  return(
    <div className={styles.box} ref={popRef}>
      <button type="button" onClick={()=>setOpen(!open)} className={styles.trigger}>
        {display||placeholder}
        <span className={styles.chev}>▾</span>
      </button>

      {open&&(
        <div className={styles.pop}>
          <input
            autoFocus
            placeholder="Search…"
            value={filter}
            onChange={e=>setFilter(e.target.value)}
          />
          <ul>
            {list.map(o=>(
              <li key={o.value} onClick={()=>{
                toggle(o.value);
                if(!multi) setOpen(false);
              }}>
                {multi&&(
                  <input type="checkbox" readOnly checked={(value as any[]).includes?.(o.value)}/>
                )}
                {o.label}
              </li>
            ))}
            {list.length===0&&<li className={styles.empty}>No match</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
