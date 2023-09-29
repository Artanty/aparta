import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild } from '@angular/core';
import { TemplateHeaderDirective } from './template-header.directive';
import 'reflect-metadata'
const constants = {
    PAGE_SIZE: 5,
    TEMPLATE: {
      header: 'header',
      body: 'body',
      pagiPrev: 'pagiPrev'
    }
}

@Component({
  selector: 'alibi-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
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
  @ViewChild('paginationPrevWrapper', { static: true }) paginationPrevWrapper: ElementRef | undefined;
  @ViewChild('paginationNextWrapper', { static: true }) paginationNextWrapper: ElementRef | undefined;

  @ContentChildren(TemplateHeaderDirective, { read: TemplateHeaderDirective })
  public templates?: QueryList<TemplateHeaderDirective>
  constructor (
    private cd: ChangeDetectorRef,
    private el: ElementRef, private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initPagination()

  }
  ngAfterContentInit() {
    //
  }

  ngAfterViewInit() {
    if (this.paginationPrevWrapper) {
      this.wrapPaginationContent(this.paginationPrevWrapper, this.prev)
    }
    if (this.paginationNextWrapper) {
      this.wrapPaginationContent(this.paginationNextWrapper, this.next)
    }
  }

  private wrapPaginationContent (wrapper: ElementRef, handler: Function) {

    const isElementTag = (el: Element, tagName: keyof HTMLElementTagNameMap) => {
      return (el instanceof Element && el.tagName === tagName?.toUpperCase())
    }

    const isElementNode = (el: Element, elementNode: number, not?: boolean) => {
      return not ? (el.nodeType !== elementNode) : (el.nodeType === elementNode)
    }

    const childNodes: HTMLElement[] = (Array.from(wrapper.nativeElement?.childNodes) as HTMLElement[])
    ?.filter((el: HTMLElement) => isElementNode(el, Node.COMMENT_NODE, true))

    const hasButtonOrLink = (childNodes: HTMLElement[]): boolean => {
      return Array.from(childNodes).some((el: HTMLElement) => {
        return isElementTag(el, 'button') || isElementTag(el, 'a')
      })
    }

    if (!hasButtonOrLink(childNodes)) {
      const buttonElement = document.createElement('button');
      childNodes.forEach((node: Node) => {
        buttonElement.appendChild(node)
      })
      if (!buttonElement.innerHTML) {
        buttonElement.textContent = (/prev/.test(wrapper.nativeElement.className)) ? '←' : '→'
      }
      buttonElement.addEventListener('click', handler.bind(this))
      wrapper.nativeElement.appendChild(buttonElement)
    }


  }

  public getTemplateByName (templateName: string):  TemplateHeaderDirective | undefined {
    return this.templates?.find((el: TemplateHeaderDirective) => el.templateName === templateName)
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
