from fastapi import FastAPI
from logging.config import dictConfig
from application.controller import Controller
from utils.logger_config import log_config

dictConfig(log_config)
app = FastAPI()
controller = Controller()
app.include_router(controller.router)

