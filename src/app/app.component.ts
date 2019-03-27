import { Component, OnInit } from '@angular/core';
import { ServicesService } from './repository/services.service';
import { pager, tbl_col } from './models/model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'datatable-app';
  data_list: pager;
  nxt_page: number;
  prev_page: number;
  d_list: Array<object>;
  isAsc_city: boolean = false;
  isAsc_color: boolean = false;
  isAsc_end_date: boolean = false;
  isAsc_price: boolean = false;
  isAsc_start_date: boolean = false;
  isAsc_status: boolean = false;
  tem_search_list: Array<tbl_col>;
  //calendar properties
  public _start_date: Date;
  public _end_date: Date;

  constructor(private _data: ServicesService) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    Swal.fire({ text: "Loading results.." });
    Swal.showLoading();
    // pull data from server for now use mock data
    this.get_data();
    Swal.close();
    //console.log("data=>",this.data_list);
  }
  get_data = (): void => {
    this.data_list = this.paginator(this._data.get_mock_data(), 1, 10);
    console.log(this.data_list);
  }
  paginator = (items: Array<tbl_col>, page: number, per_page: number) => {
    var page = page || 1, per_page = per_page || 10,
      offset = (page - 1) * per_page,
      paginatedItems = items.slice(offset).slice(0, per_page),
      total_pages = Math.ceil(items.length / per_page);
    var pages = new pager();
    pages.page = page;
    pages.per_page = per_page;
    pages.pre_page = page - 1 ? page - 1 : null;
    pages.next_page = (total_pages > page) ? page + 1 : null;
    pages.total = items.length;
    pages.total_pages = total_pages;
    pages.data = paginatedItems;
    this.nxt_page = pages.next_page;
    this.prev_page = pages.pre_page;
    console.log(pages);
    return pages;
  }

  // get next data set
  next_page = () => {
    if (this.tem_search_list != null && this.tem_search_list.length > 0) {
      this.data_list = this.paginator(this.tem_search_list, this.nxt_page, 10);
    } else {
      this.data_list = this.paginator(this._data.get_mock_data(), this.nxt_page, 10);
    }
    this.reset_sort();

  }
  // get prevous data set
  previou_page = () => {
    if (this.tem_search_list != null && this.tem_search_list.length > 0) {
      this.data_list = this.paginator(this.tem_search_list, this.prev_page, 10);
    } else {
      this.data_list = this.paginator(this._data.get_mock_data(), this.prev_page, 10);
    }
    this.reset_sort();

  }
  //compare method that perform the actual sorting of items
  compare = (a: number | string | Date, b: number | string | Date, isAsc: boolean) => {
    //check for date type object
    if (typeof (a) === 'object' && typeof (b) === 'object') {
      if (isAsc) {
        return Number(a) - Number(b);
      } else {
        return Number(b) - Number(a);
      }
    } else if (typeof (a) === 'string' && typeof (b) === 'string') {
      //because of some special character use the localeCompare method
      if (isAsc) {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    } else {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }
  // the method perform sorting
  sort = (key: string) => {
    //this.sort_direction_asc = !this.sort_direction_asc;
    const isAsc = this.get_sort_direction(key);
    console.log(isAsc);
    this.data_list.data = this.data_list.data.sort((a, b) => {
      switch (key) {
        case 'city': return this.compare(a.city.toLowerCase(), b.city.toLowerCase(), isAsc);
        case 'color': return this.compare(a.color.substring(1).toLowerCase(), b.color.substring(1).toLowerCase(), isAsc);
        case 'end_date': return this.compare(new Date(a.end_date), new Date(b.end_date), isAsc);
        case 'price': return this.compare(Number(a.price), Number(b.price), isAsc);
        case 'start_date': return this.compare(new Date(a.start_date), new Date(b.start_date), isAsc);
        case 'status': return this.compare(a.status.toLowerCase(), b.status.toLowerCase(), isAsc);
        default: return 0;
      }
    });
  }
  // reset all sort direction at every next page
  reset_sort = () => {
    this.isAsc_city = false;
    this.isAsc_color = false;
    this.isAsc_end_date = false;
    this.isAsc_price = false;
    this.isAsc_start_date = false;
    this.isAsc_status = false;
  }
  // sort by asc by default
  get_sort_direction = (prop: string): boolean => {
    switch (prop) {
      case 'city': return this.isAsc_city = !this.isAsc_city;
      case 'color': return this.isAsc_color = !this.isAsc_color;
      case 'end_date': return this.isAsc_end_date = !this.isAsc_end_date;
      case 'price': return this.isAsc_price = !this.isAsc_price;
      case 'start_date': return this.isAsc_start_date = !this.isAsc_start_date;
      case 'status': return this.isAsc_status = !this.isAsc_status;
      default: return false;
    }
  }

  search = () => {
    console.log("start_date", this._start_date);
    console.log("end_date", this._end_date);

    console.log(this._end_date);
    if (this._end_date != null && this._end_date != undefined && this._start_date != null && this._start_date != undefined) {
      Swal.fire({ text: "Loading results.." });
      Swal.showLoading();
      this.tem_search_list = this._data.get_mock_data().filter((item: tbl_col) => {
        return (new Date(item.start_date).getDate() >= this._start_date.getDate()
          && new Date(item.start_date).getDay() >= this._start_date.getDay()
          && new Date(item.start_date).getFullYear() >= this._start_date.getFullYear()
        ) && (new Date(item.end_date).getDate() <= this._end_date.getDate()
          && new Date(item.end_date).getDay() <= this._end_date.getDay()
          && new Date(item.end_date).getFullYear() <= this._end_date.getFullYear()
          );
      });
      //debugger;
      console.log(this.tem_search_list)
      if (this.tem_search_list.length > 0) {
        this.data_list = this.paginator(this.tem_search_list, 1, 10);
        Swal.close();
      } else {
        Swal.fire({ text: "No record found for selected date range", type: "error" });
      }
    } else {
      Swal.fire({ text: "Search params empty", type: "error" });
    }
    //this.data_list = new pager();
  }
  update_date_pro = (_date: string, key: string): void => {
    console.log(_date);
    if (_date != "") {
      switch (key) {
        case 'start_date': this._start_date = new Date(_date);
        case 'end_date': this._end_date = new Date(_date);
        default: ;
      }
    }
  }
  reset_search = () => {
    this._end_date = null;
    this._start_date = null;
    this.get_data();
  }


}
