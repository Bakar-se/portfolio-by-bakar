import BookCall from "@/components/contact/book-call";
import { ContactForm } from "@/components/contact/contact-form";
import Footer from "@/components/footer/main";
import Header from "@/components/header/main";
import Heading from "@/components/heading/main";
import { FadeUp } from "@/components/ui/animations/fade-up";
import { MotionEffect } from "@/components/ui/animations/motion-effect";
import Card from "@/components/ui/card";
import MainTitle from "@/components/ui/main-title";
import { getPageHead, pageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { Fragment } from "react";

const PAGE = "Contact";
const page = getPageHead(PAGE);

export const metadata: Metadata = pageMetadata(PAGE);

export default async function ContactPage() {
  const title = "Contact";
  const description = "Please feel free to reach out to me.";
  const imageUrl = "/pic.jpg";
  const imageAlt = "Avatar";
  const initials = "Bakar";
  return (
    <div>
      <Header />
      <Heading variant="default">
        <MotionEffect
          fade
          blur="10px"
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          inView
        >
          <MainTitle
            title={page.page}
            description={page.description}
            className="mx-auto mt-6 mb-14 max-w-3xl px-4 sm:px-6 lg:px-8"
          />
        </MotionEffect>
      </Heading>
      <div className="border-border bg-background relative min-h-[50vh] max-w-full border-t">
        <div className="relative mx-auto -mt-12 mb-6 max-w-3xl px-4 sm:mb-10 sm:px-6 lg:px-8">
          <FadeUp delay={0.5} duration={0.3}>
            <div className="mb-6">
              <BookCall />
            </div>
          </FadeUp>
          <FadeUp delay={0.6} duration={0.3}>
            <Card>
              <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <MotionEffect
                  fade
                  blur="10px"
                  delay={0.7}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  inView
                >
                  <ContactForm />
                </MotionEffect>
              </div>
            </Card>
          </FadeUp>
        </div>
      </div>
      <Footer />
    </div>
  );
}
