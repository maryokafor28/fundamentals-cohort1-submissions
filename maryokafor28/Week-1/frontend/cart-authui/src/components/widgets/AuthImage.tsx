import Image from "next/image";
export default function AuthImage() {
  return (
    <div className="flex items-center justify-center bg-gray-50 w-full h-full">
      <Image
        src="/images/login-img.svg" // <-- put your shopping cart + phone image here
        alt="Authentication Illustration"
        width={500}
        height={500}
        priority
      />
    </div>
  );
}
