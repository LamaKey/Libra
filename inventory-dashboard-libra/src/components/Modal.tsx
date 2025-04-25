import React from 'react';
import styles from './Modal.module.css';
import Button from './Button';

interface Props{
  open:boolean;
  width?:number;
  title:string;
  children:React.ReactNode;

  /* submit */
  onSubmit:()=>void;
  submitLabel?:string;
  submitDisabled?:boolean;

  /* cancel */
  onClose:()=>void;
}
export default function Modal({
  open,width=480,title,children,
  onSubmit,submitLabel='Save',submitDisabled,
  onClose
}:Props){
  if(!open)return null;
  return(
    <div className={styles.overlay}>
      <form
        className={styles.dialog}
        style={{width}}
        onSubmit={e=>{e.preventDefault(); if(!submitDisabled) onSubmit();}}
      >
        <div className={styles.head}>{title}</div>

        <div className={styles.body}>{children}</div>

        <div className={styles.foot}>
          <Button variant="ghost" type="button" onClick={onClose}>Discard</Button>
          <Button type="submit" disabled={submitDisabled}>{submitLabel}</Button>
        </div>
      </form>
    </div>
  );
}
