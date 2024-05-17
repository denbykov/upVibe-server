FROM alpine:3.19

ARG USERNAME=default
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apk update && \
    apk upgrade && \
    apk add sudo shadow openssh build-base \
    openssl-dev npm bash git zsh bind-tools yarn

RUN apk add openssl

RUN apk add --no-cache python3 py3-pip && \
  python3 -m venv /opt/upVibe/venv && \
  . /opt/upVibe/venv/bin/activate && \
  python3 -m pip install mutagen

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

RUN mkdir -p /opt/upVibe/server/cert && chown $USERNAME /opt/upVibe/server/cert

USER $USERNAME

RUN openssl req -x509 -newkey rsa:4096 -keyout /opt/upVibe/server/cert/privatekey.key \
    -out /opt/upVibe/server/cert/certificate.crt -days 365 -nodes -subj "/CN=localhost"

WORKDIR /workspaces/upVibe-private-workers

RUN sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions && \
  git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting && \
  git clone https://github.com/mafredri/zsh-async ~/.oh-my-zsh/plugins/async && \
  git clone https://github.com/lukechilds/zsh-nvm ~/.oh-my-zsh/custom/plugins/zsh-nvm && \
  sed -i "s/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting async zsh-nvm)/g" ~/.zshrc

ENTRYPOINT /bin/zsh
