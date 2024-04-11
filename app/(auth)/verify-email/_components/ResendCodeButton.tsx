import { generateEmailVerificationCode } from "@/app/(auth)/_actions/generateEmailVerificationCode.action";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function ResendCodeButton({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const [disabled, setDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  async function resendCode() {
    try {
      // Disable the button and set remaining time to 5 minutes (300 seconds)
      setDisabled(true);
      setRemainingTime(60);

      const res = generateEmailVerificationCode(userId, userEmail);

      toast({
        variant: "default",
        description: "Email verification code sent!",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Failed to send verification code!",
      });
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [remainingTime]);

  useEffect(() => {
    if (remainingTime === 0) {
      setDisabled(false);
    }
  }, [remainingTime]);

  return (
    <Button
      type="button"
      onClick={resendCode}
      variant={"secondary"}
      className="mt-4 w-full"
      disabled={disabled}
    >
      {remainingTime > 0
        ? `Resend code (${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? "0" : ""}${remainingTime % 60})`
        : "Resend code"}
    </Button>
  );
}
