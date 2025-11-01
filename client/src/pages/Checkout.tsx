import Breadcrumbs from '@/components/Breadcrumb'
import dayjs from 'dayjs'

import { useLocation, useNavigate } from 'react-router-dom'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useValidatePromoMutation } from '@/services/api/promoApi';
import { useBookExperienceMutation } from '@/services/api/bookingApi';
dayjs.extend(customParseFormat);

interface CheckoutState {
  date: string,
  name: string,
  time: string,
  experienceId: string,
  slotId: string,
  quantity: number,
  taxes: number,
  subtotal: number,
  total: number
}

const Checkout = () => {

  const location = useLocation();
  const state = location.state as CheckoutState | null;
  if (!state) return <div>No checkout state found</div>
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoDetails, setPromoDetails] = useState<any>(null);
  const { date, time, experienceId, slotId, quantity, taxes, subtotal, total, name } = state;
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    promoUsed: '',
    checkboxChecked: false
  });
  const [validatePromo, { isLoading: isValidatingPromo }] = useValidatePromoMutation();
  const [bookExperience, { isLoading: isBooking }] = useBookExperienceMutation();
  const navigate = useNavigate();

  const handlePay = async () => {
    try {
      const result = await bookExperience({
        name: formData.userName,
        email: formData.email,
        experienceId,
        slotId,
        quantity,
        promoUsed: promoApplied ? formData.promoUsed : undefined,
        userId: '643c1f4f3f1a2b001f6e4c8a' 
      }).unwrap();
      if (result.data) {
        navigate('/booking-success', { state: { bookingId: result.data.bookingId } });
      }
    } catch (error) {
      console.error("Payment failed", error);
    }
  }


  const handlePromo = async () => {
    try {
      const result = await validatePromo({ code: formData.promoUsed, totalAmount: total }).unwrap();
      if (result.data) {
        setPromoApplied(true);
        setPromoDetails(result.data);
      }
    } catch (error) {
      console.error("Promo validation failed", error);
      setPromoApplied(false);
      setPromoDetails(null);
    }

  }
  return (
    <div className='flex flex-col items-center w-full h-full overflow-hidden gap-2'>
      <div className='w-full'>
        <Breadcrumbs />
      </div>
      <div className='flex flex-col lg:flex-row gap-4 lg:justify-between w-full h-full'>
        <div className='lg:w-4/6 w-full flex flex-col  gap-4  overflow-hidden '>

          <div className='bg-background2 p-4 rounded-lg space-y-2 w-full'>
            <form className='space-y-4'>
              <div className='flex flex-row gap-2 justify-between items-center '>
                <div className='w-full'>
                  <label className='text-sm text-gray-500'>Full Name</label>
                  <Input className='bg-background3 rounded-md border border-border' placeholder='Your name' value={formData.userName} onChange={(e) => setFormData((prev) => ({ ...prev, userName: e.target.value }))} />
                </div>
                <div className='w-full'>
                  <label className='text-sm text-gray-500'>Email</label>
                  <Input type='email' className='bg-background3 rounded-md border border-border' placeholder='Your email' value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
                </div>
              </div>
              <div className='flex flex-row gap-2'>

                <Input className='bg-background3 flex-1 rounded-md border border-border' placeholder='Promo Code' value={formData.promoUsed} onChange={(e) => setFormData((prev) => ({ ...prev, promoUsed: e.target.value }))} />
                <Button disabled={isValidatingPromo || promoApplied} onClick={handlePromo} className='bg-black text-white '>Apply</Button>
              </div>
              <div className='flex flex-row justify-start items-center gap-2'>

                <Input type='checkbox' onChange={(e) => setFormData((prev) => ({ ...prev, checkboxChecked: e.target.checked }))} className='accent-primary w-fit' /> <span className='text-sm text-gray-500'>I agree to the Terms & Conditions</span>
              </div>
            </form>

          </div>
        </div>

        <div className='lg:flex-1 w-full  text-sm overflow-y-auto '>
          <div className="bg-background2 p-4 rounded-lg space-y-2">
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Name</span>
              <span>{name}</span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Date</span>
              <span>{dayjs(date).format('MMM D')}</span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Time</span>
              <span>{dayjs(time, "HH:mm").format("h:mm A")}</span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Taxes</span>
              <span>₹{taxes}</span>
            </div>
            {
              promoApplied && promoDetails ? (
                <div className="flex flex-row justify-between items-center">
                  <span className="text-gray-500 text-xs">Promo ({promoDetails.code} )</span>
                  <span className='text-green-500'> - ₹{promoDetails.save}</span>
                </div>
              ) : null
            }
            {
              promoApplied && promoDetails && (
                <div className="flex flex-row justify-between items-center">
                  <span className="text-gray-500 text-xs">({promoDetails.description} )</span>
                </div>
              )
            }
            <div className="h-px bg-gray-300 w-full"></div>
            <div className="flex flex-row justify-between items-center font-medium text-base">
              <span className="">Total</span> ₹{total - (promoApplied && promoDetails ? promoDetails.save : 0)}
            </div>

            <Button onClick={handlePay} disabled={!formData.checkboxChecked || !formData.email || !formData.userName} className="w-full bg-primary text-foreground py-2 rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed">Confirm & Pay</Button>
          </div>



        </div>


      </div>
    </div>
  )
}

export default Checkout