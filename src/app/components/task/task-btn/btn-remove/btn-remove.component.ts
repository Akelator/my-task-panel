import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn-remove',
  templateUrl: './btn-remove.component.html',
  styleUrls: ['../task-btn.component.scss'],
})
export class BtnRemoveComponent {
  @Input() removed: boolean;
}
