import React, { useState }  from 'react';
import TableToolbar         from '../../components/TableToolbar';
import PaginatedTable       from '../../components/PaginatedTable';
import AddOrderModal        from './AddOrderModal';
import SearchSelect, { Option } from '../../components/SearchSelect';
import { query, remove }    from '../../utils/storage';
import { Order }            from './types';
import { daysUntil }        from '../../utils/daysUntil';
import { FiTrash2 }         from 'react-icons/fi';

export default function OrdersPage() {
  /* ---------- search ---------- */
  const [search, setSearch] = useState('');

  /* ---------- add-order modal ---------- */
  const [showAdd, setShowAdd] = useState(false);

  /* ---------- filter – currency ---------- */
  const curSet      = new Set(query<Order>('orders').map(o => o.currency));
  const curOptions: Option[] = [{ value: '', label: 'All' },
                                ...[...curSet].map(c => ({ value: c, label: c }))];
  const [currency, setCurrency] = useState('');

  /* ---------- filter – supplier ---------- */
  const suppSet     = new Set(query<Order>('orders').map(o => o.supplier));
  const suppOptions: Option[] = [{ value: '', label: 'All' },
                                 ...[...suppSet].map(s => ({ value: s, label: s }))];
  const [supplier, setSupplier] = useState('');

  /* ---------- filtered data ---------- */
  const orders = query<Order>('orders')
    .filter(o => (!currency || o.currency === currency))
    .filter(o => (!supplier || o.supplier === supplier))
    .filter(o => o.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <TableToolbar
        title="Orders"
        search={{ value: search, onChange: setSearch, placeholder: 'Search orders' }}
        combinedFilters={{
          extra: [
            {
              label: 'Currency',
              control: (
                <SearchSelect
                  value={currency}
                  onChange={setCurrency}
                  options={curOptions}
                />
              )
            },
            {
              label: 'Supplier',
              control: (
                <SearchSelect
                  value={supplier}
                  onChange={setSupplier}
                  options={suppOptions}
                />
              )
            }
          ]
        }}
        onAdd={() => setShowAdd(true)}
        addLabel="Add Order"
      />

      <PaginatedTable
        data={orders}
        cols={[
          { key: 'product', header: 'Products'    },
          { key: 'value',   header: 'Order Value' },
          { key: 'qty',     header: 'Quantity'    },
          { key: 'id',      header: 'Order ID'    },
          {
            key   : 'delivery',
            header: 'Expected Delivery',
            render: o => {
              const d    = (o as Order).delivery;
              const days = daysUntil(d);
              return days >= 0
                ? `In ${days} day${days !== 1 ? 's' : ''}`
                : `${Math.abs(days)} day${days !== -1 ? 's' : ''} ago`;
            }
          },
          /* delete ------------------------------------------------------- */
          {
            key: 'del',
            header: '',
            render: o => (
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  if (confirm('Delete this order?')) {
                    remove('orders', (o as Order).id);
                  }
                }}
              >
                <FiTrash2 size={18} color="#d32f2f" />
              </button>
            )
          }
        ]}
      />

      <AddOrderModal open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}
