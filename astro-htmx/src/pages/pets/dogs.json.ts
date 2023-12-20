import { getCollection, type CollectionEntry } from "astro:content";

export async function GET() {
  const dogs: CollectionEntry<"dogs">[] = await getCollection("dogs");
  const data = dogs.map((dog) => dog.data);
  return new Response(JSON.stringify(data));
}
