export default {
  logger: [
    { type: "Console", options: { level: "info", colors: true, moduleColors: true } },
  ],
  transporter: null,
  cacher: "Memory",
  tracing: { enabled: false },
};
