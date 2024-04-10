# # Documentação da API de Dados Climáticos ☀️❄️

## Descrição
Desenvolvi uma aplicação back-end para um serviço de dados climáticos, permitindo aos usuários acessarem as informações climáticas atualizadas de diversas cidades. Utilizei Node.js e Express para o servidor, assegurando eficiência e escalabilidade na manipulação das requisições. Integrei a API Weather através da biblioteca axios para obtenção dos dados meteorológicos desejados. Além disso, para garantir a atualização periódica dos dados das cidades, empreguei a biblioteca node-cron para agendar tarefas diárias de coleta e atualização. Armazenei os dados de forma flexível e eficiente no MongoDB, garantindo alto desempenho. Por fim, a aplicação foi hospedada na AWS EC2 para garantir alta disponibilidade e escalabilidade, proporcionando uma experiência confiável aos usuários.

## Endpoints

### 1. Obter dados meteorológicos de uma cidade
Retorna os dados meteorológicos atualizados de uma cidade específica.

#### Endpoint
GET /weather?city={nome_da_cidade}

#### Parâmetros
- city (obrigatório): Nome da cidade desejada.

#### Exemplo de Requisição
GET  [${URL}/weather?city=rio de janeiro](${URL}/weather?city=rio%20de%20janeiro)

#### Resposta de Sucesso
```json
{
    "city": "rio de janeiro",
    "region": "Rio de Janeiro",
    "country": "Brazil",
    "temp_c": 25,
    "temp_f": 77,
    "local_time": "2024-04-09 10:30",
    "last_updated": "2024-04-09 10:15"
}
```
### 2. Filtrar dados meteorológicos por intervalo de datas
Retorna os dados meteorológicos de uma cidade dentro de um intervalo de datas específico.

#### Endpoint
GET /weather/filter?city={nome_da_cidade}&initialDate={data_inicial}&finalDate={data_final}

#### Parâmetros
- city (obrigatório): Nome da cidade desejada.
- initialDate (obrigatório): Data inicial no formato "YYYY-MM-DD".
- finalDate (obrigatório): Data final no formato "YYYY-MM-DD".

#### Exemplo de Requisição
GET [${URL}/weather/filter?city=rio de janeiro&initialDate=2024-04-01&finalDate=2024-04-07](${URL}/weather/filter?city=rio%20de%20janeiro&initialDate=2024-04-01&finalDate=2024-04-07)


#### Resposta de Sucesso
```json
[
    {
        "_id": "61502a924654b566d4d0313a",
        "city": "rio de janeiro",
        "region": "Rio de Janeiro",
        "country": "Brazil",
        "temp_c": 26,
        "temp_f": 78.8,
        "local_time": "2024-04-02 10:30",
        "last_updated": "2024-04-02 10:15"
    }
]
```

## Erros
- 400 Bad Request: Parâmetros ausentes ou inválidos.
- 404 Not Found: Recurso não encontrado.
- 500 Internal Server Error: Erro interno do servidor.

## Considerações Finais
- Todos os horários estão no fuso horário local da cidade.
- Os dados são atualizados periodicamente para garantir precisão.
- Consulte a documentação para mais informações sobre os parâmetros e formatos de data.
