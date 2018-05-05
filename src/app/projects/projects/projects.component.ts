import { Component, OnInit } from '@angular/core';
import { ProjectService } from '@app/core';
import { Project } from '@app/model';

@Component({
  selector: 'mst-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
  }

}
