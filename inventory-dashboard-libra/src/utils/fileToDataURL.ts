export async function fileToDataURL(f: File): Promise<string> {
  return await new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onerror = () => rej(reader.error);
    reader.onload = () => res(reader.result as string);
    reader.readAsDataURL(f);
  });
}
