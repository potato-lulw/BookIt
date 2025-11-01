import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Success = () => {
    const location = useLocation();
    const state = location.state as { bookingId: string } | null;
    if (!state) return <div>No booking information found</div>
    const { bookingId } = state;
    const navigate = useNavigate();
    return (
        <div className='flex flex-col justify-center items-center flex-1 h-full gap-4'>
            <div className='w-20 h-20 rounded-full bg-green-500 flex justify-center items-center' ><Check size={30} className='text-background font-bold'/></div>
            <h1 className='text-2xl font-medium'>Booking Confirmed!</h1>
            <p>Ref Id: {bookingId}</p>
            <Button className='bg-background2' onClick={() => navigate('/')}>Back to Home</Button>
        </div>
    )
}

export default Success