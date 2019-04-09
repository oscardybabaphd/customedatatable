import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ServicesService } from './repository/services.service';
import { Pager, TableColums } from './models/model';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { PopupmodalComponent } from './modal/popupmodal/popupmodal.component';
import { Swalnotification } from './repository/swalnotification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'datatable-app';
  dataList: Pager;
  nextPage: number;
  prevPage: number;
  tempSearchList: Array<TableColums>;
  startDate: Date;
  endDate: Date;
  tempData: Pager;
  public selectedDate: any;
  private subscription: Subscription;
  @ViewChild(PopupmodalComponent) modal: PopupmodalComponent;
  private notify: Swalnotification;
  constructor(private data: ServicesService) {
    this.notify = new Swalnotification();
  }

  ngOnInit(): void {
    this.getData();

  }

  getData = (): void => {
    this.notify.dialog(true, { text: 'Loading results..' })
    this.subscription = this.data.getAllRecord().subscribe((res) => {
      this.dataList = res;
      this.nextPage = this.dataList.nextPage;
      this.prevPage = this.dataList.prePage;
      this.notify.closeDialog();
    });
  }


  gotoNextPage = () => {
    this.notify.dialog(true, { text: 'Loading results..' })
    if (this.tempSearchList != null && this.tempSearchList.length > 0) {
      this.search(this.nextPage, 10);
    } else {
      this.subscription = this.data.getAllRecord(this.nextPage, 10).subscribe((res) => {
        this.dataList = res;
        this.nextPage = this.dataList.nextPage;
        this.prevPage = this.dataList.prePage;
      });
    }
    this.data.resetSort();
    this.notify.closeDialog();
  }

  gotoPreviousPage = () => {
    this.notify.dialog(true, { text: 'Loading results..' })
    if (this.tempSearchList != null && this.tempSearchList.length > 0) {
      this.search(this.prevPage, 10);
    } else {
      this.subscription = this.data.getAllRecord(this.prevPage, 10).subscribe((res) => {
        this.dataList = res;
        this.nextPage = this.dataList.nextPage;
        this.prevPage = this.dataList.prePage;
      });
    }
    this.data.resetSort();
    this.notify.closeDialog();
  }

  sort = (key: string) => {
    if (this.dataList.data == null) {
      return;
    }
    let isAsc = this.data.getSortDirection(key);
    this.dataList.data = this.data.sortByKey(isAsc, this.dataList.data, key);
  }

  search = (page: number = 1, per_page: number = 10) => {
    console.log(this.selectedDate);
    if (this.selectedDate.startDate != null && this.selectedDate.endDate != null) {
      this.notify.dialog(true, { text: "Loading results.." })
      this.subscription = this.data.getRecordByDateRange(moment(this.selectedDate.startDate).format("YYYY-MM-DD"),
        moment(this.selectedDate.endDate).format("YYYY-MM-DD"), page, per_page).subscribe((res) => {
          this.dataList = res;
          this.nextPage = this.dataList.nextPage;
          this.prevPage = this.dataList.prePage;
          this.tempSearchList = res.data;
          this.notify.closeDialog();
        });
    } else {
      this.notify.dialog(false, { text: "Search params empty", type: "error" })
    }
  }

  resetSearch = () => {
    this.selectedDate = null;
    this.tempSearchList = null;
    this.getData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  welcome_new = () => {

  }
}
