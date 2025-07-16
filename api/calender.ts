import { CalenderResponse, DayData } from "@/types/calender";
import axios, { AxiosInstance } from "axios";

class CalenderApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://localhost:3000/api", // Adjust the base URL as needed
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  setToken(token: string) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  async getCalenderData(date: string): Promise<DayData[]> {
    try {
      const response = await this.axiosInstance.get<CalenderResponse>(
        "/calender",
        { params: { date } }
      );
      if (response.data.errorCode) {
        throw new Error(response.data.message);
      }
      return response.data.result?.dataList ?? [];
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error.message || "API error"
      );
    }
  }
}
export default new CalenderApi();
