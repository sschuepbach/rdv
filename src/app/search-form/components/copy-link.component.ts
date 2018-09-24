import { Component, Input } from '@angular/core';

declare var LZString: any;

@Component({
  selector: 'app-copy-link',
  template: `
    <button [ngClass]="{'p-1': small}" class="btn btn-primary fa fa-link"
            ngxClipboard
            [cbContent]="generateQueryLink(data, mode)">
    </button>
  `
})
export class CopyLinkComponent {

  @Input() baseUrl;
  @Input() data;
  @Input() mode = 'search';
  @Input() small = false;

  generateQueryLink(jsonObject, mode): string {
    const jsonString = JSON.stringify(jsonObject);
    const lzString = LZString.compressToEncodedURIComponent(jsonString);
    return this.baseUrl + "/search?" + mode + "=" + lzString;
  }

}
