import { query } from './storage';
import { Branch } from '../features/branches/types';

export const branchOptions = () =>
  query<Branch>('branches').map(b => ({ value: b.id, label: b.name }));
