import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private searchTermSource = new BehaviorSubject<string>('');
  private selectedTypeSource = new BehaviorSubject<string>('');

  searchTerm$ = this.searchTermSource.asObservable();
  selectedType$ = this.selectedTypeSource.asObservable();

  setSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }

  setSelectedType(type: string): void {
    this.selectedTypeSource.next(type);
  }
}
