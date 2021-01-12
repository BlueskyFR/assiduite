FROM alpine:latest

RUN apk add --no-cache openvpn

WORKDIR /openvpn
ADD creds .
ADD ensimag.ovpn .

ENTRYPOINT [ "openvpn", "--config", "ensimag.ovpn", "--auth-user-pass", "creds" ]