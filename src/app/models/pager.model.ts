export class Pager {
    constructor(totalItems: number, itemsPerPage: number, currentPage?: number, ) {
      this.pageCount = Math.trunc(totalItems / itemsPerPage) +  (totalItems % itemsPerPage > 0 ? 1 : 0);
      this.totalItems = totalItems;
      this.currentPage = currentPage;
      this.itemsPerPage = itemsPerPage;
    }
    pageCount: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
  }