# Projeto_Final_BD_Brasileirao

Projeto final da matéria de Banco de Dados, ministrado em 2023.2 na UFRJ, pela professora Vivian.

## Proposta

Modelar uma base de dados em uma estrutura relacional, além de desenvolver uma aplicação web que possibilite consultas a essas bases. A interface web da aplicação pode ser encontrada [AQUI](https://github.com/brunafalheiro/projeto-brasileirao).

Esse trabalho utilizou uma base de dados que armazenas diversas informações de edições do Campeonato Brasileiro de 2003 até 2022. Esses dados podem ser encontrados em: https://www.kaggle.com/datasets/adaoduque/campeonato-brasileiro-de-futebol.

## Instalação

Infelizmente, o uso de migrations foi limitado nesse trabalho, sendo necessário fazermos as inserções à mão. A lista de instruções para geração do banco podem ser encontradas no drive, ao clicar nesse [link](https://drive.google.com/file/d/1lUOrLOcUXWlZ1kfbcX9VDcLFX47D8cuV/view?usp=sharing). Executando todas essas funções dentro de um BD **MySQL** você irá instanciar todas as tabelas, assim como todos os dados que as populam.

A API foi desenvolvida em NODE - JS, com auxílio de 3 bibliotecas:

- Fastify: Framework web de alta performance.
- Nodemon: Para não precisar ficar reiniciando o servidor manualmente após cada atualização no repositório.
- Dotenv: Para gerenciar variáveis de ambiente dentro de um arquivo .env.

Para realizar a instalação de todas as dependências, basta acessar o terminal na pasta raíz da aplicação e executar o seguinte comando:

`npm i`

Feito isso, você deve criar um arquivo .env nesse mesmo diretório, para armazenar as seguintes variáveis de ambiente:

- HOST: Endereço onde será hosteado o servidor. Ex: _localhost_
- DB*USER: Usuário para acesso ao banco de dados. Ex: \_root*
- DB*PASSWORD: Senha do usuário para acesso ao banco de dados. Ex: \_password*
- DATABASE: Nome do banco de dados acessado. Ex: _brasileirao_data_

Com isso, seu ambiente já estará completamente configurado e pronto para a execução da API!

## Execução

Para realizar a execução do serviço, basta executar a seguinte instrução:

`nodemon`

O seu terminal deve lhe retornar algumas informações de conexão, seguidas pela mensagem _"Connected to the database"_. Se você receber esse feedback, sua API está executando e pronta para receber requisições!

## Endpoints

A API em questão possui 5 endpoints GET:

- `HOST/campeonato/:ano`
- `HOST/time/:time`
- `HOST/confronto/:time1/:time2`
- `HOST/tecnico/:time`
- `HOST/cartoes/:corCartao`

## Oportunidades de Melhoria

Essa API foi desenvolvida para uma aplicação simples em uma curtíssima janela de tempo. Com isso, um detalhe importantíssimo nas boas práticas de API acabou ficando escanteado: o melhor retorno de mensagens de erro.

Além disso, conforme já mencionado anteriormente, a ausência de uma serviço de migrations dificulta a rápida instalação e modificação de entidades no banco de dados.

Por último, seria interessante a adição de mais endpoints, visto que alguns dados ficaram de lado nessa etapa de consultas, como os dados relativos às arenas e aos estados.
