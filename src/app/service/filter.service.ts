import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

import { PANEL_FILTERS, PanelFilter, STORE_ID } from '../model/task.mode';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _filters = new BehaviorSubject<PanelFilter[]>(PANEL_FILTERS);
  filters: Signal<PanelFilter[]>;

  storeId: string = `${STORE_ID}-filters`;

  private _searchText: string;

  set searchText(value: string) {
    this._searchText = value;
  }

  get searchText(): string {
    return this._searchText;
  }

  constructor() {
    this.filters = toSignal(this._filters.asObservable(), { initialValue: PANEL_FILTERS });
    this.retrieveStorage();
  }

  updateFilters(filters: PanelFilter[] = this.filters()): void {
    this.updateStorage(filters);
    this._filters.next(filters);
  }

  private updateStorage(filters: PanelFilter[]): void {
    const value: string = JSON.stringify(filters);
    localStorage.setItem(this.storeId, value);
  }

  private retrieveStorage(): void {
    const value: string = localStorage.getItem(this.storeId);
    if (!value?.length) return;
    const tasks: PanelFilter[] = JSON.parse(value);
    if (!tasks) return;
    this._filters.next(tasks);
  }
}
