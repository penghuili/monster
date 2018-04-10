import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { Project } from '../../model/project';
import { InputControl } from '../../shared/input/input-control';
import { Unsub } from '../../static/class/unsub';
import { ALL } from '../../static/config';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'monster-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectsComponent extends Unsub implements OnInit {
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
      this.projectService.getProjects().subscribe(data => {
        this.projects = this.showAll ? data : data.filter(a => a.id !== ALL.id);
      })
    );
  }

  onSelect(project: Project) {
    this.selected.emit(project);
  }
  onShowInput(e: MouseEvent) {
    e.stopPropagation();
    this.isAdding = true;
  }
  onCreate() {
    const data: Project = { title: this.control.getValue().trim() };
    this.projectService.create(data);
    this.isAdding = false;
  }
}
