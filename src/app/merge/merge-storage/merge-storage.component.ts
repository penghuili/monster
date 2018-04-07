import { Component, OnInit } from '@angular/core';
import { concat } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { newerTodo, Todo } from '../../model/todo';
import { MonsterStorage } from '../../model/utils';

@Component({
  templateUrl: './merge-storage.component.html',
  styleUrls: ['./merge-storage.component.scss']
})
export class MergeStorageComponent implements OnInit {
  inProgressControl = new BehaviorSubject<string>('');
  doneRecentlyControl = new BehaviorSubject<string>('');
  projectsControl = new BehaviorSubject<string>('');

  constructor() { }

  ngOnInit() {
  }
  onMergeInProgress() {
    const income = this.inProgressControl.getValue();
    if (income) {
      const incomeArr: Todo[] = JSON.parse(income);
      const sourceArr: Todo[] = MonsterStorage.get('in-progress');
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

      console.log(merged)
    }
  }
  onMergeDoneRecently() {

  }
  onMergeProjects() {

  }
  
}

// {"id":"t1522743807532","createdAt":1522743807532,"title":"testtest","project":{"id":"t1522743443457","title":"Ginmon\n\n","status":0},"note":"","hours":0.5,"status":1,"finishAt":1522782213276,"updatedAt":1522782213276}