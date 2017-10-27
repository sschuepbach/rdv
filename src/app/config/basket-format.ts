export class BasketFormat {

    //Name der Merkliste
    name: string;

    //Liste der IDs in der Merkliste
    ids: number[];

    //Sortierfeld und Richtung
    sortField: string = "";
    sortDir = "";

    //zu Beginn Suche bei 1. Treffer beginnen
    start: number = 0;

    constructor(name: string, sortField: string, sortDir: string) {

        //Name und Sortierung der Merkliste setzen
        this.name = name;
        this.sortField = sortField;
        this.sortDir = sortDir;

        //Merkliste zu Beginn leer
        this.ids = [];
    }
}