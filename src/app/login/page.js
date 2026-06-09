import Image from "next/image";
import Login from "./_components/login";
import signImage from "../../../public/images/signin-image.svg";
import logo from "../../../public/icons/aurify-new-logo.png";
import Link from "next/link";
import Footer from "@/components/footer/footer";

function LoginPage() {
  return (
    <div className="min-h-screen bg-off-white-100 text-grey-200 dark:bg-dark-bg dark:text-dark-text">
      <main className="container flex min-h-[calc(100vh-96px)] flex-col py-6 sm:py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg"
          >
            <Image
              width={142}
              height={48}
              src={logo}
              alt="Aurify AI logo"
              className="h-auto w-[142px]"
              priority
            />
          </Link>
        </div>

        <section className="grid flex-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="order-2 hidden min-h-[560px] overflow-hidden rounded-md border border-grey-25 bg-white shadow-panel lg:order-1 lg:block dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
            <div className="flex h-full flex-col justify-between p-8">
              <div>
                <p className="text-h6 font-semibold uppercase text-primary poppins-font">
                  Learning workspace
                </p>
                <h1 className="mt-3 max-w-[520px] text-xl-head font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
                  Continue where your last Study left off.
                </h1>
                <p className="mt-4 max-w-[520px] text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                  Sign in to access generated material, glossary terms, practice
                  sets, exam mode, and progress analytics.
                </p>
              </div>

              <div className="mt-8 rounded-md border border-grey-25 bg-off-white-100 p-5 dark:border-dark-border dark:bg-dark-bg">
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Material", "Practice", "Analytics"].map((item) => (
                    <div key={item} className="rounded-sm bg-white p-3 shadow-card dark:bg-dark-surface-soft dark:shadow-none">
                      <p className="text-h6 font-semibold uppercase text-grey-100 poppins-font dark:text-dark-muted">
                        {item}
                      </p>
                      <div className="mt-3 h-2 rounded-full bg-accent-100 dark:bg-dark-border">
                        <div className="h-full w-2/3 rounded-full bg-primary dark:bg-dark-accent" />
                      </div>
                    </div>
                  ))}
                </div>
                <Image
                  src={signImage}
                  alt="Student reviewing learning material"
                  width={460}
                  height={360}
                  className="mx-auto mt-8 h-auto max-h-[270px] w-full max-w-[420px]"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[480px] lg:order-2">
            <div className="rounded-md border border-grey-25 bg-white p-5 shadow-panel sm:p-8 dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
              <div className="mb-7">
                <p className="text-h6 font-semibold uppercase text-primary poppins-font">
                  Welcome back
                </p>
                <h2 className="mt-2 text-h2 font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
                  Log in to Aurify
                </h2>
                <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                  Pick up your Studies, attempts, and saved progress.
                </p>
              </div>
              <Login />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;
