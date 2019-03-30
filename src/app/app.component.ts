import { Component, OnInit } from '@angular/core';
import { ServicesService } from './repository/services.service';
import { pager, tbl_col } from './models/model';
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
  _start_date: Date;
  _end_date: Date;
  temp_data: pager;
  private subscription: Subscription;
  status_list: Array<string> = ["Seldom", "Yearly", "Often", "Never", "Once", "Weekly", "Monthly", "Daily"];
  modal_form: FormGroup;
  submitted = false;
  isviewmode = true;
  public isviewmode_data: tbl_col;
  isdarkmode = false;
  public themelabel: string = "Dark Mode"

  constructor(private _data: ServicesService, public ngxSmartModalService: NgxSmartModalService, private formbuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.get_data();

    this.modal_form = this.formbuilder.group({
      city: ["", Validators.required],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
      price: ["", Validators.required],
      status: ["", Validators.required],
      color: ["", Validators.required],
      id: [""]
    });
  }



  get_data = (): void => {
    Swal.fire({ text: "Loading results.." });
    Swal.showLoading();
    this.subscription = this._data.get_all_record().subscribe((res) => {
      this.data_list = res;
      this.nxt_page = this.data_list.next_page;
      this.prev_page = this.data_list.pre_page;
    });
    Swal.close();
  }

  next_page = () => {
    Swal.fire({ text: "Loading results.." });
    Swal.showLoading();
    if (this.tem_search_list != null && this.tem_search_list.length > 0) {
      this.search(this.nxt_page, 10);
    } else {
      this.subscription = this._data.get_all_record(this.nxt_page, 10).subscribe((res) => {
        this.data_list = res;
        this.nxt_page = this.data_list.next_page;
        this.prev_page = this.data_list.pre_page;
      });
    }
    this.reset_sort();
    Swal.close();
  }

  previou_page = () => {
    if (this.tem_search_list != null && this.tem_search_list.length > 0) {
      this.search(this.prev_page, 10);
    } else {
      console.log(this.prev_page);
      this.subscription = this._data.get_all_record(this.prev_page, 10).subscribe((res) => {
        this.data_list = res;
        this.nxt_page = this.data_list.next_page;
        this.prev_page = this.data_list.pre_page;
        console.log(this.data_list);
      });
    }
    this.reset_sort();
  }

  compare = (a: number | string | Date, b: number | string | Date, isAsc: boolean) => {
    if (typeof (a) === 'object' && typeof (b) === 'object') {
      console.log(a);
      console.log(b);
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

  sort = (key: string) => {
    if (this.data_list.data == null) {
      return;
    }
    let isAsc = this.get_sort_direction(key);

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

  reset_sort = () => {
    this.isAsc_city = false;
    this.isAsc_color = false;
    this.isAsc_end_date = false;
    this.isAsc_price = false;
    this.isAsc_start_date = false;
    this.isAsc_status = false;
  }

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

  search = (page: number = 1, per_page: number = 10) => {
    if (this._end_date != null && this._end_date != undefined && this._start_date != null && this._start_date != undefined) {
      Swal.fire({ text: "Loading results.." });
      Swal.showLoading();
      this.subscription = this._data.get_record_by_daterange(moment(this._start_date).format("YYYY-MM-DD"),
        moment(this._end_date).format("YYYY-MM-DD"), page, per_page).subscribe((res) => {
          this.data_list = res;
          this.nxt_page = this.data_list.next_page;
          this.prev_page = this.data_list.pre_page;
          this.tem_search_list = res.data;
          Swal.close();
        });
    } else {
      Swal.fire({ text: "Search params empty", type: "error" });
    }
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
    this.tem_search_list = null;
    this.get_data();
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
        this.subscription = this._data.delete_record(id).subscribe((res) => {
          if (res.status == "00") {
            let index = this.data_list.data.findIndex(x => x.id == id);
            this.data_list.data.splice(index, 1);
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
    this.ngxSmartModalService.resetModalData('myModal');
    this.ngxSmartModalService.getModal('myModal').open();
    this.ngxSmartModalService.setModalData(true, 'myModal');
    let item = this.data_list.data.filter(x => x.id == id)[0];
    this.modal_form.controls.price.setValue(item.price);
    this.modal_form.controls.city.setValue(item.city);
    this.modal_form.controls.start_date.setValue(moment(item.start_date).format("YYYY-MM-DD"));
    this.modal_form.controls.end_date.setValue(moment(item.end_date).format("YYYY-MM-DD"));
    this.modal_form.controls.color.setValue(item.color);
    this.modal_form.controls.status.setValue(item.status);
    this.modal_form.controls.id.setValue(item.id);
    this.isviewmode = false;
  }

  add = () => {
    this.ngxSmartModalService.resetModalData('myModal');
    this.ngxSmartModalService.getModal('myModal').open();
    this.isviewmode = false;

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  update_item = () => {
    this.submitted = true;
    if (this.modal_form.invalid) {
      return;
    }
    if (this.modal_form.touched) {
      Swal.fire({ text: "Loading results.." });
      Swal.showLoading();
      let post_data: tbl_col = {
        city: this.modal_form.controls.city.value,
        color: this.modal_form.controls.color.value,
        end_date: moment(this.modal_form.controls.end_date.value).format("YYYY/MM/DD"),
        id: this.modal_form.controls.id.value,
        price: this.modal_form.controls.price.value,
        start_date: moment(this.modal_form.controls.start_date.value).format("YYYY/MM/DD"),
        status: this.modal_form.controls.status.value
      };
      this.subscription = this._data.update_record(post_data).subscribe((res) => {
        if (res.status == "00") {
          let index = this.data_list.data.findIndex(x => x.id == post_data.id);
          this.data_list.data[index].city = post_data.city;
          this.data_list.data[index].price = post_data.price;
          this.data_list.data[index].color = post_data.color;
          this.data_list.data[index].status = post_data.status;
          this.data_list.data[index].start_date = post_data.start_date;
          this.data_list.data[index].end_date = post_data.end_date;
          this.ngxSmartModalService.resetModalData('myModal');
          this.ngxSmartModalService.getModal('myModal').close();
          this.onDismiss();
          Swal.fire({ text: "Update was successful", type: 'success' })
          // Swal.close();
        }

      })

    }

  }

  add_item = () => {
    this.submitted = true;
    if (this.modal_form.invalid) {
      return;
    }
    Swal.fire({ text: "Loading results.." });
    Swal.showLoading();
    let post_data: tbl_col = {
      city: this.modal_form.controls.city.value,
      color: this.modal_form.controls.color.value,
      end_date: moment(this.modal_form.controls.end_date.value).format("YYYY/MM/DD"),
      id: this.modal_form.controls.id.value,
      price: this.modal_form.controls.price.value,
      start_date: moment(this.modal_form.controls.start_date.value).format("YYYY/MM/DD"),
      status: this.modal_form.controls.status.value
    };

    this.subscription = this._data.add_record(post_data).subscribe((res) => {
      if (res.status == "00") {
        post_data.id = res.id;
        this.data_list.data.unshift(post_data);
        Swal.fire({ text: "Item added successfully", type: 'success' });
        this.ngxSmartModalService.resetModalData('myModal');
        this.ngxSmartModalService.getModal('myModal').close();
        this.onDismiss();
      }
    });
  }

  close = () => {
    this.ngxSmartModalService.getModal('myModal').close();
    this.modal_form.reset();
    this.submitted = false;
  }
  onDismiss = () => {
    this.modal_form.reset();
    this.submitted = false;
  }

  view = (id: number) => {
    this.ngxSmartModalService.resetModalData('myModal');
    this.ngxSmartModalService.getModal('myModal').open();
    this.isviewmode = true;
    this.isviewmode_data = this.data_list.data.filter(x => x.id == id)[0];
  }

  switchtheme = () => {
    this.isdarkmode = !this.isdarkmode;
    if (this.isdarkmode) {
      this.themelabel = "Light Mode";
    } else {
      this.themelabel = "Dark Mode";
    }
  }

}
