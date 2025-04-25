import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const LINKS = [
  { to:'/dashboard',   label:'Dashboard'          },
  { to:'/rooms',       label:'Manage Store Rooms' },
  { to:'/inventory',   label:'Inventory'          },
  { to:'/suppliers',   label:'Suppliers'          },
  { to:'/alerts',      label:'Alerts'             },
  { to:'/orders',      label:'Orders'             },
  { to:'/branches',    label:'Manage Branch'      },
  { to:'/calibration', label:'Calibration'        },
  { to:'/simulation', label:'Simulation'        }    // ← NEW
  
];

export function Sidebar(){
  return(
    <aside className={styles.sidebar}>
      <div className={styles.logo}>LIBRA</div>
      <nav>
        {LINKS.map(l=>(
          <NavLink key={l.to}
            to={l.to}
            className={({isActive})=>
              isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
