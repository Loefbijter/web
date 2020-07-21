import { MatPaginatorIntl } from '@angular/material/paginator';

const dutchRangeLabel: (page: number, pageSize: number, length: number) => string
  = (page: number, pageSize: number, length: number): string => {
    if (length == 0 || pageSize == 0) { return `0 van ${length}`; }

    // tslint:disable-next-line: no-parameter-reassignment
    length = Math.max(length, 0);

    const startIndex: number = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex: number = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} van ${length}`;
  };

export function getDutchPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl: MatPaginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Items per pagina:';
  paginatorIntl.nextPageLabel = 'Volgende pagina';
  paginatorIntl.previousPageLabel = 'Vorige pagina';
  paginatorIntl.firstPageLabel = 'Eerste pagina';
  paginatorIntl.lastPageLabel = 'Laatste pagina';
  paginatorIntl.getRangeLabel = dutchRangeLabel;

  return paginatorIntl;
}
