import DropUpload from "@/components/dropupload/drop-upload";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import { ArrowUpRight, LogInIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = auth();

  return (
    <div className="w-full h-full bg-gradient-to-tr from-green-200 via-green-400 to-green-500">
      <div className="absolute flex top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div>
            <h1 className="text-4xl font-semibold">Chat With Any Pdf</h1>
          </div>
          {userId ? (
            <div className="sm:mt-4 space-x-3 space-y-3">
              <Button>
                Go to Chat
                <ArrowUpRight className="ml-2 h-6 w-6" />
              </Button>
              <Button variant={"outline"}>Manage Subscription</Button>
            </div>
          ) : (
            <> </>
          )}
          <p className="max-w lg:max-w-xl text-muted-foreground  mt-1 text-lg text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>
          <div className="w-full mt-4">
            {userId ? (
              <DropUpload />
            ) : (
              <Link href={"/sign-in"}>
                <Button variant={"secondary"}>
                  Login to Get Started
                  <LogInIcon className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
