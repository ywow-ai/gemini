import { Readable } from "stream";

const createStream = () => {
  return Readable.from(["Hello, ", "this is a ", "streamed message!"]);
};

(async () => {
  const stream = createStream();

  for await (const chunk of stream) {
    process.stdout.write(chunk); // Menampilkan teks
    await new Promise((resolve) => setTimeout(resolve, 100)); // Delay 100 ms
  }
})();
