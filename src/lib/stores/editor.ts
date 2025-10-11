import { writable } from 'svelte/store';
import type { Row, Schema } from '../types';

export const rows = writable<Row[]>([]);
export const schema = writable<Schema>({ fields: [] });
export const selectedIndex = writable<number | null>(null);
export const isFormView = writable<boolean>(false); // modal -> form view toggle
