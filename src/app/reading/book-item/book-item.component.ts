import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookItemComponent {
  @Input() book: Book;

  constructor(private router: Router) {}

  onDetail(id: number) {
    this.router.navigateByUrl(`/${ROUTES.PLANS}/${ROUTES.READING}/${id}`);
  }
}
