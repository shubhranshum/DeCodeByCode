const theme = "dark";
// utils/theme.js (Create this helper file)

export const setTheme = (theme) => {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

export const getTheme = () =>
  localStorage.getItem("theme") || "dark"; // default to light
