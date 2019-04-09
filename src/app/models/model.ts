
export class Pager {
    constructor() {
    }
    page: number;
    perPage: number;
    prePage: number;
    nextPage: number;
    total: number;
    totalPages: number;
    data: Array<TableColums>;
}

export class TableColums {
    constructor() {

    }
    id: number;
    city: string;
    startDate: string;
    endDate: string;
    price: string;
    status: string;
    color: string;
}
