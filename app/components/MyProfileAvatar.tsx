import Image from "next/image";

type Props = {};

function MyProfileAvatar({}: Props) {
  return (
    <section className="w-full mx-auto">
      <Image
        className="border-4 border-black dark:border-slate-100 drop-shadow-xl shadow-black rounded-md mx-auto mt-8"
        src="/images/profile_avatar.jpeg"
        alt="Winston"
        height={650}
        width={650}
        priority={true}
        //tell nextjs it will be loaded immediately
      />
    </section>
  );
}

export default MyProfileAvatar;
