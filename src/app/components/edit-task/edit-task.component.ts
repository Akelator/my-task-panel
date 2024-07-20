import { Component, computed, Signal } from '@angular/core';
import { PanelTask } from 'src/app/model/task.mode';
import { PanelService } from 'src/app/service/panel.service';

@Component({
  selector: 'edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent {
  active: boolean = false;

  task: PanelTask;

  constructor(private service: PanelService) {}

  get valid(): Signal<boolean> {
    return computed(() => !!this.task?.name?.length);
  }

  onOpen(task: PanelTask): void {
    this.task = JSON.parse(JSON.stringify(task));
    this.onToggle(true);
  }

  onToggle(active: boolean): void {
    this.active = active;
  }

  onEditTask(): void {
    if (!this.valid()) return;
    else {
      const _task: PanelTask = this.service.tasks().find(({ code }: PanelTask) => code === this.task.code);
      _task.name = this.task.name;
      this.service.updateTasks();
      this.onToggle(false);
    }
  }
}
