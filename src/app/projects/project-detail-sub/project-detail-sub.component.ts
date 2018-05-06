import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { now, Subproject, Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { merge } from 'ramda';
import { debounceTime, first } from 'rxjs/operators';

@Component({
  selector: 'mst-project-detail-sub',
  templateUrl: './project-detail-sub.component.html',
  styleUrls: ['./project-detail-sub.component.scss']
})
export class ProjectDetailSubComponent extends Unsub implements OnInit {
  subproject: Subproject;
  todos: Todo[];
  titleControl = new InputControl('');
  resultControl = new InputControl('');
  hasTitleError = false;
  hasResultError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    const subid = this.route.snapshot.paramMap.get('subid');
    const id = this.route.snapshot.paramMap.get('id');
    this.addSubscription(
      this.projectService.getSubprojectById(subid, id).pipe(
        first()
      ).subscribe(subproject => {
        this.subproject = subproject;
        this.titleControl.setValue(this.subproject.title);
        this.resultControl.setValue(this.subproject.result);
      })
    );

    this.addSubscription(
      this.todoService.getTodosBySubprojectId(subid).subscribe(todos => {
        this.todos = todos;
      })
    );

    this.addSubscription(
      this.titleControl.value$.pipe(
        debounceTime(300)
      ).subscribe(title => {
        this.update({ title });
      })
    );

    this.addSubscription(
      this.resultControl.value$.pipe(
        debounceTime(300)
      ).subscribe(result => {
        this.update({ result });
      })
    );
  }

  onGotoTodo(id: string) {
    this.router.navigateByUrl(`${ROUTES.TODOS}/${id}`);
  }
  onBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private update(data: any) {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();

    if (title && result) {
      this.hasResultError = false;
      this.hasTitleError = false;
      this.subproject = merge(this.subproject, {
        ...data, updatedAt: now()
      });
      this.projectService.updateSubproject(this.subproject);
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }

}
