import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

import paginate from "jw-paginate";

@Component({
  selector: "app-seeker-pagination",
  templateUrl: "./seeker-pagination.component.html",
  styleUrls: ["./seeker-pagination.component.css"],
})
export class SeekerPaginationComponent implements OnInit, OnChanges {
  @Input() items: Array<any>;
  @Output() changePage = new EventEmitter<any>(true);
  @Input() initialPage = 1;
  @Input() pageSize = 15;
  @Input() maxPages = 10;

  pager: any = {};
  constructor() {}

  ngOnInit() {
    if (this.items && this.items.length) {
      this.setPage(this.initialPage);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items.currentValue !== changes.items.previousValue) {
      this.setPage(this.initialPage);
    }
  }

  private setPage(page: number) {
    this.pager = paginate(
      this.items.length,
      page,
      this.pageSize,
      this.maxPages
    );

    var pageOfItems = this.items.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );

    this.changePage.emit(pageOfItems);
  }
}
