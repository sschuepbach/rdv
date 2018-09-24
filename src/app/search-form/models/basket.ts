export class Basket {
  name: string;
  ids: string[];
  queryParams = {
    "rows": 0,
    "start": 0,
    "sortField": "",
    "sortDir": ""
  };

  constructor(name: string, sortField: string, sortDir: string, rows: number) {
    this.name = name;
    this.queryParams.sortField = sortField;
    this.queryParams.sortDir = sortDir;
    this.queryParams.rows = rows;
    this.ids = [];
  }
}
