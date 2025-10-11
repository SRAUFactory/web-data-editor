export type Row = Record<string, object>;

export interface SchemaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date';
  options?: string[];
}

export interface Schema {
  fields: SchemaField[];
}
