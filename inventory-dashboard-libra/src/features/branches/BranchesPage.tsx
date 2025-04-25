import React, { useState }  from 'react';
import TableToolbar         from '../../components/TableToolbar';
import PaginatedTable       from '../../components/PaginatedTable';
import AddBranchModal       from './AddBranchModal';
import { query, remove }    from '../../utils/storage';
import { Branch }           from './types';
import { FiMapPin, FiTrash2 } from 'react-icons/fi';

export default function BranchesPage() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const branches = query<Branch>('branches')
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <TableToolbar
        title="Manage Branch"
        search={{ value: search, onChange: setSearch, placeholder: 'Search branch' }}
        onAdd={() => setShowAdd(true)}
        addLabel="Add Branch"
      />

      <PaginatedTable
        data={branches}
        cols={[
          /* thumbnail ---------------------------------------------------- */
          {
            key: 'img',
            header: '',
            render: (b: Branch) => (
              <img
                src={b.img || '../../../public/placeholder-wide.jpg.webp'}
                style={{
                  width: 150,
                  height: 70,
                  objectFit: 'cover',
                  borderRadius: 8,
                  background: '#f5f5f5'
                }}
              />
            )
          },
          { key: 'name',    header: 'Store Name' },
          { key: 'address', header: 'Address'    },
          { key: 'street',  header: 'Street'     },
          { key: 'contact', header: 'Contact'    },

          /* delete ------------------------------------------------------- */
          {
            key: 'del',
            header: '',
            render: b => (
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  if (confirm('Delete this branch?')) {
                    remove('branches', (b as Branch).id);
                  }
                }}
              >
                <FiTrash2 size={18} color="#d32f2f" />
              </button>
            )
          }
        ]}
      />

      <AddBranchModal open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}
