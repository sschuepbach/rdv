import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-export-results-list',
  template: `
    <a *ngIf="showExportListTable"
       class="btn btn-outline-primary text-sm-center px-2 py-1 mr-2"
       [href]="exportListData"
       (click)="exportList(docs)"
       download="export-trefferliste.txt"><i class="fa fa-download"></i> Liste Exportieren</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportResultsListComponent {
  @Input() results: any;

  exportListData;

  private readonly _tableFields = environment.tableFields;

  constructor(private _sanitizer: DomSanitizer) {
  }

  exportList(docs) {
    let dataString = "data:application/octet-stream,";

    // Header hinzufügen
    for (const field of this._tableFields) {
      dataString += encodeURIComponent(field.label) + "%09";
    }
    dataString += "%0A";

    // Daten hinzufügen
    for (const doc of docs) {
      for (const field of this._tableFields) {
        switch (this.getType(doc[field.field])) {
          case 'unset':
            dataString += "ohne%09";
            break;
          case 'single':
            dataString += encodeURIComponent(doc[field.field]) + "%09";
            break;
          case 'multi':
            dataString += encodeURIComponent(doc[field.field].join("; ")) + "%09";
            break;
        }
      }
      dataString += "%0A";
    }

    this.exportListData = this._sanitizer.bypassSecurityTrustUrl(dataString);
  }

  //in Treffertabelle / Merkliste pruefen, ob Wert in Ergebnis-Liste ein Einzelwert, ein Multi-Wert (=Array) oder gar nicht gesetzt ist
  // noinspection JSMethodCanBeStatic
  private getType(obj) {

    //Wert ist nicht gesetzt
    if (!obj) {
      return 'unset';
    } else if (obj.constructor === Array) {
      return "multi";
    } else {
      return "single";
    }
  }
}
