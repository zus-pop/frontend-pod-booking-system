import { PodTypesDropdown, StoreAddressDropdown } from '.';
import { useRoomContext } from '../context/RoomContext';


const SearchForm = () => {

  const { handleCheck } = useRoomContext();


  return (
    <form className='h-[300px] lg:h-[70px] w-full'>
      <div className='flex flex-col w-full h-full lg:flex-row'>

       
        <div className='flex-1 border-r'>
          <PodTypesDropdown />
        </div>

        <div className='flex-1 border-r'>
          <StoreAddressDropdown />
        </div>

        <button
          type='submit'
          className='btn btn-primary'
          onClick={(e) => handleCheck(e)}
        >
          Search
        </button>

      </div>
    </form>
  );
};

export default SearchForm;
