import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {environment} from '../../../environments/environment';

declare var LZString: any;

@Component({
  selector: 'app-copy-link',
  template: `
    <button [ngClass]="{'p-1': small}" class="btn btn-primary fa fa-link"
            ngxClipboard
            [cbContent]="generateQueryLink(data, mode)">
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyLinkComponent {

  @Input() data;
  @Input() mode = 'search';
  @Input() small = false;

  // noinspection JSMethodCanBeStatic
  generateQueryLink(jsonObject, mode): string {
    const jsonString = JSON.stringify(jsonObject);
    const lzString = LZString.compressToEncodedURIComponent(jsonString);
    return environment.baseUrl + "/search?" + mode + "=" + lzString;
  }

}
