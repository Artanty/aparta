import { ChangeDetectionStrategy, Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { TemplateHeaderDirective } from './template-header.directive';

const constants = {
    PAGE_SIZE: 5,
    TEMPLATE: {
      header: 'header',
      body: 'body'
    }
}

@Component({
  selector: 'alibi-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  public TEMPLATE = constants.TEMPLATE

  @Input() cols: any[] = []
  @Input() data: any[] = []
  @Input() pageSize = constants.PAGE_SIZE

  page = 0;
  items: any[] = []
  pageData = {} as {
    start: number
    end: number
  }

  @ContentChildren(TemplateHeaderDirective, { read: TemplateHeaderDirective })
  public templates: QueryList<TemplateHeaderDirective> | undefined
  constructor () {}

  ngOnInit(): void {
    this.initPagination()
  }

  public get tableHeight() {
    const columnHeight = 80
    const rowHeight = 80
    const marginBottom = 20
    return {
      height: `${(rowHeight + marginBottom) * this.pageSize + columnHeight}px`
    }
  }

  private initPagination (): void {
    this.paginate(this.page, this.pageSize)
  }

  public get size(): number {
    return this.data.length;
  }

  public get totalPages(): number {
    return Math.ceil(this.size / this.pageSize)
  }

  paginate(page: number, pageSize: number) {
    const startPortion = page * pageSize
    let endPortion = startPortion + pageSize

    if (endPortion > this.size) {
      endPortion -= endPortion - this.size
    }

    this.saveCalculatedPortion(startPortion, endPortion)

    this.items = [...this.data.slice(startPortion, endPortion)]
  }

  saveCalculatedPortion (start: number, end: number): void {
    this.pageData = {
      ...this.pageData,
      start,
      end
    }
  }

  public prev() : void {
    if (this.page > 0) {
      this.page -= 1;
      this.paginate (this.page, this.pageSize)
    }
  }

  public next (): void {
    if (this.page < this.totalPages && this.pageData.end < this.size) {
      this.page += 1;
      this.paginate(this.page, this.pageSize)
    }
  }

  getdata(){

  }
}
