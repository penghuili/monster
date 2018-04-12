import { Component, OnInit } from '@angular/core';
import { MonsterStorage } from '@app/model';

@Component({
  selector: 'monster-copy-storage',
  templateUrl: './copy-storage.component.html',
  styleUrls: ['./copy-storage.component.scss']
})
export class CopyStorageComponent implements OnInit {
  inProgressText: string;
  doneRecentlyText: string;
  projectsText: string;

  inProgressSuccess: boolean;
  doneRecentlySuccess: boolean;
  projectsSuccess: boolean;

  ngOnInit() {
    this.inProgressText = JSON.stringify(MonsterStorage.get('in-progress'));
    this.doneRecentlyText = JSON.stringify(MonsterStorage.get('done-recently'));
    this.projectsText = JSON.stringify(MonsterStorage.get('projects'));
  }

  onCopyInProgress(isSuccess: boolean) {
    this.inProgressSuccess = isSuccess;
  }
  onCopyDoneRecently(isSuccess: boolean) {
    this.doneRecentlySuccess = isSuccess;
  }
  onCopyProjects(isSuccess: boolean) {
    this.projectsSuccess = isSuccess;
  }
}
