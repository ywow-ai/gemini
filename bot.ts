import {
  GoogleGenerativeAI,
  type GenerateContentResult,
  type GenerateContentStreamResult,
  type Part,
  type SingleRequestOptions,
  type Tool,
} from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { cancel, isCancel, outro, spinner, text } from "@clack/prompts";
import { gray } from "picocolors";
import { Lorem } from "./lorem";

const [width] = process.stdout.getWindowSize();
const prisma = new PrismaClient();
const history = await prisma.history.findMany({ include: { parts: true } });

const t = (text: string) => {
  const left_length = 3;

  const left = gray("\u2502\u0020");
  const space = "\u0020";
  const words = text.trim().split(/\s+/);

  return words.reduce(
    (prev, now) => {
      const next = prev.cum + now.length + left_length;
      const desition = next > width;
      return {
        cum: desition ? left_length : next,
        word: [...prev.word, desition ? left : space, now],
      };
    },
    { cum: left_length, word: [left] as string[] }
  );
};

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "reverse-string",
        description: "Membalikkan urutan karakter dalam string.",
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

const bot = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "")
  .getGenerativeModel({
    model: "gemini-1.5-flash",
    tools,
    systemInstruction: {
      role: "system",
      parts: [{ text: process.env.SYSTEM_PROMPT ?? "" }],
    },
  })
  .startChat({ history });

const spin = spinner();

let xx = 0;
while (xx < 3) {
  const prompt = await text({
    message: "ask",
  });
  // if (!prompt) {
  //   continue;
  // }

  // if (typeof prompt === "symbol") {
  //   continue;
  // }

  process.stdout.write(t(Lorem).word.join(""));

  // const { stream } = await bot.sendMessageStream(prompt);
  // process.stdout.write(gray("\u2502\u0020\u0020"));
  // for await (const item of stream) {
  //   process.stdout.write(
  //     t(item.candidates?.[0]?.content?.parts?.[0]?.text || "").word.join("")
  //   );
  // }
  xx++;
}

// import { cancel, isCancel, outro, spinner, text } from "@clack/prompts";
// import { Readable } from "stream";
// import { gray } from "picocolors";
// import p from "node:process";

// function X() {
//   return p.platform !== "win32"
//     ? p.env.TERM !== "linux"
//     : !!p.env.CI ||
//         !!p.env.WT_SESSION ||
//         !!p.env.TERMINUS_SUBLIME ||
//         p.env.ConEmuTask === "{cmd::Cmder}" ||
//         p.env.TERM_PROGRAM === "Terminus-Sublime" ||
//         p.env.TERM_PROGRAM === "vscode" ||
//         p.env.TERM === "xterm-256color" ||
//         p.env.TERM === "alacritty" ||
//         p.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
// }

// console.log();

// const E = X(),
//   u = (s: string, n: string) => (E ? s : n),
//   a = u("\u2502", "|"),
//   m = u("\u2514", "\u2014");

// const createStream = () => {
//   return Readable.from(["Hello, ", "this is a ", "streamed message!"]);
// };

// (async () => {
//   const stream = createStream();

//   await text({ message: "ask" });
//   process.stdout.write(
//     `${gray(a)}\n${gray(
//       m
//     )}  ${"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga ut veritatis dignissimos suscipit ipsum saepe aut beatae repudiandae in qui quis quidem, est ipsa! Doloremque fugiat fugit ab suscipit! Rerum?"}`
//   );
//   await text({ message: "ask" });
//   process.stdout.write(
//     `${gray(a)}\n${gray(
//       m
//     )}  ${"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga ut veritatis dignissimos suscipit ipsum saepe aut beatae repudiandae in qui quis quidem, est ipsa! Doloremque fugiat fugit ab suscipit! Rerum?"}`
//   );
//   await text({ message: "ask" });
//   process.stdout.write(
//     `${gray(a)}\n${gray(
//       m
//     )}  ${"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga ut veritatis dignissimos suscipit ipsum saepe aut beatae repudiandae in qui quis quidem, est ipsa! Doloremque fugiat fugit ab suscipit! Rerum?"}`
//   );
//   // await text({ message: "ask" });
//   // outro(
//   //   "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga ut veritatis dignissimos suscipit ipsum saepe aut beatae repudiandae in qui quis quidem, est ipsa! Doloremque fugiat fugit ab suscipit! Rerum?"
//   // );
//   // await text({ message: "ask" });
//   // outro(
//   //   "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga ut veritatis dignissimos suscipit ipsum saepe aut beatae repudiandae in qui quis quidem, est ipsa! Doloremque fugiat fugit ab suscipit! Rerum?"
//   // );
//   // await text({ message: "ask" });
//   // outro(
//   //   "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga ut veritatis dignissimos suscipit ipsum saepe aut beatae repudiandae in qui quis quidem, est ipsa! Doloremque fugiat fugit ab suscipit! Rerum?"
//   // );

//   // for await (const chunk of stream) {
//   //   process.stdout.write(`${gray(a)}\n${gray(m)}  ${chunk}`);
//   //   await new Promise((resolve) => setTimeout(resolve, 100));
//   // }
// })();
