// src/services/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // ✅ all routes share /api prefix
    credentials: "include",
  }),
  tagTypes: ["Experience", "Booking", "Promo"],
  endpoints: () => ({}), // empty, will be injected
});
