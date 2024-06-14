import Image from "next/image";
import Posts from "./components/Posts";
import MyProfileAvatar from "./components/MyProfileAvatar";

export const revalidate = 86400;

export default function Home() {
  return (
    <div className="mx-auto">
      <MyProfileAvatar />
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 👋&nbsp;
        <span className="whitespace-nowrap">
          I&apos;m <span className="font-bold">Who I&apos;m</span>.
        </span>
      </p>
      <Posts />
    </div>
  );
}
