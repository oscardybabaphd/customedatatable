import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicesService } from './repository/services.service';
import { pager, tableColums } from './models/model';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  statusList: Array<string> = ["Seldom", "Yearly", "Often", "Never", "Once", "Weekly", "Monthly", "Daily"];
  modalForm: FormGroup;
  submitted = false;
  isViewMode = true;
  public isViewModeData: tableColums;

  constructor(private data: ServicesService, public ngxSmartModalService: NgxSmartModalService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.getData();

    this.modalForm = this.formBuilder.group({
      city: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      price: ["", Validators.required],
      status: ["", Validators.required],
      color: ["", Validators.required],
      id: [""]
    });
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
    console.log(date);
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

  delete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire({ text: "Loading results.." });
        Swal.showLoading();
        this.subscription = this.data.deleteRecord(id).subscribe((res) => {
          if (res.status == "00") {
            let index = this.dataList.data.findIndex(x => x.id == id);
            this.dataList.data.splice(index, 1);
            Swal.fire(
              'Deleted!',
              'Item has been deleted.',
              'success'
            )
          }
        })

      }
    })
  }

  edit = (id: number) => {
    let item = this.dataList.data.filter(x => x.id == id)[0];
    if (item != null) {
      this.modalForm.controls['price'].setValue(item.price);
      this.modalForm.controls['city'].setValue(item.city);
      this.modalForm.controls['startDate'].setValue(moment(item.startDate).format("YYYY-MM-DD"));
      this.modalForm.controls['endDate'].setValue(moment(item.endDate).format("YYYY-MM-DD"));
      this.modalForm.controls['color'].setValue(item.color);
      this.modalForm.controls['status'].setValue(item.status);
      this.modalForm.controls['id'].setValue(item.id);
      this.ngxSmartModalService.resetModalData('myModal');
      this.ngxSmartModalService.getModal('myModal').open();
      this.ngxSmartModalService.setModalData(true, 'myModal');
      this.isViewMode = false;
    }
  }

  add = () => {
    this.ngxSmartModalService.resetModalData('myModal');
    this.ngxSmartModalService.getModal('myModal').open();
    this.isViewMode = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateItem = () => {
    this.submitted = true;
    if (this.modalForm.invalid) {
      return;
    }
    if (this.modalForm.touched) {
      Swal.fire({ text: "Loading results.." });
      Swal.showLoading();
      let postData: tableColums = {
        city: this.modalForm.controls['city'].value,
        color: this.modalForm.controls['color'].value,
        endDate: moment(this.modalForm.controls['endDate'].value).format("YYYY/MM/DD"),
        id: this.modalForm.controls['id'].value,
        price: this.modalForm.controls['price'].value,
        startDate: moment(this.modalForm.controls['startDate'].value).format("YYYY/MM/DD"),
        status: this.modalForm.controls['status'].value
      };
      this.subscription = this.data.updateRecord(postData).subscribe((res) => {
        if (res.status == "00") {
          let index = this.dataList.data.findIndex(x => x.id == postData.id);
          this.dataList.data[index] = postData;
          this.ngxSmartModalService.resetModalData('myModal');
          this.ngxSmartModalService.getModal('myModal').close();
          this.onDismiss();
          Swal.fire({ text: "Update was successful", type: 'success' })
        }
      })
    }
  }

  addItem = () => {
    this.submitted = true;
    if (this.modalForm.invalid) {
      return;
    }
    Swal.fire({ text: "Loading results.." });
    Swal.showLoading();
    let postData: tableColums = {
      city: this.modalForm.controls['city'].value,
      color: this.modalForm.controls['color'].value,
      endDate: moment(this.modalForm.controls['endDate'].value).format("YYYY/MM/DD"),
      id: this.modalForm.controls['id'].value,
      price: this.modalForm.controls['price'].value,
      startDate: moment(this.modalForm.controls['startDate'].value).format("YYYY/MM/DD"),
      status: this.modalForm.controls['status'].value
    };
    this.subscription = this.data.addRecord(postData).subscribe((res) => {
      if (res.status == "00") {
        postData.id = res.id;
        this.dataList.data.unshift(postData);
        Swal.fire({ text: "Item added successfully", type: 'success' });
        this.ngxSmartModalService.resetModalData('myModal');
        this.ngxSmartModalService.getModal('myModal').close();
        this.onDismiss();
      }
    });
  }
  close = () => {
    this.ngxSmartModalService.getModal('myModal').close();
    this.modalForm.reset();
    this.submitted = false;
  }
  onDismiss = () => {
    this.modalForm.reset();
    this.submitted = false;
  }
  view = (id: number) => {
    this.isViewModeData = this.dataList.data.filter(x => x.id == id)[0];
    if (this.isViewModeData != null) {
      this.ngxSmartModalService.resetModalData('myModal');
      this.ngxSmartModalService.getModal('myModal').open();
      this.isViewMode = true;
    }
  }
}
