export interface PaginationProps {
    activePage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }