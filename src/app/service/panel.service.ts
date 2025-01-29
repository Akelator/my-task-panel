import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

import { PanelTask, Priority, STORE_ID, TaskSort, TaskState } from '../model/task.mode';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  private _panelId = new BehaviorSubject<string>('MY_TASKS');
  panelId: Signal<string>;

  private _tasks = new BehaviorSubject<PanelTask[]>([]);
  tasks: Signal<PanelTask[]>;

  storeId: string = `${STORE_ID}-tasks`;

  constructor() {
    this.tasks = toSignal(this._tasks.asObservable(), { initialValue: [] });
    this.panelId = toSignal(this._panelId.asObservable(), { initialValue: 'MY_TASKS' });
    this.retrieveStorage();
    this.retrievePanelId();
  }

  tryAddTask(link: string, name: string): boolean {
    if (!link?.length || !name?.length) return false;
    const code: string = this.getCodeFromLink(link);
    if (!code?.length) return false;
    this.addTask(link, code, name);
    return true;
  }

  private addTask(link: string, code: string, name: string): void {
    const tasks: PanelTask[] = this._tasks.value || [];
    const newTask: PanelTask = { link, code, name, state: TaskState.NEW, priority: Priority.LOW };
    const newTasks: PanelTask[] = [newTask, ...tasks];
    this.updateTasks(newTasks);
  }

  getCodeFromLink(link: string): string {
    const splits: string[] = link.split('/');
    if (splits?.length < 2) return undefined;
    if (!splits[0].includes('https:')) return undefined;
    const code = splits[splits.length - 1];
    const exists: boolean = this.checkTaskExists(code);
    return exists ? undefined : code;
  }

  validLink(link: string): boolean {
    if (!link?.length) return true;
    const splits: string[] = link.split('/');
    if (splits?.length < 2) return true;
    if (!splits[0].includes('https:')) return false;
    const code = splits[splits.length - 1];
    return !this.checkTaskExists(code);
  }

  checkTaskExists(taskCode: string): boolean {
    const tasks: PanelTask[] = this._tasks.value || [];
    return tasks.some(({ code }: PanelTask) => code === taskCode);
  }

  removeTask(taskCode: string): void {
    const tasks: PanelTask[] = this._tasks.value || [];
    const newTasks: PanelTask[] = tasks.filter(({ code }: PanelTask) => code !== taskCode);
    this.updateTasks(newTasks);
  }

  updateTasks(tasks: PanelTask[] = this.tasks()): void {
    this.updateStorage(tasks);
    this._tasks.next(tasks);
  }

  updatePanelId(panelId: string): void {
    localStorage.setItem(`${this.storeId}-panel-id`, panelId);
    this._panelId.next(panelId);
  }

  private retrievePanelId(): void {
    const value: string = localStorage.getItem(`${this.storeId}-panel-id`);
    if (!value?.length) return;
    this._panelId.next(value);
  }

  private updateStorage(tasks: PanelTask[]): void {
    const value: string = JSON.stringify(tasks);
    localStorage.setItem(this.storeId, value);
  }

  private retrieveStorage(): void {
    const value: string = localStorage.getItem(this.storeId);
    if (!value?.length) return;
    const tasks: PanelTask[] = JSON.parse(value);
    if (!tasks) return;
    this._tasks.next(tasks);
  }

  exportJSON(fileName: string): void {
    const tasks: PanelTask[] = this.tasks();
    const data: string = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'data:application/json;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  sortTasks(): void {
    const collator = new Intl.Collator([], { numeric: true });
    this.tasks().sort((a, b) => {
      const aKey: string = Object.keys(TaskSort).find((key: string) => key == a.state);
      const bKey: string = Object.keys(TaskSort).find((key: string) => key == b.state);
      const sA: TaskSort = TaskSort[aKey];
      const sB: TaskSort = TaskSort[bKey];
      const prioA: number = a.priority || Priority.LOW;
      const prioB: number = b.priority || Priority.LOW;
      const scndSort: number = prioA === prioB ? collator.compare(a.code, b.code) : prioA > prioB ? 1 : -1;
      return sA === sB ? scndSort : sA > sB ? 1 : -1;
    });
    this.updateTasks();
  }
}
