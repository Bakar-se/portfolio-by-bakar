import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { BOOKING_URL } from "@/config/booking";
import { ArrowUpRightIcon, CalendarDaysIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

/** Invites visitors to book a call instead of writing a message. */
const BookCall: FC = () => (
  <Card>
    <div className="flex flex-col items-center gap-4 px-4 py-6 text-center sm:flex-row sm:px-8 sm:text-left">
      <div className="border-border bg-accent/50 flex size-12 shrink-0 items-center justify-center rounded-xl border">
        <CalendarDaysIcon className="text-foreground size-6" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <h2 className="text-accent-foreground text-lg font-semibold">
          Prefer to talk?
        </h2>
        <p className="text-foreground text-sm">
          Pick a time that suits you on my calendar and we&apos;ll have a call.
        </p>
      </div>
      <Button asChild>
        <Link href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a call
          <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  </Card>
);

export default BookCall;
