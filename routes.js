import { capitalizar } from "./utils.js";
import { query } from "./dbConfig.js";
const routes = [
  {
    method: "GET",
    url: "/campeonato/:ano",
    handler: async function (request, reply) {
      const { ano } = request.params;
      const sqlQuery = `
              SELECT 
              Nome, 
              SUM(pontos) AS PONTOS_ACUMULADOS, 
              COUNT(IDPartida) AS JOGOS, 
              SUM(Vitoria) AS VITORIAS, 
              SUM(Derrota) AS DERROTAS, 
              SUM(Empate) AS EMPATES, 
              SUM(Gols_Feitos) AS GOLS_FEITOS, 
              SUM(gols_sofridos) AS GOLS_SOFRIDOS 
          FROM ( 
              SELECT 
                  p.Time_foi_mandante, 
                  p.IdPartida, 
                  p.IdTime, 
                  Nome, 
                  p.Gols_Feitos, 
                  p2.Gols_Feitos AS GOLS_SOFRIDOS, 
                  CASE WHEN p.Gols_Feitos > p2.Gols_Feitos THEN 1 
                  ELSE 0 END AS Vitoria, 
                  CASE WHEN p.Gols_Feitos < p2.Gols_Feitos THEN 1 
                  ELSE 0 END AS Derrota, 
                  CASE WHEN p.Gols_Feitos = p2.Gols_Feitos THEN 1 
                  ELSE 0 END AS Empate, 
                  CASE WHEN p.Gols_Feitos > p2.Gols_Feitos THEN 3 
                  WHEN p.Gols_Feitos < p2.Gols_Feitos THEN 0 
                  ELSE 1 END AS pontos 
              FROM Participacao AS p 
              LEFT JOIN Participacao AS p2 ON p.IdPartida = p2.IdPartida AND p.Time_foi_mandante <> p2.Time_foi_mandante 
              LEFT JOIN Time AS t ON p.IdTime = t.Id 
              LEFT JOIN Partida ON Partida.Id = p.IdPartida 
              WHERE Partida.data LIKE '%${ano}%' 
            ) AS subquery 
            GROUP BY 1 
            ORDER BY 2 DESC, 4 DESC, 7 DESC;
            `;

      const results = await query(sqlQuery);
      return results;
    },
  },
  {
    method: "GET",
    url: "/time/:nomeTime",
    handler: async function (request, reply) {
      const { nomeTime } = request.params;
      const sqlQuery = `
                SELECT 
                Nome, 
                SUM(pontos) AS pontos_acumulados, 
                SUM(Gols_Feitos) AS Gols_Feitos, 
                SUM(gols_sofridos) AS Gols_sofridos, 
                SUM(Gols_Feitos) - SUM(gols_sofridos) AS saldo_geral 
            FROM ( 
                SELECT 
                    Nome, 
                    p.Gols_Feitos, 
                    p2.Gols_Feitos AS gols_sofridos, 
                    CASE WHEN p.Gols_Feitos > p2.Gols_Feitos THEN 3 
                    WHEN p.Gols_Feitos < p2.Gols_Feitos THEN 0 
                    ELSE 1 END AS pontos 
                FROM Participacao AS p 
                LEFT JOIN Participacao AS p2 ON p.IdPartida = p2.IdPartida AND p.Time_foi_mandante <> p2.Time_foi_mandante 
                LEFT JOIN Time AS t ON p.IdTime = t.Id 
                LEFT JOIN Partida ON Partida.Id = p.IdPartida 
                WHERE Nome = '${capitalizar(nomeTime)}' 
            ) AS subquery 
            GROUP BY 1;  
            `;
      const results = await query(sqlQuery);
      return results;
    },
  },
  {
    method: "GET",
    url: "/confronto/:timeA/:timeB",
    handler: async function (request, reply) {
      const { timeA, timeB } = request.params;
      const sqlQuery = `
                SELECT 
                Nome, 
                NomeAdversario, 
                SUM(Vitoria) AS VitoriasPrimeiro, 
                SUM(Derrota) AS VitoriasSegundo, 
                SUM(Empate) AS Empates, 
                SUM(Gols_Feitos) AS GolsPrimeiro, 
                SUM(Gols_Sofridos) AS GolsSegundo 
            FROM ( 
                SELECT 
                    t.Nome, 
                    t2.Nome AS NomeAdversario, 
                    p.Gols_Feitos, 
                    p2.Gols_Feitos AS Gols_Sofridos, 
                    CASE WHEN p.Gols_Feitos > p2.Gols_Feitos THEN 1 
                    ELSE 0 END AS Vitoria, 
                    CASE WHEN p.Gols_Feitos < p2.Gols_Feitos THEN 1 
                    ELSE 0 END AS Derrota, 
                    CASE WHEN p.Gols_Feitos = p2.Gols_Feitos THEN 1 
                    ELSE 0 END AS Empate, 
                    CASE WHEN p.Gols_Feitos > p2.Gols_Feitos THEN 3 
                    WHEN p.Gols_Feitos < p2.Gols_Feitos THEN 0 
                    ELSE 1 END AS pontos 
                FROM Participacao AS p 
                LEFT JOIN Participacao AS p2 ON p.IdPartida = p2.IdPartida AND p.Time_foi_mandante <> p2.Time_foi_mandante 
                LEFT JOIN Time AS t ON p.IdTime = t.Id 
                LEFT JOIN Time AS t2 ON p2.IdTime = t2.Id 
                LEFT JOIN Partida ON Partida.Id = p.IdPartida 
                WHERE t.Nome = '${capitalizar(timeA)}' 
                AND t2.Nome = '${capitalizar(timeB)}' 
            ) AS subquery 
            GROUP BY 1, 2;
            `;

      const results = await query(sqlQuery);
      return results;
    },
  },
  {
    method: "GET",
    url: "/tecnico/:nomeTime",
    handler: async function (request, reply) {
      const { nomeTime } = request.params;
      const sqlQuery = `
              SELECT DISTINCT Tecnico.Nome FROM Tecnico
              INNER JOIN Participacao ON Participacao.IdTecnico = Tecnico.Id
              INNER JOIN Time ON Time.Id = Participacao.IdTime
              WHERE Time.Nome = '${capitalizar(nomeTime)}'
              AND Tecnico.Nome != 'Indefinido';
            `;

      const results = await query(sqlQuery);
      return results;
    },
  },
  {
    method: "GET",
    url: "/cartoes/:corCartao",
    handler: async function (request, reply) {
      const { corCartao } = request.params;
      const sqlQuery = `
            SELECT 
            Nome, 
            COUNT(c.Cor_cartao) AS cartoes 
        FROM Jogador J  
        LEFT JOIN Cartao_recebido c ON c.IdJogador = J.Id 
        WHERE Cor_cartao = '${corCartao}'
        GROUP BY Nome 
        ORDER BY cartoes DESC;
      `;

      const results = await query(sqlQuery);
      return results;
    },
  },
];

export default routes;
