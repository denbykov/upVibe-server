export const readJSON = async (body: ReadableStream<Uint8Array>) => {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const chunks: Array<string> = [];

  async function read() {
    const { done, value } = await reader.read();
    if (done) {
      return JSON.parse(chunks.join(''));
    }
    const chunk = decoder.decode(value, { stream: true });
    chunks.push(chunk);
    return read();
  }
  return read();
};
