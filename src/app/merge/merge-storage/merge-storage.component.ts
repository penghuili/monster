import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { mergeItems } from '../../model/item';
import { Project } from '../../model/project';
import { Todo } from '../../model/todo';
import { MonsterStorage } from '../../model/utils';
import { InputControl } from '../../shared/input/input-control';
import { ProjectService } from '../../todo/services/project.service';
import { TodoService } from '../../todo/services/todo.service';

@Component({
  templateUrl: './merge-storage.component.html',
  styleUrls: ['./merge-storage.component.scss']
})
export class MergeStorageComponent {
  inProgressControl = new InputControl('');
  doneRecentlyControl = new InputControl('');
  projectsControl = new InputControl('');

  inProgressHasError = false;
  doneRecentlyHasError = false;
  projectsHasError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
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
      const merged = mergeItems(incomeArr, sourceArr);
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
      const merged = mergeItems(incomeArr, sourceArr);
      this.todoService.updateDoneRecently(merged);

      this.router.navigate([ '../' ], { relativeTo: this.route });
    }
  }
  onMergeProjects() {
    const income = this.projectsControl.getValue();
    if (income) {
      let incomeArr: Project[];
      let sourceArr: Project[];
      try {
        incomeArr = JSON.parse(income);
      } catch (e) {
        this.projectsHasError = true;
        return;
      }
      this.projectsHasError = false;
      sourceArr = MonsterStorage.get('projects');
      const merged = mergeItems(incomeArr, sourceArr);
      this.projectService.updateProjects(merged);

      this.router.navigate([ '../' ], { relativeTo: this.route });
    }
  }
}
