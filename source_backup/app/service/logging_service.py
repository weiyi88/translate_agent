import logging
import os
from datetime import date, datetime

from app.util.config import Settings


class LoggingService:
    def __init__(self):
        self.last_log_date = None
        self.log_dir = Settings.LOGGING_LOG_PATH
        os.makedirs(self.log_dir, exist_ok=True)

    def configure_logging(self):
        today = date.today().strftime("%Y-%m-%d")
        if self.last_log_date != today:
            self.last_log_date = today
            file_name = f"{today}-translation.log"

            # Remove existing handlers
            for handler in logging.root.handlers[:]:
                logging.root.removeHandler(handler)

            # Create new file handler
            file_handler = logging.FileHandler(
                os.path.join(self.log_dir, file_name), mode="a")
            file_handler.setFormatter(logging.Formatter(
                "%(asctime)s:%(levelname)s:%(message)s"))

            # Configure root logger
            logging.root.setLevel(logging.INFO)
            logging.root.addHandler(file_handler)

            logging.info("Logging service reconfigured for new day")

    def log(self, level, message):
        self.configure_logging()  # Ensure logging is configured for the current day
        logging.log(level, message)


# Global instance of LoggingService
logging_service = LoggingService()


def launch_logging_service():
    logging_service.configure_logging()
    logging.info("Logging service launched")

# Use this function to log messages


def log_message(level, message):
    logging_service.log(level, message)
