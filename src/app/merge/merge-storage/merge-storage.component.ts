import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Todo } from '../../model/todo';
import { MonsterStorage } from '../../model/utils';
import { InputControl } from '../../shared/input/input-control';
import { TodoService } from '../../todo/services/todo.service';

@Component({
  templateUrl: './merge-storage.component.html',
  styleUrls: ['./merge-storage.component.scss']
})
export class MergeStorageComponent {
  inProgressControl = new InputControl('');
  doneRecentlyControl = new InputControl('');

  inProgressHasError = false;
  doneRecentlyHasError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {}

  onMergeInProgress() {
    const income = this.inProgressControl.getValue();
    if (income) {
      let incomeArr: Todo[];
      let sourceArr: Todo[];
      try {
        incomeArr = JSON.parse(income);
      } catch (e) {
        this.inProgressHasError = true;
        return;
      }
      this.inProgressHasError = false;
      sourceArr = MonsterStorage.get('in-progress');
      const merged = this.todoService.merge(incomeArr, sourceArr);
      this.todoService.updateInProgress(merged);

      this.router.navigate([ '../' ], { relativeTo: this.route });
    }
  }
  onMergeDoneRecently() {
    const income = this.doneRecentlyControl.getValue();
    if (income) {
      let incomeArr: Todo[];
      let sourceArr: Todo[];
      try {
        incomeArr = JSON.parse(income);
      } catch (e) {
        this.doneRecentlyHasError = true;
        return;
      }
      this.doneRecentlyHasError = false;
      sourceArr = MonsterStorage.get('done-recently');
      const merged = this.todoService.merge(incomeArr, sourceArr);
      this.todoService.updateDoneRecently(merged);

      this.router.navigate([ '../' ], { relativeTo: this.route });
    }
  }
}
