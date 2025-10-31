import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { setSearchTerm } from "@/store/slices/searchSlice"; 

const Navbar = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    dispatch(setSearchTerm(search));
  };

  return (
    <nav className="w-full flex justify-center items-center px-6 py-2 shadow-md">
      <div className="max-w-7xl w-full flex flex-row justify-between items-center">
        <img src="/logo.png" className="md:w-[100px] w-[75px]" alt="Logo" />

        <form
          onSubmit={handleSubmit}
          className="flex flex-row justify-center items-center gap-2 md:gap-4"
        >
          <Input
            name="search"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="rounded-none bg-background2 outline-0 text-xs md:text-base"
            placeholder="Search experiences"
          />
          <Button type="submit" className="font-medium text-sm md:text-base">
            Search
          </Button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
