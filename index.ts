import { cancel, isCancel, outro, spinner, text } from "@clack/prompts";
import {
  GoogleGenerativeAI,
  SchemaType,
  type StartChatParams,
  type Tool,
} from "@google/generative-ai";

(async () => {
  let chatState: boolean = true;
  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const tools: Tool[] = [
    {
      functionDeclarations: [
        {
          name: "reverse-string",
          description: "Membalikkan urutan karakter dalam string.",
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              x1: {
                type: SchemaType.STRING,
                enum: ["aaa", "bbb", "ccc"],
              },
              x2: {
                type: SchemaType.STRING,
                enum: ["1", "2", "3"],
              },
              x3: {
                type: SchemaType.STRING,
              },
            },
          },
        },
        {
          name: "calculate-sum",
          description: "Menghitung jumlah dari dua angka.",
        },
        {
          name: "fetch-data",
          description: "Mengambil data dari API eksternal.",
        },
        {
          name: "generate-uuid",
          description: "Menghasilkan UUID unik baru.",
        },
        {
          name: "parse-json",
          description:
            "Menganalisis string JSON dan mengembalikannya sebagai objek.",
        },
      ],
    },
  ];

  const chat = genAi
    .getGenerativeModel({
      model: "gemini-1.5-flash",
      tools,
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

    const funcs = response.functionCalls();
    if (funcs) {
      for (const fn of funcs) {
        fn.name;
        tools.find((x) => {
          x;
        });
      }
    }
    // process.stdout.write(response.text());
    // console.log(response.functionCalls());
    // console.log(response.promptFeedback);
    // console.log(response.candidates);
    // console.log(...(await chat.getHistory()));

    outro(response.text());
  }
})().catch(console.error);
