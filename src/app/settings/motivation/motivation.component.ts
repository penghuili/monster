import { Component, OnInit } from '@angular/core';
import { MotivationService } from '@app/core';
import { MonsterStorage, Motivation, now, NowIWant, Tab } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-motivation',
  templateUrl: './motivation.component.html',
  styleUrls: ['./motivation.component.scss']
})
export class MotivationComponent extends Unsub implements OnInit {
  currentMotivation: Motivation;
  motivations: Motivation[];
  motivationControl = new InputControl<string>({ required: true });
  isShowAddMotivation: boolean;

  currentWant: NowIWant;
  wants: NowIWant[];
  wantControl = new InputControl<string>({ required: true });
  isShowAddWant: boolean;
  wantLength: number;

  WANT = 'want';
  MOTIVATION = 'motivation';
  tabs: Tab[] = [
    { key: this.MOTIVATION, value: this.MOTIVATION },
    { key: this.WANT, value: 'now i want' }
  ];
  activeTab = MonsterStorage.get('motivation-active-tab') || this.MOTIVATION;

  private newMotivation = new Subject<boolean>();
  private newWant = new Subject<boolean>();

  constructor(private motivationService: MotivationService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.newMotivation.asObservable().pipe(
        startWith(true),
        switchMap(() => this.motivationService.getMotivations())
      ).subscribe(motivations => {
        this.motivations = motivations ? motivations : [];
        this.currentMotivation = this.motivations[0];

        if (this.motivations[0]) {
          this.motivationControl.setValue(this.motivations[0].motivation);
        } else {
          this.motivationControl.reset();
        }
      })
    );

    this.addSubscription(
      this.newWant.asObservable().pipe(
        startWith(true),
        switchMap(() => this.motivationService.getWants())
      ).subscribe(wants => {
        this.wants = wants ? wants : [];
        this.currentWant = this.wants[0];

        if (this.wants[0]) {
          this.wantControl.setValue(this.wants[0].want);
        } else {
          this.wantControl.reset();
        }
      })
    );

    this.addSubscription(
      this.wantControl.value$.pipe(
        debounceTime(100)
      ).subscribe(text => {
        this.wantLength = text ? text.length : 0;
      })
    );
  }

  toggleAddWant() {
    this.isShowAddWant = !this.isShowAddWant;
  }
  toggleAddMotivation() {
    this.isShowAddMotivation = !this.isShowAddMotivation;
  }
  createWant() {
    if (this.wantControl.valid && this.wantControl.getValue().length <= 20) {
      const want: NowIWant = {
        createdAt: now(),
        want: this.wantControl.getValue()
      };
      this.addSubscription(
        this.motivationService.addWant(want).subscribe(success => {
          if (success) {
            this.newWant.next(true);
            this.isShowAddWant = false;
          }
        })
      );
    }
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
            this.isShowAddMotivation = false;
          }
        })
      );
    }
  }
  onChangeTab(key: string) {
    this.activeTab = key;
    MonsterStorage.set('motivation-active-tab', key);
  }

}
