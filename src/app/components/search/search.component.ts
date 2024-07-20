import { Component, computed, ElementRef, Signal, ViewChild } from '@angular/core';
import { FilterService } from 'src/app/service/filter.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @ViewChild('input') input: ElementRef;
  constructor(public filter: FilterService) {}

  get searching(): Signal<boolean> {
    return computed(() => !!this.filter.searchText?.length);
  }

  onClearSearch(): void {
    this.filter.searchText = '';
    this.input.nativeElement.focus();
  }
}
