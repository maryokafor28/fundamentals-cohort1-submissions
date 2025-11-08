import { v4 as uuidv4 } from 'uuid';

export function generateReference(prefix = 'FLOW') {
  const date = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  return `${prefix}-${date}-${uuidv4().split('-')[0]}`;
}
