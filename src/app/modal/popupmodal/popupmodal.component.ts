import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableColums, Pager } from 'src/app/models/model';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ServicesService } from 'src/app/repository/services.service';
import { Swalnotification } from 'src/app/repository/swalnotification';

@Component({
  selector: 'popupmodal',
  templateUrl: './popupmodal.component.html',
  styleUrls: ['./popupmodal.component.css']
})

export class PopupmodalComponent implements OnInit, OnDestroy {
  statusList: Array<string> = ["", "Seldom", "Yearly", "Often", "Never", "Once", "Weekly", "Monthly", "Daily"];
  modalForm: FormGroup;
  submitted = false;
  isViewMode = true;
  public isViewModeData: TableColums;
  private subscription: Subscription;
  @Input() dataList: Pager;
  private notify: Swalnotification;
  constructor(public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder, private data: ServicesService) {
    this.notify = new Swalnotification();
  }

  ngOnInit() {
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

  edit = (id: number) => {
    const item = this.dataList.data.filter(x => x.id == id)[0];
    if (item != null) {
      this.modalForm.controls['price'].setValue(item.price);
      this.modalForm.controls['city'].setValue(item.city);
      this.modalForm.controls['startDate'].setValue(moment(item.startDate).format('YYYY-MM-DD'));
      this.modalForm.controls['endDate'].setValue(moment(item.endDate).format('YYYY-MM-DD'));
      this.modalForm.controls['color'].setValue(item.color);
      this.modalForm.controls['status'].setValue(item.status);
      this.modalForm.controls['id'].setValue(item.id);
      this.modalOpenClose(true, true);
      this.isViewMode = false;
    }
  }

  modalOpenClose = (isOpen: boolean = false, hasData: boolean = false, isViewMode: boolean = false): void => {
    if (isOpen && hasData) {
      this.ngxSmartModalService.resetModalData('myModal');
      this.ngxSmartModalService.getModal('myModal').open();
      this.ngxSmartModalService.setModalData(true, 'myModal');
    } else if (isOpen && hasData == false) {
      if (!isViewMode) {
        this.ngxSmartModalService.resetModalData('myModal');
      }
      this.isViewMode = isViewMode;
      this.ngxSmartModalService.getModal('myModal').open();
    } else {
      this.ngxSmartModalService.getModal('myModal').close();
      this.modalForm.reset();
      this.submitted = false;
    }
  }


  delete = (id: number) => {
    this.notify.confirmDeleteDialog().then((result) => {
      if (result.value) {
        this.subscription = this.data.deleteRecord(id).subscribe((res) => {
          if (res.status === '00') {
            let index = this.dataList.data.findIndex(x => x.id == id);
            this.dataList.data.splice(index, 1);
            this.notify.dialog(false, { text: 'Item has been deleted', type: 'success' })
          }
        });
      }
    });
  }

  closeModal = () => {
    this.modalOpenClose();
  }

  onDismiss = () => {
    this.modalForm.reset();
    this.submitted = false;
  }

  openAddModal = () => {
    this.modalOpenClose(true);
  }

  view = (id: number) => {
    this.isViewModeData = this.dataList.data.filter(x => x.id == id)[0];
    if (this.isViewModeData != null) {
      this.modalOpenClose(true, false, true);
    }
  }

  updateItem = () => {
    this.submitted = true;
    if (this.modalForm.invalid) {
      return;
    }
    if (this.modalForm.touched) {
      this.notify.dialog(true, { text: 'Processing please wait..' });
      let postData: TableColums = {
        city: this.modalForm.controls['city'].value,
        color: this.modalForm.controls['color'].value,
        endDate: moment(this.modalForm.controls['endDate'].value).format('YYYY/MM/DD'),
        id: this.modalForm.controls['id'].value,
        price: this.modalForm.controls['price'].value,
        startDate: moment(this.modalForm.controls['startDate'].value).format('YYYY/MM/DD'),
        status: this.modalForm.controls['status'].value
      };
      this.subscription = this.data.updateRecord(postData).subscribe((res) => {
        if (res.status === '00') {
          const index = this.dataList.data.findIndex(x => x.id == postData.id);
          this.dataList.data[index] = postData;
          this.modalOpenClose();
          this.onDismiss();
          this.notify.dialog(false, { text: 'Update was successful', type: 'success' })
        }
      })
    }
  }

  addItem = () => {
    this.submitted = true;
    if (this.modalForm.invalid) {
      return;
    }
    this.notify.dialog(true, { text: 'Processing please wait..' });
    let postData: TableColums = {
      city: this.modalForm.controls['city'].value,
      color: this.modalForm.controls['color'].value,
      endDate: moment(this.modalForm.controls['endDate'].value).format('YYYY/MM/DD'),
      id: this.modalForm.controls['id'].value,
      price: this.modalForm.controls['price'].value,
      startDate: moment(this.modalForm.controls['startDate'].value).format('YYYY/MM/DD'),
      status: this.modalForm.controls['status'].value
    };

    this.subscription = this.data.addRecord(postData).subscribe((res) => {
      if (res.status === '00') {
        postData.id = res.id;
        this.dataList.data.unshift(postData);
        this.notify.dialog(false, { text: 'Item added successfully', type: 'success' });
        this.modalOpenClose();
        this.onDismiss();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}