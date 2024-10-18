
import { useState, useEffect } from "react";
import { ScrollToTop } from "../components";
import { hotelRules } from "../constants/data";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Loading from "../components/Loading";
import LoginForm from "../components/LoginForm";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";


const StoreDetails = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [pods, setPods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { login } = useAuth();

    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/v1/stores/${id}`);
                if (!response.ok) {
                    throw new Error("Không thể lấy thông tin cửa hàng");
                }
                const data = await response.json();
                setStore(data);

                // Fetch pods for this store
                const podsResponse = await fetch(
                    `${API_URL}/api/v1/stores/${id}/pods`
                );
                if (!podsResponse.ok) {
                    throw new Error("Không thể lấy danh sách pods");
                }
                const podsData = await podsResponse.json();
                setPods(podsData);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin:", error);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchStoreDetails();
    }, [id, API_URL]);

    const handleViewDetails = (podId) => {
        navigate(`/pod/${podId}`);
    };

    const handleLoginSuccess = async (message, token) => {
        setShowLoginForm(false);
        await login(token);
        showToast(message, "success");
    };

    if (loading) {
        return <Loading />;
    }

    if (!store) {
        return <div>Không tìm thấy thông tin cửa hàng</div>;
    }

    return (
        <section>
            <ScrollToTop />

            <div
                className="bg-room h-screen relative flex justify-center items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${store.image})` }}
            >
                <div className="absolute w-full h-full bg-black/70" />
                <h1 className="text-6xl text-white z-20 font-primary text-center">
                    {store.store_name} Details
                </h1>
            </div>

            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row lg:gap-x-8 h-full py-12">
                    {/* ⬅️⬅️⬅️ left side ⬅️⬅️⬅️ */}
                    <div className="w-full lg:w-[60%] h-full text-justify">
                        <h2 className="h2">{store.store_name}</h2>

                        <img
                            className="mb-8"
                            src={store.image}
                            alt={store.store_name}
                        />

                        <div className="mt-8">
                            <h3 className="h2 mb-3">About</h3>
                            <p className="mb-8">
                                The Poddy offers a delightful blend of
                                functionality and ambiance, making it an ideal
                                place to relax or get work done. With a range of
                                amenities, it provides a perfect setup for
                                students and professionals alike. The decor
                                combines modern and cozy elements, creating a
                                warm and inviting space to unwind or catch up
                                with friends. Additionally, the shop has a great
                                selection of coffee, snacks, and refreshments,
                                ensuring that guests have everything they need
                                for a productive or leisurely visit.
                            </p>

                            {/* icons grid */}
                            {store.facilities &&
                                store.facilities.length > 0 && (
                                    <div className="grid grid-cols-3 gap-6 mb-12">
                                        {store.facilities.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-x-3 flex-1"
                                            >
                                                <div className="text-3xl text-accent">
                                                    {item.icon && <item.icon />}
                                                </div>
                                                <div className="text-base">
                                                    {item.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* ➡️➡️➡️ right side ➡️➡️➡️ */}
                    <div className="w-full lg:w-[40%] h-full">
                        {/* reservation */}
                        <div className="py-8 px-6 bg-accent/20 mb-12">
                            <h3 className="h3 mb-4">Store Rules</h3>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="mb-6 text-justify">
                                    Please follow these rules to experience the
                                    best services.
                                </p>
                                <ul className="flex flex-col gap-y-4">
                                    {hotelRules.map(({ rules }, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-x-4"
                                        >
                                            <FaCheck className="text-accent" />
                                            {rules}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-8 mb-24">
                <h2 className="font-primary text-[45px] mb-8">Pod List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    {pods.map((pod) => (
                        <div
                            key={pod.pod_id}
                            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
                        >
                            <div className="w-full h-48 bg-gray-300">
                                <img
                                    src={pod.image}
                                    alt={pod.pod_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="font-primary text-xl mb-2 transition-colors duration-200 ease-in-out hover:text-accent">
                                    {pod.pod_name}
                                </h3>
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Type: {pod.type_id}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Status:
                                        <span
                                            className={
                                                pod.is_available
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }
                                        >
                                            {pod.is_available
                                                ? " Available"
                                                : " Unavailable"}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    className="w-full text-center mt-4 py-2 text-sm font-sans bg-black text-white hover:bg-accent transition-colors duration-200 ease-in-out uppercase tracking-wider"
                                    onClick={() =>
                                        handleViewDetails(pod.pod_id)
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showLoginForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg">
                        <LoginForm
                            onClose={() => setShowLoginForm(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default StoreDetails;
