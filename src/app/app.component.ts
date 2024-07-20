import { PanelFilter, PanelTask, TaskSort, TaskState } from 'src/app/model/task.mode';
import { Component, computed, Signal, ViewChild } from '@angular/core';

import { NewTaskComponent } from './components/new-task/new-task.component';
import { PanelService } from './service/panel.service';
import { FilterService } from './service/filter.service';
import { EditTaskComponent } from './components/edit-task/edit-task.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(NewTaskComponent) newTaskDialog: NewTaskComponent;
  @ViewChild(EditTaskComponent) editTaskDialog: EditTaskComponent;

  constructor(private service: PanelService, private filterService: FilterService) {}

  get filters(): Signal<PanelFilter[]> {
    return computed(() => this.filterService.filters());
  }

  onSortByState(): void {
    this.service.sortTasks();
  }

  onDownloadTasks(): void {
    this.service.exportJSON();
  }

  onUploadTasks(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const tasks: PanelTask[] = JSON.parse(e.target!.result as string);
          this.service.updateTasks(tasks);
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  }

  onFilter(filter: PanelFilter): void {
    filter.visible = !filter.visible;
    this.filterService.updateFilters();
  }

  onOpenNewTaskDialog(): void {
    this.newTaskDialog.onToggle(true);
  }

  onEditTask(task: PanelTask): void {
    this.editTaskDialog.onOpen(task);
  }

  onClearRemovedTasks(): void {
    if (!this.removedAreVisible()) return;
    this.onFilter(this.filters()[5]);
    setTimeout(() => {
      const tasks: PanelTask[] = this.service.tasks().filter(({ state }: PanelTask) => state !== TaskState.REMOVE);
      this.service.updateTasks(tasks);
    }, 300);
  }

  get removedAreVisible(): Signal<boolean> {
    return computed(() => {
      const onFilters: boolean = this.filters()[5].visible;
      const atLeastOne: boolean = this.service.tasks().some(({ state }: PanelTask) => state === TaskState.REMOVE);
      return onFilters && atLeastOne;
    });
  }

  count(taskState: TaskState): number {
    const tasks: PanelTask[] = this.service.tasks().filter(({ state }: PanelTask) => state === taskState);
    return tasks?.length || 0;
  }

  countRemoved(): number {
    return this.count(TaskState.REMOVE);
  }
}
