import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn-visible',
  templateUrl: './btn-visible.component.html',
  styleUrls: ['../task-btn.component.scss'],
})
export class BtnVisibleComponent {
  @Input() hidden: boolean;
}
