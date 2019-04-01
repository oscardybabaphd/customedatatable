
export class pager {
    constructor() {   
    }
    page: number;
    perPage: number;
    prePage: number;
    nextPage: number;
    total: number;
    totalPages: number;
    data: Array<tableColums>
}

export class tableColums {
    constructor(){

    }
    id:number;
    city: string;
    startDate: string;
    endDate: string;
    price: string;
    status: string;
    color:string;
}
