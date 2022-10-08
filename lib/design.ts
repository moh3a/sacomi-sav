export const PRIMARY_COLOR = {
  light: "teal-600",
  dark: "teal-600",
  caret: "caret-teal-600",
  border: "border-teal-600",
  outline: "outline-teal-600",
};

export const PRIMARY_TEXT_COLOR = {
  light: "text-slate-800",
  dark: "text-slate-100",
};

export const GRADIENT_VARIANTS = {
  light: {
    from: "from-neutral-900",
    to: "to-slate-900",
  },
  dark: {
    from: "from-rose-100",
    to: "to-teal-100",
  },
};

export const PADDING = "px-3 py-1";
export const ROUNDED = "rounded-lg";

export const TEXT_GRADIENT = `bg-clip-text text-transparent bg-gradient-to-r ${GRADIENT_VARIANTS.light.from} ${GRADIENT_VARIANTS.light.to} dark:${GRADIENT_VARIANTS.dark.from} dark:${GRADIENT_VARIANTS.dark.to}`;

export const BG_GRADIENT = `bg-gradient-to-r ${GRADIENT_VARIANTS.light.from} ${GRADIENT_VARIANTS.light.to} dark:${GRADIENT_VARIANTS.dark.from} dark:${GRADIENT_VARIANTS.dark.to}`;
export const BG_GRADIENT_REVERSE = `bg-gradient-to-r dark:${GRADIENT_VARIANTS.light.from} dark:${GRADIENT_VARIANTS.light.to} ${GRADIENT_VARIANTS.dark.from} ${GRADIENT_VARIANTS.dark.to}`;

export const SHADOW = {
  light: `shadow-md shadow-${PRIMARY_COLOR.light}-500/50`,
  dark: `shadow-md shadow-${PRIMARY_COLOR.light}-500/50`,
};

/**
 * BUTTONS
 */
export const BUTTON_VARIANTS = {
  solid: `font-bold text-center ${PRIMARY_TEXT_COLOR.dark} dark:${PRIMARY_TEXT_COLOR.light} ${BG_GRADIENT} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `,
  outline: `font-bold text-center ${TEXT_GRADIENT} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `,
};

/**
 * INPUTS
 */
export const TEXT_INPUT = `${PRIMARY_COLOR.caret} border ${PRIMARY_COLOR.border} focus:outline ${PRIMARY_COLOR.outline} ${ROUNDED} ${PADDING}`;
export const PASSWORD_INPUT = `${PRIMARY_COLOR.caret} border ${PRIMARY_COLOR.border} focus:outline ${PRIMARY_COLOR.outline} ${ROUNDED} ${PADDING}`;
