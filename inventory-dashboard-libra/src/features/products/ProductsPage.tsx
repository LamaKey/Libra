import React, { useState }              from 'react';
import { Link }                         from 'react-router-dom';
import TableToolbar                     from '../../components/TableToolbar';
import PaginatedTable                   from '../../components/PaginatedTable';
import AddProductModal                  from './AddProductModal';
import SearchSelect, { Option }         from '../../components/SearchSelect';
import { query }                        from '../../utils/storage';
import { Product }                      from './types';
import { Supplier }                     from '../suppliers/types';
import { Branch }                       from '../branches/types';
import Badge                            from '../../components/Badge';
import { FiTrash2, FiBox }                        from 'react-icons/fi';
import { remove } from '../../utils/storage';
import { recomputeProductQty } from '../../utils/stock';

export default function ProductsPage() {
  /* ---------- search ---------- */
  const [search, setSearch] = useState('');

  /* ---------- filters ---------- */
  const [avail, setAvail] = useState('');
  const [loc,   setLoc]   = useState('');

  const availOpts: Option[] = [
    { value: '',    label: 'All' },
    { value: 'ok',  label: 'In-stock' },
    { value: 'low', label: 'Low stock' },
    { value: 'out', label: 'Out of stock' }
  ];

  /* branch list → filter options */
  const branches  = query<Branch>('branches');
  const locOpts: Option[] = [
    { value: '', label: 'All' },
    ...branches.map(b => ({ value: b.id, label: b.name }))
  ];

  /* ---------- data ---------- */
  const products = query<Product>('products')
    .filter(p => {
      if (avail === 'ok')  return !p.low && p.qty > 0;
      if (avail === 'low') return  p.low && p.qty > 0;
      if (avail === 'out') return  p.qty === 0;
      return true;
    })
    .filter(p => (!loc || p.location === loc))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    products.forEach(p => recomputeProductQty(p.id));

  /* helper: supplier-id → name */
  const supplierMap = Object.fromEntries(
    query<Supplier>('suppliers').map(s => [s.id, s.name])
  );
  /* helper: branch-id → name */
  const branchMap   = Object.fromEntries(
    branches.map(b => [b.id, b.name])
  );

  /* ---------- add-modal ---------- */
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <TableToolbar
        title="Products"
        search={{ value: search, onChange: setSearch, placeholder: 'Search product' }}
        combinedFilters={{
          availability: { value: avail, onChange: setAvail, options: availOpts },
          location:     { value: loc,   onChange: setLoc,   options: locOpts  }
        }}
        onAdd={() => setShowAdd(true)}
        addLabel="Add Product"
      />

      <PaginatedTable
        data={products}
        cols={[
          /* product thumbnail & name -------------------------------------------------- */
          {
            key: 'img',
            header: 'Products',
            render: (p) => (
              <Link
                to={`/inventory/${(p as Product).id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {(p as Product).img ? (
                  <img
                    src={(p as Product).img || '../../../public/placeholder-wide.jpg.webp'}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      objectFit: 'cover'
                    }}
                />
                ) : (
                  <FiBox size={28} color="#9e9e9e" />
                )}
                {(p as Product).name}
              </Link>
            )
          },
          /* price, qty --------------------------------------------------------------- */
          { key: 'price', header: 'Buying Price' },
          { key: 'qty', header: 'Quantity',
            render: (p) => (p as Product).qty },

          /* branch name (instead of id) --------------------------------------------- */
          {
            key: 'location',
            header: 'Location',
            render: (p) => branchMap[(p as Product).location ?? ''] ?? '—'
          },

          /* suppliers list ----------------------------------------------------------- */
          {
            key: 'suppliers',
            header: 'Suppliers',
            render: (p) =>
              (p as Product).suppliers
                .map(id => supplierMap[id] || 'Unknown')
                .join(', ')
          },

          /* availability badge ------------------------------------------------------- */
          {
            key: 'low',
            header: 'Availability',
            render: (p) => {
              const pr   = p as Product;
              const tone = pr.qty === 0 ? 'error'
                        : pr.low       ? 'warning'
                        : 'success';
              const lbl  = pr.qty === 0 ? 'Out of stock'
                        : pr.low       ? 'Low stock'
                        : 'In-stock';
              return <Badge tone={tone}>{lbl}</Badge>;
            }
          },
          {
            key:'del',
            header:'',
            render:(p)=>(
              <button
                style={{background:'none',border:'none',cursor:'pointer'}}
                onClick={()=>{
                  if(confirm('Delete this product?')){
                    remove('products', (p as Product).id);
                  }
                }}
              >
                <FiTrash2 size={18} color="#d32f2f"/>
              </button>
            )
          }
        ]}
      />

      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}
