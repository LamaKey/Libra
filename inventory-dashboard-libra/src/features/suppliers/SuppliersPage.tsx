import React,{useState} from 'react';
import TableToolbar   from '../../components/TableToolbar';
import PaginatedTable from '../../components/PaginatedTable';
import AddSupplierModal from './AddSupplierModal';
import { query }     from '../../utils/storage';
import { Supplier }  from './types';
import { FiUser }    from 'react-icons/fi';

export default function SuppliersPage(){
  const [search,setSearch]=useState('');
  const [showAdd,setShowAdd]=useState(false);

  const suppliers=query<Supplier>('suppliers')
    .filter(s=>s.name.toLowerCase().includes(search.toLowerCase()));

  return(
    <>
      <TableToolbar
        title="Suppliers"
        search={{value:search,onChange:setSearch,placeholder:'Search supplier'}}
        onAdd={()=>setShowAdd(true)}
        addLabel="Add Supplier"
      />

      <PaginatedTable
        data={suppliers}
        cols={[
          {key:'img',header:'',render:(s:Supplier)=>
              s.img
                ? <img src={s.img} style={{width:32,height:32,borderRadius:16}}/>
                : <FiUser size={28} color="#9e9e9e"/>},
          {key:'name',   header:'Supplier Name'},
          {key:'contact',header:'Contact Number'},
          {key:'email',  header:'Email'}
        ]}
      />

      <AddSupplierModal open={showAdd} onClose={()=>setShowAdd(false)}/>
    </>
  );
}
