import { SVGProps } from "react";

import { classNames } from "app/utils/class-names";

// Placeholder mark: replace this with your own logo SVG.
export const Logo: React.FC<Omit<SVGProps<SVGSVGElement>, "ref">> = ({
  className,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className={classNames(
        "fill-stone-400/60 hover:fill-stone-300 transition-all",
        className
      )}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M20 2 L38 20 L20 38 L2 20 Z M20 9 L31 20 L20 31 L9 20 Z"
      />
    </svg>
  );
};
