import { useStoreContext } from '../context/StoreContext';
import { BsChevronDown } from 'react-icons/bs';
import { podtypesList } from '../constants/data';
import { Menu } from '@headlessui/react';


const PodTypesDropdown = () => {

  const { podtypes, setPodtypes, } = useStoreContext();


  return (
    <Menu as='div' className='w-full h-full bg-white relative'>


      <Menu.Button className='w-full h-full flex items-center justify-between px-8'>
        {podtypes}
        <BsChevronDown className='text-base text-accent-hover' />
      </Menu.Button>


      <Menu.Items as='ul' className='bg-white absolute w-full flex flex-col z-40'>
        {
          podtypesList.map(({ name }, idx) =>
            <Menu.Item
              as='li'
              key={idx}
              onClick={() => setPodtypes(name)}
              className='border-b last-of-type:border-b-0 h-10 hover:bg-accent hover:text-white w-full flex items-center justify-center cursor-pointer'
            >
              {name}
            </Menu.Item>
          )
        }
      </Menu.Items>


    </Menu>
  );
};

export default PodTypesDropdown;
