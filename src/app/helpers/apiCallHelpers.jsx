import axios from "axios";
import Swal from 'sweetalert2';

// POST API without token
export const postDataWithoutToken = async (route, formData, contentType, onSuccess, onError) => {
    try {
        const response = await axios.post(route, formData, {
            headers: {
                'Content-Type': contentType,
            },
        });

        if (response.data.status === 200) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.message,
            });
            if (onSuccess) onSuccess(response.data.data);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: response.data.message,
            });
            if (onError) onError(response.data.data);
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response ? error.response.data.message : "An error occurred",
        });
        if (onError) onError(error);
    }
};