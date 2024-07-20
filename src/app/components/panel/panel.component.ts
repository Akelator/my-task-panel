import { FilterService } from './../../service/filter.service';
import { Component, computed, EventEmitter, Output, Signal } from '@angular/core';
import { PanelFilter, PanelTask, TaskSort } from 'src/app/model/task.mode';
import { PanelService } from 'src/app/service/panel.service';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  @Output() editTask = new EventEmitter<PanelTask>();
  constructor(private service: PanelService, private filterService: FilterService) {}

  get tasks(): Signal<PanelTask[]> {
    return computed(() => this.service.tasks());
  }

  get filters(): Signal<PanelFilter[]> {
    return computed(() => this.filterService.filters());
  }

  get search(): Signal<string> {
    return computed(() => this.filterService.searchText?.toLowerCase());
  }

  visible(task: PanelTask): boolean {
    const filter: PanelFilter = this.filters().find(({ state }: PanelFilter) => state === task.state);
    const isVisible: boolean = filter.visible;
    if (!isVisible) return false;
    if (!this.search()) return true;
    const matchName: boolean = task.name.toLowerCase().includes(this.search());
    const matchCode: boolean = task.code.toLowerCase().includes(this.search());
    return matchName || matchCode;
  }

  onEditTask(task: PanelTask): void {
    this.editTask.emit(task);
  }
}
