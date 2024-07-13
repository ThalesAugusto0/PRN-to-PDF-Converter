# convert-files

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

### O que fazer

1. O botão de cancelar deve limpar tudo e voltar para o estado inicial `Selecione um arquivo para começar`.
2. Criar função que chama o script python para converter e abrir o modal do windows para salvar. 
3. Criar funcionalidade para remover o arquivo selecionado.
