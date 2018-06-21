import { Component, OnInit } from '@angular/core';
import { MotivationService } from '@app/core';
import { Motivation, now } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-motivation',
  templateUrl: './motivation.component.html',
  styleUrls: ['./motivation.component.scss']
})
export class MotivationComponent extends Unsub implements OnInit {
  motivations: Motivation[];
  motivationControl = new InputControl<string>({ required: true });

  private newMotivation = new Subject<boolean>();

  constructor(private motivationService: MotivationService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.newMotivation.asObservable().pipe(
        startWith(true),
        switchMap(() => this.motivationService.getMotivations())
      ).subscribe(motivations => {
        motivations = motivations ? motivations : [];
        this.motivations = motivations.reverse();

        if (this.motivations[0]) {
          this.motivationControl.setValue(this.motivations[0].motivation);
        } else {
          this.motivationControl.reset();
        }
      })
    );
  }

  createMotivation() {
    if (this.motivationControl.valid) {
      const motivation: Motivation = {
        createdAt: now(),
        motivation: this.motivationControl.getValue()
      };
      this.addSubscription(
        this.motivationService.add(motivation).subscribe(success => {
          if (success) {
            this.newMotivation.next(true);
          }
        })
      );
    }
  }

}
