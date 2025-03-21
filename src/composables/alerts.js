// src/composables/useAlert.js
import Swal from "sweetalert2";

export function success() {
    const showAlert = (title, text, icon = "success") => {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: "#ff33a6", // Color rosa de los botones
        });
    };

    return { showAlert };
}

export function error() {
    const showError = (title, text, icon = "error") => {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: "#ff33a6",
        });
    };

    return { showError };
}