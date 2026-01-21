import { invokeLLM } from "./server/_core/llm";

async function testLLM() {
  console.log("Testing LLM API connection...");
  
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Hello from Cognitect!' in one sentence." }
      ]
    });
    
    console.log("✅ LLM API is working!");
    console.log("Response:", response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error("❌ LLM API failed:", error);
    return false;
  }
}

testLLM().then(success => {
  process.exit(success ? 0 : 1);
});

