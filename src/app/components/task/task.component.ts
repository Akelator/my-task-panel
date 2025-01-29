import { Component, computed, EventEmitter, Input, Output, Signal } from '@angular/core';
import { PanelTask, Priority, TaskState } from 'src/app/model/task.mode';
import { PanelService } from 'src/app/service/panel.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task: PanelTask;
  @Output() edit = new EventEmitter<void>();

  constructor(private service: PanelService) {}

  get priority(): Signal<Priority> {
    return computed(() => this.task.priority || Priority.LOW);
  }

  get review(): Signal<boolean> {
    return computed(() => this.task.state === TaskState.REVIEW);
  }

  get hidden(): Signal<boolean> {
    return computed(() => this.task.state === TaskState.HIDDEN);
  }

  get removed(): Signal<boolean> {
    return computed(() => this.task.state === TaskState.REMOVE);
  }

  get active(): Signal<boolean> {
    return computed(() => {
      return !this.review() && !this.hidden() && !this.removed();
    });
  }

  onReviewTask(): void {
    this.task.state = this.review() ? TaskState.TODO : TaskState.REVIEW;
    this.service.updateTasks();
  }

  onRemoveTask(): void {
    this.task.state = this.removed() ? TaskState.TODO : TaskState.REMOVE;
    this.service.updateTasks();
  }

  onHideTask(): void {
    this.task.state = this.hidden() ? TaskState.TODO : TaskState.HIDDEN;
    this.service.updateTasks();
  }

  onChangeState(): void {
    const current: TaskState = this.task.state;
    let newState: TaskState = TaskState.TODO;
    if (current === TaskState.TODO) newState = TaskState.PROGRESS;
    else if (current === TaskState.PROGRESS) newState = TaskState.DONE;
    this.task.state = newState;
    this.service.updateTasks();
  }

  onNavigateToTask(): void {
    navigator.clipboard.writeText(this.task.link);
    window.open(this.task.link);
  }

  onClipboard(onlyName?: boolean): void {
    let name: string = `${this.task.code} ${this.task.name}`;
    if (!onlyName) name = `- [${name}](${this.task.link})`;
    navigator.clipboard.writeText(name);
  }

  onClipboardCode(): void {
    navigator.clipboard.writeText(this.task.code);
  }

  onEdit(): void {
    this.edit.emit();
  }

  onChangePriority(): void {
    let newPriority: Priority = Priority.LOW;
    if (this.priority() === Priority.LOW) newPriority = Priority.MID;
    if (this.priority() === Priority.MID) newPriority = Priority.HIG;
    this.task.priority = newPriority;
    this.service.updateTasks();
  }
}
