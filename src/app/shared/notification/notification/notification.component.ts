import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/core';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent extends Unsub implements OnInit {
  message = '';

  constructor(private notiService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.notiService.getMessage().subscribe(m => {
        this.message = m;
      })
    );
  }

}
