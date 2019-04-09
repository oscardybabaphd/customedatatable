import { Injectable } from '@angular/core';
import { TableColums, Pager } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  public isAscCity = false;
  public isAscColor = false;
  public isAscEnddate = false;
  public isAscPrice = false;
  public isAscStartdate = false;
  public isAscStatus = false;
  private baseUrl = environment.baseUrl;
  public isDarkMode = false;
  public themeLabel = 'Dark Mode';
  constructor(private http: HttpClient) { }

  getAllRecord = (pageData: number = 1, perPageData: number = 10): Observable<Pager> => {
    const url = this.baseUrl + `/getall/${pageData}/${perPageData}`;
    return this.http.get<Pager>(url);
  }

  getRecordByDateRange = (startDate: string, endDate: string, pageData: number = 1, perPageData: number = 10): Observable<Pager> => {
    const url = this.baseUrl + `/search/${startDate}/${endDate}/${pageData}/${perPageData}`;
    return this.http.get<Pager>(url);
  }

  updateRecord = (item: TableColums): Observable<any> => {
    const url = this.baseUrl + '/update';
    return this.http.post(url, item);
  }

  addRecord = (item: TableColums): Observable<any> => {
    const url = this.baseUrl + '/add';
    return this.http.post(url, item);
  }

  deleteRecord = (id: number): Observable<any> => {
    const url = this.baseUrl + `/delete/${id}`;
    return this.http.get(url);
  }

  compare = (a: number | string | Date, b: number | string | Date, isAsc: boolean) => {
    if (typeof (a) === 'object' && typeof (b) === 'object') {
      if (isAsc) {
        return Number(a) - Number(b);
      } else {
        return Number(b) - Number(a);
      }
    } else if (typeof (a) === 'string' && typeof (b) === 'string') {
      if (isAsc) {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    } else {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }


  resetSort = () => {
    this.isAscCity = false;
    this.isAscColor = false;
    this.isAscEnddate = false;
    this.isAscPrice = false;
    this.isAscStartdate = false;
    this.isAscStatus = false;
  }

  getSortDirection = (prop: string): boolean => {
    switch (prop) {
      case 'city': return this.isAscCity = !this.isAscCity;
      case 'color': return this.isAscColor = !this.isAscColor;
      case 'endDate': return this.isAscEnddate = !this.isAscEnddate;
      case 'price': return this.isAscPrice = !this.isAscPrice;
      case 'startDate': return this.isAscStartdate = !this.isAscStartdate;
      case 'status': return this.isAscStatus = !this.isAscStatus;
      default: return false;
    }
  }

  switchTheme = () => {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.themeLabel = 'Light Mode';
    } else {
      this.themeLabel = 'Dark Mode';
    }
  }

  sortByKey = (isAsc: boolean, dataList: Array<TableColums>, key: string): Array<TableColums> => {
    const listItems = dataList.sort((a, b) => {
      switch (key) {
        case 'city': return this.compare(a.city.toLowerCase(), b.city.toLowerCase(), isAsc);
        case 'color': return this.compare(a.color.substring(1).toLowerCase(), b.color.substring(1).toLowerCase(), isAsc);
        case 'endDate': return this.compare(new Date(a.endDate), new Date(b.endDate), isAsc);
        case 'price': return this.compare(Number(a.price), Number(b.price), isAsc);
        case 'startDate': return this.compare(new Date(a.startDate), new Date(b.startDate), isAsc);
        case 'status': return this.compare(a.status.toLowerCase(), b.status.toLowerCase(), isAsc);
        default: return 0;
      }
    });
    return listItems;
  }
}
