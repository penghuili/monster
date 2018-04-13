import { Component, OnInit } from '@angular/core';
import { TodoService } from '@app/core';

@Component({
  selector: 'monster-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent {
  constructor(private todoService: TodoService) { }

  onProcessTodo() {
    this.todoService.process();
  }
}
