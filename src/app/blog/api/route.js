import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const response = await axios.get("http://localhost:1337/api/aurify-blogs?populate=*", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BLOG_TOKEN}`,
      },
    });
    
    const responseData = response.data;
    return NextResponse.json(responseData);

  } catch (error) {
    console.error(
      "Error",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   return NextResponse.json({
//     hello:"hello world"
//   })
// }
