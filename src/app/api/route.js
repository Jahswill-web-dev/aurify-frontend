import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  const data = await request.json()
    console.log(data)
  try {
    const response = await axios.post(
      "https://connect.mailerlite.com/api/subscribers/",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { error: "Internal server error " },
      { status: 500 }
    );
  }
}
