FROM rust:buster

WORKDIR /usr/src/cli
COPY . .

RUN cargo install --path .

CMD ["cli"]