import Swal from "sweetalert2";

export function success() {
    const showAlert = (title: string, text: string, options: any = {}) => {
        return Swal.fire({
            title,
            text,
            icon: "success",
            confirmButtonColor: "#ff33a6",
            ...options
        });
    };

    const showToast = (title: string, text: string, timer: number = 2000) => {
        return Swal.fire({
            title,
            text,
            icon: "success",
            confirmButtonColor: "#ff33a6",
            timer,
            showConfirmButton: false
        });
    };

    return { showAlert, showToast };
}

export function error() {
    const showError = (title: string, text: string, options: any = {}) => {
        return Swal.fire({
            title,
            text,
            icon: "error",
            confirmButtonColor: "#ff33a6",
            ...options
        });
    };

    return { showError };
}

export function confirmation() {
    const showConfirmation = (title: string, text: string, options: any = {}) => {
        return Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
            ...options
        });
    };

    const confirmDeletion = (title: string = "¿Estás seguro?", text: string = "Esta acción no se puede deshacer") => {
        return Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });
    };

    return { showConfirmation, confirmDeletion };
}
