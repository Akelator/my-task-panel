import { Component, computed, Signal } from '@angular/core';
import { PanelService } from 'src/app/service/panel.service';

@Component({
  selector: 'edit-panel-id',
  templateUrl: './edit-panel-id.component.html',
  styleUrls: ['./edit-panel-id.component.scss'],
})
export class EditPanelIdComponent {
  active: boolean = false;
  panelId: string;

  constructor(private service: PanelService) {}

  get valid(): Signal<boolean> {
    return computed(() => !!this.panelId?.length);
  }

  onOpen(panelId: string): void {
    this.panelId = panelId || '';
    this.onToggle(true);
  }

  onToggle(active: boolean): void {
    this.active = active;
  }

  onEditPanelId(): void {
    if (!this.valid()) return;
    else {
      this.service.updatePanelId(this.panelId);
      this.onToggle(false);
    }
  }
}
