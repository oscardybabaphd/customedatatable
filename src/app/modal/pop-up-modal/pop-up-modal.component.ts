import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tableColums, pager } from 'src/app/models/model';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ServicesService } from 'src/app/repository/services.service';

@Component({
  selector: 'pop-up-modal',
  templateUrl: './pop-up-modal.component.html',
  styleUrls: ['./pop-up-modal.component.css']
})
export class PopUpModalComponent implements OnInit, OnDestroy {
  statusList: Array<string> = ["Seldom", "Yearly", "Often", "Never", "Once", "Weekly", "Monthly", "Daily"];
  modalForm: FormGroup;
  submitted = false;
  isViewMode = true;
  public isViewModeData: tableColums;
  private subscription: Subscription;
  @Input() dataList: pager;
  constructor(public ngxSmartModalService: NgxSmartModalService, private formBuilder: FormBuilder, private data: ServicesService) { }

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

  closeModal = () => {
    this.ngxSmartModalService.getModal('myModal').close();
    this.modalForm.reset();
    this.submitted = false;
  }
  onDismiss = () => {
    this.modalForm.reset();
    this.submitted = false;
  }

  openAddModal = () => {
    this.ngxSmartModalService.resetModalData('myModal');
    this.ngxSmartModalService.getModal('myModal').open();
    this.isViewMode = false;
  }

  view = (id: number) => {
    this.isViewModeData = this.dataList.data.filter(x => x.id == id)[0];
    if (this.isViewModeData != null) {
      this.ngxSmartModalService.resetModalData('myModal');
      this.ngxSmartModalService.getModal('myModal').open();
      this.isViewMode = true;
    }
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
