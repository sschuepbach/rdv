export class BasketFormat {

    //Name der Merkliste
    name: string;

    //Liste der IDs in der Merkliste
    ids: string[];

    //Suchparameter fuer Paging und Sortierung (werden über Config gesetzt)
    queryParams = {
        "rows": 0,
        "start": 0,
        "sortField": "",
        "sortDir": ""
    };

    //Constructor zur Erstellung einer neuen Merkliste
    constructor(name: string, sortField: string, sortDir: string, rows: number) {

        //Name und Sortierung der Merkliste setzen
        this.name = name;
        this.queryParams.sortField = sortField;
        this.queryParams.sortDir = sortDir;
        this.queryParams.rows = rows;

        //Merkliste zu Beginn leer
        this.ids = [];
    }
}