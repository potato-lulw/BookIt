import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface ExperienceCardProps {
  _id: string;
  destinationName: string;
  placeName: string;
  description: string;
  price: number;
  thumbnail: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  _id,
  destinationName,
  placeName,
  description,
  price,
  thumbnail,
}) => {
  const navigate = useNavigate();


  return (
    <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:scale-[1.01] duration-200">
      {/* Image Section */}
      <div className="relative w-full h-48">
        <img
          src={thumbnail.slice(0, thumbnail.lastIndexOf('=')) + '=300'}
          alt={destinationName}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold leading-tight">
              {destinationName}
            </h2>
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
              {placeName}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price + Button */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium flex flex-row gap-2 justify-center items-center">
            From <span className="text-lg">₹{price.toLocaleString("en-IN")}</span>
          </span>
          <Button variant="default" size="sm" onClick={() => navigate(`/details/${_id}`)}>
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;





