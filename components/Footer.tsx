import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 bg-black text-white">
        <div className="w-4/5">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold text-[#fce3c7]">Eldics Store</h1>
          </Link>
          <p className="mt-6 text-sm">
            We are dedicated to providing the best service possible. Our team is
            committed to ensuring your satisfaction with every interaction. If
            you have any questions or concerns, please don&apos;t hesitate to
            reach out to us. We are here to help and will do our best to address
            any issues you may have. Thank you for choosing us, and we look
            forward to serving you again in the future.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-[#fce3c7] mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link className="hover:underline transition" href="/">
                  Home
                </Link>
              </li>

              <li>
                <Link className="hover:underline transition" href="/about">
                  About us
                </Link>
              </li>

              <li>
                <Link className="hover:underline transition" href="/contact">
                  Contact us
                </Link>
              </li>

              <li>
                <Link className="hover:underline transition" href="/privacy">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-[#fce3c7] mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+2348138502791</p>
              <p>contact@Eldics.dev </p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white bg-black">
        Copyright 2025 © Eldics.dev All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
