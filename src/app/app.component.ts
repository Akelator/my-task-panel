import { Component, computed, Signal, ViewChild } from '@angular/core';
import { PanelFilter, PanelTask, TaskState } from 'src/app/model/task.mode';

import { EditPanelIdComponent } from './components/edit-panel-id/edit-panel-id.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { FilterService } from './service/filter.service';
import { PanelService } from './service/panel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(NewTaskComponent) newTaskDialog: NewTaskComponent;
  @ViewChild(EditTaskComponent) editTaskDialog: EditTaskComponent;
  @ViewChild(EditPanelIdComponent) editPanelIdDialog: EditPanelIdComponent;

  panelIdBttn: PanelFilter = { state: TaskState.PANEL_ID, visible: true, hidden: false, panelId: true };

  get panelId(): Signal<string> {
    return computed(() => this.service.panelId());
  }

  private setPanelId(fileName: string): void {
    if (!fileName?.length) return;
    const panelId: string = fileName.split('.json')[0];
    if (!panelId?.length) return;
    this.service.updatePanelId(panelId);
  }

  constructor(private service: PanelService, private filterService: FilterService) {}

  get filters(): Signal<PanelFilter[]> {
    return computed(() => {
      return this.filterService.filters();
    });
  }

  onSortByState(): void {
    this.service.sortTasks();
  }

  onDownloadTasks(): void {
    this.service.exportJSON(this.panelId());
  }

  onUploadTasks(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const fileName: string = file.name;
      this.setPanelId(fileName);
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
      input.value = '';
    }
  }

  onFilter(filter: PanelFilter): void {
    if (filter.panelId) {
      this.onEditPanelId();
    } else {
      filter.visible = !filter.visible;
      this.filterService.updateFilters();
    }
  }

  onOpenNewTaskDialog(): void {
    this.newTaskDialog.onToggle(true);
  }

  onEditTask(task: PanelTask): void {
    this.editTaskDialog.onOpen(task);
  }

  onEditPanelId(): void {
    this.editPanelIdDialog.onOpen(this.panelId());
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
    if (taskState === TaskState.PANEL_ID) return 1;
    const tasks: PanelTask[] = this.service.tasks().filter(({ state }: PanelTask) => state === taskState);
    return tasks?.length || 0;
  }

  countRemoved(): number {
    return this.count(TaskState.REMOVE);
  }
}
