import React from "react";
import { cn } from "@/lib/utils.ts";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  id?: string;
}

export const PageContainer = (props: ContainerProps) => (
  <div
    className={cn(
      "sm:px-16 px-8 py-4 flex flex-col gap-5 flex-1",
      props.className,
    )}
    id={props.id}
  >
    {props.children}
  </div>
);

interface TitleTextProps {
  className?: string;
  children: React.ReactNode;
}

export const TitleText = (props: TitleTextProps) => (
  <h1 className={cn("font-semibold text-base sm:text-lg", props.className)}>
    {props.children}
  </h1>
);
