module.exports = {
  apps: [
    {
      name: "byeol fanpage",
      script: "/home/streaming/.local/bin/waitress-serve",
      interpreter: "/usr/bin/python",
      instances: 1,
      cwd: "/home/streaming/fan-profile",
      args: "--listen=0.0.0.0:32443 app_utf8:app",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      autorestart: true,
      max_restarts: 10
    }
  ]
}
