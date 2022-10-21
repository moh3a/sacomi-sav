export const PADDING = "px-3 py-1";
export const ROUNDED = "rounded-lg";
export const SHADOW = `shadow-md shadow-primary/50`;

export const TEXT_GRADIENT = ` bg-clip-text text-transparent bg-gradient-to-r from-primaryDark via-secondaryDark to-primaryDark dark:from-primaryLight dark:via-secondaryLight dark:to-primaryLight  `;

export const BG_GRADIENT = ` bg-gradient-to-r from-primaryLight to-secondaryLight dark:from-primaryDark dark:to-secondaryDark `;
export const BG_GRADIENT_REVERSE = `bg-gradient-to-r from-primaryDark to-secondaryDark dark:from-primaryLight dark:to-secondaryLight `;

/**
 * BUTTONS
 */
export const BUTTON_VARIANTS = {
  solid: ` ${BG_GRADIENT_REVERSE} font-bold text-center text-contentDark dark:text-contentLight disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `,
  outline: ` font-bold text-center ${TEXT_GRADIENT} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `,
};

/**
 * INPUTS
 */
// export const TEXT_INPUT = ` caret-primary border border-primary focus:outline outline-primary bg-primaryLight dark:bg-primaryDark ${ROUNDED} ${PADDING} `;
export const TEXT_INPUT = ` caret-primary focus:outline outline-primary shadow-sm bg-white shadow-primaryDark dark:bg-black dark:shadow-primaryLight ${ROUNDED} ${PADDING} `;
