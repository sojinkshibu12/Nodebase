import Link from "next/link";
import Image from "next/image";
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return(
          <div>
    <div className="flex   items-center justify-center flex-col  p-2 md:p-10">
            <Link href="/" className="flex items-center  gap-1 self-center font-medium">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={30}
                    height={30}
                    className="inline-block mr-1"
                />
                Nodebase
            </Link>
        </div>
    {children}</div>
    )
}