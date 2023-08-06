import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const getFirstStoreByID = async ({id} : {id: string} ) => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const store = await prismadb.store.findFirst({
    where: {
      id,
      userId,
    }
  });

  if (!store) redirect('/');
  return store
}