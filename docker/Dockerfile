FROM ruby:3.1-bullseye

# Minimal toolchain for native gems and Jekyll asset processing.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN gem install bundler -v 2.5.23

WORKDIR /var/jekyll
