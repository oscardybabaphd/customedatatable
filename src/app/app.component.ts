import { Component, OnInit, OnDestroy, HostListener, Input, ViewChild } from '@angular/core';
import { ServicesService } from './repository/services.service';
import { pager, tableColums } from './models/model';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { PopUpModalComponent } from './modal/pop-up-modal/pop-up-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'datatable-app';
  dataList: pager;
  nextPage: number;
  prevPage: number;
  tempSearchList: Array<tableColums>;
  startDate: Date;
  endDate: Date;
  tempData: pager;
  private subscription: Subscription;
  @ViewChild(PopUpModalComponent) modal: PopUpModalComponent;
  constructor(private data: ServicesService) {

  }

  ngOnInit(): void {
    this.getData();
  }

  getData = (): void => {
    Swal.fire({ text: "Loading results.." });
    Swal.showLoading();
    this.subscription = this.data.getAllRecord().subscribe((res) => {
      this.dataList = res;
      this.nextPage = this.dataList.nextPage;
      this.prevPage = this.dataList.prePage;
    });
    Swal.close();
  }

  gotoNextPage = () => {
    Swal.fire({ text: "Loading results.." });
    Swal.showLoading();
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
    Swal.close();
  }

  gotoPreviousPage = () => {
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
  }

  sort = (key: string) => {
    if (this.dataList.data == null) {
      return;
    }
    let isAsc = this.data.getSortDirection(key);
    this.dataList.data = this.data.sortByKey(isAsc, this.dataList.data, key);
  }

  search = (page: number = 1, per_page: number = 10) => {
    if (this.endDate != null && this.endDate != undefined && this.startDate != null && this.startDate != undefined) {
      Swal.fire({ text: "Loading results.." });
      Swal.showLoading();
      this.subscription = this.data.getRecordByDateRange(moment(this.startDate).format("YYYY-MM-DD"),
        moment(this.endDate).format("YYYY-MM-DD"), page, per_page).subscribe((res) => {
          this.dataList = res;
          this.nextPage = this.dataList.nextPage;
          this.prevPage = this.dataList.prePage;
          this.tempSearchList = res.data;
          Swal.close();
        });
    } else {
      Swal.fire({ text: "Search params empty", type: "error" });
    }
  }

  updateDateProps = (date: string, key: string): void => {
    if (date != "") {
      switch (key) {
        case 'startDate': this.startDate = new Date(date);
        case 'endDate': this.endDate = new Date(date);
        default: ;
      }
    }
  }

  resetSearch = () => {
    this.endDate = null;
    this.startDate = null;
    this.tempSearchList = null;
    this.getData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
