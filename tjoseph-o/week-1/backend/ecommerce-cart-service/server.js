


const app = require('./app');
const { database, environment } = require('./src/config');

const startServer = async () => {
  try {
    await database.connectDB();

    const server = app.listen(environment.PORT, () => {
      console.log(`🚀 ${environment.APP_NAME} running on port ${environment.PORT}`);
      console.log(`🌍 Environment: ${environment.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${environment.PORT}/api`);
      console.log(`❤️  Health Check: http://localhost:${environment.PORT}/health`);
      
      if (environment.isDevelopment()) {
       
        console.log('\n🧪 Run tests: npm test');
        console.log('🔧 Development mode: npm run dev');
      }
    });

  
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);
      
      server.close(async (err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        
        console.log('🛑 HTTP server closed');
        
        try {
          await database.disconnectDB();
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during database disconnection:', error);
          process.exit(1);
        }
      });
    };

   
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

   
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

 
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};


if (require.main === module) {
  startServer();
}

module.exports = startServer;