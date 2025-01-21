import { cancel, isCancel, outro, spinner, text } from "@clack/prompts";
import {
  GoogleGenerativeAI,
  type StartChatParams,
} from "@google/generative-ai";

(async () => {
  let chatState: boolean = true;
  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const chat = genAi
    .getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: process.env.SYSTEM_PROMPT ?? "" }],
      },
    })
    .startChat({ history: [{ role: "user", parts: [{ text: "halo" }] }] });

  const s = spinner();
  while (chatState) {
    const rl = await text({ message: "Ask Gemini" });

    if (typeof rl === "symbol") {
      if (isCancel(rl)) {
        chatState = false;
        cancel("Stopping");
        break;
      }

      continue;
    }

    const fun = {
      "\\q": () => {
        chatState = false;
        outro("Bye..");
      },
    };

    const prompt = fun[rl as keyof typeof fun] ?? rl;

    if (typeof prompt === "function") {
      prompt();
      continue;
    }

    s.start("Waiting");
    const { response } = await chat.sendMessage(prompt);
    s.stop("Gemini");
    outro(response.text());
  }
})().catch(console.error);
