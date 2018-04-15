import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Project } from '@app/model';

@Component({
  selector: 'mst-project-list-picker',
  templateUrl: './project-list-picker.component.html',
  styleUrls: ['./project-list-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectListPickerComponent implements OnInit {
  @Input() activeProject: Project;
  @Input() showAll = true;
  @Output() selected = new EventEmitter<Project>();

  project: Project;
  showList = false;

  ngOnInit() {
    this.project = this.activeProject;
  }

  onOpenList() {
    this.showList = true;
  }
  onSelect(project: Project) {
    this.showList = false;
    this.project = project;
    this.selected.emit(project);
  }
}
