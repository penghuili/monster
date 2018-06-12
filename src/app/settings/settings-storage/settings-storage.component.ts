import { Component, OnInit } from '@angular/core';
import { StorageApiService } from '@app/core';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-settings-storage',
  templateUrl: './settings-storage.component.html',
  styleUrls: ['./settings-storage.component.scss']
})
export class SettingsStorageComponent extends Unsub implements OnInit {
  quota: number;
  usage: number;
  isPersisted: boolean;
  allowedPersist: boolean;

  constructor(private storageApiService: StorageApiService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.storageApiService.getEstimatedStorageUsage().subscribe(estimated => {
        if (estimated) {
          this.quota = estimated.quota;
          this.usage = estimated.usage;
        } else {
          this.quota = 0;
          this.usage = 0;
        }
      })
    );

    this.addSubscription(
      this.storageApiService.isPersisted().subscribe(persisted => {
        this.isPersisted = persisted;
      })
    );
  }

  getRatio(): number {
    return this.quota && this.usage ? this.usage / this.quota : 0;
  }
  onPersist() {
    this.addSubscription(
      this.storageApiService.askForPersistStorage().subscribe(success => {
        this.isPersisted = success;
        this.allowedPersist = success;
      })
    );
  }

}
