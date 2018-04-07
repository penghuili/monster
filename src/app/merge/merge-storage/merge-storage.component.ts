import { Component } from '@angular/core';
import { concat } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { newerTodo, Todo } from '../../model/todo';
import { MonsterStorage } from '../../model/utils';

@Component({
  templateUrl: './merge-storage.component.html',
  styleUrls: ['./merge-storage.component.scss']
})
export class MergeStorageComponent {
  inProgressControl = new BehaviorSubject<string>('');
  doneRecentlyControl = new BehaviorSubject<string>('');
  projectsControl = new BehaviorSubject<string>('');

  onMerge(table: string) {
    const income = this.inProgressControl.getValue();
    if (income) {
      const incomeArr: Todo[] = JSON.parse(income);
      const sourceArr: Todo[] = MonsterStorage.get(table);
      const incomeLen = incomeArr.length;
      const sourceLen = sourceArr.length;
      let merged = [];
      let short: Todo[];
      let long: Todo[];
      let extra: Todo[];
      if (incomeLen < sourceLen) {
        short = incomeArr;
        long = sourceArr;
        extra = sourceArr.slice(incomeLen);
      } else {
        short = sourceArr;
        long = incomeArr;
        extra = incomeArr.slice(sourceLen);
      }
      short.forEach((a, i) => {
        const b = long[i];
        merged.push(newerTodo(a, b));
      });
      merged = concat(merged, extra);

      MonsterStorage.set(table, merged);
    }
  }
}
