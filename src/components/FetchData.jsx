import React, { useState, useEffect } from 'react';

const FetchData = () => {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await fetch('https://poddy.store/api/v1/pods');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPods(data);
        console.log(data);
        setLoading(false);
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
        setLoading(false);
        console.error('Lỗi:', err);
      }
    };

    fetchPods();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Danh sách Pods</h2>
      {pods.map((pod) => (
        <div key={pod.pod_id}>
          <h3>{pod.pod_name}</h3>
          <p>Loại: {pod.type_id}</p>
          <p>Trạng thái: {pod.is_available ? 'Có sẵn' : 'Không có sẵn'}</p>
        </div>
      ))}
    </div>
  );
};

export default FetchData;