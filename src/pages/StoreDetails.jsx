import { ScrollToTop } from '../components';
import { useStoreContext } from '../context/StoreContext';
import { hotelRules } from '../constants/data';
import { useParams } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const StoreDetails = () => {

  const { id } = useParams(); // id get form url (/room/:id) as string...
  const { stores } = useStoreContext();

  const store = stores.find(store => store.id === +id);

  // for (const key in room) {
  //   console.log(key);
  // }

  const { name, description, facilities, price, imageLg } = store ?? {};

  // Tạm thời thay thế PodTypesDropdown và StoreAddressDropdown bằng select đơn giản
  const PodTypesDropdown = () => (
    <select className="w-full p-2 border rounded">
      <option>Chọn loại Pod</option>
      <option>Pod Single</option>
      <option>Pod Double</option>
      <option>Pod Meeting</option>
    </select>
  );

  const StoreAddressDropdown = () => (
    <select className="w-full p-2 border rounded">
      <option>Chọn địa chỉ cửa hàng</option>
      <option>123 Nguyen Hue, District 1</option>
      <option>456 Le Van Sy, District 3</option>
      <option>789 Tran Hung Dao, District 5</option>
    </select>
  );

  return (
    <section>

      <ScrollToTop />

      <div className='bg-room h-[560px] relative flex justify-center items-center bg-cover bg-center'>
        <div className='absolute w-full h-full bg-black/70' />
        <h1 className='text-6xl text-white z-20 font-primary text-center'>{name} Details</h1>
      </div>


      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row lg:gap-x-8 h-full py-24'>

          {/* ⬅️⬅️⬅️ left side ⬅️⬅️⬅️ */}
          <div className='w-full lg:w-[60%] h-full text-justify'>

            <h2 className='h2'>{name}</h2>
            <p className='mb-8'>{description}</p>
            <img className='mb-8' src={imageLg} alt="roomImg" />

            <div className='mt-12'>
              <h3 className='h3 mb-3'></h3>
              <p className='mb-12'> The Poddy offers a delightful blend of functionality and ambiance, making it an ideal place to relax or get work done. With a range of amenities, it provides a perfect setup for students and professionals alike. The decor combines modern and cozy elements, creating a warm and inviting space to unwind or catch up with friends. Additionally, the shop has a great selection of coffee, snacks, and refreshments, ensuring that guests have everything they need for a productive or leisurely visit. </p>

              {/* icons grid */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                {
                  facilities.map((item, index) =>
                    <div key={index} className='flex items-center gap-x-3 flex-1'>
                      <div className='text-3xl text-accent'>{<item.icon />}</div>
                      <div className='text-base'>{item.name}</div>
                    </div>
                  )
                }
              </div>
            </div>

          </div>


          {/* ➡️➡️➡️ right side ➡️➡️➡️ */}
          <div className='w-full lg:w-[40%] h-full'>

            {/* reservation */}
            <div className='py-8 px-6 bg-accent/20 mb-12'>

              <div className='flex flex-col space-y-4 mb-4'>
                <h3>Your Reservation</h3>
                
                
                <div className='h-[60px]'><PodTypesDropdown /></div>
                <div className='h-[60px]'><StoreAddressDropdown /></div>
              </div>

              <button className='btn btn-lg btn-primary w-full'>
                Book now for ${price}
              </button>
            </div>

            <div>
              <h3 className='h3'>POD Rules</h3>
              <p className='mb-6 text-justify'>
              Please follow these rules to experience the best services.
              </p>

              <ul className='flex flex-col gap-y-4'>
                {
                  hotelRules.map(({ rules }, idx) =>
                    <li key={idx} className='flex items-center gap-x-4'>
                      <FaCheck className='text-accent' />
                      {rules}
                    </li>
                  )
                }
              </ul>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};

export default StoreDetails;
