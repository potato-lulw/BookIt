// src/services/api/experienceApi.ts

import type { ApiResponse } from "@/types/api.types";
import type { AllExperience, SingleExperienceResponseData, } from "@/types/experience.types";
import { api } from "../api";

export const experienceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/experiences
    getAllExperiences: builder.query<ApiResponse<AllExperience[]>, void>({
      query: () => ({
        url: "/experiences",
        method: "GET",
      }),
      providesTags: ["Experience"],
    }),

    // GET /api/experiences/:id
    getExperienceById: builder.query<ApiResponse<SingleExperienceResponseData>, string>({
      query: (id) =>({ 
        url: `/experiences/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Experience", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllExperiencesQuery,
  useGetExperienceByIdQuery,
} = experienceApi;
