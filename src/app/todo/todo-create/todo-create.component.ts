import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TodoService } from '../services/todo.service';

@Component({
  selector: 'monster-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent implements OnInit {
  titleControl = new BehaviorSubject<string>('');
  noteControl = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {}

  ngOnInit() {
  }

  onCreate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    if (title) {
      this.todoService.create({ title, note });
      this.onBack();
    }
  }
  onBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
