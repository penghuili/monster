import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ProjectService } from '@app/core';
import { Project } from '@app/model';
import { ALL, Unsub } from '@app/static';

import { InputControl } from '../../input/input-control';

@Component({
  selector: 'monster-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectListComponent extends Unsub implements OnInit {
  @Input() activeProject: Project;
  @Input() showAll = true;
  @Output() selected = new EventEmitter<Project>();

  projects: Project[];
  control = new InputControl('');
  isAdding = false;

  constructor(private projectService: ProjectService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.projectService.getAll().subscribe(data => {
        this.projects = this.showAll ? data : data.filter(a => a.id !== ALL.id);
      })
    );
  }

  onSelect(project: Project) {
    this.projectService.updateCurrent(project);
    this.selected.emit(project);
  }
  onShowInput() {
    this.isAdding = true;
  }
  onCreate() {
    const data: Project = { title: this.control.getValue().trim() };
    this.projectService.create(data);
    this.isAdding = false;
  }
}
