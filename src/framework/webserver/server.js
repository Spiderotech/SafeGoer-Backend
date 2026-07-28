const serverConfig = (server, config) => {
  const startServer = () => {
    server.on("error", (error) => {
      console.error(`Server failed to listen on port ${config.port}:`, error.message);
      process.exit(1);
    });

    server.listen(config.port, () => {
      console.log(`Server listening on Port ${config.port}`);
    });
  };

  return {
    startServer,
  };
};

export default serverConfig;
