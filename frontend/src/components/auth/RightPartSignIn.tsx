import background from "@/assets/background.png";

const RightPartSignIn = () => {
  return (
    <div className="relative hidden md:flex h-full w-full overflow-hidden">
      <img
        src={background}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full items-center px-16">
        <div>
          <h1 className="text-6xl font-bold tracking-tight text-white">
            Pay<span className="text-[#6366f1]">U</span>
          </h1>

          <h2 className="mt-2 text-5xl font-bold leading-tight text-white">
            Payments made
          </h2>

          <h2 className="text-5xl font-bold leading-tight text-[#6366f1]">
            simple, secure &amp; instant
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RightPartSignIn;