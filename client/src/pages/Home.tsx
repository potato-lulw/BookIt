import ExperienceCard from "@/components/ExperienceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppSelector } from "@/hooks/useRedux";
import { useGetAllExperiencesQuery } from "@/services/api/experienceApi";



const Home = () => {
    // const [experiences, setExperiences] = useState<AllExperience[]>([]);
    const searchTerm = useAppSelector((state) => state.search.searchTerm);
    const debounce = useDebounce<string>(searchTerm, 300);

    // 🔥 If there's no search, call the endpoint without params
    const { data: AllExperiencesResponse, isLoading, error } = useGetAllExperiencesQuery(
        debounce.trim().length >= 2 ? { search: debounce } : undefined
    );
    const experiences = AllExperiencesResponse?.data;
    return (
        <div className="">
            {/* <h1 className="text-2xl font-semibold mb-6">Explore Experiences</h1> */}

            <div
                className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
            >
                {isLoading &&
                    Array.from({ length: 8 }).map((_, index) => (
                        <ExperienceCardSkeleton key={index} />
                    ))}
                {
                    !isLoading && !error && !experiences?.length && (
                        <p>No experiences found</p>
                    )
                }
                {
                    !isLoading && error && (
                        <p>Something went wrong</p>
                    )
                }
                {!isLoading && !error && experiences?.length && experiences?.map((exp) => (
                    <ExperienceCard key={exp._id} {...exp} />
                ))}
            </div>
        </div>
    );
};

export default Home;


const ExperienceCardSkeleton = () => {
    return (
        <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col animate-pulse">
            {/* Image Section */}
            <div className="relative w-full h-48">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        {/* Title skeleton */}
                        <Skeleton className="h-5 w-2/3 rounded" />
                        {/* Place name pill */}
                        <Skeleton className="h-4 w-20 rounded-full" />
                    </div>

                    {/* Description skeleton */}
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-4/5" />
                </div>

                {/* Price + Button skeleton */}
                <div className="mt-4 flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                </div>
            </div>
        </div>
    );
};

