# -*- coding: utf-8 -*-
from flask import Flask, render_template, render_template_string
import time

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 3600

@app.after_request
def add_cache_headers(response):
    response.headers["Cache-Control"] = "public, max-age=3600"
    response.headers.pop("Pragma", None)
    response.headers.pop("Expires", None)
    return response

@app.route("/")
def index():
    asset_version = int(time.time())
    return render_template("index.html", asset_version=asset_version)

@app.errorhandler(404)
def page_not_found(e):
    return render_template_string("""
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="icon" href="https://www.eunbyeol.kr/static/favicon.ico">
                <title>페이지를 찾을 수 없습니다 - Eunbyeol.kr</title>
            </head>
            <style>
                body {font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;letter-spacing: -0.02em;overflow-x: hidden;background-color: #171717 translate="no"}
                html, body {overflow-x: hidden;position: relative;width: 100%;   -ms-overflow-style: none; scrollbar-width: none;}
                html ::-webkit-scrollbar {
                    display: none;
                }

            </style>
            <body>
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #f8f9fa; color: #333; font-family: Arial, sans-serif;">
                    <h1 style="font-size: 72px; margin-bottom: 0; text-align: center;">
                        길을 잠깐 잃은 것 같아요
                    </h1>
                    <p style="font-size: 18px; margin-top: 10px; text-align: center;">
                        찾으시는 페이지가 없거나 다른 곳으로 이동되었어요.<br>
                        올바른 URL: <a href="https://www.eunbyeol.kr" style="color:#4e73df; text-decoration:none;">https://www.eunbyeol.kr</a>
                    </p>
                    <br><br><br>
                </div>
            </body>
            </html>
    """), 404

if __name__ == "__main__":
    app.run(port=32443, debug=True)