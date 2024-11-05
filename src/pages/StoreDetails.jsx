import React, { useState, useEffect } from "react";

import { storeRules } from "../constants/data";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheck, FaMapMarkerAlt, FaPhone, FaUsers, FaUser, FaStar } from "react-icons/fa";
import Loading from "../components/Loading";
import LoginForm from "../components/LoginForm";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";


const POD_TYPES = [
    { id: 1, name: 'Single POD', icon: FaUser },
    { id: 2, name: 'Double POD', icon: FaUsers },
    { id: 3, name: 'Meeting Room', icon: FaUsers }
];

const StoreDetails = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [pods, setPods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPods, setTotalPods] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { login } = useAuth();
    const ITEMS_PER_PAGE = 3;
    const [allPods, setAllPods] = useState([]); // Lưu tất cả pods
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPods, setFilteredPods] = useState([]); // Lưu kết quả search
    const [displayedPods, setDisplayedPods] = useState([]); // Lưu pods đang hiển thị

    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                setLoading(true);
                // Fetch store info
                const response = await fetch(`${API_URL}/api/v1/stores/${id}`);
                if (!response.ok) {
                    throw new Error("Không thể lấy thông tin cửa hàng");
                }
                const data = await response.json();
                setStore(data);

                // Fetch tất cả pods không giới hạn limit
                const podsResponse = await fetch(`${API_URL}/api/v1/stores/${id}/pods?limit=100`);
                if (!podsResponse.ok) {
                    setAllPods([]);
                    setFilteredPods([]);
                    setDisplayedPods([]);
                    setTotalPods(0);
                    return;
                }
                const podsData = await podsResponse.json();
                
                // Lọc chỉ lấy những pod có is_available là true
                const availablePods = podsData.pods.filter(pod => pod.is_available === true);
                setAllPods(availablePods);
                setFilteredPods(availablePods);
                setDisplayedPods(availablePods.slice(0, ITEMS_PER_PAGE));
                setTotalPods(availablePods.length);
                
            } catch (error) {
                console.error("Lỗi khi lấy thông tin:", error);
                showToast("Không thể lấy thông tin cửa hàng", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetails();
    }, [id, API_URL, showToast]);

    const handleViewDetails = (podId) => {
        navigate(`/pod/${podId}`);
    };

    const handleLoginSuccess = async (message, token) => {
        setShowLoginForm(false);
        await login(token);
        showToast(message, "success");
    };

    const handleFilterByType = (typeName) => {
        setSearchTerm(typeName);
        setCurrentPage(1);

        if (!typeName) {
            // Nếu bỏ filter, hiển thị lại tất cả pod available
            setFilteredPods(allPods);
            setDisplayedPods(allPods.slice(0, ITEMS_PER_PAGE));
            setTotalPods(allPods.length);
        } else {
            // Lọc pods theo type trong số các pod available
            const filtered = allPods.filter(pod => 
                pod.type.type_name === typeName
            );
            setFilteredPods(filtered);
            setDisplayedPods(filtered.slice(0, ITEMS_PER_PAGE));
            setTotalPods(filtered.length);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        const podsToDisplay = searchTerm ? filteredPods : allPods;
        setDisplayedPods(podsToDisplay.slice(startIndex, endIndex));
        console.log('Page changed:', page); // Để debug
        console.log('Displayed pods:', podsToDisplay.slice(startIndex, endIndex)); // Để debug
    };

    if (loading) {
        return <Loading />;
    }

    if (!store) {
        return <div>Không tìm thấy thông tin cửa hàng</div>;
    }

    return (
        <section>
            

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
                            className="mb-4"
                            src={store.image}
                            alt={store.store_name}
                        />

                        {/* Thêm địa chỉ và s hotline */}
                        <div className="mb-8">
                            <p className="flex items-center mb-2">
                                <FaMapMarkerAlt className="text-accent mr-2" />
                                <span>{store.address}</span>
                            </p>
                            <p className="flex items-center">
                                <FaPhone className="text-accent mr-2" />
                                <span>{store.hotline}</span>
                            </p>
                        </div>

                        <div className="mt-8">
                            <h3 className="h2 mb-3">About</h3>
                            <p className="mb-4">
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
                                    <div className="grid grid-cols-3 gap-6 mb-4">
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
                        {/* Store Rules */}
                        <div className="bg-accent/20 p-4 rounded-lg mb-6">
                            <h3 className="h3 mb-4">Store Rules</h3>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="mb-6 text-justify">
                                    Please follow these rules to experience the best services.
                                </p>
                                <ul className="flex flex-col gap-y-4">
                                    {storeRules.map(({ rules }, idx) => (
                                        <li key={idx} className="flex items-center gap-x-4">
                                            <FaCheck className="text-accent" />
                                            {rules}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Customer Reviews */}
                        {store?.feedbacks && store.feedbacks.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Customer Reviews</h3>
                                <div className="space-y-6">
                                    {store.feedbacks
                                        .sort((a, b) => b.rating - a.rating)
                                        .slice(0, 4)
                                        .map((feedback, idx) => (
                                            <div 
                                                key={idx} 
                                                className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-lg text-gray-800">
                                                            {feedback.user_name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Pod: {feedback.pod_name}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`${
                                                                    i < feedback.rating 
                                                                        ? 'text-yellow-400' 
                                                                        : 'text-gray-200'
                                                                }`}
                                                                size={18}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                {feedback.comment && (
                                                    <p className="text-gray-600 text-sm italic">
                                                        "{feedback.comment}"
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-4 mb-24">
                <h2 className="font-primary text-[45px] mb-6">Pod List</h2>
                
                {allPods.length > 0 ? (
                    <>
                        {/* Filter buttons */}
                        <div className="flex justify-start gap-4 mb-12">
                            <button
                                onClick={() => handleFilterByType('')}
                                className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all duration-300 ${
                                    !searchTerm 
                                    ? 'bg-accent text-white' 
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                            >
                                All Pods
                            </button>
                            {POD_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleFilterByType(type.name)}
                                    className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all duration-300 ${
                                        searchTerm === type.name 
                                        ? 'bg-accent text-white' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    <type.icon className="text-lg" />
                                    {type.name}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-8">
                            {displayedPods.map((pod) => (
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
                                                Type: {pod.type.type_name}
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

                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={searchTerm ? filteredPods.length : allPods.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-xl text-gray-600">No PODs available at this store yet.</p>
                    </div>
                )}
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
