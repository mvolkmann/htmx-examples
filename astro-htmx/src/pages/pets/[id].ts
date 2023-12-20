import type { APIContext } from "astro";
import type { APIRoute } from "astro";

export function getStaticPaths() {
  return [{ params: { id: "1" } }];
}

// export function GET({ params, request }: APIContext) {
export const GET: APIRoute = ({ params, request }) => {
  console.log("dogs-api.ts: params =", params);
  // console.log("dogs-api.ts: request =", request);
  const dog = { name: "Comet", breed: "Whippet" };
  return new Response(JSON.stringify(dog));
};
