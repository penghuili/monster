import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mst-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  @Output() addTodo = new EventEmitter<boolean>();

  onAddTodo() {
    this.addTodo.emit(true);
  }
}
