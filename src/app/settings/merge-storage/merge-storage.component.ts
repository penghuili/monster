import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { mergeItems, MonsterStorage, Project, Todo } from '@app/model';
import { InputControl } from '@app/shared';

@Component({
  templateUrl: './merge-storage.component.html',
  styleUrls: ['./merge-storage.component.scss']
})
export class MergeStorageComponent implements OnInit {
  inProgressControl = new InputControl('');
  doneRecentlyControl = new InputControl('');
  projectsControl = new InputControl('');

  inProgressHasError = false;
  doneRecentlyHasError = false;
  projectsHasError = false;

  projectsStr: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {}

  ngOnInit() {
    this.projectsStr = JSON.stringify(MonsterStorage.get('projects'));
  }
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