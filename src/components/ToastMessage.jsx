import React, { useEffect } from "react";

const ToastMessage = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            // onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
    };

    return (
        <div
            className={`z-[100] fixed bottom-4 right-4 p-4 rounded-lg text-white ${
                typeClasses[type] || "bg-gray-500"
            } shadow-lg transition-all duration-300 ease-in-out`}
        >
            <p className="font-medium">{message}</p>
        </div>
    );
};

export default ToastMessage;
