import Image from "next/image";
import Link from "next/link";
export function LoginPopUp() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div
        className="bg-white rounded-md text-p-text 
        p-4 left-2/4"
      >
        <div className="flex flex-col items-center gap-2">
          {/* <Image src={expired} alt="" height={50} width={50}/> */}
          <h3 className="text-2xl">Whoops!! your session has expired</h3>
          <p>Simply Login again to continue using aurify</p>
          <Link href="/login" className="py-2 px-4 bg-primary rounded text-secondary
          cursor-pointer">Login</Link>
        </div>
      </div>
    </div>
  );
}
