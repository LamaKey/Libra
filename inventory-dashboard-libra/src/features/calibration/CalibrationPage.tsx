import React,{useState} from 'react';
import TableToolbar   from '../../components/TableToolbar';
import PaginatedTable from '../../components/PaginatedTable';
import CalibrateWizard from './CalibrateWizard';
import { query } from '../../utils/storage';
import { Product } from '../products/types';

export default function CalibrationPage(){
  const [search,setSearch] = useState('');
  const [sel,setSel]       = useState<Product>();

  const products = query<Product>('products')
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !(p.crateWeight && p.unitWeight && p.unitsPerCrate));  // needs calibration

  return(
    <>
      <TableToolbar
        title="Calibration"
        search={{value:search,onChange:setSearch,placeholder:'Search product'}}
      />

      <PaginatedTable
        data={products}
        cols={[
          { key:'name', header:'Product' },
          { key:'crateWeight', header:'Crate Weight (g)',
            render:p=>(p as Product).crateWeight ?? '—' },
          { key:'unitWeight',  header:'Unit Weight (g)',
            render:p=>(p as Product).unitWeight ?? '—' },
          { key:'unitsPerCrate', header:'Units / Crate',
            render:p=>(p as Product).unitsPerCrate ?? '—' }
        ]}
        onRowClick={p=>setSel(p as Product)}
      />

      {sel && (
        <CalibrateWizard
          product={sel}
          open={!!sel}
          onClose={()=>setSel(undefined)}
        />
      )}
    </>
  );
}
