export interface Basket {
  id: number;
  name: string;
  records: string[];
  queryParams: {
    rows: number;
    start: number;
    sortField: string;
    sortDir: string;
  };
}
