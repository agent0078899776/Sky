import { GoogleGenAI } from "@google/genai";

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined");
    process.exit(1);
  }
  const ai = new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  
  try {
    console.log("Downloading brand logo from Imgur...");
    const imgUrl = "https://i.imgur.com/5jlSX4vh.jpg";
    const res = await fetch(imgUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.statusText}`);
    }
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    
    console.log("Asking Gemini to inspect the visual properties of the logo...");
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64,
          },
        },
        "This is the current brand logo of 'SkySwitch Technologies'. Describe its precise visual design, colors, geometry, text layout, and any symbols used, so that I can recreate and upgrade it with a 3D feel/details in React.",
      ],
    });
    
    console.log("\n=== LOGO ANALYSIS ===");
    console.log(result.text);
    console.log("=====================");
  } catch (err) {
    console.error("Error analyzing logo:", err);
  }
}

run();
