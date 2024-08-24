import { NextRequest, NextResponse } from "next/server";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

// Define a component to render the payment details
function PaymentDetails({
  data,
}: {
  data: Record<string, string>;
}): ReactElement {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-xl p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Details
        </h2>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <span className="font-semibold text-gray-600 capitalize">
                {key.replace(/([a-z])([A-Z])/g, "$1 $2")}:
              </span>{" "}
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const contentType: string = req.headers.get("content-type") || "";
    let data: Record<string, any> | null = null;

    if (contentType.includes("application/json")) {
      const rawBody: string = await req.text();
      data = JSON.parse(rawBody);
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData: FormData = await req.formData();
      data = {};
      formData.forEach((value, key) => {
        data![key] = value;
      });
    } else if (contentType.includes("text/plain")) {
      const rawBody: string = await req.text();
      data = { text: rawBody };
    } else {
      return NextResponse.json(
        { error: `Unsupported content type: ${contentType}` },
        { status: 415 }
      );
    }

    // Render the PaymentDetails component to an HTML string
    //@ts-ignore
    const html = renderToString(<PaymentDetails data={data} />);

    // Return the HTML response
    return new NextResponse(`<!DOCTYPE html>${html}`, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 400 }
    );
  }
}
