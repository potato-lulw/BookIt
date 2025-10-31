
import { Button } from './ui/button'
import { Input } from './ui/input'

const Navbar = () => {
  return (
    <nav className='w-full flex justify-center items-center p-2 shadow-md'>
        <div className='max-w-7xl w-full flex flex-row justify-between items-center '>
            <img src='logo.png' className='md:w-[100px] w-[75px]'/>
            <div className='flex flex-row justify-center items-center gap-2 md:gap-4'>

            <Input className=' rounded-none bg-background2 outline-0 text-xs md:text-base' placeholder='Search experiences'/>
            <Button className='font-medium text-sm md:text-base'>Search</Button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar