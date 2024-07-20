import { Component, computed, Signal } from '@angular/core';
import { PanelService } from 'src/app/service/panel.service';

@Component({
  selector: 'new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  active: boolean = false;

  link: string = '';
  name: string = '';

  constructor(private service: PanelService) {}

  get invalidLink(): Signal<boolean> {
    return computed(() => !this.service.validLink(this.link));
  }

  get valid(): Signal<boolean> {
    return computed(() => {
      const inputValid: boolean = !!this.link?.length && !!this.name?.length;
      return inputValid && !this.invalidLink();
    });
  }

  onToggle(active: boolean): void {
    this.active = active;
  }

  onAddTask(): void {
    if (!this.valid()) return;
    else {
      const created: boolean = this.service.tryAddTask(this.link, this.name);
      if (!created) return;
      this.clearDialog();
    }
  }

  clearDialog(): void {
    this.link = '';
    this.name = '';
  }
}
