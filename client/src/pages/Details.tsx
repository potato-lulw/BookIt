import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumb";
import { useGetExperienceByIdQuery } from "@/services/api/experienceApi";
import { useParams } from "react-router-dom";
import Carousel from "@/components/Carousel";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ExperienceDetailsApiResponse, isLoading, error } = useGetExperienceByIdQuery(id!);
  const details = ExperienceDetailsApiResponse?.data;
  console.log(details)
  const images = details?.experience?.images ?? [];
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1);


  if (isLoading) return <div>Loading...</div>;
  if (error || !details) return <div>Error loading experience details.</div>;

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden gap-2">
      {/* Breadcrumb */}
      <div className="w-full">
        <Breadcrumbs />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 lg:justify-between w-full h-full">
        {/* Carousel */}
        <div className="relative lg:w-4/6 w-full flex flex-col justify-center items-center gap-4  overflow-hidden ">
          <Carousel images={images} duration={4000} />

          <div >
            <h1 className="text-xl md:text-2xl font-semibold mb-2">{details.experience.destinationName}</h1>
            <p className="text-gray-500 text-sm">{details.experience.description}</p>
          </div>

          <div className="w-full space-y-2">
            <p>Choose Date</p>
            <div className="flex flex-row gap-4 text-sm justify-start w-full items-center">
              {
                details.availability.map((avail, index) => (
                  <span onClick={() => {
                    setSelectedDateIndex(index)
                    setSelectedSlotId(null);
                    return true;
                  }
                  } className={`${index == selectedDateIndex ? "bg-primary text-foreground" : ""} bg-background p-2 border border-border rounded-sm cursor-pointer`} key={index}>{dayjs(avail.date).format("MMM D")}</span>
                ))
              }
            </div>
          </div>
          <div className="w-full space-y-2">
            <p>Choose Time</p>
            <div className="flex flex-row gap-4 text-sm justify-start w-full items-center">
              {
                details.availability[selectedDateIndex].slots.map((slot, index) => (
                  <span onClick={() => setSelectedSlotId(slot._id)} className={`${selectedSlotId == slot._id ? "bg-primary" : "bg-background"} cursor-pointer border border-border rounded-sm p-2`} key={index}>{dayjs(slot.time, "HH:mm").format("h:mm A")} <span className="text-destructive">{slot.availableSlots} Left</span></span>
                ))
              }
            </div>
            <p className="text-xs text-gray-500">All times are in IST (GMT +5:30)</p>
          </div>

          <div className="w-full space-y-2">
            <p>About</p>

            <p className="text-xs text-gray-500 bg-background2 p-1">Minimmum age 10</p>
          </div>
        </div>


        {/* Booking Section */}
        <div className="lg:flex-1 w-full  text-sm overflow-y-auto ">
          <div className="bg-background2 p-4 rounded-lg space-y-2">

            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Starts at</span>
              <span>₹{details.experience.price}</span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Qualtity</span>
              <span className="flex gap-2 items-center">
                <Minus className={`${quantity == 1 ? "text-gray-200": ""} `} size={12} onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} />
                {quantity}
                <Plus size={12} onClick={() => setQuantity((prev) => Math.min(details.availability[selectedDateIndex].slots.find((slot) => slot._id === selectedSlotId)?.availableSlots ?? 0, prev + 1))} /></span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Subtotal</span>
              <span> ₹{ details.experience.price * quantity }</span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-gray-500 text-xs">Taxes 5%</span> { }
              <span> ₹{ details.experience.price * quantity * 0.05 }</span>
            </div>
            <div className="h-px bg-gray-300 w-full"></div>
            <div className="flex flex-row justify-between items-center font-medium text-base">
              <span className="">Total</span> ₹{details.experience.price * quantity * 1.05}
            </div>
            <button disabled={!selectedSlotId} className="w-full bg-primary text-foreground py-2 rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed">Proceed to Book</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
