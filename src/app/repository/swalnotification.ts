import Swal from 'sweetalert2';

export class Swalnotification {
    constructor() {

    }
    dialog = (isLoading: boolean, content: any) => {
        Swal.fire(content);
        if (isLoading) {
            Swal.showLoading();
        }
    }

    closeDialog = () => {
        if (Swal.isLoading()) {
            Swal.close();
        }
    }
    confirmDeleteDialog = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this item!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });
        if (result.value) {
            this.dialog(true, { text: 'Deletion in progress', allowOutsideClick: false });
        }
        return result;
    }
}
