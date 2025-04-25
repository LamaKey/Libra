/* ----------------------------------------------------------------------
   very-small “DB” wrapper around localStorage
   -------------------------------------------------------------------- */
   export type TableKey =
   | 'rooms'     | 'scales'   | 'products'
   | 'suppliers' | 'alerts'   | 'orders'
   | 'branches';
 
 /* ---------- internals ---------- */
 function getData<T = unknown>(key: TableKey): T[] {
   const raw = localStorage.getItem(key);
   if (!raw) return [];
   try       { return JSON.parse(raw) as T[]; }
   catch     { console.warn(`Bad JSON for ${key}`); return []; }
 }
 
 function setData<T>(key: TableKey, data: T[]) {
   localStorage.setItem(key, JSON.stringify(data));
 }
 
 /* broadcast a change so React screens can refresh */
 function emitChange(key: TableKey) {
   window.dispatchEvent(new CustomEvent(`${key}-changed`));
 }
 
 /* ---------- public helpers ---------- */
 export function query<T>(key: TableKey) {
   return getData<T>(key);
 }
 
 export function insert<T extends { id: string }>(key: TableKey, record: T) {
   setData(key, [...getData<T>(key), record]);
   emitChange(key);
 }
 
 export function update<T>(key: TableKey, id: string, patch: Partial<T>) {
   const rows = getData<any>(key).map(r => (r.id === id ? { ...r, ...patch } : r));
   setData(key, rows);
   emitChange(key);
 }
 
 /* 💥 FIXED → now notifies listeners too */
 export function remove(key: TableKey, id: string) {
   setData(key, getData<any>(key).filter((r: any) => r.id !== id));
   emitChange(key);                 // <--  this was missing
   window.location.reload();
 }
 