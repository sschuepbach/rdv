export class BasketFormat {

    name: string;
    ids: number[];
    sortField: string = "id_int";
    sortDir = "asc";
    start: number = 0;

    constructor(name: string) {
        this.name = name;
        this.ids = [];
    }
}