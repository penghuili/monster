import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Project } from '../../model/project';
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
  @Input() current: Project;
  @Input() showAll = true;
  @Output() selected = new EventEmitter<Project>();
  @Output() create = new EventEmitter<Project>();

  projects: Project[];
  control = new BehaviorSubject<string>('');
  isShow = false;
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

  onCreate(e: MouseEvent) {
    e.stopPropagation();
    this.isAdding = true;
  }
  onFinish() {
    const data: Project = { title: this.control.getValue() };
    this.projectService.create(data);
    this.isAdding = false;
  }

  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  onSelect(project: Project) {
    if (!this.current || project.id !== this.current.id) {
      this.selected.emit(project);
    }
  }

}
