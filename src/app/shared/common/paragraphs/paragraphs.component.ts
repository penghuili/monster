import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { paragraphString } from '@app/model';

@Component({
  selector: 'mst-paragraphs',
  templateUrl: './paragraphs.component.html',
  styleUrls: ['./paragraphs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParagraphsComponent {
  @Input() set text(value: string) {
    this.paragraphs = paragraphString(value);
  }

  paragraphs: string[];
}
