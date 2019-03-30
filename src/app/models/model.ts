
export class pager {
    constructor() {   
    }
    page: number;
    per_page: number;
    pre_page: number;
    next_page: number;
    total: number;
    total_pages: number;
    data: Array<tbl_col>
}

export class tbl_col {
    constructor(){

    }
    id:number;
    city: string;
    start_date: string;
    end_date: string;
    price: string;
    status: string;
    color:string;
}
