FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN useradd --create-home --uid 10001 --shell /usr/sbin/nologin runner \
    && mkdir -p /workspace \
    && chown runner:runner /workspace

USER 10001:10001
WORKDIR /workspace

# Only the Python standard library is present. Learner code runs with -I -B,
# without network access, with a read-only workspace and bounded resources.
CMD ["python3", "--version"]
