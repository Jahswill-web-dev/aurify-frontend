import Image from "next/image";
import CreateAccount from "./_components/creatAccount";
import signImage from "../../../public/images/signin-image.svg";
import logo from "../../../public/icons/aurify-new-logo.png";
import Link from "next/link";
import Footer from "@/components/footer/footer";

function SignUpPage() {
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

        <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="mx-auto w-full max-w-[500px]">
            <div className="rounded-md border border-grey-25 bg-white p-5 shadow-panel sm:p-8 dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
              <div className="mb-7">
                <p className="text-h6 font-semibold uppercase text-primary poppins-font">
                  Start learning
                </p>
                <h1 className="mt-2 text-h2 font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
                  Create your Aurify account
                </h1>
                <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                  Save generated Studies, practice sets, exam scores, and progress
                  in one workspace.
                </p>
              </div>
              <CreateAccount />
            </div>
          </div>

          <div className="hidden min-h-[560px] overflow-hidden rounded-md border border-grey-25 bg-white shadow-panel lg:block dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
            <div className="flex h-full flex-col justify-between p-8">
              <div>
                <p className="text-h6 font-semibold uppercase text-primary poppins-font">
                  Study from a prompt
                </p>
                <h2 className="mt-3 max-w-[520px] text-xl-head font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
                  Turn a topic into a complete learning path.
                </h2>
                <p className="mt-4 max-w-[520px] text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                  Aurify builds material, glossary terms, practice questions,
                  exam mode, and progress signals around each Study.
                </p>
              </div>

              <div className="mt-8 rounded-md border border-grey-25 bg-off-white-100 p-5 dark:border-dark-border dark:bg-dark-bg">
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Prompt", "Study", "Review"].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-sm bg-white p-3 shadow-card dark:bg-dark-surface-soft dark:shadow-none"
                    >
                      <p className="text-h6 font-semibold uppercase text-grey-100 poppins-font dark:text-dark-muted">
                        {item}
                      </p>
                      <div className="mt-3 h-2 rounded-full bg-accent-100 dark:bg-dark-border">
                        <div
                          className="h-full rounded-full bg-primary dark:bg-dark-accent"
                          style={{ width: `${55 + index * 15}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Image
                  src={signImage}
                  alt="Student creating a learning workspace"
                  width={460}
                  height={360}
                  className="mx-auto mt-8 h-auto max-h-[270px] w-full max-w-[420px]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default SignUpPage;
